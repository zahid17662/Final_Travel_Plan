import { useState } from "react";
import { CheckIcon, Panel, PlusIcon, TrashIcon } from "../../components/ui";
import { uid } from "./seed";
import type { CheckItem, Doc } from "./seed";
import type { Set } from "./panes";

export const groups = ["Packing", "Documents", "Before leaving"];
const groupOf = (c: CheckItem) => c.group ?? (/passport|visa|insurance|ticket|booking|document/i.test(c.text) ? "Documents" : /pack|charger|adapter|toiletr|clothes|shoes/i.test(c.text) ? "Packing" : "Before leaving");

function Bar({ done, total, label }: { done: number; total: number; label: string }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="h-2 overflow-hidden rounded-full bg-navy/10"><div className="h-full rounded-full bg-navy transition-all" style={{ width: `${pct}%` }} /></div>;
}

export default function Checklist({ doc, set }: { doc: Doc; set: Set }) {
  const [text, setText] = useState<Record<string, string>>({});
  const total = doc.checklist.length; const done = doc.checklist.filter((c) => c.done).length;
  const add = (g: string) => { const v = (text[g] ?? "").trim(); if (!v) return; set((d) => ({ ...d, checklist: [...d.checklist, { id: uid(), text: v, done: false, group: g }] })); setText((t) => ({ ...t, [g]: "" })); };
  const toggle = (id: string) => set((d) => ({ ...d, checklist: d.checklist.map((x) => (x.id === id ? { ...x, done: !x.done } : x)) }));
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold tracking-tight">Checklist</h2>
      <Panel className="space-y-3">
        <div className="flex items-baseline justify-between"><p className="text-sm font-bold">{total ? (done === total ? "All done. Have a great trip!" : "Getting ready") : "Nothing on the list yet"}</p><p className="text-sm font-semibold text-navy/60">{done} of {total} · {total ? Math.round((done / total) * 100) : 0}%</p></div>
        <Bar done={done} total={total} label="Overall checklist progress" />
      </Panel>
      {groups.map((g) => {
        const items = doc.checklist.filter((c) => groupOf(c) === g); const gd = items.filter((c) => c.done).length;
        return (
          <section key={g} aria-label={g} className="rounded-3xl bg-white/60 p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-display text-xl uppercase tracking-wide">{g}</h3><span className="text-xs font-semibold text-navy/55">{gd}/{items.length}</span></div>
            {items.length > 0 && <div className="mb-3"><Bar done={gd} total={items.length} label={`${g} progress`} /></div>}
            {items.length ? (
              <ul className="space-y-2">{items.map((c) => (
                <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-card">
                  <button type="button" role="checkbox" aria-checked={c.done} aria-label={c.text} onClick={() => toggle(c.id)} className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${c.done ? "border-navy bg-navy text-white" : "border-navy/25 hover:border-navy"}`}>{c.done && <CheckIcon size={14} />}</button>
                  <span onClick={() => toggle(c.id)} className={`min-w-0 flex-1 cursor-pointer text-sm ${c.done ? "text-navy/45 line-through" : "font-semibold"}`}>{c.text}</span>
                  <button type="button" aria-label={`Remove ${c.text}`} onClick={() => set((d) => ({ ...d, checklist: d.checklist.filter((x) => x.id !== c.id) }))} className="grid h-8 w-8 place-items-center rounded-full text-navy/55 hover:bg-navy/5"><TrashIcon size={14} /></button>
                </li>
              ))}</ul>
            ) : <p className="mb-3 text-sm text-navy/55">No items in this group yet.</p>}
            <div className="mt-3 flex gap-2">
              <input aria-label={`Add item to ${g}`} value={text[g] ?? ""} onChange={(e) => setText((t) => ({ ...t, [g]: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") add(g); }} placeholder="Add an item" className="h-11 min-w-0 flex-1 rounded-full border border-navy/15 bg-white px-4 text-sm outline-none focus:border-navy" />
              <button type="button" onClick={() => add(g)} disabled={!(text[g] ?? "").trim()} className="inline-flex h-11 items-center gap-1.5 rounded-full bg-navy px-5 text-sm font-bold text-white disabled:opacity-40"><PlusIcon size={14} />Add</button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
