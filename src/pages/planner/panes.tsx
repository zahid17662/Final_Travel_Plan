import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowDownIcon, ArrowUpIcon, Badge, Button, DotsIcon, Dropdown, EmptyState, Input, Textarea, PinIcon, PlusIcon, StarIcon, TrashIcon } from "../../components/ui";
import { CommentButton, CommentThread, useComments } from "./comments";
import { EditingTag } from "./Presence";
import { ReservationsSummary } from "./Reservations";
import type { Doc, Place } from "./seed";

export type Set = (fn: (d: Doc) => Doc) => void;
const H = ({ children, aside }: { children: ReactNode; aside?: ReactNode }) => (
  <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-extrabold tracking-tight">{children}</h2>{aside}</div>
);
const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/* ---------- Places ---------- */
type PlaceListProps = { doc: Doc; set: Set; selectedId?: string; onSelect: (id: string) => void; onHover: (id?: string) => void };

function PlaceRow({ p, i, last, set, selected, onSelect, onHover }: { p: Place; i: number; last: boolean; set: Set; selected: boolean; onSelect: () => void; onHover: (id?: string) => void }) {
  const [thread, setThread] = useState(false);
  const { enabled } = useComments();
  const move = (dir: -1 | 1) => set((d) => { const a = [...d.places]; const j = i + dir; [a[i], a[j]] = [a[j], a[i]]; return { ...d, places: a }; });
  return (
    <li id={`place-${p.id}`} onMouseEnter={() => onHover(p.id)} onMouseLeave={() => onHover(undefined)}
      className={`relative rounded-2xl bg-white p-3 shadow-card transition sm:p-4 ${selected ? "ring-2 ring-ocean-500" : ""}`}>
      <EditingTag placeId={p.id} />
      <div className="flex gap-3">
      <button type="button" onClick={onSelect} aria-label={`Show ${p.name} on map`} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-white">{i + 1}</button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="text-sm font-bold">{p.name}</h3>
          <Badge tone="ocean">{p.category}</Badge>
          {p.rating && <span className="inline-flex items-center gap-1 text-xs font-semibold text-navy/70"><span className="text-amber-500"><StarIcon size={12} /></span>{p.rating.toFixed(1)}</span>}
        </div>
        <input aria-label={`Notes for ${p.name}`} defaultValue={p.note} placeholder="Add notes, links, opening hours…" className="mt-1.5 w-full rounded-md bg-transparent py-1 text-xs text-navy/70 outline-none placeholder:text-navy/35 focus:bg-surface focus:px-2"
          onBlur={(e) => { const v = e.target.value; if (v !== p.note) set((d) => ({ ...d, places: d.places.map((x) => (x.id === p.id ? { ...x, note: v } : x)) })); }} />
        <div className="mt-2"><CommentButton placeId={p.id} name={p.name} open={thread} onClick={() => setThread((o) => !o)} /></div>
      </div>
      <Dropdown align="right" trigger={<span aria-label={`Actions for ${p.name}`} className="grid h-8 w-8 place-items-center rounded-full text-navy/60 hover:bg-navy/5"><DotsIcon size={16} /></span>}
        items={[
          ...(i > 0 ? [{ label: "Move up", icon: <ArrowUpIcon size={14} />, onSelect: () => move(-1) }] : []),
          ...(!last ? [{ label: "Move down", icon: <ArrowDownIcon size={14} />, onSelect: () => move(1) }] : []),
          { label: "Remove", icon: <TrashIcon size={14} />, danger: true, onSelect: () => set((d) => ({ ...d, places: d.places.filter((x) => x.id !== p.id) })) },
        ]} />
      </div>
      {thread && enabled && <CommentThread placeId={p.id} name={p.name} />}
    </li>
  );
}

export function PlacesList({ doc, set, selectedId, onSelect, onHover, onAdd }: PlaceListProps & { onAdd: (name: string) => void }) {
  const [name, setName] = useState("");
  const add = () => { if (name.trim()) { onAdd(name.trim()); setName(""); } };
  return (
    <section aria-label="Places to visit">
      <H aside={<span className="text-sm font-semibold text-navy/55">{doc.places.length} {doc.places.length === 1 ? "place" : "places"}</span>}>Places to visit</H>
      <div className="mb-4 flex gap-2">
        <Input className="flex-1" aria-label="Add a place" placeholder="Add a place, e.g. Sagrada Família" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") add(); }} />
        <Button onClick={add} icon={<PlusIcon size={16} />} className="h-fit !py-3">Add</Button>
      </div>
      {doc.places.length ? (
        <ol className="space-y-3">{doc.places.map((p, i) => <PlaceRow key={p.id} p={p} i={i} last={i === doc.places.length - 1} set={set} selected={p.id === selectedId} onSelect={() => onSelect(p.id)} onHover={onHover} />)}</ol>
      ) : (
        <EmptyState title="No places yet" description="Search above to add your first stop. Each place gets a numbered pin on the map." illustration={<span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ocean-100"><PinIcon size={24} /></span>} />
      )}
    </section>
  );
}

/* ---------- Overview ---------- */
export function Overview(p: PlaceListProps & { onAdd: (n: string) => void; onSeeReservations: () => void }) {
  return (
    <div className="space-y-10">
      <section aria-label="Notes">
        <Textarea aria-label="Trip notes" rows={3} placeholder="Write or paste general notes here, e.g. how to get around, local tips, must-try food" defaultValue={p.doc.overview} key={p.doc.overview}
          onBlur={(e) => { const v = e.target.value; if (v !== p.doc.overview) p.set((d) => ({ ...d, overview: v })); }} />
      </section>
      <PlacesList {...p} />
      <ReservationsSummary doc={p.doc} set={p.set} onSeeAll={p.onSeeReservations} />
    </div>
  );
}
