import { useState } from "react";
import { Avatar, Badge, Button, CheckIcon, ChevronDownIcon, Container, MinusIcon, Page, StarIcon } from "../components/ui";

const free = ["Unlimited trips and places", "Collaborative planning with friends", "Shared guides and public trip pages", "Budget and expense tracking", "Up to 5 attachments per trip"];
const pro = ["Everything in Free", "Offline access to trips and maps", "Unlimited attachments", "One-tap route optimization", "Export to Google Maps", "Flight deal alerts", "No ads", "Priority support"];

const rows: [string, string | boolean, string | boolean][] = [
  ["Offline access", false, true], ["Unlimited attachments", "5 per trip", true], ["Route optimization", false, true],
  ["Export to Google Maps", false, true], ["Flight deals", "Search only", "Price alerts"], ["No ads", false, true],
];

const faqs = [
  ["Can I really use Travel Plan for free?", "Yes. Planning trips, building itineraries, sharing guides and working with friends are free with no time limit. Pro adds offline access and extra tools for frequent travellers."],
  ["What happens if I cancel Pro?", "You keep everything you created. Your account moves to the Free plan at the end of the billing period, and offline downloads stop syncing."],
  ["Can I switch between monthly and yearly?", "Any time. If you move from monthly to yearly, we credit the unused part of your month towards the yearly price."],
  ["How does offline access work?", "Download any trip before you leave and its itinerary, notes, reservations and maps stay available without a signal. Changes sync when you are back online."],
  ["Do you offer refunds?", "If Pro isn't right for you, contact us within 14 days of your first payment for a full refund."],
  ["Is there a plan for groups?", "Everyone you invite can view and edit your trip on the Free plan. Each person only needs Pro for their own offline access."],
];

const quotes = [
  ["Aiko Tanaka", "Planned Kyoto with five friends", "Offline maps saved us in the mountains. The route optimizer took an hour of faffing out of every day."],
  ["Jess Page", "Travel writer", "I export every itinerary to Google Maps before a trip. Worth the price for that alone."],
  ["Sam Berg", "Road-tripper", "Flight alerts found us Reykjavik for half the usual fare. Pro paid for itself in one booking."],
];

const Cell = ({ v }: { v: string | boolean }) => v === true ? <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-navy text-white"><CheckIcon size={13} /><span className="sr-only">Included</span></span>
  : v === false ? <span className="text-navy/30"><MinusIcon size={16} /><span className="sr-only">Not included</span></span> : <span className="text-xs font-semibold text-navy/70">{v}</span>;

