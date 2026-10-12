import { useMemo, useState } from "react";
import { Badge, Button, Card, Chip, Container, EmptyState, Page, SearchBar, Select, StarIcon, Tabs, unsplash } from "../../components/ui";
import { categories, continents, dests, seasons } from "../../data/explore";
import type { Dest, Season } from "../../data/explore";

const budgetLabel = { "$": "Budget", "$$": "Mid-range", "$$$": "Splurge" } as const;

function DestCard({ d }: { d: Dest }) {
  return (
    <a href={`#/destination/${d.slug}`} className="group block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500">
      <Card hover image={unsplash(d.photo, 700)} imageAlt={d.name} padded={false} ratio="aspect-[4/3]">
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div><h3 className="font-display text-xl uppercase tracking-wide">{d.name}</h3><p className="text-xs text-navy/60">{d.country}</p></div>
            <Badge tone="ocean">{d.budget}</Badge>
          </div>
          <p className="mt-2 line-clamp-2 text-xs text-navy/70">{d.blurb}</p>
          <p className="mt-3 text-[11px] font-semibold text-navy/55">Best: {d.bestTime}</p>
        </div>
      </Card>
    </a>
  );
}

export default function Explore() {
  const [q, setQ] = useState("");
  const [continent, setContinent] = useState("");
  const [season, setSeason] = useState("");
  const [budget, setBudget] = useState("");
  const [cat, setCat] = useState("All");
  const [bt, setBt] = useState<Season>("Spring");

  const list = useMemo(() => dests.filter((d) =>
    (!continent || d.continent === continent) && (!season || d.seasons.includes(season as Season)) && (!budget || d.budget === budget) &&
    (cat === "All" || d.tags.includes(cat)) && `${d.name} ${d.country} ${d.continent}`.toLowerCase().includes(q.trim().toLowerCase()),
  ), [q, continent, season, budget, cat]);
  const active = !!(q || continent || season || budget || cat !== "All");
  const reset = () => { setQ(""); setContinent(""); setSeason(""); setBudget(""); setCat("All"); };
  const trending = [...dests].filter((d) => d.trend).sort((a, b) => b.trend! - a.trend!).slice(0, 5);
  const best = dests.filter((d) => d.seasons.includes(bt)).slice(0, 4);

  return (
    <Page loggedIn={false}>
      <section className="bg-navy text-white">
        <Container className="py-12 md:py-16">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">Explore</p>
          <h1 className="mt-2 max-w-3xl font-display text-5xl font-bold uppercase leading-[1.02] md:text-7xl">Where to next?</h1>
          <p className="mt-3 max-w-lg text-sm text-white/75">Browse destinations, compare seasons and budgets, and start a plan in one click.</p>
          <SearchBar tone="glass" className="mt-6 max-w-xl !py-3.5" placeholder="Search a city, country or continent" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search destinations" />
        </Container>
      </section>

      <Container className="space-y-14 py-10">
        <section aria-label="Filters" className="-mt-16 rounded-3xl bg-white p-4 shadow-pop sm:p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Select label="Continent" value={continent} onChange={(e) => setContinent(e.target.value)} placeholder="Anywhere" options={continents.map((c) => ({ value: c, label: c }))} />
            <Select label="Season" value={season} onChange={(e) => setSeason(e.target.value)} placeholder="Any season" options={seasons.map((s) => ({ value: s, label: s }))} />
            <Select label="Budget" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Any budget" options={[{ value: "$", label: "$ Budget" }, { value: "$$", label: "$$ Mid-range" }, { value: "$$$", label: "$$$ Splurge" }]} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Categories">
            {["All", ...categories].map((c) => <Chip key={c} selected={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
          </div>
        </section>

        <section aria-labelledby="pop">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <h2 id="pop" className="font-display text-3xl uppercase tracking-wide md:text-4xl">{active ? `${list.length} destination${list.length === 1 ? "" : "s"}` : "Popular destinations"}</h2>
            {active && <Button variant="ghost" size="sm" onClick={reset}>Clear filters</Button>}
          </div>
          {list.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((d) => <DestCard key={d.slug} d={d} />)}</div>
          ) : (
            <EmptyState title="No destinations match" description="Try a different season, budget or category." action={<Button onClick={reset}>Clear filters</Button>} />
          )}
        </section>

        <section aria-labelledby="trend">
          <div className="mb-5"><h2 id="trend" className="font-display text-3xl uppercase tracking-wide md:text-4xl">Trending now</h2><p className="mt-1 text-sm text-navy/60">Most saved by travellers over the last 30 days.</p></div>
          <ol className="grid gap-3 lg:grid-cols-5">
            {trending.map((d, i) => (
              <li key={d.slug}>
                <a href={`#/destination/${d.slug}`} className="group relative block aspect-[3/4] overflow-hidden rounded-3xl shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500">
                  <img src={unsplash(d.photo, 600)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent" />
                  <span className="absolute left-4 top-3 font-display text-5xl font-bold text-white/90">{i + 1}</span>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="font-display text-xl uppercase tracking-wide">{d.name}</p>
                    <p className="text-xs text-white/75">{d.country}</p>
                    <p className="mt-2 inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold backdrop-blur">+{d.trend}% this month</p>
                  </div>
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="best" className="rounded-3xl bg-white p-5 shadow-card sm:p-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div><h2 id="best" className="font-display text-3xl uppercase tracking-wide md:text-4xl">Best time to visit</h2><p className="mt-1 text-sm text-navy/60">Pick a season to see where the weather is at its best.</p></div>
            <Tabs variant="pill" value={bt} onChange={(v) => setBt(v as Season)} items={seasons.map((s) => ({ id: s, label: s }))} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {best.map((d) => (
              <a key={d.slug} href={`#/destination/${d.slug}`} className="flex items-center gap-3 rounded-2xl bg-surface p-3 transition hover:shadow-pop">
                <img src={unsplash(d.photo, 200)} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                <span className="min-w-0"><span className="block truncate text-sm font-bold">{d.name}</span><span className="block text-xs text-navy/60">{d.bestTime}</span>
                  <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold"><span className="text-amber-500"><StarIcon size={11} /></span>{d.attractions[0].rating.toFixed(1)} · {d.avgCost > 0 && `$${d.avgCost}/day`}</span></span>
              </a>
            ))}
          </div>
        </section>
      </Container>
    </Page>
  );
}
