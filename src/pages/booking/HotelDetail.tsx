import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Avatar, Badge, Button, CheckIcon, Container, EmptyState, Page, PinIcon } from "../../components/ui";
import { getHotel, hotelPhoto } from "../../data/booking";
import { AddToTripModal, ScoreBadge, Stars, scoreWord } from "./common";

export default function HotelDetail() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const h = getHotel(id);
  const [photo, setPhoto] = useState(0);
  const [adding, setAdding] = useState(false);
  const nights = Math.max(1, Number(sp.get("nights")) || 1), guests = Math.max(1, Number(sp.get("guests")) || 2);
  if (!h) return <Page loggedIn={false}><Container className="py-20"><EmptyState title="We couldn't find that hotel" description="It may no longer be listed." action={<Button href="#/hotels">Back to hotels</Button>} /></Container></Page>;
  const best = h.deals[0], dist = [["Cleanliness", 0.3], ["Location", 0.1], ["Staff", 0.2], ["Value", -0.2]] as const;
  const gallery = [...h.photos, ...h.photos.slice(0, 2)].slice(0, 5);

  return (
    <Page loggedIn={false}>
      <Container className="py-8">
        <nav aria-label="Breadcrumb" className="text-xs font-semibold text-navy/60"><Link to="/hotels" className="hover:underline">Hotels</Link> / {h.city} / {h.name}</nav>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div><Stars n={h.stars} /><h1 className="mt-1 font-display text-4xl font-bold uppercase leading-tight md:text-6xl">{h.name}</h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-navy/65"><PinIcon size={14} />{h.area}, {h.city}, {h.country}</p></div>
          <div className="flex items-center gap-2"><span className="text-right text-xs"><strong className="block text-sm">{scoreWord(h.rating)}</strong>{h.reviews.toLocaleString()} reviews</span><ScoreBadge n={h.rating} /></div>
        </div>

        <div className="mt-6 grid gap-2 md:h-[26rem] md:grid-cols-4 md:grid-rows-2" role="group" aria-label="Photo gallery">
          {gallery.map((p, i) => (
            <button key={i} type="button" aria-label={`Show photo ${i + 1}`} aria-pressed={photo === i} onClick={() => setPhoto(i)}
              className={`relative overflow-hidden bg-ocean-100 ${i === 0 ? "col-span-2 row-span-2 aspect-[4/3] rounded-3xl md:aspect-auto" : "hidden rounded-2xl md:block"} ${photo === i && i > 0 ? "ring-2 ring-ocean-500" : ""}`}>
              <img src={hotelPhoto(i === 0 ? gallery[photo] : p, i === 0 ? 1200 : 500)} alt={i === 0 ? `${h.name}, photo ${photo + 1}` : ""} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-10">
            <section><h2 className="font-display text-3xl uppercase tracking-wide">About</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-navy/80">{h.desc} Rooms are air-conditioned and soundproofed, with a 24-hour front desk and luggage storage.</p></section>
            <section aria-labelledby="am"><h2 id="am" className="font-display text-3xl uppercase tracking-wide">Amenities</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">{h.amenities.map((a) => <li key={a} className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold shadow-card"><span className="grid h-6 w-6 place-items-center rounded-full bg-ocean-100"><CheckIcon size={13} /></span>{a}</li>)}</ul></section>
            <section aria-labelledby="deals"><h2 id="deals" className="font-display text-3xl uppercase tracking-wide">Compare prices</h2>
              <ul className="mt-4 divide-y divide-navy/10 rounded-3xl bg-white px-5 shadow-card">
                {h.deals.map((d, i) => (
                  <li key={d.site} className="flex flex-wrap items-center gap-3 py-4"><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{d.site}</span>{d.perks && <span className="text-xs text-navy/55">{d.perks}</span>}</span>
                    {i === 0 && <Badge tone="success">Lowest price</Badge>}<span className="text-lg font-extrabold">${d.price}<span className="text-xs font-normal text-navy/55"> / night</span></span><Button size="sm" variant={i === 0 ? "primary" : "secondary"} href="#/hotels" aria-label={`View deal on ${d.site}`}>View deal</Button></li>))}
              </ul></section>
            <section aria-labelledby="rv"><h2 id="rv" className="font-display text-3xl uppercase tracking-wide">Guest reviews</h2>
              <div className="mt-4 grid gap-6 rounded-3xl bg-white p-5 shadow-card sm:grid-cols-[10rem_1fr]">
                <div className="text-center"><p className="font-display text-6xl font-bold">{h.rating.toFixed(1)}</p><p className="text-sm font-bold">{scoreWord(h.rating)}</p><p className="text-xs text-navy/55">{h.reviews.toLocaleString()} reviews</p></div>
                <ul className="space-y-2 self-center">{dist.map(([k, d]) => { const v = Math.min(10, h.rating + d); return <li key={k} className="flex items-center gap-3 text-xs"><span className="w-20 font-semibold">{k}</span><span className="h-2 flex-1 rounded-full bg-surface"><span className="block h-2 rounded-full bg-navy" style={{ width: `${v * 10}%` }} /></span><span className="w-8 text-right font-bold">{v.toFixed(1)}</span></li>; })}</ul>
              </div>
              <ul className="mt-4 space-y-3">{h.review.map((r) => <li key={r.name} className="flex gap-3 rounded-3xl bg-white p-4 shadow-card"><Avatar name={r.name} /><div className="min-w-0 flex-1"><p className="text-xs font-bold">{r.name} <span className="font-normal text-navy/50">· {r.date}</span></p><p className="mt-1 text-sm">{r.text}</p></div><ScoreBadge n={r.score} /></li>)}</ul></section>
            <section aria-labelledby="mp"><h2 id="mp" className="font-display text-3xl uppercase tracking-wide">Location</h2>
              <div className="relative mt-4 aspect-[16/8] overflow-hidden rounded-3xl bg-ocean-100 shadow-card">
                <svg viewBox="0 0 100 50" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true"><path d="M0 36 C20 28 34 44 54 34 S88 28 100 34 V50 H0Z" className="fill-ocean-300/50" /><path d="M-5 12 C20 16 28 6 50 12 S85 18 105 8" className="stroke-white" strokeWidth="2" fill="none" /><path d="M18 -5 C22 20 40 28 36 55 M72 -5 C66 22 78 30 68 55" className="stroke-white/80" strokeWidth="1.2" fill="none" /></svg>
                <span role="img" aria-label={h.name} style={{ left: `${h.x}%`, top: `${h.y / 2}%` }} className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-navy text-white shadow-pop ring-2 ring-white"><PinIcon size={16} /></span>
                <p className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold shadow-card">{h.area}, {h.city}</p></div></section>
          </div>
          <aside className="h-fit rounded-3xl bg-white p-5 shadow-pop lg:sticky lg:top-6" aria-label="Booking summary">
            <p className="text-xs text-navy/55">From</p><p className="text-4xl font-extrabold">${best.price}<span className="text-sm font-normal text-navy/55"> / night</span></p>
            <p className="mt-1 text-xs text-navy/65">{nights} night{nights > 1 ? "s" : ""}, {guests} guest{guests > 1 ? "s" : ""} · total <strong>${(best.price * nights).toLocaleString()}</strong> on {best.site}</p>
            <div className="mt-4 space-y-2"><Button className="w-full" href="#/hotels" aria-label={`View deal on ${best.site}`}>View deal</Button><Button className="w-full" variant="secondary" onClick={() => setAdding(true)}>Add to trip</Button></div>
            <p className="mt-3 text-[11px] text-navy/50">Prices are examples and may differ on the booking site.</p>
          </aside>
        </div>
      </Container>
      {adding && <AddToTripModal open onClose={() => setAdding(false)} reservation={{ type: "Hotel", name: h.name, date: `${nights} night${nights > 1 ? "s" : ""}`, confirmation: "", notes: `${h.area}, ${h.city} · $${best.price}/night via ${best.site}` }} />}
    </Page>
  );
}
