import { useMemo, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import topo from "world-atlas/countries-110m.json";

type Country = Feature<Geometry, { name: string }>;
const W = 960, H = 500;

const countries: Country[] = (() => {
  const t = topo as unknown as Topology;
  return (feature(t, t.objects.countries as GeometryCollection) as FeatureCollection<Geometry, { name: string }>).features.filter((f) => f.properties.name !== "Antarctica");
})();
export const countryNames = countries.map((c) => c.properties.name).sort();

export default function WorldMap({ visited, onToggle }: { visited: string[]; onToggle?: (name: string) => void }) {
  const [hover, setHover] = useState<string>();
  const paths = useMemo(() => {
    const proj = geoNaturalEarth1().fitSize([W, H], { type: "Sphere" });
    const gen = geoPath(proj);
    return countries.map((c) => ({ name: c.properties.name, d: gen(c) ?? "" }));
  }, []);
  const set = new Set(visited);
  return (
    <div className="relative overflow-hidden rounded-3xl bg-ocean-100/60 p-2 shadow-card sm:p-4">
      <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label="World map of visited countries" className="w-full">
        {paths.map((p) => {
          const on = set.has(p.name);
          const props = onToggle ? { role: "button" as const, tabIndex: 0, "aria-pressed": on, onClick: () => onToggle(p.name), onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(p.name); } } } : { role: "img" as const };
          return <path key={p.name} d={p.d} aria-label={`${p.name}${on ? ", visited" : ""}`} onMouseEnter={() => setHover(p.name)} onMouseLeave={() => setHover(undefined)} onFocus={() => setHover(p.name)} onBlur={() => setHover(undefined)} {...props}
            strokeWidth={0.5} className={`stroke-white outline-none transition-colors ${on ? "fill-navy" : "fill-white"} ${onToggle ? "cursor-pointer" : ""} ${hover === p.name ? (on ? "fill-navy/80" : "fill-ocean-300") : ""} focus-visible:stroke-ocean-500 focus-visible:stroke-2`} />;
        })}
      </svg>
      <p className="pointer-events-none absolute bottom-3 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold shadow-card" aria-live="polite">{hover ? `${hover}${set.has(hover) ? " · visited" : onToggle ? " · click to mark visited" : ""}` : onToggle ? "Click a country to mark it visited" : "Visited countries"}</p>
    </div>
  );
}
