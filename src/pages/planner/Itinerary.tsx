import { useMemo, useState } from "react";
import type { DragEvent, ReactNode } from "react";
import { Badge, Button, ChevronDownIcon, DotsIcon, Dropdown, PlusIcon, StarIcon, Tabs, TrashIcon, unsplash, useToast } from "../../components/ui";
import type { DropdownItem } from "../../components/ui";
import { ArrowDownIcon, ArrowUpIcon } from "../../components/ui";
import {
  BagIcon, BedIcon, CarIcon, ClockIcon, CoffeeIcon, CoinIcon, ForkIcon, GripIcon, LandmarkIcon, MoonIcon, RouteIcon, TransitIcon, WalkIcon, WandIcon,
} from "./glyphs";
import {
  allSuggestions, autoMode, costByKind, dist, hoursByKind, kindOf, kinds, modes, normalize, optimizeOrder, pathLength, photoFor, suggestionsFor, travelMinutes,
} from "./itineraryData";
import type { Kind, Mode, Suggestion } from "./itineraryData";
import { CommentButton, CommentThread, useComments } from "./comments";
import { EditingTag } from "./Presence";
import PlaceDetail from "./PlaceDetail";
import type { Candidate } from "./PlaceDetail";
import { hashPos, uid } from "./seed";
import type { Doc, Place } from "./seed";
import type { Set } from "./panes";

const kindIcon: Record<Kind, (p: { size?: number }) => ReactNode> = {
  attraction: LandmarkIcon, restaurant: ForkIcon, cafe: CoffeeIcon, hotel: BedIcon, shopping: BagIcon, nightlife: MoonIcon,
};
const modeIcon = { walk: WalkIcon, transit: TransitIcon, drive: CarIcon };
const modeLabel = { walk: "Walk", transit: "Transit", drive: "Drive" };
const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

type Over = { id: string; pos: "before" | "after" } | { day: number | null };

