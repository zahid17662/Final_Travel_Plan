import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { CloseIcon, LayersIcon, MinusIcon, PinIcon, PlusIcon, SearchIcon, StarIcon, TargetIcon, Toggle } from "../../components/ui";
import type { Place } from "./seed";

const themes = {
  default: { name: "Default", land: "#e9ecee", water: "#cfe6fb", park: "#dce9de", road: "#ffffff", label: "#8a93a6" },
  terrain: { name: "Terrain", land: "#e8e4d6", water: "#bfdcf0", park: "#cddfc2", road: "#f8f5ec", label: "#7d7a6a" },
  night: { name: "Night", land: "#243063", water: "#141c3f", park: "#1b2a5a", road: "#33437f", label: "#8fa0d6" },
} as const;
type ThemeId = keyof typeof themes;

type Nearby = { id: string; name: string; x: number; y: number };
type Props = {
  places: Place[]; nearby: Nearby[]; selectedId?: string; hoverId?: string;
  onSelect: (id?: string) => void; onAddNearby: (n: Nearby) => void; onSearchArea: () => void; searching: boolean; readOnly?: boolean;
};

const MIN = 1, MAX = 3;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function MapPanel({ places, nearby, selectedId, hoverId, onSelect, onAddNearby, onSearchArea, searching, readOnly }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, z: 1 });
  const [theme, setTheme] = useState<ThemeId>("default");
  const [routes, setRoutes] = useState(true);
  const [labels, setLabels] = useState(true);
  const [layersOpen, setLayersOpen] = useState(false);
  const t = themes[theme];
  const selected = places.find((p) => p.id === selectedId);

  const bound = (x: number, y: number, z: number) => {
    const w = box.current?.clientWidth ?? 0, h = box.current?.clientHeight ?? 0;
    return { x: clamp(x, w * (1 - z), 0), y: clamp(y, h * (1 - z), 0), z };
  };
  const zoomBy = (f: number) => setView((v) => {
    const w = box.current?.clientWidth ?? 0, h = box.current?.clientHeight ?? 0;
    const z = clamp(v.z * f, MIN, MAX);
    return bound(w / 2 - ((w / 2 - v.x) * z) / v.z, h / 2 - ((h / 2 - v.y) * z) / v.z, z);
  });
  const down = (e: PointerEvent) => { drag.current = { px: e.clientX, py: e.clientY, x: view.x, y: view.y }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); };
  const move = (e: PointerEvent) => { const d = drag.current; if (d) setView((v) => bound(d.x + e.clientX - d.px, d.y + e.clientY - d.py, v.z)); };
  const up = () => { drag.current = null; };

  const btn = "grid h-10 w-10 place-items-center bg-white text-navy transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-navy disabled:opacity-40";
  const inv = `translate(-50%,-50%) scale(${1 / view.z})`;

  return (
    <div className="relative h-full w-full overflow-hidden bg-ocean-100" style={{ backgroundColor: t.water }}>
      <div ref={box} role="application" aria-label="Trip map. Drag to pan." className="absolute inset-0 cursor-grab touch-none select-none active:cursor-grabbing"
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onClick={() => { onSelect(undefined); setLayersOpen(false); }}>
        <div className="absolute inset-0 origin-top-left" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.z})` }}>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="1000" height="800" fill={t.land} />
            <path d="M-20 520 C140 440 260 580 420 520 C580 460 640 360 800 380 C900 392 960 340 1040 300 L1040 400 C960 440 900 500 800 490 C680 478 640 580 480 640 C320 700 160 620 -20 660Z" fill={t.water} />
            <ellipse cx="840" cy="130" rx="120" ry="70" fill={t.water} />
            <ellipse cx="220" cy="170" rx="130" ry="80" fill={t.park} />
            <rect x="620" y="560" width="220" height="130" rx="40" fill={t.park} />
            <rect x="380" y="90" width="120" height="90" rx="24" fill={t.park} />
            <g stroke={t.road} strokeLinecap="round" fill="none">
              <path d="M0 250 H1000M0 420 H1000M0 720 H1000" strokeWidth="9" />
              <path d="M180 0 V800M520 0 V800M860 0 V800" strokeWidth="9" />
              <path d="M0 140 L1000 340M120 800 L560 0M700 800 L1000 560M300 0 L480 800" strokeWidth="4" />
              <path d="M0 330 H1000M0 600 H1000M350 0 V800M690 0 V800" strokeWidth="3" />
            </g>
            {labels && (
              <g fill={t.label} fontSize="22" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif" letterSpacing="2">
                <text x="90" y="190">PARK</text><text x="560" y="520">RIVER</text><text x="640" y="640">GARDENS</text><text x="700" y="300">OLD TOWN</text><text x="230" y="460">HARBOUR</text>
              </g>
            )}
          </svg>
          {routes && places.length > 1 && (
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polyline points={places.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={theme === "night" ? "#7cc0dc" : "#1F2B5E"} strokeOpacity="0.7" strokeWidth="2.5" strokeDasharray="1 6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
          )}
          {nearby.map((n) => (
            <button key={n.id} type="button" aria-label={`Add nearby suggestion: ${n.name}`} title={`Add ${n.name}`} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onAddNearby(n); }}
              className="group absolute z-10 grid h-5 w-5 place-items-center rounded-full border-2 border-navy bg-white text-navy shadow-card hover:bg-ocean-100" style={{ left: `${n.x}%`, top: `${n.y}%`, transform: inv }}>
              <PlusIcon size={10} /><span className="pointer-events-none absolute left-6 whitespace-nowrap rounded-md bg-navy px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">{n.name}</span>
            </button>
          ))}
          {places.map((p, i) => {
            const on = p.id === selectedId, hot = p.id === hoverId;
            return (
              <button key={p.id} type="button" aria-label={`Pin ${i + 1}: ${p.name}`} aria-pressed={on} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onSelect(p.id); }}
                className={`absolute grid place-items-center rounded-full border-2 border-white text-xs font-bold text-white shadow-pop transition-[width,height,background-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${on || hot ? "z-20 h-10 w-10 bg-ocean-500" : "z-10 h-8 w-8 bg-navy"}`}
                style={{ left: `${p.x}%`, top: `${p.y}%`, transform: inv }}>{i + 1}</button>
            );
          })}
        </div>
      </div>

      {!readOnly && <button type="button" onClick={onSearchArea} disabled={searching}
        className="absolute left-1/2 top-4 z-20 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-navy shadow-pop transition hover:bg-surface disabled:opacity-70">
        <SearchIcon size={14} />{searching ? "Searching…" : "Search this area"}
      </button>}

      <div className="absolute right-3 top-3 z-20 sm:right-4 sm:top-4">
        <button type="button" aria-haspopup="dialog" aria-expanded={layersOpen} onClick={() => setLayersOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2.5 text-xs font-bold text-navy shadow-pop hover:bg-surface"><LayersIcon size={14} /><span className="hidden sm:inline">Map layers</span></button>
        {layersOpen && (
          <div role="dialog" aria-label="Map layers" className="absolute right-0 mt-2 w-60 space-y-4 rounded-2xl bg-white p-4 text-navy shadow-pop">
            <div role="radiogroup" aria-label="Map style" className="grid grid-cols-3 gap-2">
              {(Object.keys(themes) as ThemeId[]).map((id) => (
                <button key={id} type="button" role="radio" aria-checked={theme === id} onClick={() => setTheme(id)} className="text-center text-[11px] font-semibold">
                  <span className={`mb-1 block h-12 rounded-lg border-2 ${theme === id ? "border-navy" : "border-transparent"}`} style={{ background: `linear-gradient(135deg, ${themes[id].land} 55%, ${themes[id].water} 55%)` }} />
                  {themes[id].name}
                </button>
              ))}
            </div>
            <Toggle checked={routes} onChange={setRoutes} label="Route lines" />
            <Toggle checked={labels} onChange={setLabels} label="Area labels" />
          </div>
        )}
      </div>

      <div className="absolute bottom-24 right-3 z-20 flex flex-col overflow-hidden rounded-xl shadow-pop sm:bottom-6 sm:right-4 lg:bottom-6">
        <button type="button" aria-label="Zoom in" disabled={view.z >= MAX} onClick={() => zoomBy(1.5)} className={`${btn} border-b border-navy/10`}><PlusIcon size={18} /></button>
        <button type="button" aria-label="Zoom out" disabled={view.z <= MIN} onClick={() => zoomBy(1 / 1.5)} className={`${btn} border-b border-navy/10`}><MinusIcon size={18} /></button>
        <button type="button" aria-label="Reset view" onClick={() => setView({ x: 0, y: 0, z: 1 })} className={btn}><TargetIcon size={18} /></button>
      </div>

      {selected && (
        <div className="absolute bottom-24 left-3 right-16 z-20 max-w-xs rounded-2xl bg-white p-4 text-navy shadow-pop sm:bottom-6 sm:left-4 lg:bottom-6">
          <button type="button" aria-label="Close place card" onClick={() => onSelect(undefined)} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full hover:bg-navy/5"><CloseIcon size={14} /></button>
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-navy/55"><PinIcon size={12} />{selected.category}</p>
          <h3 className="mt-1 pr-6 text-base font-bold">{places.indexOf(selected) + 1}. {selected.name}</h3>
          {selected.rating && <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold"><span className="text-amber-500"><StarIcon size={14} /></span>{selected.rating.toFixed(1)}</p>}
          {selected.note && <p className="mt-2 text-xs text-navy/60">{selected.note}</p>}
        </div>
      )}
    </div>
  );
}
