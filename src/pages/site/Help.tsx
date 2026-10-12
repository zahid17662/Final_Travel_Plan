import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Container, EmptyState, Input, Page, SearchBar, Select, Skeleton, Textarea, useToast } from "../../components/ui";
import { CalendarIcon, ChevronRightIcon, LockIcon, MapIcon, SettingsIcon, SparkleIcon, UsersIcon } from "../../components/ui";
import { articles, helpCategories, popularArticles } from "../../data/content";
import { Hero, H2 } from "./bits";

const icons = { sparkle: SparkleIcon, calendar: CalendarIcon, map: MapIcon, users: UsersIcon, settings: SettingsIcon, lock: LockIcon };

function ContactForm() {
  const { show } = useToast();
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<Record<string, string>>({});
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!String(f.get("name")).trim()) next.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(String(f.get("email")))) next.email = "Enter a valid email";
    if (String(f.get("message")).trim().length < 10) next.message = "Tell us a little more";
    setErr(next);
    if (Object.keys(next).length) return;
    setSent(true);
    show({ title: "Message sent", description: "We reply within one working day.", tone: "success" });
  };
  if (sent) return <EmptyState title="Thanks, we got your message" description="Our team will reply by email within one working day." action={<Button variant="secondary" onClick={() => setSent(false)}>Send another</Button>} />;
  return (
    <form onSubmit={submit} noValidate className="space-y-4 rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2"><Input name="name" label="Name" error={err.name} autoComplete="name" /><Input name="email" type="email" label="Email" error={err.email} autoComplete="email" /></div>
      <Select name="topic" label="Topic" options={["Using the planner", "Billing", "Bug report", "Something else"].map((v) => ({ value: v, label: v }))} />
      <Textarea name="message" label="How can we help?" rows={5} />
      {err.message && <p role="alert" className="text-xs text-red-600">{err.message}</p>}
      <Button type="submit" size="lg">Send message</Button>
    </form>
  );
}
export { ContactForm };

export function Help() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 450); return () => clearTimeout(t); }, []);
  const results = useMemo(() => { const k = q.trim().toLowerCase(); return k ? articles.filter((a) => (a.title + a.body.join(" ")).toLowerCase().includes(k)) : []; }, [q]);
  const searching = q.trim().length > 0;

  return (
    <Page loggedIn={false}>
      <Hero eyebrow="Help centre" title="How can we help?">
        <div className="mx-auto mt-8 max-w-xl"><SearchBar tone="glass" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles, e.g. offline maps" aria-label="Search help articles" className="!py-3.5 !text-sm" /></div>
      </Hero>
      <Container className="space-y-16 py-12 md:py-16">
        {searching ? (
          <section aria-live="polite"><H2>{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</H2>
            <div className="mt-6">{results.length ? <ArticleList items={results} /> : <EmptyState title="No articles found" description="Try different words, or send us a message and we will help directly." action={<><Button variant="secondary" onClick={() => setQ("")}>Clear search</Button><Button href="#/help#contact">Contact us</Button></>} />}</div></section>
        ) : (
          <>
            <section aria-labelledby="cats"><H2 id="cats">Browse by topic</H2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? Array.from({ length: 6 }, (_, i) => <div key={i} className="space-y-3 rounded-3xl bg-white p-6 shadow-card" role="status" aria-label="Loading"><Skeleton circle className="h-11 w-11" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-3 w-4/5" /></div>)
                  : helpCategories.map((c) => { const I = icons[c.icon]; return (
                    <Link key={c.id} to={`/help/topic/${c.id}`} className="group rounded-3xl bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-pop focus-visible:outline-2 focus-visible:outline-navy">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ocean-100"><I size={20} /></span>
                      <h3 className="mt-4 font-extrabold">{c.title}</h3><p className="mt-1 text-sm text-navy/60">{c.blurb}</p>
                      <p className="mt-3 text-xs font-bold text-navy/50">{articles.filter((a) => a.cat === c.id).length} articles</p></Link>); })}
              </div></section>
            <section aria-labelledby="pop"><H2 id="pop">Popular articles</H2>
              <div className="mt-6"><ArticleList items={popularArticles.map((id) => articles.find((a) => a.id === id)!)} /></div></section>
          </>
        )}
        <section id="contact" aria-labelledby="ct" className="mx-auto max-w-2xl scroll-mt-24"><H2 id="ct">Still need help?</H2><p className="mb-6 mt-2 text-sm text-navy/65">Send us a note and a real person will reply.</p><ContactForm /></section>
      </Container>
    </Page>
  );
}

function ArticleList({ items }: { items: typeof articles }) {
  return (
    <ul className="divide-y divide-navy/5 overflow-hidden rounded-3xl bg-white shadow-card">
      {items.map((a) => <li key={a.id}><Link to={`/help/${a.id}`} className="flex items-center justify-between gap-4 px-5 py-4 text-sm font-semibold hover:bg-surface focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-navy sm:px-6">{a.title}<ChevronRightIcon size={16} /></Link></li>)}
    </ul>
  );
}

export function HelpTopic() {
  const { cat } = useParams();
  const c = helpCategories.find((x) => x.id === cat);
  const items = articles.filter((a) => a.cat === cat);
  return (
    <Page loggedIn={false}>
      <Hero eyebrow="Help centre" title={c?.title ?? "Topic"} />
      <Container className="max-w-3xl py-12">
        {items.length ? <ArticleList items={items} /> : <EmptyState title="Nothing here yet" description="We are still writing this topic." action={<Button href="#/help">Back to help</Button>} />}
      </Container>
    </Page>
  );
}

export function HelpArticle() {
  const { id } = useParams();
  const a = articles.find((x) => x.id === id);
  const [vote, setVote] = useState<"" | "yes" | "no">("");
  if (!a) return <Page loggedIn={false}><Container className="max-w-3xl py-16"><EmptyState title="Article not found" action={<Button href="#/help">Back to help</Button>} /></Container></Page>;
  const cat = helpCategories.find((c) => c.id === a.cat);
  return (
    <Page loggedIn={false}>
      <Container className="max-w-3xl py-12">
        <nav aria-label="Breadcrumb" className="text-xs text-navy/60"><Link to="/help" className="hover:underline">Help</Link> / <Link to={`/help/topic/${a.cat}`} className="hover:underline">{cat?.title}</Link></nav>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-tight md:text-6xl">{a.title}</h1>
        <div className="mt-6 space-y-4 rounded-3xl bg-white p-6 text-sm leading-relaxed text-navy/80 shadow-card sm:p-8">{a.body.map((p, i) => <p key={i}>{p}</p>)}</div>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm"><span className="font-semibold">{vote ? "Thanks for the feedback" : "Was this helpful?"}</span>
          {!vote && <><Button size="sm" variant="secondary" onClick={() => setVote("yes")}>Yes</Button><Button size="sm" variant="secondary" onClick={() => setVote("no")}>No</Button></>}</div>
      </Container>
    </Page>
  );
}
