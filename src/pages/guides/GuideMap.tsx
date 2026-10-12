import { PinIcon } from "../../components/ui";

type Pin = { id: string; name: string; x: number; y: number };

export default function GuideMap({ pins, selected, onSelect, label }: { pins: Pin[]; selected?: string; onSelect: (id: string) => void; label: string }) {
  return (
    <div className="relative h-full min-h-[18rem] w-full overflow-hidden rounded-3xl bg-ocean-100 shadow-card">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <rect width="100" height="100" className="fill-ocean-100" />
        <path d="M0 70 C20 58 34 78 54 66 S88 58 100 66 V100 H0Z" className="fill-ocean-300/50" />
        <path d="M-5 22 C20 28 28 12 50 22 S85 30 105 16" className="stroke-white" strokeWidth="2.4" fill="none" />
        <path d="M18 -5 C22 30 40 50 36 105 M72 -5 C66 36 78 56 68 105" className="stroke-white/80" strokeWidth="1.4" fill="none" />
        <rect x="6" y="36" width="14" height="12" rx="3" className="fill-white/60" /><rect x="76" y="76" width="16" height="12" rx="3" className="fill-white/60" /><rect x="44" y="6" width="12" height="8" rx="3" className="fill-white/60" />
      </svg>
      {pins.map((p, i) => (
        <button key={p.id} type="button" aria-label={p.name} aria-pressed={selected === p.id} onClick={() => onSelect(p.id)} style={{ left: `${p.x}%`, top: `${p.y}%` }}
          className={`absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xs font-bold ring-2 ring-white transition ${selected === p.id ? "z-10 scale-125 bg-navy text-white shadow-pop" : "bg-white text-navy shadow-card hover:scale-110"}`}>{i + 1}</button>
      ))}
      <p className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold shadow-card"><PinIcon size={12} />{label}</p>
    </div>
  );
}
