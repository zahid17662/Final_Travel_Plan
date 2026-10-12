import Hero from "../components/Hero";

const features = [
  ["01", "Itinerary builder", "Drop places into days, reorder stops, and see travel times between them."],
  ["02", "Maps that think", "Every saved spot pinned on a map, so you can plan the best route."],
  ["03", "Plan together", "Invite friends, vote on places and edit the trip in real time."],
  ["04", "Budget & bookings", "Flights, hotels and tours get stored in one place, split fairly."],
];
const guides = [
  ["Kyoto in 5 days", "photo-1493976040374-85c8e12f0c0e"],
  ["Iceland ring road", "photo-1519092437326-bfd121eb53ae"],
  ["Amalfi coast escape", "photo-1533105079780-92b9be482077"],
];

export default function Landing() {
  return (
    <div className="bg-white">
      <Hero />

      <section id="features" className="mx-auto max-w-6xl px-6 py-28 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-navy/50">Why Travel Plan</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-extrabold tracking-tight md:text-5xl">One app for all your travel planning needs</h2>
        <p className="mx-auto mt-5 max-w-md text-sm text-navy/60">Create detailed itineraries, explore shared guides and manage your bookings seamlessly — all in one place.</p>
        <div className="mt-16 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([n, t, d]) => (
            <div key={n} className="group rounded-2xl border border-navy/10 bg-white p-6 transition hover:bg-navy hover:text-white">
              <span className="text-xs text-navy/40 group-hover:text-white/50">{n}</span>
              <h3 className="mt-6 text-base font-bold">{t}</h3>
              <p className="mt-2 text-xs leading-relaxed opacity-60">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="guides" className="mx-3 rounded-2xl bg-navy py-20 text-white md:mx-6">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight">Guides from real travellers</h2>
            <a href="#/guides" className="text-xs text-white/80 hover:text-white">View all guides →</a>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {guides.map(([t, id]) => (
              <article key={t} className="group overflow-hidden rounded-xl">
                <div className="relative aspect-[4/3.2] bg-white/5">
                  <img src={`https://images.unsplash.com/${id}?w=800&q=80`} alt={t} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/10 to-transparent" />
                  <h3 className="absolute bottom-5 left-5 text-sm font-bold uppercase tracking-wide">{t}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="start" className="mx-auto max-w-4xl px-6 py-28 text-center">
        <h2 className="text-4xl font-extrabold uppercase tracking-tight md:text-6xl">Your next trip starts here</h2>
        <p className="mt-5 text-sm text-navy/60">Free-to-use. Plan solo or with your whole crew.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#/signup" className="rounded-full bg-navy px-7 py-3 text-xs font-semibold text-white hover:opacity-90">Start planning</a>
          <a href="#/app" className="rounded-full border border-navy/15 px-7 py-3 text-xs font-semibold hover:bg-navy/5">Get the app →</a>
        </div>
      </section>

      <footer id="about" className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 border-t border-navy/10 px-6 py-8 text-xs text-navy/50">
        <span>© {new Date().getFullYear()} Travel Plan. Made for wanderers.</span>
        <span className="flex gap-6"><a href="#/privacy">Privacy</a><a href="#/terms">Terms</a></span>
      </footer>
    </div>
  );
}
