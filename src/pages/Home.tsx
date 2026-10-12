import { useState } from "react";
import Hero from "../components/Hero";
import PlanTripModal from "../components/trip/PlanTripModal";

const img = (id: string, w = 800) => `https://images.unsplash.com/${id}?w=${w}&q=80&fit=crop`;

const trips = [
  { title: "Trip to London", dates: "Oct 2 – 7", places: "4 places", photo: "photo-1549483249-f0b359d1e289" },
  { title: "Trip to Paris", dates: "Sep 26 – 30", places: "13 places", photo: "photo-1585944285854-d06c019aaca3" },
  { title: "Trip to Paris", dates: "Sep 26 – 30", places: "0 places", photo: "photo-1587648415693-4a5362b2ce41" },
];
const guide = { title: "Paris Guide", photo: "photo-1637851058613-95f0d41c3c2f" };
const popular = [
  { title: "Se é sua primeira vez em Salvador", blurb: "Para quem tá vindo pela primeira vez, seu lugar é aqui. Os clássicos que eu recomendo.", author: "Mill e umas Viagens", likes: 0, views: 74, photo: "photo-1569556420157-6030491766d1" },
  { title: "Ximending Food Guide: 30+ Spots", blurb: "My husband and I have visited Ximending 10 times over the years, and these are our picks.", author: "Katherine Woo", likes: 1, views: 257, photo: "photo-1542990254-7174ee186dd1" },
  { title: "ITALY", blurb: "I first visited Italy in November 2024 and did Milan, Rome, Florence, Venice.", author: "Jess Page", likes: 4, views: 877, photo: "photo-1523906921802-b5d2d899e93b" },
];
const footerCols = [
  ["Travel Plan", ["Hotels", "Blog", "Report security issue", "Terms, Privacy policy & Copyright"]],
  ["Guides and resources", ["Trip planners by destination", "Explore cities and countries", "Road trips by destination", "Best places to visit by category"]],
];

const Heart = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" /></svg>;
const Eye = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>;
const Avatar = ({ children = "M" }: { children?: string }) => <span className="grid h-6 w-6 place-items-center rounded-full bg-navy/10 text-[10px] font-semibold">{children}</span>;
const Dots = () => <span className="grid h-7 w-7 place-items-center rounded-full bg-black/45 text-xs text-white backdrop-blur">•••</span>;
const ShareChip = () => <span className="rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">↪ Share</span>;
const PlanBtn = ({ children, onClick }: { children: string; onClick?: () => void }) => onClick ? <button type="button" onClick={onClick} className="rounded-full bg-navy/5 px-4 py-2 text-xs font-semibold hover:bg-navy/10 transition">+ {children}</button> : <a href="#/home" className="rounded-full bg-navy/5 px-4 py-2 text-xs font-semibold hover:bg-navy/10 transition">+ {children}</a>;

