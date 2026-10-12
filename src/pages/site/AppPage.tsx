import { Button, Container, Page, unsplash } from "../../components/ui";
import { CheckIcon, MapIcon, CalendarIcon, UsersIcon, DownloadIcon, SparkleIcon, PinIcon } from "../../components/ui";
import { H2 } from "./bits";

function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative aspect-[9/19] w-48 shrink-0 rounded-[2.2rem] border-[7px] border-navy-900 bg-white shadow-pop sm:w-56 ${className}`} role="img" aria-label="Travel Plan app screenshot">
      <div className="absolute left-1/2 top-1.5 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-navy-900" />
      <div className="h-full overflow-hidden rounded-[1.6rem] bg-surface">{children}</div>
    </div>
  );
}

function ItineraryScreen() {
  const stops = [["Louvre Museum", "09:30", "photo-1499856871958-5b9627545d1a"], ["Café de Flore", "12:30", "photo-1502602898657-3e91760cbb34"], ["Seine cruise", "17:00", "photo-1431274172761-fca41d930114"]];
  return (
    <div className="flex h-full flex-col" aria-hidden="true">
      <div className="bg-navy px-4 pb-4 pt-8 text-white"><p className="font-display text-2xl uppercase leading-none">Paris</p><p className="mt-1 text-[10px] text-white/70">Day 2 · Fri, Oct 16</p></div>
      <div className="flex-1 space-y-2.5 p-3">
        {stops.map(([n, t, p]) => (
          <div key={n} className="flex items-center gap-2.5 rounded-xl bg-white p-2 shadow-card">
            <img src={unsplash(p, 120)} alt="" className="h-11 w-11 rounded-lg object-cover" />
            <div className="min-w-0"><p className="truncate text-[11px] font-bold">{n}</p><p className="text-[10px] text-navy/55">{t}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MapScreen() {
  return (
    <div className="relative h-full bg-ocean-100" aria-hidden="true">
      <svg viewBox="0 0 200 400" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <path d="M-10 120 C60 90 90 160 210 130" stroke="#fff" strokeWidth="10" fill="none" /><path d="M40 -10 C70 120 20 260 90 410" stroke="#fff" strokeWidth="7" fill="none" />
        <path d="M120 -10 C110 140 170 250 130 410" stroke="#fff" strokeWidth="5" fill="none" />
        <path d="M50 90 C70 150 120 190 110 250 S140 320 100 350" stroke="#1F2B5E" strokeWidth="2.5" strokeDasharray="2 7" strokeLinecap="round" fill="none" />
        {[[50, 90], [110, 250], [100, 350]].map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="11" fill="#1F2B5E" /><text x={x} y={y + 3.5} fontSize="10" fontWeight="700" fill="#fff" textAnchor="middle">{i + 1}</text></g>)}
      </svg>
      <div className="absolute inset-x-3 bottom-4 rounded-xl bg-white p-2.5 shadow-pop"><p className="text-[11px] font-bold">Eiffel Tower</p><p className="text-[10px] text-navy/55">12 min walk · 0.9 km</p></div>
    </div>
  );
}

function TripsScreen() {
  const t = [["Lisbon", "photo-1555881400-74d7acaacd8b"], ["Tokyo", "photo-1540959733332-eab4deabeeaf"], ["Rome", "photo-1552832230-c0197dd311b5"]];
  return (
    <div className="space-y-2.5 p-3 pt-8" aria-hidden="true">
      <p className="font-display text-xl uppercase">My trips</p>
      {t.map(([n, p]) => (
        <div key={n} className="relative h-24 overflow-hidden rounded-xl"><img src={unsplash(p, 300)} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" /><p className="absolute bottom-2 left-3 font-display text-lg uppercase text-white">{n}</p></div>
      ))}
    </div>
  );
}

/* Decorative QR-style code, not scannable */
function Qr() {
  const n = 25;
  const cells: boolean[] = [];
  let s = 7;
  for (let i = 0; i < n * n; i++) { s = (s * 1103515245 + 12345) & 0x7fffffff; cells.push(s % 100 < 48); }
  const finder = (x: number, y: number) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  const finderOn = (x: number, y: number) => { const fx = x < 7 ? x : x - (n - 7), fy = y < 7 ? y : y - (n - 7); return fx === 0 || fx === 6 || fy === 0 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4); };
  return (
    <svg viewBox={`0 0 ${n} ${n}`} className="h-36 w-36" role="img" aria-label="QR code to download the app" shapeRendering="crispEdges">
      <rect width={n} height={n} fill="#fff" />
      {cells.map((on, i) => { const x = i % n, y = Math.floor(i / n); const v = finder(x, y) ? finderOn(x, y) : on; return v ? <rect key={i} x={x} y={y} width="1" height="1" fill="#1F2B5E" /> : null; })}
    </svg>
  );
}

const Store = ({ name, sub }: { name: string; sub: string }) => (
  <a href="#/app" className="inline-flex items-center gap-3 rounded-xl bg-white px-5 py-2.5 text-navy shadow-card transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-navy text-white"><DownloadIcon size={16} /></span>
    <span className="text-left leading-tight"><span className="block text-[10px] text-navy/60">{sub}</span><span className="block text-sm font-extrabold">{name}</span></span>
  </a>
);

const features = [
  [MapIcon, "Maps that work offline", "Download a trip before you fly and keep every pin, route and note without a signal."],
  [CalendarIcon, "Your day, at a glance", "A clean timeline of what is next, with travel times between each stop."],
  [UsersIcon, "Plan together", "Friends edit the same itinerary live. Comments and votes keep everyone in sync."],
  [PinIcon, "Save places on the go", "Share a spot from any app and it lands in your trip, ready to schedule."],
  [SparkleIcon, "Smart route suggestions", "One tap reorders your day to save time on the road."],
  [CheckIcon, "Bookings in one place", "Flights, stays and tickets live beside your plan, even offline."],
] as const;

export default function AppPage() {
  return (
    <Page loggedIn={false}>
      <div className="mx-3 mt-3 overflow-hidden rounded-2xl bg-navy text-white md:mx-6">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 sm:px-6 md:grid-cols-2 md:pt-20">
          <div className="pb-4 md:pb-20">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">Travel Plan for iOS and Android</p>
            <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-[1.02] md:text-7xl">Your whole trip, in your pocket</h1>
            <p className="mt-4 max-w-md text-sm text-white/75">Plan on the web, then take every day, map and booking with you. Works offline.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Store name="App Store" sub="Download on the" /><Store name="Google Play" sub="Get it on" /></div>
            <div className="mt-8 flex items-center gap-4 rounded-2xl bg-white/10 p-3 pr-5 backdrop-blur w-fit">
              <div className="rounded-xl bg-white p-1.5"><Qr /></div>
              <p className="max-w-[10rem] text-xs leading-relaxed text-white/80"><span className="block font-bold text-white">Scan to download</span>Point your phone camera at the code.</p>
            </div>
          </div>
          <div className="relative flex h-[26rem] items-end justify-center gap-4 overflow-hidden sm:h-[32rem]">
            <Phone className="mb-[-3rem] -rotate-3"><TripsScreen /></Phone>
            <Phone className="mb-[-6rem] hidden sm:block"><ItineraryScreen /></Phone>
            <Phone className="mb-[-1.5rem] hidden rotate-3 lg:block"><MapScreen /></Phone>
          </div>
        </div>
      </div>
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-xl text-center"><H2>Made for the road</H2><p className="mt-3 text-sm text-navy/65">Everything you plan at home, working where you need it.</p></div>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([Icon, t, d]) => (
            <li key={t} className="rounded-3xl bg-white p-6 shadow-card"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-ocean-100"><Icon size={20} /></span><h3 className="mt-4 text-base font-extrabold">{t}</h3><p className="mt-1.5 text-sm text-navy/65">{d}</p></li>
          ))}
        </ul>
        <div className="mt-14 flex flex-col items-center gap-3 rounded-3xl bg-white p-8 text-center shadow-card">
          <H2>Free to download</H2><p className="max-w-md text-sm text-navy/65">Offline downloads are part of Pro. Everything else is free.</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3"><Button href="#/signup">Create free account</Button><Button href="#/pricing" variant="secondary">See Pro</Button></div>
        </div>
      </Container>
    </Page>
  );
}