function Faq({ q, a, open, onToggle, id }: { q: string; a: string; open: boolean; onToggle: () => void; id: string }) {
  return (
    <div className="rounded-3xl bg-white shadow-card">
      <h3><button type="button" aria-expanded={open} aria-controls={`${id}-p`} id={`${id}-b`} onClick={onToggle} className="flex w-full items-center justify-between gap-4 rounded-3xl px-5 py-4 text-left text-sm font-bold focus-visible:outline-2 focus-visible:outline-ocean-500 sm:px-6 sm:text-base">
        {q}<span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface transition-transform ${open ? "rotate-180" : ""}`}><ChevronDownIcon size={16} /></span></button></h3>
      <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}><div className="overflow-hidden"><p className="px-5 pb-5 text-sm text-navy/70 sm:px-6">{a}</p></div></div>
    </div>
  );
}

export default function Pricing() {
  const [yearly, setYearly] = useState(true);
  const [open, setOpen] = useState<number | null>(0);
  const price = yearly ? 5 : 7;

  return (
    <Page loggedIn={false}>
      <Container className="pb-8 pt-12 text-center md:pt-16">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-navy/50">Pricing</p>
        <h1 className="mx-auto mt-2 max-w-3xl font-display text-5xl font-bold uppercase leading-[1.02] md:text-7xl">Plan for free. Go further with Pro.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-navy/65">Everything you need to plan a trip is free. Upgrade when you want to take it offline.</p>
        <div role="radiogroup" aria-label="Billing period" className="mx-auto mt-8 flex w-fit items-center rounded-full bg-white p-1 shadow-card">
          {[[false, "Monthly"], [true, "Yearly"]].map(([v, l]) => (
            <button key={String(l)} type="button" role="radio" aria-checked={yearly === v} onClick={() => setYearly(v as boolean)} className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${yearly === v ? "bg-navy text-white shadow-card" : "text-navy/70"}`}>
              {l as string}{v === true && <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${yearly ? "bg-ocean-300 text-navy" : "bg-ocean-100 text-navy"}`}>Save 29%</span>}</button>))}
        </div>
      </Container>

      <Container className="space-y-20 pb-20">
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <section aria-labelledby="free" className="flex flex-col rounded-3xl bg-white p-6 shadow-card sm:p-8">
            <h2 id="free" className="text-lg font-extrabold">Free</h2><p className="mt-1 text-sm text-navy/60">For planning trips with friends.</p>
            <p className="mt-5 font-display text-6xl font-bold leading-none">$0<span className="ml-2 font-sans text-sm font-normal text-navy/55">forever</span></p>
            <ul className="my-6 flex-1 space-y-3 text-sm">{free.map((f) => <li key={f} className="flex gap-3"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ocean-100"><CheckIcon size={12} /></span>{f}</li>)}</ul>
            <Button variant="secondary" size="lg" href="#/signup">Start for free</Button>
          </section>
          <section aria-labelledby="pro" className="relative flex flex-col rounded-3xl bg-navy p-6 text-white shadow-pop sm:p-8">
            <div className="flex items-center justify-between"><h2 id="pro" className="text-lg font-extrabold">Pro</h2><Badge tone="ocean">Most popular</Badge></div><p className="mt-1 text-sm text-white/70">For frequent and off-grid travellers.</p>
            <p className="mt-5 font-display text-6xl font-bold leading-none" aria-live="polite">${price}<span className="ml-2 font-sans text-sm font-normal text-white/65">per month</span></p>
            <p className="mt-2 text-xs text-white/65">{yearly ? "Billed $60 once a year" : "Billed monthly. Cancel any time"}</p>
            <ul className="my-6 flex-1 space-y-3 text-sm">{pro.map((f) => <li key={f} className="flex gap-3"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/15"><CheckIcon size={12} /></span>{f}</li>)}</ul>
            <Button variant="glass" size="lg" href="#/signup">Get Pro</Button>
            <p className="mt-3 text-center text-[11px] text-white/55">14-day money-back guarantee</p>
          </section>
        </div>

        <section aria-labelledby="cmp">
          <h2 id="cmp" className="text-center font-display text-4xl uppercase tracking-wide md:text-5xl">Compare plans</h2>
          <div className="relative mx-auto mt-8 max-w-4xl overflow-x-auto rounded-3xl bg-white shadow-card">
            <table className="w-full min-w-[30rem] text-left text-sm">
              <caption className="sr-only">Feature comparison between Free and Pro</caption>
              <thead><tr className="border-b border-navy/10"><th scope="col" className="p-4 sm:p-5"><span className="sr-only">Feature</span></th><th scope="col" className="w-32 p-4 text-center font-extrabold">Free</th><th scope="col" className="w-32 bg-ocean-100/50 p-4 text-center font-extrabold">Pro</th></tr></thead>
              <tbody>{rows.map(([k, a, b]) => <tr key={k} className="border-b border-navy/5 last:border-0"><th scope="row" className="p-4 font-semibold sm:p-5">{k}</th><td className="p-4 text-center"><Cell v={a} /></td><td className="bg-ocean-100/50 p-4 text-center"><Cell v={b} /></td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="tm">
          <h2 id="tm" className="text-center font-display text-4xl uppercase tracking-wide md:text-5xl">Loved by travellers</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {quotes.map(([n, r, t]) => (
              <li key={n} className="flex flex-col rounded-3xl bg-white p-6 shadow-card">
                <span className="flex gap-0.5 text-amber-500" role="img" aria-label="5 stars">{[0, 1, 2, 3, 4].map((i) => <StarIcon key={i} size={14} />)}</span>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-navy/80">“{t}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3"><Avatar name={n} /><span><span className="block text-sm font-bold">{n}</span><span className="block text-xs text-navy/55">{r}</span></span></figcaption>
              </li>))}
          </ul>
        </section>

        <section aria-labelledby="faq" className="mx-auto max-w-3xl">
          <h2 id="faq" className="text-center font-display text-4xl uppercase tracking-wide md:text-5xl">Questions, answered</h2>
          <div className="mt-8 space-y-3">{faqs.map(([q, a], i) => <Faq key={q} id={`faq${i}`} q={q} a={a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />)}</div>
        </section>

        <section className="rounded-3xl bg-navy px-6 py-14 text-center text-white md:py-20">
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold uppercase leading-tight md:text-6xl">Your next trip starts here</h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/70">Start free today. Upgrade to Pro whenever you are ready to go offline.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><Button variant="glass" size="lg" href="#/signup">Start planning for free</Button><Button variant="ghost" size="lg" href="#/signup" className="!text-white hover:!bg-white/10">Get Pro</Button></div>
        </section>
      </Container>
    </Page>
  );
}
