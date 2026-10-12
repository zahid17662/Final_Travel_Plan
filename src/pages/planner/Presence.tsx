import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Tooltip } from "../../components/ui";
import { colorFor, firstName } from "./collab";
import type { Member } from "./collab";
import { Dot } from "./comments";

export type Editing = { name: string; placeId?: string; what: string } | undefined;
const E = createContext<Editing>(undefined);
export const EditingProvider = E.Provider;
export const useEditing = () => useContext(E);

export function useSimulatedPresence(others: Member[], places: { id: string; name: string }[]) {
  const [online, setOnline] = useState<string[]>(() => others.slice(0, 2).map((m) => m.name));
  const [editing, setEditing] = useState<Editing>();
  const ref = useRef({ others, places }); ref.current = { others, places };
  useEffect(() => { setOnline((o) => { const n = o.filter((x) => others.some((m) => m.name === x)); return n.length === o.length ? o : n; }); }, [others]);
  useEffect(() => {
    let stop: number | undefined;
    const tick = window.setInterval(() => {
      const { others: o, places: p } = ref.current; if (!o.length) return;
      const m = o[Math.floor(Math.random() * o.length)];
      setOnline((l) => (l.includes(m.name) ? l : [...l, m.name]));
      if (m.role === "view") return;
      const pl = p.length && Math.random() < 0.6 ? p[Math.floor(Math.random() * p.length)] : undefined;
      setEditing({ name: m.name, placeId: pl?.id, what: pl ? pl.name : "the itinerary" });
      window.clearTimeout(stop); stop = window.setTimeout(() => setEditing(undefined), 5500);
    }, 12000);
    return () => { window.clearInterval(tick); window.clearTimeout(stop); };
  }, []);
  useEffect(() => { if (editing && !others.some((m) => m.name === editing.name)) setEditing(undefined); }, [others, editing]);
  return { online, editing };
}

export function PresenceBar({ you, others, online }: { you: string; others: Member[]; online: string[] }) {
  const people = [{ name: you, you: true }, ...others.filter((m) => online.includes(m.name)).map((m) => ({ name: m.name, you: false }))];
  const shown = people.slice(0, 4); const extra = people.length - shown.length;
  return (
    <div role="group" aria-label={`${people.length} online: ${people.map((p) => (p.you ? "you" : p.name)).join(", ")}`} className="mr-1 hidden items-center -space-x-2 sm:flex">
      {shown.map((p) => (
        <Tooltip key={p.name} content={p.you ? "You" : `${firstName(p.name)} · online`} side="bottom">
          <span className="relative rounded-full ring-2" style={{ ["--tw-ring-color" as string]: colorFor(p.name) }}><Dot name={p.name} size={30} />
            <span aria-hidden className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" /></span>
        </Tooltip>
      ))}
      {extra > 0 && <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-ocean-100 text-[11px] font-bold ring-2 ring-white">+{extra}</span>}
    </div>
  );
}

export function EditingPill({ editing }: { editing: Editing }) {
  if (!editing) return <span role="status" className="sr-only" />;
  const c = colorFor(editing.name);
  return (
    <span role="status" className="inline-flex max-w-[16rem] items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-pop">
      <span aria-hidden className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: c }} /><span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: c }} /></span>
      <span className="truncate"><strong style={{ color: c }}>{firstName(editing.name)}</strong> is editing {editing.what}</span>
    </span>
  );
}

export function EditingTag({ placeId }: { placeId: string }) {
  const e = useEditing();
  if (!e || e.placeId !== placeId) return null;
  return <span className="absolute -top-2.5 right-4 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white shadow-card" style={{ background: colorFor(e.name) }}>{firstName(e.name)} is editing</span>;
}
