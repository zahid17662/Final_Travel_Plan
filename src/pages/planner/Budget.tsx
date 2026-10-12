import { useMemo, useState } from "react";
import { Badge, Button, Chip, DotsIcon, Dropdown, EditIcon, Input, Modal, Panel, PlusIcon, Select, TrashIcon, UsersIcon } from "../../components/ui";
import { convert, currencies, fmt, settle } from "./money";
import { categories, uid } from "./seed";
import type { Doc, Expense } from "./seed";
import type { Set } from "./panes";

const palette = ["#1F2B5E", "#3b8fd0", "#7cc0dc", "#e0a43a", "#3aa6a0", "#d86b7f"];

function ExpenseModal({ initial, travelers, base, onClose, onSave }: { initial?: Expense; travelers: string[]; base: string; onClose: () => void; onSave: (e: Expense) => void }) {
  const [f, setF] = useState({ name: initial?.name ?? "", amount: initial ? String(initial.amount) : "", currency: initial?.currency ?? base, category: initial?.category ?? categories[2], paidBy: initial?.paidBy ?? travelers[0] });
  const [split, setSplit] = useState<string[]>(initial?.split ?? travelers);
  const [tried, setTried] = useState(false);
  const amount = Number(f.amount);
  const errs = { name: !f.name.trim() ? "Add a name" : "", amount: !(amount > 0) ? "Enter an amount greater than 0" : "", split: !split.length ? "Choose at least one person" : "" };
  const save = () => {
    setTried(true); if (errs.name || errs.amount || errs.split) return;
    onSave({ id: initial?.id ?? uid(), name: f.name.trim(), amount, currency: f.currency, category: f.category, paidBy: f.paidBy, split }); onClose();
  };
  const toggle = (n: string) => setSplit((s) => (s.includes(n) ? s.filter((x) => x !== n) : [...s, n]));
  return (
    <Modal open onClose={onClose} title={initial ? "Edit expense" : "Add expense"} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save}>{initial ? "Save changes" : "Add expense"}</Button></>}>
      <div className="space-y-4">
        <Input label="What was it for?" placeholder="e.g. Museum tickets" value={f.name} error={tried ? errs.name : undefined} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Amount" type="number" min={0} step="0.01" placeholder="0.00" value={f.amount} error={tried ? errs.amount : undefined} onChange={(e) => setF({ ...f, amount: e.target.value })} />
          <Select label="Currency" value={f.currency} onChange={(e) => setF({ ...f, currency: e.target.value })} options={currencies.map((c) => ({ value: c, label: c }))} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Category" value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} options={categories.map((c) => ({ value: c, label: c }))} />
          <Select label="Paid by" value={f.paidBy} onChange={(e) => setF({ ...f, paidBy: e.target.value })} options={travelers.map((n) => ({ value: n, label: n }))} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between"><p id="split-label" className="text-xs font-bold">Split between</p>
            <button type="button" className="text-xs font-semibold underline" onClick={() => setSplit(split.length === travelers.length ? [] : travelers)}>{split.length === travelers.length ? "Clear" : "Everyone"}</button></div>
          <div role="group" aria-labelledby="split-label" className="flex flex-wrap gap-2">{travelers.map((n) => <Chip key={n} selected={split.includes(n)} onClick={() => toggle(n)}>{n}</Chip>)}</div>
          {tried && errs.split && <p role="alert" className="mt-1.5 text-xs font-semibold text-red-600">{errs.split}</p>}
          {split.length > 0 && amount > 0 && <p className="mt-2 text-xs text-navy/60">{fmt(amount / split.length, f.currency)} each across {split.length} {split.length === 1 ? "person" : "people"}</p>}
        </div>
      </div>
    </Modal>
  );
}

