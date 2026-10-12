import { useMemo, useState } from "react";
import { Badge, Button, Chip, Container, EmptyState, Input, Page, PlusIcon, SearchIcon, Select, Tabs, CloseIcon } from "../../components/ui";
import { airlines, airports, fmtDur, fmtTime, genFlights } from "../../data/booking";
import type { FlightX } from "../../data/booking";
import { AddToTripModal, PlaneIcon } from "./common";

type Leg = { from: string; to: string; date: string };
type Search = { mode: string; legs: Leg[]; adults: number; kids: number; cls: string };
const label = (a: { code: string; city: string }) => `${a.city} (${a.code})`;
const toCode = (v: string) => { const m = v.match(/\(([A-Z]{3})\)/)?.[1] ?? v.trim().toUpperCase(); return airports.find((a) => a.code === m)?.code; };
const today = () => new Date().toISOString().slice(0, 10);
const plus = (n: number) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
const dayNames = (t: number) => (t >= 1440 ? "+1" : "");
const band = (m: number) => (m < 720 ? "morning" : m < 1020 ? "afternoon" : "evening");

function Row({ f, mode, onAdd }: { f: FlightX; mode: string; onAdd: () => void }) {
  const seg = (dep: number, arr: number, from: string, to: string) => (
    <div className="flex items-center gap-3 sm:gap-5">
      <div className="text-center"><p className="text-lg font-extrabold">{fmtTime(dep)}</p><p className="text-xs text-navy/60">{from}</p></div>
      <div className="min-w-0 flex-1 text-center"><p className="text-[11px] text-navy/55">{fmtDur(arr - dep)}</p><div className="relative my-1 h-px bg-navy/20"><span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-1 text-navy/50"><PlaneIcon size={14} /></span></div>
        <p className={`text-[11px] font-semibold ${f.stops ? "text-amber-600" : "text-emerald-600"}`}>{f.stops ? `${f.stops} stop${f.stops > 1 ? "s" : ""}${f.via && f.stops === 1 ? ` · ${f.via}` : ""}` : "Nonstop"}</p></div>
      <div className="text-center"><p className="text-lg font-extrabold">{fmtTime(arr)}<sup className="ml-0.5 text-[10px] font-bold text-navy/55">{dayNames(arr)}</sup></p><p className="text-xs text-navy/60">{to}</p></div>
    </div>
  );
  return (
    <li className="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-card transition hover:shadow-pop sm:flex-row sm:items-center sm:p-5">
      <div className="w-32 shrink-0"><span className="grid h-10 w-10 place-items-center rounded-full bg-ocean-100 text-xs font-bold">{f.airline.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span><p className="mt-2 text-sm font-bold">{f.airline}</p><p className="text-[11px] text-navy/55">{f.code}</p></div>
      <div className="min-w-0 flex-1 space-y-3">{seg(f.depart, f.arrive, f.from, f.to)}{mode === "round" && f.back && <div className="border-t border-dashed border-navy/10 pt-3">{seg(f.back.depart, f.back.arrive, f.to, f.from)}</div>}</div>
      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-navy/10 pt-3 sm:w-36 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
        <div className="sm:text-right"><p className="text-2xl font-extrabold leading-none">${f.price.toLocaleString()}</p><p className="text-[11px] text-navy/55">{mode === "round" ? "round trip, total" : "total"}</p></div>
        <Button size="sm" onClick={onAdd}>Add to trip</Button>
      </div>
    </li>
  );
}

export default function Flights() {
  const [mode, setMode] = useState("round");
  const [legs, setLegs] = useState<Leg[]>([{ from: "New York (JFK)", to: "Paris (CDG)", date: plus(30) }, { from: "Paris (CDG)", to: "London (LHR)", date: plus(36) }]);
  const [ret, setRet] = useState(plus(37));
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [cls, setCls] = useState("Economy");
  const [paxOpen, setPaxOpen] = useState(false);
  const [errs, setErrs] = useState<string>();
  const [s, setS] = useState<Search>({ mode: "round", legs: [{ from: "New York (JFK)", to: "Paris (CDG)", date: plus(30) }], adults: 1, kids: 0, cls: "Economy" });
  const [leg, setLeg] = useState(0);
  const [sort, setSort] = useState("best");
  const [maxStops, setMaxStops] = useState("any");
  const [air, setAir] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(6000);
  const [times, setTimes] = useState<string[]>([]);
  const [adding, setAdding] = useState<FlightX>();

  const visibleLegs = mode === "multi" ? legs : legs.slice(0, 1);
  const setLegAt = (i: number, p: Partial<Leg>) => setLegs((l) => l.map((x, k) => (k === i ? { ...x, ...p } : x)));
  const search = () => {
    for (const [i, l] of visibleLegs.entries()) {
      const a = toCode(l.from), b = toCode(l.to);
      if (!a || !b) return setErrs(`Pick an airport from the list${visibleLegs.length > 1 ? ` for flight ${i + 1}` : ""}.`);
      if (a === b) return setErrs("Departure and arrival airports must be different.");
      if (!l.date) return setErrs("Choose a departure date.");
    }
    if (mode === "round" && (!ret || ret < legs[0].date)) return setErrs("Return date must be after departure.");
    setErrs(undefined); setLeg(0); setS({ mode, legs: visibleLegs, adults, kids, cls });
  };

  const cur = s.legs[Math.min(leg, s.legs.length - 1)];
  const all = useMemo(() => genFlights(toCode(cur.from)!, toCode(cur.to)!, s.cls, s.adults + s.kids, s.mode === "round"), [cur, s]);
  const filtered = all.filter((f) => (maxStops === "any" || f.stops <= Number(maxStops)) && (!air.length || air.includes(f.airline)) && f.price <= maxPrice && (!times.length || times.includes(band(f.depart))));
  const score = (f: FlightX) => f.price / 10 + f.mins / 6 + f.stops * 40;
  const sorted = [...filtered].sort((a, b) => (sort === "cheap" ? a.price - b.price : sort === "fast" ? a.mins - b.mins : score(a) - score(b)));
  const cheapest = all.length ? Math.min(...all.map((f) => f.price)) : 0, fastest = all.length ? Math.min(...all.map((f) => f.mins)) : 0, bestOne = [...all].sort((a, b) => score(a) - score(b))[0];
  const dirty = maxStops !== "any" || air.length > 0 || maxPrice < 6000 || times.length > 0;
  const toggle = (a: string[], v: string, set: (x: string[]) => void) => set(a.includes(v) ? a.filter((x) => x !== v) : [...a, v]);
  const ap = <datalist id="airports">{airports.map((a) => <option key={a.code} value={label(a)}>{a.name}</option>)}</datalist>;
  const stepper = (name: string, v: number, set: (n: number) => void, min: number) => (
    <div className="flex items-center justify-between py-2"><span className="text-sm font-semibold">{name}</span><span className="flex items-center gap-3">
      <button type="button" aria-label={`Fewer ${name.toLowerCase()}`} disabled={v <= min} onClick={() => set(v - 1)} className="grid h-8 w-8 place-items-center rounded-full border border-navy/15 disabled:opacity-30">−</button><span className="w-4 text-center text-sm font-bold" aria-live="polite">{v}</span>
      <button type="button" aria-label={`More ${name.toLowerCase()}`} disabled={v >= 9} onClick={() => set(v + 1)} className="grid h-8 w-8 place-items-center rounded-full border border-navy/15 disabled:opacity-30">+</button></span></div>
  );

  return (
    <Page loggedIn={false}>
      <section className="mx-3 mt-3 rounded-2xl bg-navy text-white md:mx-6">
        <Container className="py-10 md:py-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">Flights</p>
          <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-[1.02] md:text-7xl">Where are you flying?</h1>
          <form onSubmit={(e) => { e.preventDefault(); search(); }} className="mt-6 rounded-3xl bg-white p-4 text-navy shadow-pop sm:p-5">
            {ap}
            <div className="flex flex-wrap items-center gap-3">
              <div role="radiogroup" aria-label="Trip type" className="flex rounded-full bg-surface p-1">
                {[["round", "Round trip"], ["oneway", "One way"], ["multi", "Multi-city"]].map(([v, l]) => <button key={v} type="button" role="radio" aria-checked={mode === v} onClick={() => setMode(v)} className={`rounded-full px-4 py-2 text-xs font-semibold transition ${mode === v ? "bg-navy text-white shadow-card" : "text-navy/70"}`}>{l}</button>)}
              </div>
              <div className="relative"><Button type="button" size="sm" variant="secondary" aria-expanded={paxOpen} onClick={() => setPaxOpen(!paxOpen)}>{adults + kids} passenger{adults + kids > 1 ? "s" : ""}</Button>
                {paxOpen && <><div className="fixed inset-0 z-20" onClick={() => setPaxOpen(false)} /><div className="absolute left-0 top-full z-30 mt-2 w-64 rounded-3xl bg-white p-4 shadow-pop">{stepper("Adults", adults, setAdults, 1)}{stepper("Children", kids, setKids, 0)}<Button type="button" size="sm" className="mt-2 w-full" onClick={() => setPaxOpen(false)}>Done</Button></div></>}</div>
              <Select aria-label="Cabin class" value={cls} onChange={(e) => setCls(e.target.value)} options={["Economy", "Premium economy", "Business", "First"].map((c) => ({ value: c, label: c }))} />
            </div>
            <div className="mt-4 space-y-3">
              {visibleLegs.map((l, i) => (
                <div key={i} className="grid gap-3 md:grid-cols-[1fr_1fr_11rem_11rem_auto] md:items-end">
                  <Input label={mode === "multi" ? `Flight ${i + 1} from` : "From"} list="airports" value={l.from} placeholder="City or airport" onChange={(e) => setLegAt(i, { from: e.target.value })} />
                  <Input label={mode === "multi" ? "To" : "To"} list="airports" value={l.to} placeholder="City or airport" onChange={(e) => setLegAt(i, { to: e.target.value })} />
                  <Input label="Depart" type="date" min={today()} value={l.date} onChange={(e) => setLegAt(i, { date: e.target.value })} />
                  {mode === "round" ? <Input label="Return" type="date" min={l.date || today()} value={ret} onChange={(e) => setRet(e.target.value)} /> : <span className="hidden md:block" />}
                  {mode === "multi" && legs.length > 2 ? <button type="button" aria-label={`Remove flight ${i + 1}`} onClick={() => setLegs((x) => x.filter((_, k) => k !== i))} className="grid h-11 w-11 place-items-center rounded-full text-navy/60 hover:bg-navy/5"><CloseIcon size={16} /></button> : <span className="hidden md:block" />}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              {mode === "multi" && legs.length < 4 ? <Button type="button" variant="ghost" size="sm" icon={<PlusIcon size={14} />} onClick={() => setLegs((x) => [...x, { from: x[x.length - 1].to, to: "", date: "" }])}>Add flight</Button> : <span />}
              <Button type="submit" size="lg" icon={<SearchIcon size={16} />}>Search flights</Button>
            </div>
            {errs && <p role="alert" className="mt-3 text-xs font-semibold text-red-600">{errs}</p>}
          </form>
        </Container>
      </section>

      <Container className="py-8">
        {s.legs.length > 1 && <Tabs className="mb-6" items={s.legs.map((l, i) => ({ id: String(i), label: `${toCode(l.from)} → ${toCode(l.to)}` }))} value={String(leg)} onChange={(v) => setLeg(Number(v))} />}
        <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
          <aside className="h-fit space-y-6 rounded-3xl bg-white p-5 shadow-card" aria-label="Filters">
            <div className="flex items-center justify-between"><h2 className="text-sm font-extrabold">Filters</h2>{dirty && <button type="button" className="text-xs font-semibold underline" onClick={() => { setMaxStops("any"); setAir([]); setMaxPrice(6000); setTimes([]); }}>Reset</button>}</div>
            <Select label="Stops" value={maxStops} onChange={(e) => setMaxStops(e.target.value)} options={[{ value: "any", label: "Any" }, { value: "0", label: "Nonstop only" }, { value: "1", label: "Up to 1 stop" }]} />
            <fieldset><legend className="mb-2 text-xs font-bold">Departure time</legend><div className="flex flex-wrap gap-2">{["morning", "afternoon", "evening"].map((t) => <Chip key={t} selected={times.includes(t)} onClick={() => toggle(times, t, setTimes)}>{t[0].toUpperCase() + t.slice(1)}</Chip>)}</div></fieldset>
            <div><label htmlFor="mp" className="mb-1 block text-xs font-bold">Max price: ${maxPrice.toLocaleString()}{maxPrice === 6000 ? "+" : ""}</label><input id="mp" type="range" min={200} max={6000} step={100} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-navy" /></div>
            <fieldset><legend className="mb-2 text-xs font-bold">Airlines</legend><div className="space-y-2">{airlines.map((a) => <label key={a} className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4 accent-navy" checked={air.includes(a)} onChange={() => toggle(air, a, setAir)} />{a}</label>)}</div></fieldset>
          </aside>

          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2"><div><h2 className="text-lg font-extrabold">{toCode(cur.from)} → {toCode(cur.to)}</h2><p className="text-xs text-navy/60" aria-live="polite">{sorted.length} flight{sorted.length === 1 ? "" : "s"} · {s.adults + s.kids} passenger{s.adults + s.kids > 1 ? "s" : ""} · {s.cls}</p></div><Badge tone="ocean">Sample fares</Badge></div>
            <div role="tablist" aria-label="Sort flights" className="grid grid-cols-3 gap-2">
              {[["best", "Best", bestOne ? `$${bestOne.price.toLocaleString()} · ${fmtDur(bestOne.mins)}` : ""], ["cheap", "Cheapest", `$${cheapest.toLocaleString()}`], ["fast", "Fastest", fmtDur(fastest)]].map(([id, l, sub]) => (
                <button key={id} type="button" role="tab" aria-selected={sort === id} onClick={() => setSort(id)} className={`rounded-2xl p-3 text-left transition sm:p-4 ${sort === id ? "bg-navy text-white shadow-pop" : "bg-white shadow-card hover:shadow-pop"}`}><span className="block text-sm font-extrabold">{l}</span><span className={`block text-xs ${sort === id ? "text-white/75" : "text-navy/60"}`}>{sub}</span></button>))}
            </div>
            {sorted.length ? <ul className="space-y-3">{sorted.map((f) => <Row key={f.id} f={f} mode={s.mode} onAdd={() => setAdding(f)} />)}</ul>
              : <EmptyState title="No flights match" description="Try allowing more stops or raising your maximum price." action={<Button onClick={() => { setMaxStops("any"); setAir([]); setMaxPrice(6000); setTimes([]); }}>Reset filters</Button>} />}
          </div>
        </div>
      </Container>
      {adding && <AddToTripModal open onClose={() => setAdding(undefined)} reservation={{ type: "Flight", name: `${adding.from} → ${adding.to} · ${adding.airline}`, date: `${cur.date}, ${fmtTime(adding.depart)}`, confirmation: "", start: cur.date || undefined, notes: `${adding.code} · ${fmtTime(adding.depart)}–${fmtTime(adding.arrive)} · ${adding.stops ? `${adding.stops} stop` : "Nonstop"} · $${adding.price}` }} />}
    </Page>
  );
}