function dayLabel(start: string | undefined, n: number) {
  if (!start) return "";
  const [y, m, d] = start.split("-").map(Number);
  if (!y) return "";
  return new Date(y, m - 1, d + n - 1).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function TravelChip({ a, b, mode, onCycle }: { a: Place; b: Place; mode?: Mode; onCycle: () => void }) {
  const km = dist(a, b); const m = mode ?? autoMode(km); const Icon = modeIcon[m];
  return (
    <li className="flex items-center gap-3 py-1 pl-[2.1rem]">
      <span aria-hidden className="h-6 w-px border-l-2 border-dashed border-navy/20" />
      <button type="button" onClick={onCycle} aria-label={`${modeLabel[m]}, ${travelMinutes(km, m)} minutes, ${km.toFixed(1)} kilometres. Change travel mode`}
        className="inline-flex items-center gap-1.5 rounded-full border border-navy/10 bg-white px-3 py-1 text-xs font-semibold text-navy/70 shadow-card transition hover:bg-navy/5">
        <Icon size={14} />{travelMinutes(km, m)} min<span className="text-navy/40">·</span>{km.toFixed(1)} km
      </button>
    </li>
  );
}

type CardProps = {
  p: Place; num: number; day: number | undefined; dayCount: number; first: boolean; last: boolean; selected: boolean; dragging: boolean; over?: "before" | "after";
  set: Set; onSelect: (id: string) => void; onHover: (id?: string) => void; onOpen: () => void; onMove: (dir: -1 | 1) => void; onSend: (day: number | undefined) => void;
  onDragStart: (e: DragEvent, id: string, el: HTMLElement | null) => void; onDragEnd: () => void; onDragOver: (e: DragEvent, id: string) => void; onDrop: (e: DragEvent, id: string) => void;
};

function PlaceCard(c: CardProps) {
  const { p } = c;
  const [thread, setThread] = useState(false);
  const { enabled } = useComments();
  const kind = kindOf(p.category); const Icon = kindIcon[kind];
  const patch = (x: Partial<Place>) => c.set((d) => ({ ...d, places: d.places.map((q) => (q.id === p.id ? { ...q, ...x } : q)) }));
  const items: DropdownItem[] = [
    { label: "View details", onSelect: c.onOpen },
    ...(!c.first ? [{ label: "Move up", icon: <ArrowUpIcon size={14} />, onSelect: () => c.onMove(-1) }] : []),
    ...(!c.last ? [{ label: "Move down", icon: <ArrowDownIcon size={14} />, onSelect: () => c.onMove(1) }] : []),
    ...Array.from({ length: c.dayCount }, (_, i) => i + 1).filter((n) => n !== c.day).map((n) => ({ label: `Move to Day ${n}`, onSelect: () => c.onSend(n) })),
    ...(c.day ? [{ label: "Unschedule", onSelect: () => c.onSend(undefined) }] : []),
    { label: "Remove", icon: <TrashIcon size={14} />, danger: true, onSelect: () => c.set((d) => ({ ...d, places: d.places.filter((q) => q.id !== p.id) })) },
  ];
  const field = "h-9 rounded-lg border border-navy/10 bg-surface px-2 text-xs font-semibold outline-none focus:border-navy";
  return (
    <li id={`place-${p.id}`} onMouseEnter={() => c.onHover(p.id)} onMouseLeave={() => c.onHover(undefined)} onDragOver={(e) => c.onDragOver(e, p.id)} onDrop={(e) => c.onDrop(e, p.id)}
      className={`relative rounded-2xl bg-white p-3 shadow-card transition ${c.selected ? "ring-2 ring-ocean-500" : ""} ${c.dragging ? "opacity-40" : ""}`}>
      <EditingTag placeId={p.id} />
      {c.over && <span aria-hidden className={`absolute inset-x-2 z-10 h-1 rounded-full bg-ocean-500 ${c.over === "before" ? "-top-2" : "-bottom-2"}`} />}
      <div className="flex gap-2.5">
        <span draggable role="button" tabIndex={-1} aria-label={`Drag ${p.name} to reorder`} title="Drag to reorder"
          onDragStart={(e) => c.onDragStart(e, p.id, (e.currentTarget as HTMLElement).closest("li"))} onDragEnd={c.onDragEnd}
          className="flex w-5 shrink-0 cursor-grab items-center justify-center text-navy/35 hover:text-navy active:cursor-grabbing"><GripIcon size={18} /></span>
        <button type="button" onClick={c.onOpen} aria-label={`Open details for ${p.name}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ocean-100 sm:h-24 sm:w-24">
          <img src={unsplash(p.photo ?? photoFor(p.name), 300)} alt="" loading="lazy" className="h-full w-full object-cover" draggable={false} />
          <span className="absolute left-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-navy text-[11px] font-bold text-white ring-2 ring-white">{c.num}</span>
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <button type="button" onClick={() => { c.onSelect(p.id); c.onOpen(); }} className="min-w-0 text-left text-sm font-bold leading-snug hover:underline">{p.name}</button>
            <Dropdown align="right" trigger={<span aria-label={`Actions for ${p.name}`} className="grid h-8 w-8 place-items-center rounded-full text-navy/60 hover:bg-navy/5"><DotsIcon size={16} /></span>} items={items} />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy/65">
            <span className="inline-flex items-center gap-1.5 font-semibold"><Icon size={13} />{p.category}</span>
            {p.rating && <span className="inline-flex items-center gap-1 font-semibold"><span className="text-amber-500"><StarIcon size={12} /></span>{p.rating.toFixed(1)}</span>}
            <span className="inline-flex items-center gap-1"><ClockIcon size={12} />{hoursByKind[kind]}</span>
          </div>
          <input key={p.note} aria-label={`Note for ${p.name}`} defaultValue={p.note} placeholder="Add a note…" onBlur={(e) => { if (e.target.value !== p.note) patch({ note: e.target.value }); }}
            className="mt-2 w-full rounded-md bg-transparent py-1 text-xs text-navy/75 outline-none placeholder:text-navy/35 focus:bg-surface focus:px-2" />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2 pl-[1.75rem]">
        <label className="inline-flex items-center gap-1.5 text-xs text-navy/60"><ClockIcon size={13} /><span className="sr-only">Time for {p.name}</span>
          <input key={p.time} type="time" defaultValue={p.time ?? ""} onBlur={(e) => { if (e.target.value !== (p.time ?? "")) patch({ time: e.target.value || undefined }); }} className={`${field} w-28`} /></label>
        <label className="inline-flex items-center gap-1.5 text-xs text-navy/60"><CoinIcon size={13} /><span className="sr-only">Cost for {p.name}</span>
          <input key={p.cost} type="number" min={0} placeholder="$0" defaultValue={p.cost ?? ""} onBlur={(e) => { const v = e.target.value === "" ? undefined : Math.max(0, Number(e.target.value)); if (v !== p.cost) patch({ cost: v }); }} className={`${field} w-20`} /></label>
        <span className="ml-auto"><CommentButton placeId={p.id} name={p.name} open={thread} onClick={() => setThread((o) => !o)} /></span>
      </div>
      {thread && enabled && <div className="pl-[1.75rem]"><CommentThread placeId={p.id} name={p.name} /></div>}
    </li>
  );
}

export default function Itinerary({ doc, set, start, city, selectedId, onSelect, onHover }: {
  doc: Doc; set: Set; start?: string; city: string; selectedId?: string; onSelect: (id?: string) => void; onHover: (id?: string) => void;
}) {
  const { show } = useToast();
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [drag, setDrag] = useState<string>();
  const [over, setOver] = useState<Over>();
  const [overrides, setOverrides] = useState<Record<string, Mode>>({});
  const [detail, setDetail] = useState<Candidate>();
  const [dayInputs, setDayInputs] = useState<Record<number, string>>({});
  const [cat, setCat] = useState<Kind>("attraction");
  const dayNums = Array.from({ length: doc.days }, (_, i) => i + 1);
  const numberOf = (id: string) => doc.places.findIndex((p) => p.id === id) + 1;
  const names = useMemo(() => new window.Set(doc.places.map((p) => p.name.toLowerCase())), [doc.places]);

  const movePlace = (id: string, day: number | undefined, targetId?: string, pos?: "before" | "after") => set((d) => {
    const moving = d.places.find((p) => p.id === id);
    if (!moving || id === targetId) return d;
    const rest = d.places.filter((p) => p.id !== id);
    const idx = targetId ? rest.findIndex((p) => p.id === targetId) + (pos === "after" ? 1 : 0) : rest.length;
    rest.splice(Math.max(0, idx), 0, { ...moving, day });
    return { ...d, places: normalize(rest) };
  });
  const nudge = (id: string, dir: -1 | 1) => set((d) => {
    const p = d.places.find((x) => x.id === id); if (!p) return d;
    const same = d.places.filter((x) => x.day === p.day); const i = same.findIndex((x) => x.id === id); const t = same[i + dir];
    if (!t) return d;
    const a = [...d.places]; const ia = a.indexOf(p); const ib = a.indexOf(t); [a[ia], a[ib]] = [a[ib], a[ia]];
    return { ...d, places: a };
  });
  const addTo = (s: { name: string; category: string; x: number; y: number; rating?: number }, day: number | undefined, extra: Partial<Place> = {}) => set((d) => ({
    ...d, places: normalize([...d.places, { id: uid(), note: "", cost: costByKind[kindOf(s.category)], ...s, day, ...extra }]),
  }));
  const addTyped = (day: number) => {
    const name = (dayInputs[day] ?? "").trim(); if (!name) return;
    addTo({ name, category: "Attraction", ...hashPos(name) }, day); setDayInputs((m) => ({ ...m, [day]: "" }));
  };
  const optimize = (day: number) => {
    const items = doc.places.filter((p) => p.day === day); const next = optimizeOrder(items);
    const saved = pathLength(items) - pathLength(next);
    if (saved < 0.05) { show({ title: `Day ${day} is already efficient`, description: "No shorter route found." }); return; }
    set((d) => ({ ...d, places: normalize([...d.places.filter((p) => p.day !== day), ...next]) }));
    show({ title: `Day ${day} route optimized`, description: `Saved about ${saved.toFixed(1)} km of travel.`, tone: "success" });
  };
  const autoFill = (day: number) => {
    const fresh = allSuggestions().filter((s) => !names.has(s.name.toLowerCase()));
    const picks: Suggestion[] = (["attraction", "restaurant", "cafe"] as Kind[]).map((k) => fresh.find((s) => s.kind === k)).filter(Boolean) as Suggestion[];
    if (!picks.length) { show({ title: "No more suggestions to add" }); return; }
    const times = ["10:00", "13:00", "16:00"];
    set((d) => ({ ...d, places: normalize([...d.places, ...picks.map((s, i) => ({ id: uid(), note: "", cost: costByKind[s.kind], name: s.name, category: s.category, x: s.x, y: s.y, rating: s.rating, day, time: times[i] }))]) }));
    show({ title: `Added ${picks.length} places to Day ${day}`, tone: "success" });
  };
  const removeDay = (n: number) => set((d) => ({ ...d, days: d.days - 1, places: normalize(d.places.map((p) => (p.day === n ? { ...p, day: undefined } : p.day && p.day > n ? { ...p, day: p.day - 1 } : p))) }));
  const submitDetail = (day: number | undefined) => {
    if (!detail) return;
    if (detail.id) movePlace(detail.id, day);
    else addTo(detail, day);
    show({ title: day ? `Added to Day ${day}` : "Saved to unscheduled", description: detail.name, tone: "success" });
  };

  const onDragStart = (e: DragEvent, id: string, el: HTMLElement | null) => {
    e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", id);
    if (el) e.dataTransfer.setDragImage(el, 20, 20);
    setDrag(id);
  };
  const endDrag = () => { setDrag(undefined); setOver(undefined); };
  const cardOver = (day: number | undefined) => (e: DragEvent, id: string) => {
    if (!drag) return; e.preventDefault(); e.stopPropagation();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const pos = e.clientY < r.top + r.height / 2 ? "before" : "after";
    setOver((o) => (o && "id" in o && o.id === id && o.pos === pos ? o : { id, pos }));
    void day;
  };
  const cardDrop = (day: number | undefined) => (e: DragEvent, id: string) => {
    if (!drag) return; e.preventDefault(); e.stopPropagation();
    const pos = over && "id" in over ? over.pos : "after";
    movePlace(drag, day, id, pos); endDrag();
  };
  const zoneProps = (day: number | undefined) => ({
    onDragOver: (e: DragEvent) => { if (!drag) return; e.preventDefault(); setOver((o) => (o && "day" in o && o.day === (day ?? null) ? o : { day: day ?? null })); },
    onDrop: (e: DragEvent) => { if (!drag) return; e.preventDefault(); movePlace(drag, day); endDrag(); },
  });

  const renderList = (day: number | undefined, items: Place[]) => (
    <ol className="space-y-0">
      {items.map((p, i) => (
        <li key={p.id} className="list-none">
          <ol className="m-0 list-none p-0">
            <PlaceCard p={p} num={numberOf(p.id)} day={day} dayCount={doc.days} first={i === 0} last={i === items.length - 1} selected={p.id === selectedId} dragging={drag === p.id}
              over={over && "id" in over && over.id === p.id ? over.pos : undefined} set={set} onSelect={(id) => onSelect(id)} onHover={onHover}
              onOpen={() => setDetail({ id: p.id, name: p.name, category: p.category, rating: p.rating, x: p.x, y: p.y, day: p.day })}
              onMove={(dir) => nudge(p.id, dir)} onSend={(d) => movePlace(p.id, d)} onDragStart={onDragStart} onDragEnd={endDrag} onDragOver={cardOver(day)} onDrop={cardDrop(day)} />
            {day && items[i + 1] && <TravelChip a={p} b={items[i + 1]} mode={overrides[`${p.id}-${items[i + 1].id}`]}
              onCycle={() => { const k = `${p.id}-${items[i + 1].id}`; const cur = overrides[k] ?? autoMode(dist(p, items[i + 1])); setOverrides((o) => ({ ...o, [k]: modes[(modes.indexOf(cur) + 1) % modes.length] })); }} />}
          </ol>
        </li>
      ))}
    </ol>
  );

  const allCollapsed = dayNums.every((n) => collapsed[n]);
  const unscheduled = doc.places.filter((p) => !p.day);
  const dropActive = (day: number | null) => !!drag && over && "day" in over && over.day === day;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold tracking-tight">Itinerary</h2>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="ghost" onClick={() => setCollapsed(allCollapsed ? {} : Object.fromEntries(dayNums.map((n) => [n, true])))}>{allCollapsed ? "Expand all" : "Collapse all"}</Button>
          <Button size="sm" icon={<PlusIcon size={14} />} onClick={() => set((d) => ({ ...d, days: d.days + 1 }))}>Add day</Button>
        </div>
      </div>

      {dayNums.map((n) => {
        const items = doc.places.filter((p) => p.day === n); const open = !collapsed[n];
        const total = items.reduce((s, p) => s + (p.cost ?? 0), 0); const date = dayLabel(start, n);
        return (
          <section key={n} aria-label={`Day ${n}`} {...zoneProps(n)} className={`rounded-3xl p-3 transition sm:p-4 ${dropActive(n) ? "bg-ocean-100/60 ring-2 ring-dashed ring-ocean-500" : "bg-white/60"}`}>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" aria-expanded={open} aria-controls={`day-body-${n}`} onClick={() => setCollapsed((c) => ({ ...c, [n]: open }))} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy/5 transition ${open ? "" : "-rotate-90"}`}><ChevronDownIcon size={16} /></span>
                <span className="min-w-0"><span className="block font-display text-xl uppercase tracking-wide">Day {n}{date && <span className="ml-2 font-sans text-sm font-semibold normal-case tracking-normal text-navy/60">{date}</span>}</span>
                  <span className="block text-xs text-navy/55">{items.length} {items.length === 1 ? "stop" : "stops"}{total > 0 && ` · ${money(total)}`}</span></span>
              </button>
              <Button size="sm" variant="secondary" icon={<RouteIcon size={14} />} disabled={items.length < 3} onClick={() => optimize(n)}>Optimize route</Button>
              <Button size="sm" variant="secondary" icon={<WandIcon size={14} />} onClick={() => autoFill(n)}>Auto-fill day</Button>
              <Dropdown align="right" trigger={<span aria-label={`Actions for Day ${n}`} className="grid h-8 w-8 place-items-center rounded-full text-navy/60 hover:bg-navy/5"><DotsIcon size={16} /></span>}
                items={[{ label: "Clear day", onSelect: () => set((d) => ({ ...d, places: normalize(d.places.map((p) => (p.day === n ? { ...p, day: undefined } : p))) })) },
                  ...(doc.days > 1 ? [{ label: "Delete day", danger: true, icon: <TrashIcon size={14} />, onSelect: () => removeDay(n) }] : [])]} />
            </div>
            {open && (
              <div id={`day-body-${n}`} className="mt-4 space-y-3">
                {items.length ? renderList(n, items) : <p className="rounded-2xl border border-dashed border-navy/20 px-4 py-6 text-center text-sm text-navy/55">Nothing planned yet. Drag a place here, add one below, or try Auto-fill day.</p>}
                <div className="flex gap-2">
                  <input aria-label={`Add a place to Day ${n}`} value={dayInputs[n] ?? ""} onChange={(e) => setDayInputs((m) => ({ ...m, [n]: e.target.value }))} onKeyDown={(e) => { if (e.key === "Enter") addTyped(n); }}
                    placeholder="Add a place" className="h-11 min-w-0 flex-1 rounded-full border border-navy/15 bg-white px-4 text-sm outline-none focus:border-navy" />
                  <Button size="sm" icon={<PlusIcon size={14} />} onClick={() => addTyped(n)} disabled={!(dayInputs[n] ?? "").trim()}>Add</Button>
                </div>
              </div>
            )}
          </section>
        );
      })}

      <section aria-label="Unscheduled places" {...zoneProps(undefined)} className={`rounded-3xl p-3 transition sm:p-4 ${dropActive(null) ? "bg-ocean-100/60 ring-2 ring-dashed ring-ocean-500" : "bg-white/60"}`}>
        <h3 className="mb-3 text-sm font-extrabold">Unscheduled <span className="font-normal text-navy/55">· {unscheduled.length}</span></h3>
        {unscheduled.length ? renderList(undefined, unscheduled) : <p className="text-sm text-navy/55">Everything has a day. Drop a place here to unschedule it.</p>}
      </section>

      <section aria-label="Places to visit suggestions">
        <h3 className="mb-3 text-xl font-extrabold tracking-tight">Places to visit</h3>
        <div className="mb-4 overflow-x-auto pb-1"><Tabs variant="pill" items={kinds.map((k) => ({ id: k.id, label: k.label }))} value={cat} onChange={(id) => setCat(id as Kind)} /></div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {suggestionsFor(cat).map((s) => {
            const added = names.has(s.name.toLowerCase()); const Icon = kindIcon[s.kind];
            return (
              <li key={s.name} className="flex gap-3 rounded-2xl bg-white p-3 shadow-card">
                <button type="button" onClick={() => setDetail({ name: s.name, category: s.category, rating: s.rating, x: s.x, y: s.y })} aria-label={`Open details for ${s.name}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ocean-100">
                  <img src={unsplash(photoFor(s.name), 300)} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div><p className="truncate text-sm font-bold">{s.name}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-xs text-navy/65"><span className="inline-flex items-center gap-1"><Icon size={12} />{s.category}</span><span className="inline-flex items-center gap-1"><span className="text-amber-500"><StarIcon size={11} /></span>{s.rating.toFixed(1)}</span></p></div>
                  {added ? <Badge tone="success">Added to trip</Badge> : (
                    <Dropdown className="self-start" trigger={<span className="inline-flex items-center gap-1 rounded-full bg-navy px-3 py-1.5 text-xs font-bold text-white"><PlusIcon size={12} />Add to day</span>}
                      items={[...dayNums.map((n) => ({ label: `Day ${n}`, onSelect: () => { addTo(s, n); show({ title: `Added to Day ${n}`, description: s.name, tone: "success" }); } })), { label: "Unscheduled", onSelect: () => addTo(s, undefined) }]} />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {detail && <PlaceDetail key={detail.id ?? detail.name} place={detail} city={city} days={doc.days} onClose={() => setDetail(undefined)} onSubmit={submitDetail} />}
    </div>
  );
}
