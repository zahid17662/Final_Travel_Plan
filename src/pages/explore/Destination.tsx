import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge, Button, CalendarIcon, Chip, Container, EmptyState, GlobeIcon, Page, PinIcon, PlusIcon, StarIcon, UsersIcon, GuideCard, unsplash } from "../../components/ui";
import PlanTripModal from "../../components/trip/PlanTripModal";
import { guides } from "../../data";
import { dests, findDest, months } from "../../data/explore";
import type { Dest } from "../../data/explore";
import { hashPos } from "../planner/seed";

const H = ({ id, children, sub }: { id: string; children: string; sub?: string }) => (
  <div className="mb-5"><h2 id={id} className="font-display text-3xl uppercase tracking-wide md:text-4xl">{children}</h2>{sub && <p className="mt-1 text-sm text-navy/60">{sub}</p>}</div>
);
const Star = ({ r }: { r: number }) => <span className="inline-flex items-center gap-1 text-xs font-semibold"><span className="text-amber-500"><StarIcon size={12} /></span>{r.toFixed(1)}</span>;

function Weather({ d }: { d: Dest }) {
  const [sel, setSel] = useState(new Date().getMonth());
  const maxT = Math.max(...d.hi), maxR = Math.max(...d.rain);
  const W = 720, Ht = 220, bw = W / 12;
  const pts = d.rain.map((r, i) => `${i * bw + bw / 2},${Ht - 30 - (r / maxR) * (Ht - 60)}`).join(" ");
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-navy/70">
        <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded bg-ocean-500" />Avg. high °C</span>
        <span className="inline-flex items-center gap-2"><span className="h-0.5 w-4 bg-navy" />Rainfall mm</span>
      </div>
      <svg viewBox={`0 0 ${W} ${Ht}`} role="img" aria-label={`Average monthly high temperature and rainfall in ${d.name}`} className="w-full">
        {d.hi.map((t, i) => {
          const h = (t / maxT) * (Ht - 60);
          return (
            <g key={i} onMouseEnter={() => setSel(i)} onClick={() => setSel(i)} className="cursor-pointer">
              <rect x={i * bw} y={0} width={bw} height={Ht} fill="transparent" />
              <rect x={i * bw + 10} y={Ht - 30 - h} width={bw - 20} height={h} rx={8} className={i === sel ? "fill-navy" : "fill-ocean-300"} />
              <text x={i * bw + bw / 2} y={Ht - 34 - h} textAnchor="middle" className="fill-navy text-[11px] font-bold">{t}°</text>
              <text x={i * bw + bw / 2} y={Ht - 10} textAnchor="middle" className={`text-[11px] font-semibold ${i === sel ? "fill-navy" : "fill-navy/55"}`}>{months[i]}</text>
            </g>
          );
        })}
        <polyline points={pts} fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="stroke-navy/70" pointerEvents="none" />
        {d.rain.map((r, i) => <circle key={i} cx={i * bw + bw / 2} cy={Ht - 30 - (r / maxR) * (Ht - 60)} r={i === sel ? 5 : 3} className="fill-white stroke-navy" strokeWidth={2} pointerEvents="none" />)}
      </svg>
      <p className="mt-3 rounded-2xl bg-surface px-4 py-3 text-sm" aria-live="polite"><strong>{months[sel]}:</strong> around {d.hi[sel]}°C and {d.rain[sel]} mm of rain. {d.hi[sel] >= 15 && d.hi[sel] <= 28 && d.rain[sel] < 90 ? "A comfortable month to visit." : d.rain[sel] >= 120 ? "Expect plenty of rain." : "Pack for the conditions."}</p>
    </div>
  );
}