export default function Home() {
  const [planOpen, setPlanOpen] = useState(false);
  return (
    <div className="bg-white">
      <PlanTripModal open={planOpen} onClose={() => setPlanOpen(false)} />
      <Hero variant="home" onPlanTrip={() => setPlanOpen(true)} />

      <section className="mx-auto max-w-6xl px-6 pt-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Recently viewed and upcoming</h2>
          <button type="button" onClick={() => setPlanOpen(true)} className="rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition">+ Plan new trip</button>
        </div>
        <div className="mt-8 flex items-center justify-between text-sm font-semibold">
          <span>Recently viewed ▾</span><a href="#/home">See all</a>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...trips, { title: guide.title, photo: guide.photo, guide: true }].map((t, i) => (
            <article key={i} className="group">
              <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-navy/5">
                <img src={img(t.photo)} alt={t.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute right-3 top-3 flex items-center gap-2"><ShareChip /><Dots /></div>
              </div>
              <h3 className="mt-3 text-base">{t.title}</h3>
              {"guide" in t ? (
                <p className="mt-2 flex items-center gap-4 text-sm text-navy/60"><span className="flex items-center gap-1"><Heart />0</span><span className="flex items-center gap-1"><Eye />0</span></p>
              ) : (
                <p className="mt-2 flex items-center gap-2 text-sm text-navy/60"><Avatar />• {t.dates} • {t.places}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 bg-navy/[0.04]">
        <div className="mx-auto grid max-w-6xl items-end gap-8 px-6 pt-12 lg:grid-cols-[1fr_320px]">
          <div className="pb-12">
            <h2 className="text-2xl font-extrabold tracking-tight">Need a place to stay?</h2>
            <form className="mt-6 flex flex-wrap gap-3" onSubmit={(e) => e.preventDefault()}>
              <label className="min-w-[220px] flex-1 rounded-lg border border-navy/10 bg-white px-4 py-2">
                <span className="block text-xs font-bold">Where</span>
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-navy/40" placeholder="Search destinations" />
              </label>
              <label className="rounded-lg border border-navy/10 bg-white px-4 py-2">
                <span className="block text-xs font-bold">When</span>
                <span className="text-sm">10/26 – 10/27</span>
              </label>
              <label className="rounded-lg border border-navy/10 bg-white px-4 py-2">
                <span className="block text-xs font-bold">Travelers</span>
                <span className="text-sm">1 room · 2 guests</span>
              </label>
              <button className="rounded-full bg-navy px-8 py-3 text-sm font-bold text-white hover:opacity-90 transition">Search</button>
            </form>
          </div>
          <svg className="hidden lg:block" viewBox="0 0 320 180" aria-hidden="true">
            <rect x="90" y="20" width="140" height="150" fill="#1F2B5E" opacity="0.1" />
            <rect x="120" y="0" width="80" height="170" fill="#1F2B5E" opacity="0.12" />
            {Array.from({ length: 4 }).map((_, r) => Array.from({ length: 3 }).map((_, c) => <rect key={`${r}${c}`} x={118 + c * 28} y={20 + r * 28} width="16" height="10" fill="#fff" opacity="0.8" />))}
            <circle cx="60" cy="110" r="32" fill="#1F2B5E" opacity="0.25" /><circle cx="262" cy="110" r="32" fill="#1F2B5E" opacity="0.25" />
            <rect x="40" y="170" width="240" height="10" fill="#1F2B5E" />
          </svg>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="relative h-[380px] overflow-hidden rounded-2xl bg-[#cfe6fb]">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 800 380" aria-hidden="true">
            <path d="M0 140 C120 110 200 190 320 170 C420 150 480 230 560 210 C660 185 740 230 800 200 L800 380 L0 380Z" fill="#e4e7ea" />
            <path d="M0 250 C140 230 260 300 400 280 C560 255 680 310 800 290 L800 380 L0 380Z" fill="#d6dadf" />
            <path d="M520 20 C560 60 620 40 680 80 C720 110 760 90 800 130 L800 0 L520 0Z" fill="#e9ecee" />
          </svg>
          <div className="absolute left-5 top-5 flex items-center gap-6 rounded-xl bg-navy px-6 py-4 text-white">
            <div className="text-center"><div className="text-2xl">0</div><div className="text-[10px] font-bold uppercase tracking-wide">Countries</div></div>
            <div className="text-center"><div className="text-2xl">0</div><div className="text-[10px] font-bold uppercase tracking-wide">Cities &amp; regions</div></div>
            <div className="text-lg">✋ Travel Newcomer</div>
          </div>
          <a href="#/home" className="absolute right-5 top-5 rounded-full bg-white px-5 py-3 text-sm font-bold hover:bg-white/90 transition">Add visited places</a>
          <div className="absolute bottom-5 right-5 flex flex-col overflow-hidden rounded-lg bg-white text-lg font-bold shadow">
            <button className="px-3 py-1.5 hover:bg-navy/5">+</button><button className="border-t border-navy/10 px-3 py-1.5 hover:bg-navy/5">−</button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-6 md:grid-cols-2">
        <div className="rounded-2xl bg-navy/[0.04] p-7">
          <div className="flex items-center justify-between"><h2 className="text-2xl font-extrabold">Your trips</h2><PlanBtn onClick={() => setPlanOpen(true)}>Plan new trip</PlanBtn></div>
          <ul className="mt-6">
            {trips.slice(0, 2).map((t, i) => (
              <li key={i} className={`flex items-center gap-4 py-4 ${i ? "border-t border-navy/10" : ""}`}>
                <img src={img(t.photo, 200)} alt="" className="h-20 w-20 rounded-lg object-cover" />
                <div className="flex-1"><div>{t.title}</div><p className="mt-2 flex items-center gap-2 text-sm text-navy/60"><Avatar />• {t.dates} • {t.places}</p></div>
                <span className="text-navy/50">↪ &nbsp;•••</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 text-right text-sm font-bold"><a href="#/home">See all</a></div>
        </div>
        <div className="rounded-2xl bg-navy/[0.04] p-7">
          <div className="flex items-center justify-between"><h2 className="text-2xl font-extrabold">Your guides</h2><PlanBtn>Create new guide</PlanBtn></div>
          <div className="mt-6 flex items-center gap-4 py-4">
            <img src={img(guide.photo, 200)} alt="" className="h-20 w-20 rounded-lg object-cover" />
            <div className="flex-1"><div>{guide.title}</div><p className="mt-2 flex items-center gap-4 text-sm text-navy/60"><span className="flex items-center gap-1"><Heart />0</span><span className="flex items-center gap-1"><Eye />0</span></p></div>
            <span className="text-navy/50">↪ &nbsp;•••</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Explore</h2>
        <h3 className="mt-8 text-xl font-bold">Popular destinations</h3>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {popular.map((p) => (
            <article key={p.title} className="group">
              <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-navy/5">
                <img src={img(p.photo)} alt={p.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute right-3 top-3 flex items-center gap-2"><ShareChip /><Dots /></div>
              </div>
              <h4 className="mt-3 truncate text-base">{p.title}</h4>
              <p className="mt-2 line-clamp-2 text-sm text-navy/60">{p.blurb}</p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Avatar>{p.author[0]}</Avatar><span className="flex-1 truncate">{p.author}</span>
                <span className="flex items-center gap-1"><Heart />{p.likes}</span><span className="flex items-center gap-1"><Eye />{p.views}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="bg-navy/[0.04]">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 text-sm md:grid-cols-4">
          <div>
            <p>Made with ♥ in SF &amp; more</p>
            <p className="mt-2">© {new Date().getFullYear()} Travel Plan Inc.</p>
            <button className="mt-5 rounded-full border border-navy/10 bg-white px-4 py-2 text-xs font-bold">Change language ▾</button>
          </div>
          {footerCols.map(([h, items]) => (
            <div key={h as string}>
              <h4 className="font-bold">{h as string}</h4>
              <ul className="mt-5 space-y-3">{(items as string[]).map((i) => <li key={i}><a href="#/home" className="hover:underline">{i}</a></li>)}</ul>
            </div>
          ))}
          <div>
            <h4 className="font-bold">Get the app</h4>
            <div className="mt-5 flex gap-3">
              <a href="#/home" className="rounded-md bg-navy px-3 py-2 text-xs font-semibold text-white">App Store</a>
              <a href="#/home" className="rounded-md bg-navy px-3 py-2 text-xs font-semibold text-white">Google Play</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
