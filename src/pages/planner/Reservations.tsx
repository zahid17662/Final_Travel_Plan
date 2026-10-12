import { useState } from "react";
import type { ReactNode } from "react";
import { Badge, Button, CalendarIcon, Chip, CopyIcon, DotsIcon, Dropdown, EditIcon, EmptyState, FileIcon, Input, Modal, Panel, PlusIcon, Select, Textarea, TrashIcon, useToast } from "../../components/ui";
import { BedIcon, CarIcon, ForkIcon, MailIcon, PaperclipIcon, PlaneIcon, TrainIcon } from "./glyphs";
import { uid } from "./seed";
import type { Doc, Reservation } from "./seed";
import type { Set } from "./panes";

type IconC = (p: { size?: number }) => ReactNode;
export const resTypes: { id: string; Icon: IconC }[] = [
  { id: "Flight", Icon: PlaneIcon }, { id: "Hotel", Icon: BedIcon }, { id: "Car rental", Icon: CarIcon },
  { id: "Train", Icon: TrainIcon }, { id: "Restaurant", Icon: ForkIcon }, { id: "Other", Icon: FileIcon },
];
const typeOf = (t: string) => resTypes.find((x) => x.id === t) ?? (t === "Lodging" ? resTypes[1] : resTypes[5]);
const short = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" }); };
const rangeText = (r: Reservation) => (r.start ? (r.end && r.end !== r.start ? `${short(r.start)} – ${short(r.end)}` : short(r.start)) : r.date);

function ReservationModal({ initial, preset, onClose, onSave }: { initial?: Reservation; preset?: string; onClose: () => void; onSave: (r: Reservation) => void }) {
  const [f, setF] = useState({ type: typeOf(initial?.type ?? preset ?? "Other").id, name: initial?.name ?? "", confirmation: initial?.confirmation ?? "", start: initial?.start ?? "", end: initial?.end ?? "", notes: initial?.notes ?? "" });
  const [files, setFiles] = useState<string[]>(initial?.files ?? []);
  const [tried, setTried] = useState(false);
  const nameErr = !f.name.trim() ? "Enter a name for this reservation" : undefined;
  const dateErr = f.start && f.end && f.end < f.start ? "End date can't be before the start date" : undefined;
  const save = () => {
    setTried(true); if (nameErr || dateErr) return;
    const r: Reservation = { id: initial?.id ?? uid(), type: f.type, name: f.name.trim(), confirmation: f.confirmation.trim(), start: f.start || undefined, end: f.end || undefined, notes: f.notes.trim() || undefined, files, date: "" };
    r.date = f.start ? rangeText(r) : initial?.date ?? "";
    onSave(r); onClose();
  };
  return (
    <Modal open onClose={onClose} title={initial ? "Edit reservation" : "Add reservation"} footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save}>{initial ? "Save changes" : "Save reservation"}</Button></>}>
      <div className="space-y-4">
        <Select label="Type" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} options={resTypes.map((t) => ({ value: t.id, label: t.id }))} />
        <Input label="Name" placeholder="e.g. Air France AF007" value={f.name} error={tried ? nameErr : undefined} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <Input label="Confirmation number" placeholder="Optional" value={f.confirmation} onChange={(e) => setF({ ...f, confirmation: e.target.value })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Start date" type="date" value={f.start} onChange={(e) => setF({ ...f, start: e.target.value })} />
          <Input label="End date" type="date" value={f.end} min={f.start || undefined} error={tried ? dateErr : undefined} onChange={(e) => setF({ ...f, end: e.target.value })} />
        </div>
        <Textarea label="Notes" rows={2} placeholder="Seat numbers, check-in times, addresses…" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} />
        <div>
          <p className="mb-1.5 text-xs font-bold">Attachments</p>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-navy/20 px-4 py-3.5 text-sm text-navy/65 hover:bg-navy/[0.03] focus-within:outline-2 focus-within:outline-navy">
            <PaperclipIcon size={18} /><span><strong className="text-navy">Attach files</strong> such as tickets or confirmations</span>
            <input type="file" multiple className="sr-only" onChange={(e) => { const n = Array.from(e.target.files ?? []).map((x) => x.name); if (n.length) setFiles((l) => [...l, ...n]); e.target.value = ""; }} />
          </label>
          {files.length > 0 && <ul className="mt-2 flex flex-wrap gap-2">{files.map((n, i) => <Chip key={`${n}-${i}`} icon={<FileIcon size={12} />} onRemove={() => setFiles((l) => l.filter((_, j) => j !== i))}>{n}</Chip>)}</ul>}
        </div>
      </div>
    </Modal>
  );
}