function MapSection({ d }: { d: Dest }) {
  const [sel, setSel] = useState(0);
  const pins = d.attractions.map((a) => ({ ...a, ...hashPos(a.name + d.slug) }));
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-ocean-100 shadow-card">
        <svg viewBox="0 0 100 62" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <rect width="100" height="62" className="fill-ocean-100" />
          <path d="M0 40 C20 30 30 48 52 38 S88 30 100 38 V62 H0Z" className="fill-ocean-300/50" />
          <path d="M-5 14 C20 18 28 8 50 14 S85 20 105 10" className="stroke-white" strokeWidth="2.4" fill="none" />
          <path d="M18 -5 C22 20 40 30 36 70 M70 -5 C64 22 76 34 66 70" className="stroke-white/80" strokeWidth="1.4" fill="none" />
          <rect x="6" y="22" width="14" height="9" rx="3" className="fill-white/60" /><rect x="76" y="44" width="16" height="10" rx="3" className="fill-white/60" /><rect x="44" y="4" width="12" height="7" rx="3" className="fill-white/60" />
        </svg>
        {pins.map((p, i) => (
          <button key={p.name} type="button" onClick={() => setSel(i)} aria-label={p.name} aria-pressed={sel === i}
            style={{ left: `${p.x}%`, top: `${p.y}%` }} className={`absolute grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-xs font-bold ring-2 ring-white transition ${sel === i ? "z-10 scale-125 bg-navy text-white shadow-pop" : "bg-white text-navy shadow-card hover:scale-110"}`}>{i + 1}</button>
        ))}
        <p className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold shadow-card"><PinIcon size={12} /> {d.name}, {d.country}</p>
      </div>
      <ol className="space-y-2">
        {pins.map((p, i) => (
          <li key={p.name}>
            <button type="button" onClick={() => setSel(i)} className={`flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left shadow-card transition ${sel === i ? "ring-2 ring-ocean-500" : "hover:shadow-pop"}`}>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy text-xs font-bold text-white">{i + 1}</span>
              <span className="min-w-0"><span className="block truncate text-sm font-bold">{p.name}</span><span className="block text-xs text-navy/60">{p.time}</span></span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Destination() {
  const { slug } = useParams();
  const d = findDest(slug);
  const [plan, setPlan] = useState(false);
  if (!d) return <Page loggedIn={false}><Container className="py-20"><EmptyState title="We couldn't find that destination" description="Try exploring our popular places instead." action={<Button href="#/explore">Explore destinations</Button>} /></Container></Page>;

  const facts = [
    { icon: <CalendarIcon size={18} />, k: "Best time", v: d.bestTime }, { icon: <GlobeIcon size={18} />, k: "Currency", v: d.currency },
    { icon: <UsersIcon size={18} />, k: "Language", v: d.language }, { icon: <StarIcon size={18} />, k: "Avg. cost", v: `$${d.avgCost} / day` },
  ];
  const gs = d.guides.map((id) => guides.find((g) => g.id === id)).filter((g): g is NonNullable<typeof g> => !!g);
  const related = dests.filter((x) => x.slug !== d.slug && x.continent === d.continent).slice(0, 3);

  return (
    <Page loggedIn={false}>
      <section className="relative isolate overflow-hidden bg-navy-900 text-white">
        <img src={unsplash(d.photo, 2000)} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900 via-navy-900/40 to-navy-900/20" />
        <Container className="flex min-h-[26rem] flex-col justify-end pb-10 pt-24 md:min-h-[34rem]">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-white/75"><Link to="/explore" className="hover:underline">Explore</Link> / {d.continent} / {d.country}</nav>
          <h1 className="mt-3 font-display text-7xl font-bold uppercase leading-[0.95] tracking-wide md:text-[9rem]">{d.name}</h1>
          <p className="mt-3 max-w-xl text-base text-white/85">{d.blurb}</p>
          <div className="mt-5 flex flex-wrap gap-2">{d.tags.map((t) => <Badge key={t} tone="ocean">{t}</Badge>)}</div>
        </Container>
      </section>

      <Container className="space-y-16 pb-32 pt-8">
        <dl className="-mt-16 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.k} className="rounded-3xl bg-white p-5 shadow-pop">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ocean-100 text-navy">{f.icon}</span>
              <dt className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-navy/50">{f.k}</dt>
              <dd className="mt-0.5 text-base font-extrabold">{f.v}</dd>
            </div>
          ))}
        </dl>

        <section aria-labelledby="attr">
          <H id="attr" sub={`The sights that keep ${d.name} on everyone's list.`}>Top attractions</H>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {d.attractions.map((a, i) => (
              <li key={a.name} className="overflow-hidden rounded-3xl bg-white shadow-card transition hover:shadow-pop">
                <div className="relative aspect-[4/3] bg-ocean-100"><img src={unsplash(a.photo, 600)} alt={a.name} loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-navy text-xs font-bold text-white ring-2 ring-white">{i + 1}</span></div>
                <div className="p-4"><div className="flex items-start justify-between gap-2"><h3 className="text-sm font-bold">{a.name}</h3><Star r={a.rating} /></div>
                  <p className="mt-1.5 text-xs text-navy/70">{a.blurb}</p><p className="mt-3 text-[11px] font-semibold text-navy/55">Allow {a.time}</p></div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="eat">
          <H id="eat" sub="Local favourites, from quick bites to long dinners.">Best restaurants</H>
          <ul className="grid gap-4 md:grid-cols-3">
            {d.restaurants.map((r) => (
              <li key={r.name} className="flex gap-4 rounded-3xl bg-white p-3 shadow-card">
                <img src={unsplash(r.photo, 300)} alt="" loading="lazy" className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
                <div className="min-w-0 py-1"><h3 className="truncate text-sm font-bold">{r.name}</h3><p className="text-xs text-navy/60">{r.cuisine}</p>
                  <div className="mt-2 flex items-center gap-3"><Star r={r.rating} /><Badge>{r.price}</Badge></div></div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="stay">
          <H id="stay" sub="Choose the neighbourhood first, then the hotel.">Where to stay</H>
          <ul className="grid gap-4 md:grid-cols-3">
            {d.areas.map((a, i) => (
              <li key={a.name} className="rounded-3xl bg-white p-5 shadow-card">
                <span className="font-display text-4xl font-bold text-ocean-300">0{i + 1}</span>
                <h3 className="mt-1 text-lg font-extrabold">{a.name}</h3><p className="mt-1 text-sm text-navy/70">{a.vibe}</p>
                <div className="mt-4 flex items-center justify-between"><span className="text-xs font-semibold text-navy/60">From ${a.from} / night</span>
                  <Button size="sm" variant="secondary" href="#/hotels">See hotels</Button></div>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="sample">
          <H id="sample" sub="Start from a ready-made plan and make it yours.">Sample itineraries</H>
          <ul className="grid gap-5 md:grid-cols-2">
            {d.samples.map((s) => (
              <li key={s.title} className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-card sm:flex-row">
                <img src={unsplash(s.photo, 500)} alt="" loading="lazy" className="h-44 w-full object-cover sm:h-auto sm:w-44" />
                <div className="flex flex-1 flex-col p-5">
                  <Badge tone="ocean">{s.days} days</Badge>
                  <h3 className="mt-2 text-lg font-extrabold">{s.title}</h3>
                  <p className="mt-1 text-xs text-navy/65">{s.stops.join(" · ")}</p>
                  <div className="mt-auto pt-4"><Button size="sm" onClick={() => setPlan(true)}>Use this itinerary</Button></div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {gs.length > 0 && (
          <section aria-labelledby="guides">
            <H id="guides" sub="Written by people who have been there.">Guides from travellers</H>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gs.map((g) => <GuideCard key={g.id} image={unsplash(g.photo, 700)} title={g.title} blurb={g.blurb} author={g.author} likes={g.likes} views={g.views} href={`#/guide/${g.id}`} />)}
            </div>
          </section>
        )}

        <section aria-labelledby="wx" className="rounded-3xl bg-white p-5 shadow-card sm:p-8">
          <H id="wx" sub="Tap a month to see typical conditions.">Weather by month</H>
          <Weather d={d} />
        </section>

        <section aria-labelledby="map">
          <H id="map" sub="Where the top attractions sit.">Map</H>
          <MapSection d={d} />
        </section>

        {related.length > 0 && (
          <section aria-labelledby="more">
            <H id="more">{`More in ${d.continent}`}</H>
            <div className="flex flex-wrap gap-2">{related.map((r) => <a key={r.slug} href={`#/destination/${r.slug}`}><Chip>{r.name}, {r.country}</Chip></a>)}</div>
          </section>
        )}
      </Container>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center p-4 sm:justify-end sm:px-8">
        <Button size="lg" className="pointer-events-auto shadow-pop" icon={<PlusIcon size={16} />} onClick={() => setPlan(true)}>Plan a trip to {d.name}</Button>
      </div>
      <PlanTripModal open={plan} onClose={() => setPlan(false)} initial={{ id: d.slug, name: d.name, sub: d.country, type: "city" }} />
    </Page>
  );
}
