import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, CalendarIcon, ChevronLeftIcon, ChevronRightIcon, Chip, Container, DateRangePicker, EmptyState, GridIcon, MapIcon, Page, PinIcon, SearchIcon, Select, UsersIcon, formatRange } from "../../components/ui";
import type { DateRange } from "../../components/ui";
import { amenityList, hotelCities, hotelPhoto, hotelsX } from "../../data/booking";
import type { HotelX } from "../../data/booking";
import { AddToTripModal, ScoreBadge, Stars, scoreWord } from "./common";

const nightsOf = (r: DateRange) => (r.start && r.end ? Math.max(1, Math.round((+r.end - +r.start) / 86400000)) : 1);
const fmtDate = (d?: Date) => (d ? d.toISOString().slice(0, 10) : "");

function Carousel({ h }: { h: HotelX }) {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((x) => (x + d + h.photos.length) % h.photos.length);
  const btn = "absolute top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-navy opacity-0 shadow-card transition focus-visible:opacity-100 group-hover/c:opacity-100";
  return (
    <div className="group/c relative h-52 shrink-0 overflow-hidden bg-ocean-100 sm:h-auto sm:w-72" role="group" aria-roledescription="carousel" aria-label={`${h.name} photos`}>
      <img src={hotelPhoto(h.photos[i], 700)} alt={`${h.name}, photo ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
      <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className={`${btn} left-2`}><ChevronLeftIcon size={16} /></button>
      <button type="button" aria-label="Next photo" onClick={() => go(1)} className={`${btn} right-2`}><ChevronRightIcon size={16} /></button>
      <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5" aria-hidden="true">{h.photos.map((_, k) => <span key={k} className={`h-1.5 rounded-full bg-white transition-all ${k === i ? "w-4" : "w-1.5 opacity-60"}`} />)}</div>
    </div>
  );
}

function HotelCard({ h, nights, guests, onAdd, active, onHover }: { h: HotelX; nights: number; guests: number; onAdd: () => void; active?: boolean; onHover?: (id?: string) => void }) {
  const [cmp, setCmp] = useState(false);
  const q = `?nights=${nights}&guests=${guests}`;
  return (
    <article onMouseEnter={() => onHover?.(h.id)} onMouseLeave={() => onHover?.(undefined)} className={`flex flex-col overflow-hidden rounded-3xl bg-white shadow-card transition hover:shadow-pop sm:flex-row ${active ? "ring-2 ring-ocean-500" : ""}`}>
      <Carousel h={h} />
      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0"><Stars n={h.stars} />
            <h3 className="mt-1 truncate text-lg font-extrabold"><Link to={`/hotel/${h.id}${q}`} className="hover:underline">{h.name}</Link></h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-navy/60"><PinIcon size={12} />{h.area}, {h.city}</p></div>
          <div className="flex shrink-0 items-center gap-2 text-right"><span className="text-xs"><strong className="block">{scoreWord(h.rating)}</strong><span className="text-navy/55">{h.reviews.toLocaleString()} reviews</span></span><ScoreBadge n={h.rating} /></div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">{h.amenities.slice(0, 4).map((a) => <Badge key={a}>{a}</Badge>)}</div>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
          <button type="button" aria-expanded={cmp} onClick={() => setCmp(!cmp)} className="text-xs font-semibold text-navy underline underline-offset-2">Compare {h.deals.length} sites</button>
          <div className="text-right"><p className="text-[11px] text-navy/55">{nights} night{nights > 1 ? "s" : ""}, {guests} guest{guests > 1 ? "s" : ""}</p>
            <p className="text-2xl font-extrabold leading-none">${(h.price * nights).toLocaleString()}</p><p className="text-[11px] text-navy/55">${h.price} / night</p></div>
        </div>
        {cmp && (
          <ul className="mt-3 divide-y divide-navy/10 rounded-2xl bg-surface px-3 text-xs" aria-label="Price comparison">
            {h.deals.map((d, i) => <li key={d.site} className="flex items-center justify-between gap-3 py-2"><span className="font-semibold">{d.site}{d.perks && <span className="ml-2 font-normal text-navy/55">{d.perks}</span>}</span><span className="font-bold">{i === 0 && <Badge tone="success" className="mr-2">Lowest</Badge>}${d.price}<span className="font-normal text-navy/55"> / night</span></span></li>)}
          </ul>
        )}
        <div className="mt-4 flex flex-wrap gap-2"><Button size="sm" variant="secondary" onClick={onAdd}>Add to trip</Button><Button size="sm" href={`#/hotel/${h.id}${q}`}>View deal</Button></div>
      </div>
    </article>
  );
}

function PriceMap({ list, active, onPick, nights }: { list: HotelX[]; active?: string; onPick: (id: string) => void; nights: number }) {
  return (
    <div className="relative h-full min-h-[30rem] overflow-hidden rounded-3xl bg-ocean-100 shadow-card">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M0 74 C20 62 34 82 54 70 S88 62 100 70 V100 H0Z" className="fill-ocean-300/50" /><path d="M-5 24 C20 30 28 14 50 24 S85 32 105 18" className="stroke-white" strokeWidth="2.4" fill="none" />
        <path d="M18 -5 C22 30 40 50 36 105 M72 -5 C66 36 78 56 68 105" className="stroke-white/80" strokeWidth="1.4" fill="none" />
        <rect x="6" y="38" width="14" height="12" rx="3" className="fill-white/60" /><rect x="76" y="78" width="16" height="12" rx="3" className="fill-white/60" /><rect x="44" y="6" width="12" height="8" rx="3" className="fill-white/60" />
      </svg>
      {list.map((h) => (
        <button key={h.id} type="button" onClick={() => onPick(h.id)} style={{ left: `${h.x}%`, top: `${h.y}%` }} aria-label={`${h.name}, $${h.price} per night`}
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs font-bold ring-2 ring-white transition ${active === h.id ? "z-10 scale-110 bg-navy text-white shadow-pop" : "bg-white text-navy shadow-card hover:scale-105"}`}>${h.price}</button>
      ))}
      <p className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold shadow-card">{list.length} stays · prices per night{nights > 1 ? "" : ""}</p>
    </div>
  );
}

export default function Hotels() {
  const [city, setCity] = useState("Paris");
  const [range, setRange] = useState<DateRange>({});
  const [calOpen, setCalOpen] = useState(false);
  const [gOpen, setGOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [applied, setApplied] = useState({ city: "Paris" });
  const [lo, setLo] = useState(0);
  const [hi, setHi] = useState(500);
  const [stars, setStars] = useState<number[]>([]);
  const [minRating, setMinRating] = useState("0");
  const [am, setAm] = useState<string[]>([]);
  const [sort, setSort] = useState("rec");
  const [view, setView] = useState<"list" | "map">("list");
  const [active, setActive] = useState<string>();
  const [adding, setAdding] = useState<HotelX>();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const nights = nightsOf(range), guests = adults + kids;
  const list = useMemo(() => hotelsX.filter((h) => (!applied.city || h.city.toLowerCase().includes(applied.city.trim().toLowerCase()) || h.country.toLowerCase().includes(applied.city.trim().toLowerCase()))
    && h.price >= lo && h.price <= hi && (!stars.length || stars.includes(h.stars)) && h.rating >= Number(minRating) && am.every((a) => h.amenities.includes(a)))
    .sort((a, b) => (sort === "price" ? a.price - b.price : sort === "rating" ? b.rating - a.rating : sort === "stars" ? b.stars - a.stars : b.rating * 20 - b.price / 10 - (a.rating * 20 - a.price / 10))), [applied, lo, hi, stars, minRating, am, sort]);
  const toggle = <T,>(arr: T[], v: T, set: (a: T[]) => void) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const reset = () => { setLo(0); setHi(500); setStars([]); setMinRating("0"); setAm([]); };
  const filtered = lo > 0 || hi < 500 || stars.length > 0 || minRating !== "0" || am.length > 0;
  const field = "flex h-full w-full items-center gap-2 rounded-2xl bg-surface px-4 py-3 text-left text-sm";
  const stepper = (label: string, v: number, set: (n: number) => void, min: number) => (
    <div className="flex items-center justify-between py-2"><span className="text-sm font-semibold">{label}</span>
      <span className="flex items-center gap-3"><button type="button" aria-label={`Fewer ${label.toLowerCase()}`} disabled={v <= min} onClick={() => set(v - 1)} className="grid h-8 w-8 place-items-center rounded-full border border-navy/15 disabled:opacity-30">−</button><span className="w-4 text-center text-sm font-bold" aria-live="polite">{v}</span><button type="button" aria-label={`More ${label.toLowerCase()}`} disabled={v >= 9} onClick={() => set(v + 1)} className="grid h-8 w-8 place-items-center rounded-full border border-navy/15 disabled:opacity-30">+</button></span></div>
  );

  const Filters = (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h2 className="text-sm font-extrabold">Filters</h2>{filtered && <button type="button" onClick={reset} className="text-xs font-semibold underline">Reset</button>}</div>
      <fieldset><legend className="mb-2 text-xs font-bold">Price per night</legend>
        <p className="mb-2 text-sm font-semibold">${lo} – ${hi}{hi === 500 ? "+" : ""}</p>
        <input type="range" min={0} max={500} step={10} value={lo} aria-label="Minimum price" onChange={(e) => setLo(Math.min(Number(e.target.value), hi - 10))} className="w-full accent-navy" />
        <input type="range" min={0} max={500} step={10} value={hi} aria-label="Maximum price" onChange={(e) => setHi(Math.max(Number(e.target.value), lo + 10))} className="w-full accent-navy" /></fieldset>
      <fieldset><legend className="mb-2 text-xs font-bold">Star rating</legend><div className="flex flex-wrap gap-2">{[5, 4, 3, 2].map((s) => <Chip key={s} selected={stars.includes(s)} onClick={() => toggle(stars, s, setStars)}>{s} ★</Chip>)}</div></fieldset>
      <Select label="Guest rating" value={minRating} onChange={(e) => setMinRating(e.target.value)} options={[{ value: "0", label: "Any" }, { value: "7", label: "Good 7+" }, { value: "8", label: "Very good 8+" }, { value: "9", label: "Exceptional 9+" }]} />
      <fieldset><legend className="mb-2 text-xs font-bold">Amenities</legend><div className="space-y-2">{amenityList.map((a) => (
        <label key={a} className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-navy" checked={am.includes(a)} onChange={() => toggle(am, a, setAm)} />{a}</label>))}</div></fieldset>
    </div>
  );

  return (
    <Page loggedIn={false}>
      <section className="mx-3 mt-3 rounded-2xl bg-navy text-white md:mx-6">
        <Container className="py-10 md:py-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">Hotels</p>
          <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-[1.02] md:text-7xl">Find your stay</h1>
          <form onSubmit={(e) => { e.preventDefault(); setApplied({ city }); setCalOpen(false); setGOpen(false); }} className="relative mt-6 grid gap-2 rounded-3xl bg-white p-2 text-navy shadow-pop md:grid-cols-[1.4fr_1.2fr_1fr_auto]">
            <label className={`${field} focus-within:ring-2 focus-within:ring-navy/20`}><PinIcon size={16} /><span className="sr-only">Destination</span>
              <input list="cities" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Where to?" className="w-full bg-transparent font-semibold outline-none" /><datalist id="cities">{hotelCities.map((c) => <option key={c} value={c} />)}</datalist></label>
            <div className="relative"><button type="button" aria-expanded={calOpen} onClick={() => { setCalOpen(!calOpen); setGOpen(false); }} className={field}><CalendarIcon size={16} /><span className={range.start ? "font-semibold" : "text-navy/55"}>{formatRange(range) || "Check-in – Check-out"}</span></button>
              {calOpen && <><div className="fixed inset-0 z-20" onClick={() => setCalOpen(false)} /><div className="absolute left-0 top-full z-30 mt-2 max-w-[calc(100vw-2rem)] rounded-3xl bg-white p-4 shadow-pop"><DateRangePicker value={range} onChange={setRange} /></div></>}</div>
            <div className="relative"><button type="button" aria-expanded={gOpen} onClick={() => { setGOpen(!gOpen); setCalOpen(false); }} className={field}><UsersIcon size={16} /><span className="font-semibold">{guests} guest{guests > 1 ? "s" : ""}</span></button>
              {gOpen && <><div className="fixed inset-0 z-20" onClick={() => setGOpen(false)} /><div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-3xl bg-white p-4 shadow-pop">{stepper("Adults", adults, setAdults, 1)}{stepper("Children", kids, setKids, 0)}<Button size="sm" className="mt-2 w-full" onClick={() => setGOpen(false)}>Done</Button></div></>}</div>
            <Button type="submit" size="lg" icon={<SearchIcon size={16} />}>Search</Button>
          </form>
        </Container>
      </section>

      <Container className="py-8">
        <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
          <aside className="hidden h-fit rounded-3xl bg-white p-5 shadow-card lg:block" aria-label="Filters">{Filters}</aside>
          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-extrabold" aria-live="polite">{list.length} stay{list.length === 1 ? "" : "s"}{applied.city ? ` in ${applied.city}` : ""}</h2>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="secondary" className="lg:hidden" onClick={() => setFiltersOpen(!filtersOpen)}>Filters{filtered ? " •" : ""}</Button>
                <Select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} options={[{ value: "rec", label: "Recommended" }, { value: "price", label: "Lowest price" }, { value: "rating", label: "Top rated" }, { value: "stars", label: "Star rating" }]} />
                <div role="group" aria-label="View" className="flex rounded-full bg-white p-1 shadow-card">
                  {([["list", "List", <GridIcon key="l" size={14} />], ["map", "Map", <MapIcon key="m" size={14} />]] as const).map(([v, l, ic]) => (
                    <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${view === v ? "bg-navy text-white" : "text-navy/70"}`}>{ic}{l}</button>))}
                </div>
              </div>
            </div>
            {filtersOpen && <div className="mb-5 rounded-3xl bg-white p-5 shadow-card lg:hidden">{Filters}</div>}
            {!list.length ? <EmptyState title="No stays match" description="Try widening your price range or removing a filter." action={<Button onClick={() => { reset(); setApplied({ city: "" }); setCity(""); }}>Clear all</Button>} /> : view === "list" ? (
              <div className="space-y-4">{list.map((h) => <HotelCard key={h.id} h={h} nights={nights} guests={guests} onAdd={() => setAdding(h)} />)}</div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
                <div className="order-2 max-h-[40rem] space-y-3 overflow-y-auto pr-1 xl:order-1">{list.map((h) => (
                  <button key={h.id} type="button" onClick={() => setActive(h.id)} className={`flex w-full gap-3 rounded-2xl bg-white p-2 text-left shadow-card ${active === h.id ? "ring-2 ring-ocean-500" : ""}`}>
                    <img src={hotelPhoto(h.photos[0], 240)} alt="" className="h-20 w-24 shrink-0 rounded-xl object-cover" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{h.name}</span><Stars n={h.stars} /><span className="block text-xs text-navy/60">{h.area} · {h.rating}</span></span><span className="self-end text-sm font-extrabold">${h.price}</span></button>))}</div>
                <div className="order-1 h-[26rem] xl:order-2 xl:h-[40rem]"><PriceMap list={list} active={active} onPick={setActive} nights={nights} /></div>
                {active && (() => { const h = list.find((x) => x.id === active); return h ? <div className="order-3 xl:col-span-2"><HotelCard h={h} nights={nights} guests={guests} onAdd={() => setAdding(h)} active /></div> : null; })()}
              </div>
            )}
          </div>
        </div>
      </Container>
      {adding && <AddToTripModal open onClose={() => setAdding(undefined)} reservation={{ type: "Hotel", name: adding.name, date: formatRange(range) || `${nights} night${nights > 1 ? "s" : ""}`, confirmation: "", start: fmtDate(range.start) || undefined, end: fmtDate(range.end) || undefined, notes: `${adding.area}, ${adding.city} · $${adding.price}/night via ${adding.deals[0].site}` }} />}
    </Page>
  );
}