function parseEmail(text: string): Reservation {
  const subject = /^subject:\s*(.+)$/im.exec(text)?.[1]?.trim();
  const first = text.split("\n").map((l) => l.trim()).find(Boolean);
  const lower = text.toLowerCase();
  const type = /flight|airline|boarding|depart/.test(lower) ? "Flight" : /car rental|rental car|pick-?up/.test(lower) ? "Car rental" : /train|rail/.test(lower) ? "Train"
    : /hotel|check-?in|room|stay/.test(lower) ? "Hotel" : /restaurant|table for|dinner reservation/.test(lower) ? "Restaurant" : "Other";
  let conf = /(?:confirmation|booking|reference|reservation)\s*(?:number|no\.?|code|id|#)?\s*[:#-]?\s*([A-Z0-9]{5,10})\b/i.exec(text)?.[1];
  if (!conf || !/\d/.test(conf)) conf = /\b(?=[A-Z0-9]*\d)(?=[A-Z0-9]*[A-Z])[A-Z0-9]{6}\b/.exec(text)?.[0];
  const dates = text.match(/\b20\d\d-\d\d-\d\d\b/g) ?? [];
  const r: Reservation = { id: uid(), type, name: (subject || first || "Imported booking").replace(/^(fwd?|re):\s*/i, "").slice(0, 80), confirmation: (conf ?? "").toUpperCase(), start: dates[0], end: dates[1], date: "" };
  r.date = r.start ? rangeText(r) : "Imported from email";
  return r;
}

export default function Reservations({ doc, set, tripId }: { doc: Doc; set: Set; tripId: string }) {
  const { show } = useToast();
  const [filter, setFilter] = useState<string>();
  const [modal, setModal] = useState<{ initial?: Reservation; preset?: string }>();
  const [email, setEmail] = useState("");
  const address = `trip-${tripId.replace(/[^a-z0-9]/gi, "").slice(0, 10).toLowerCase()}@import.travelplan.app`;
  const list = doc.reservations.filter((r) => !filter || typeOf(r.type).id === filter);
  const upsert = (r: Reservation) => set((d) => ({ ...d, reservations: d.reservations.some((x) => x.id === r.id) ? d.reservations.map((x) => (x.id === r.id ? r : x)) : [...d.reservations, r] }));
  const copy = async (text: string, what: string) => { try { await navigator.clipboard.writeText(text); show({ title: `${what} copied`, tone: "success" }); } catch { show({ title: "Couldn't copy", description: text, tone: "error" }); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold tracking-tight">Reservations</h2>
        <Button size="sm" icon={<PlusIcon size={14} />} onClick={() => setModal({})}>Add reservation</Button>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Reservation types">
        {resTypes.map(({ id, Icon }) => {
          const n = doc.reservations.filter((r) => typeOf(r.type).id === id).length; const on = filter === id;
          return (
            <li key={id} className={`relative rounded-2xl p-3 shadow-card transition ${on ? "bg-navy text-white" : "bg-white"}`}>
              <button type="button" aria-pressed={on} onClick={() => setFilter(on ? undefined : id)} className="flex w-full items-center gap-3 pr-8 text-left">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${on ? "bg-white/15" : "bg-ocean-100"}`}><Icon size={20} /></span>
                <span className="min-w-0"><span className="block truncate text-sm font-bold">{id}</span><span className={`block text-xs ${on ? "text-white/70" : "text-navy/55"}`}>{n} saved</span></span>
              </button>
              <button type="button" aria-label={`Add ${id} reservation`} onClick={() => setModal({ preset: id })} className={`absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full ${on ? "hover:bg-white/15" : "hover:bg-navy/5"}`}><PlusIcon size={14} /></button>
            </li>
          );
        })}
      </ul>

      {list.length ? (
        <ul className="space-y-3">
          {list.map((r) => {
            const { Icon } = typeOf(r.type);
            return (
              <li key={r.id} className="rounded-2xl bg-white p-4 shadow-card">
                <div className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ocean-100"><Icon size={22} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-bold">{r.name}</h3><Badge tone="ocean">{typeOf(r.type).id}</Badge></div>
                    {rangeText(r) && <p className="mt-1 flex items-center gap-1.5 text-xs text-navy/65"><CalendarIcon size={13} />{rangeText(r)}</p>}
                    {r.confirmation && (
                      <p className="mt-2 flex items-center gap-2 text-xs"><span className="text-navy/55">Confirmation</span><code className="rounded-md bg-surface px-2 py-1 font-mono font-bold tracking-wider">{r.confirmation}</code>
                        <button type="button" aria-label={`Copy confirmation number for ${r.name}`} onClick={() => copy(r.confirmation, "Confirmation number")} className="grid h-7 w-7 place-items-center rounded-full text-navy/55 hover:bg-navy/5"><CopyIcon size={13} /></button></p>
                    )}
                    {r.notes && <p className="mt-2 text-xs text-navy/70">{r.notes}</p>}
                    {!!r.files?.length && <ul className="mt-2 flex flex-wrap gap-1.5">{r.files.map((n, i) => <li key={`${n}-${i}`} className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold"><PaperclipIcon size={11} />{n}</li>)}</ul>}
                  </div>
                  <Dropdown align="right" trigger={<span aria-label={`Actions for ${r.name}`} className="grid h-8 w-8 place-items-center rounded-full text-navy/60 hover:bg-navy/5"><DotsIcon size={16} /></span>}
                    items={[{ label: "Edit", icon: <EditIcon size={14} />, onSelect: () => setModal({ initial: r }) }, { label: "Delete", icon: <TrashIcon size={14} />, danger: true, onSelect: () => set((d) => ({ ...d, reservations: d.reservations.filter((x) => x.id !== r.id) })) }]} />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState title={filter ? `No ${filter.toLowerCase()} reservations` : "No reservations yet"} description="Add bookings by hand or import them from a confirmation email."
          action={<Button onClick={() => setModal({ preset: filter })} icon={<PlusIcon size={16} />}>Add reservation</Button>} />
      )}

      <Panel className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy text-white"><MailIcon size={20} /></span>
          <div><h3 className="text-sm font-extrabold">Forward emails to import</h3><p className="mt-0.5 text-xs text-navy/65">Forward booking confirmations to your trip address and we will add them here. Or paste an email below.</p></div>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-surface px-3 py-2"><code className="min-w-0 flex-1 truncate text-xs font-semibold">{address}</code>
          <Button size="sm" variant="secondary" icon={<CopyIcon size={13} />} onClick={() => copy(address, "Address")}>Copy</Button></div>
        <Textarea aria-label="Paste a confirmation email" rows={4} placeholder={"Subject: Your flight to Paris\nConfirmation: K8D2LQ\nDeparts 2026-11-02, returns 2026-11-07"} value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="flex justify-end"><Button disabled={!email.trim()} onClick={() => { const r = parseEmail(email); upsert(r); setEmail(""); show({ title: `Imported ${r.type.toLowerCase()}`, description: r.name, tone: "success" }); }}>Import email</Button></div>
      </Panel>

      {modal && <ReservationModal key={modal.initial?.id ?? modal.preset ?? "new"} initial={modal.initial} preset={modal.preset} onClose={() => setModal(undefined)} onSave={upsert} />}
    </div>
  );
}

export function ReservationsSummary({ doc, set, onSeeAll }: { doc: Doc; set: Set; onSeeAll: () => void }) {
  return (
    <section aria-label="Reservations and attachments">
      <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-extrabold tracking-tight">Reservations and attachments</h2>
        <Button variant="ghost" size="sm" onClick={onSeeAll}>{doc.reservations.length ? `See all ${doc.reservations.length}` : "Add"}</Button></div>
      {doc.reservations.length ? (
        <ul className="space-y-3">{doc.reservations.slice(0, 2).map((r) => { const { Icon } = typeOf(r.type); return (
          <li key={r.id} className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-card"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ocean-100"><Icon size={20} /></span>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{r.name}</p><p className="truncate text-xs text-navy/60">{rangeText(r)}{r.confirmation && ` · #${r.confirmation}`}</p></div></li>); })}</ul>
      ) : <Panel className="text-sm text-navy/60">No reservations yet. Add flights, stays and bookings to keep them with your plan.</Panel>}
      <div className="mt-4">
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-navy/20 bg-white px-4 py-6 text-center text-sm text-navy/60 transition hover:bg-navy/[0.03] focus-within:outline-2 focus-within:outline-navy">
          <FileIcon size={22} /><span><strong className="text-navy">Attach a file</strong> or drop a confirmation here</span>
          <input type="file" multiple className="sr-only" onChange={(e) => { const n = Array.from(e.target.files ?? []).map((f) => f.name); if (n.length) set((d) => ({ ...d, attachments: [...d.attachments, ...n] })); e.target.value = ""; }} />
        </label>
        {doc.attachments.length > 0 && <ul className="mt-3 flex flex-wrap gap-2">{doc.attachments.map((a, i) => <Chip key={`${a}-${i}`} icon={<FileIcon size={12} />} onRemove={() => set((d) => ({ ...d, attachments: d.attachments.filter((_, j) => j !== i) }))}>{a}</Chip>)}</ul>}
      </div>
    </section>
  );
}
