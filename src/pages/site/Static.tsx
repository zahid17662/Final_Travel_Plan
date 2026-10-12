import { Avatar, Container, Page, unsplash } from "../../components/ui";
import { Button, GlobeIcon, HeartIcon, UsersIcon } from "../../components/ui";
import { legal } from "../../data/content";
import { Hero, H2 } from "./bits";
import { ContactForm } from "./Help";

export function About() {
  const stats = [["2.4M", "trips planned"], ["190", "countries covered"], ["38k", "guides written"]];
  const values = [[GlobeIcon, "Curious first", "We build for people who would rather wander than scroll."], [UsersIcon, "Better together", "Great trips are shared. Planning should be too."], [HeartIcon, "Honest and calm", "No dark patterns, no clutter. Just the tools you need."]] as const;
  const team = ["Maya Ortiz", "Jonas Weber", "Aiko Tanaka", "Sam Berg"];
  return (
    <Page loggedIn={false}>
      <Hero eyebrow="About Travel Plan" title="We help the world plan better trips" tall />
      <Container className="space-y-20 py-14 md:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <img src={unsplash("photo-1488085061387-422e29b40080", 1000)} alt="" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-card" />
          <div><H2>Why we started</H2><p className="mt-4 text-sm leading-relaxed text-navy/75">Travel Plan began with a spreadsheet, a group chat and a trip that nearly never happened. We wanted one calm place to gather ideas, make decisions with friends and carry the plan with us.</p><p className="mt-3 text-sm leading-relaxed text-navy/75">Today travellers use Travel Plan to build itineraries, share guides and find the places locals love.</p></div>
        </div>
        <dl className="grid gap-4 sm:grid-cols-3">{stats.map(([n, l]) => <div key={l} className="rounded-3xl bg-navy p-8 text-center text-white"><dt className="order-2 mt-1 text-xs text-white/70">{l}</dt><dd className="font-display text-6xl font-bold">{n}</dd></div>)}</dl>
        <section><H2>What we believe</H2><ul className="mt-6 grid gap-5 md:grid-cols-3">{values.map(([I, t, d]) => <li key={t} className="rounded-3xl bg-white p-6 shadow-card"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-ocean-100"><I size={20} /></span><h3 className="mt-4 font-extrabold">{t}</h3><p className="mt-1.5 text-sm text-navy/65">{d}</p></li>)}</ul></section>
        <section><H2>The team</H2><ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{team.map((n) => <li key={n} className="flex flex-col items-center rounded-3xl bg-white p-6 text-center shadow-card"><Avatar name={n} size="lg" /><p className="mt-3 text-sm font-bold">{n}</p></li>)}</ul></section>
        <div className="rounded-3xl bg-white p-8 text-center shadow-card"><H2>Join the journey</H2><p className="mt-2 text-sm text-navy/65">Start planning your next trip today.</p><div className="mt-5 flex justify-center gap-3"><Button href="#/signup">Get started</Button><Button href="#/contact" variant="secondary">Contact us</Button></div></div>
      </Container>
    </Page>
  );
}

function Legal({ title, updated, sections }: { title: string; updated: string; sections: string[][] }) {
  return (
    <Page loggedIn={false}>
      <Hero eyebrow={`Last updated ${updated}`} title={title} />
      <Container className="grid gap-8 py-12 md:grid-cols-[220px_1fr] md:py-16">
        <nav aria-label="On this page" className="md:sticky md:top-24 md:self-start"><p className="text-xs font-bold uppercase tracking-widest text-navy/50">On this page</p><ul className="mt-3 space-y-2 text-sm">{sections.map(([h], i) => <li key={h}><a href={`#s${i}`} onClick={(e) => { e.preventDefault(); document.getElementById(`s${i}`)?.scrollIntoView({ behavior: "smooth" }); }} className="text-navy/70 hover:text-navy hover:underline">{h}</a></li>)}</ul></nav>
        <div className="space-y-8 rounded-3xl bg-white p-6 shadow-card sm:p-10">{sections.map(([h, t], i) => <section key={h} id={`s${i}`} className="scroll-mt-24"><h2 className="text-lg font-extrabold">{i + 1}. {h}</h2><p className="mt-2 text-sm leading-relaxed text-navy/75">{t}</p></section>)}</div>
      </Container>
    </Page>
  );
}
export const Privacy = () => <Legal title="Privacy Policy" updated="October 1, 2026" sections={legal.privacy} />;
export const Terms = () => <Legal title="Terms of Service" updated="October 1, 2026" sections={legal.terms} />;

export function Contact() {
  return (
    <Page loggedIn={false}>
      <Hero eyebrow="Contact" title="Get in touch" />
      <Container className="grid gap-8 py-12 md:grid-cols-[1fr_320px] md:py-16">
        <ContactForm />
        <aside className="space-y-4">
          {[["Support", "help@travelplan.example", "Replies within one working day."], ["Press", "press@travelplan.example", "Media enquiries and assets."], ["Office", "21 Harbour Street, Lisbon", "Visits by appointment."]].map(([t, a, d]) => <div key={t} className="rounded-3xl bg-white p-5 shadow-card"><h3 className="text-sm font-extrabold">{t}</h3><p className="mt-1 text-sm">{a}</p><p className="text-xs text-navy/55">{d}</p></div>)}
          <Button href="#/help" variant="secondary" className="w-full">Browse the help centre</Button>
        </aside>
      </Container>
    </Page>
  );
}
