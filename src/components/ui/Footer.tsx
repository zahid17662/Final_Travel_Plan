import { SITE_NAME } from "./Navbar";

const columns: [string, [string, string][]][] = [
  [SITE_NAME, [["About", "#/about"], ["Blog", "#/blog"], ["Contact", "#/contact"], ["Privacy policy", "#/privacy"], ["Terms of service", "#/terms"]]],
  ["Guides and resources", [["Explore destinations", "#/explore"], ["Traveller guides", "#/guides"], ["Hotels", "#/hotels"], ["Flights", "#/flights"], ["Help centre", "#/help"]]],
];

export default function Footer() {
  return (
    <footer className="bg-surface text-navy">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 text-sm md:grid-cols-4">
        <div>
          <p>Made with ♥ for wanderers</p>
          <p className="mt-2 text-navy/60">© {new Date().getFullYear()} {SITE_NAME}. Made for wanderers.</p>
          <button type="button" className="mt-5 rounded-full border border-navy/10 bg-white px-4 py-2 text-xs font-bold transition hover:bg-navy/5 active:scale-95" onClick={() => { window.location.hash = "#/settings/locale"; }}>Change language ▾</button>
        </div>
        {columns.map(([title, items]) => (
          <div key={title}>
            <h4 className="font-bold">{title}</h4>
            <ul className="mt-5 space-y-3 text-navy/75">
              {items.map(([i, h]) => <li key={i}><a href={h} className="transition hover:text-navy hover:underline">{i}</a></li>)}
            </ul>
          </div>
        ))}
        <div>
          <h4 className="font-bold">Get the app</h4>
          <div className="mt-5 flex gap-3">
            <a href="#/app" className="rounded-lg bg-navy px-3.5 py-2 text-xs font-semibold text-white transition hover:-translate-y-px hover:opacity-90 active:scale-95">App Store</a>
            <a href="#/app" className="rounded-lg bg-navy px-3.5 py-2 text-xs font-semibold text-white transition hover:-translate-y-px hover:opacity-90 active:scale-95">Google Play</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