export default function Budget({ doc, set, travelers }: { doc: Doc; set: Set; travelers: string[] }) {
  const base = doc.currency ?? "USD";
  const [modal, setModal] = useState<{ initial?: Expense }>();
  const [hover, setHover] = useState<string>();
  const baseAmt = (e: Expense) => convert(e.amount, e.currency ?? base, base);
  const spent = doc.expenses.reduce((s, e) => s + baseAmt(e), 0);
  const pct = doc.budget ? Math.min(100, (spent / doc.budget) * 100) : 0;
  const over = doc.budget > 0 && spent > doc.budget;
  const by = categories.map((c, i) => ({ c, v: doc.expenses.filter((e) => e.category === c).reduce((s, e) => s + baseAmt(e), 0), color: palette[i % palette.length] })).filter((x) => x.v > 0);

  const { balances, debts } = useMemo(() => {
    const b: Record<string, number> = Object.fromEntries(travelers.map((n) => [n, 0]));
    doc.expenses.forEach((e) => {
      const amt = convert(e.amount, e.currency ?? base, base); const payer = e.paidBy ?? travelers[0]; const who = e.split?.length ? e.split : travelers;
      b[payer] = (b[payer] ?? 0) + amt; who.forEach((n) => { b[n] = (b[n] ?? 0) - amt / who.length; });
    });
    return { balances: b, debts: settle(b) };
  }, [doc.expenses, travelers, base]);

  const upsert = (e: Expense) => set((d) => ({ ...d, expenses: d.expenses.some((x) => x.id === e.id) ? d.expenses.map((x) => (x.id === e.id ? e : x)) : [...d.expenses, e] }));
  let acc = 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-extrabold tracking-tight">Budget &amp; expenses</h2>
        <Button size="sm" icon={<PlusIcon size={14} />} onClick={() => setModal({})}>Add expense</Button></div>

      <Panel className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label={`Total budget (${base})`} type="number" min={0} defaultValue={doc.budget || ""} key={doc.budget} placeholder="0" onBlur={(ev) => { const v = Math.max(0, Number(ev.target.value) || 0); if (v !== doc.budget) set((d) => ({ ...d, budget: v })); }} />
          <div><p className="text-xs font-bold">Spent</p><p className="mt-2 text-2xl font-extrabold">{fmt(spent, base)}</p></div>
          <div><p className="text-xs font-bold">{over ? "Over budget" : "Remaining"}</p><p className={`mt-2 text-2xl font-extrabold ${over ? "text-red-600" : ""}`}>{fmt(Math.abs(doc.budget - spent), base)}</p></div>
        </div>
        <div>
          <div role="progressbar" aria-label="Budget used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} className="h-3 overflow-hidden rounded-full bg-navy/10"><div className={`h-full rounded-full transition-all ${over ? "bg-red-500" : "bg-navy"}`} style={{ width: `${pct}%` }} /></div>
          <p className="mt-2 text-xs text-navy/60">{doc.budget ? `${Math.round((spent / doc.budget) * 100)}% of budget used` : "Set a budget to track progress."}</p>
        </div>
      </Panel>

      <Panel>
        <h3 className="mb-4 text-sm font-extrabold">Spending by category</h3>
        {by.length ? (
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="relative h-44 w-44 shrink-0">
              <svg viewBox="0 0 42 42" className="h-full w-full -rotate-90" role="img" aria-label={`Spending by category: ${by.map((x) => `${x.c} ${fmt(x.v, base)}`).join(", ")}`}>
                <circle cx="21" cy="21" r="15.915" fill="none" stroke="#eef0f5" strokeWidth="6" />
                {by.map((x) => { const p = (x.v / spent) * 100; const el = (
                  <circle key={x.c} cx="21" cy="21" r="15.915" fill="none" stroke={x.color} strokeWidth={hover === x.c ? 7 : 6} strokeDasharray={`${Math.max(p - 0.6, 0.1)} ${100 - Math.max(p - 0.6, 0.1)}`} strokeDashoffset={-acc} opacity={hover && hover !== x.c ? 0.35 : 1} className="transition-all" />); acc += p; return el; })}
              </svg>
              <div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><div><p className="text-[11px] font-semibold text-navy/55">Total</p><p className="text-lg font-extrabold">{fmt(spent, base)}</p></div></div>
            </div>
            <ul className="w-full flex-1 space-y-2">
              {by.map((x) => (
                <li key={x.c} onMouseEnter={() => setHover(x.c)} onMouseLeave={() => setHover(undefined)} className="flex items-center gap-3 text-sm">
                  <span aria-hidden className="h-3 w-3 shrink-0 rounded-full" style={{ background: x.color }} /><span className="flex-1 font-semibold">{x.c}</span>
                  <span className="text-navy/55">{Math.round((x.v / spent) * 100)}%</span><strong className="w-20 text-right">{fmt(x.v, base)}</strong>
                </li>
              ))}
            </ul>
          </div>
        ) : <p className="text-sm text-navy/55">Add an expense to see the breakdown.</p>}
      </Panel>

      <section aria-label="Expenses">
        <h3 className="mb-3 text-sm font-extrabold">Expenses <span className="font-normal text-navy/55">· {doc.expenses.length}</span></h3>
        {doc.expenses.length ? (
          <ul className="space-y-2">{doc.expenses.map((e) => {
            const cur = e.currency ?? base; const who = e.split?.length ? e.split : travelers;
            return (
              <li key={e.id} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-card">
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{e.name}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-navy/60"><Badge>{e.category}</Badge><span>Paid by {e.paidBy ?? travelers[0]}</span><span className="inline-flex items-center gap-1"><UsersIcon size={12} />{who.length === travelers.length ? "Everyone" : who.join(", ")}</span></p></div>
                <div className="text-right"><strong className="text-sm">{fmt(e.amount, cur)}</strong>{cur !== base && <p className="text-[11px] text-navy/55">≈ {fmt(baseAmt(e), base)}</p>}</div>
                <Dropdown align="right" trigger={<span aria-label={`Actions for ${e.name}`} className="grid h-8 w-8 place-items-center rounded-full text-navy/60 hover:bg-navy/5"><DotsIcon size={16} /></span>}
                  items={[{ label: "Edit", icon: <EditIcon size={14} />, onSelect: () => setModal({ initial: e }) }, { label: "Delete", icon: <TrashIcon size={14} />, danger: true, onSelect: () => set((d) => ({ ...d, expenses: d.expenses.filter((x) => x.id !== e.id) })) }]} />
              </li>
            );
          })}</ul>
        ) : <Panel className="text-sm text-navy/60">No expenses yet. Log what you spend and split it with your travelers.</Panel>}
      </section>

      <Panel className="space-y-4">
        <h3 className="text-sm font-extrabold">Who owes whom</h3>
        {travelers.length < 2 ? <p className="text-sm text-navy/60">Invite travelers to split costs and settle up here.</p> : (
          <>
            {debts.length ? (
              <ul className="space-y-2">{debts.map((d) => (
                <li key={`${d.from}-${d.to}`} className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 text-sm"><span><strong>{d.from}</strong> owes <strong>{d.to}</strong></span><strong>{fmt(d.amount, base)}</strong></li>
              ))}</ul>
            ) : <p className="rounded-xl bg-surface px-4 py-3 text-sm font-semibold">{doc.expenses.length ? "All settled up. Nobody owes anything." : "Nothing to settle yet."}</p>}
            <ul className="flex flex-wrap gap-2">{Object.entries(balances).map(([n, v]) => (
              <li key={n} className="rounded-full border border-navy/10 bg-white px-3 py-1.5 text-xs font-semibold">{n}: {Math.abs(v) < 0.005 ? "even" : v > 0 ? `gets back ${fmt(v, base)}` : `owes ${fmt(-v, base)}`}</li>
            ))}</ul>
          </>
        )}
      </Panel>

      {modal && <ExpenseModal key={modal.initial?.id ?? "new"} initial={modal.initial} travelers={travelers} base={base} onClose={() => setModal(undefined)} onSave={upsert} />}
    </div>
  );
}
