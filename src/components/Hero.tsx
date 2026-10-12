const nav = "px-3 py-2 text-xs text-white/90 hover:text-white transition";
const pill = "rounded-full border border-white/25 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-medium text-white hover:bg-white/20 transition";

export default function Hero({ variant = "landing" }: { variant?: "landing" | "home" }) {
  return (
    <section className="h-screen min-h-[640px] p-3">
      <div className="relative h-full overflow-hidden rounded-2xl bg-navy">
        <video className="absolute inset-0 h-full w-full object-cover" src="/hero.mp4" autoPlay muted loop playsInline />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/20 to-navy/60" />
        <div className="pointer-events-none absolute inset-0 grid grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="border-r border-white/10 last:border-r-0" />)}
        </div>

        <header className="relative flex items-center justify-between px-6 py-5 md:px-10">
          <a href="#/guides" className={`${nav} md:hidden`}>Guides</a>
          <nav className="hidden md:flex gap-2">
            <a className={nav} href="#/home">Home</a><a className={nav} href="#/guides">Guides</a><a className={nav} href="#/hotels">Hotels</a><a className={nav} href="#/flights">Flights</a>
          </nav>
          <a href="#/" className="absolute left-1/2 -translate-x-1/2 text-center text-white">
            <svg className="mx-auto" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M3 12c5 0 5-6 9-6s4 6 9 6M3 12c5 0 5 6 9 6s4-6 9-6" /></svg>
            <div className="mt-1 text-[10px] font-semibold tracking-[0.3em]">TRAVEL PLAN</div>
          </a>
          {variant === "home" ? (
            <div className="ml-auto flex items-center gap-3">
              <label className="hidden w-56 items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-white backdrop-blur sm:flex">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                <input className="w-full bg-transparent text-xs outline-none placeholder:text-white/70" placeholder="Enter place or user" />
              </label>
              <a href="#/notifications" aria-label="Notifications" className="text-white/90 hover:text-white transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0" /></svg>
              </a>
              <a href="#/profile" aria-label="Profile" className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-xs font-bold text-navy transition hover:bg-white">M</a>
            </div>
          ) : (
            <nav className="ml-auto flex items-center gap-3">
              <a className={`${nav} md:hidden`} href="#/home">Home</a><a className={nav} href="#/login">Login</a><a className={pill} href="#/signup">Signup</a>
            </nav>
          )}
        </header>

        <div className="absolute inset-x-0 top-1/2 -translate-y-[58%] px-6 text-center text-white">
          <p className="mx-auto max-w-xs text-xs text-white/85 md:text-sm">Every trip, every step, every detail — beautifully organized from start to finish.</p>
          <h1 className="font-display text-[clamp(4rem,16vw,14rem)] font-bold uppercase leading-[1.05]">Explore</h1>
          <a href="#/signup" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-navy hover:bg-white/90 transition">Plan a trip <span>→</span></a>
        </div>
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/80">↓</div>
      </div>
    </section>
  );
}
