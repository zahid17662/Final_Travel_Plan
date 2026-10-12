import { useMemo, useState } from "react";
import { Avatar, Badge, Button, Chip, Container, EmptyState, HeartIcon, Page, PinIcon, PlusIcon, SearchBar, Select, Tabs } from "../../components/ui";
import { coverSrc, loadGuides, loadState, placeCount } from "../../data/guidesStore";
import type { FullGuide } from "../../data/guidesStore";

const Stat = ({ icon, n, label }: { icon: React.ReactNode; n: number; label: string }) => <span className="inline-flex items-center gap-1" title={label}>{icon}<span className="sr-only">{label}:</span>{n}</span>;
const BookmarkIcon = ({ size = 14 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z" /></svg>;

function Card({ g }: { g: FullGuide }) {
  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-card transition hover:shadow-pop">
      <a href={`#/guide/${g.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500">
        <div className="relative aspect-[4/3.2] bg-navy/5">
          {g.cover && <img src={coverSrc(g.cover)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/10 to-transparent" />
          {!g.published && <span className="absolute left-3 top-3"><Badge tone="navy">Draft</Badge></span>}
          <h3 className="absolute inset-x-5 bottom-5 text-sm font-bold uppercase tracking-wide text-white">{g.title || "Untitled guide"}</h3>
        </div>
        <div className="flex items-center gap-2 p-4 text-xs">
          <Avatar name={g.author} size="sm" /><span className="min-w-0 flex-1 truncate font-semibold">{g.author}</span>
          <span className="flex shrink-0 items-center gap-3 text-navy/65">
            <Stat icon={<PinIcon size={13} />} n={placeCount(g)} label="Places" /><Stat icon={<BookmarkIcon size={13} />} n={g.saves} label="Saves" /><Stat icon={<HeartIcon size={13} />} n={g.likes} label="Likes" />
          </span>
        </div>
      </a>
    </article>
  );
}

export default function Guides() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("All");
  const [sort, setSort] = useState("popular");
  const [tab, setTab] = useState("all");
  const all = useMemo(() => loadGuides(), []);
  const st = useMemo(() => loadState(), []);
  const tags = useMemo(() => ["All", ...Array.from(new Set(all.flatMap((g) => g.tags)))], [all]);
  const pub = all.filter((g) => g.published);
  const featured = [...pub].sort((a, b) => b.saves - a.saves)[0];

  const base = tab === "mine" ? all.filter((g) => g.mine) : tab === "saved" ? pub.filter((g) => st.saved.includes(g.id)) : pub;
  const list = base.filter((g) => (tag === "All" || g.tags.includes(tag)) && `${g.title} ${g.author} ${g.destination}`.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => (sort === "new" ? b.updated - a.updated : sort === "saves" ? b.saves - a.saves : b.likes + b.views / 10 - (a.likes + a.views / 10)));
  const browsing = tab === "all" && !q && tag === "All";

  return (
    <Page loggedIn={false}>
      <section className="mx-3 mt-3 rounded-2xl bg-navy text-white md:mx-6">
        <Container className="py-12 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">Guides</p>
              <h1 className="mt-2 font-display text-5xl font-bold uppercase leading-[1.02] md:text-7xl">Guides from real travellers</h1>
              <p className="mt-3 max-w-lg text-sm text-white/75">Lists of places, notes and insider tips. Use one as the start of your next trip.</p>
            </div>
            <Button variant="glass" icon={<PlusIcon size={16} />} href="#/guides/new">Write a guide</Button>
          </div>
        </Container>
      </section>

      <Container className="space-y-10 py-10">
        {browsing && featured && (
          <a href={`#/guide/${featured.id}`} className="group grid overflow-hidden rounded-3xl bg-white shadow-card transition hover:shadow-pop md:grid-cols-2">
            <div className="relative aspect-[16/10] md:aspect-auto"><img src={coverSrc(featured.cover, 1200)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <Badge tone="ocean">Featured guide</Badge>
              <h2 className="mt-3 font-display text-4xl font-bold uppercase leading-tight md:text-5xl">{featured.title}</h2>
              <p className="mt-3 text-sm text-navy/70">{featured.blurb}</p>
              <div className="mt-5 flex items-center gap-3 text-xs"><Avatar name={featured.author} /><span className="font-semibold">{featured.author}</span>
                <span className="flex items-center gap-3 text-navy/65"><Stat icon={<PinIcon size={13} />} n={placeCount(featured)} label="Places" /><Stat icon={<BookmarkIcon size={13} />} n={featured.saves} label="Saves" /><Stat icon={<HeartIcon size={13} />} n={featured.likes} label="Likes" /></span></div>
              <span className="mt-6 inline-flex w-fit rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white">Read guide</span>
            </div>
          </a>
        )}

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Tabs variant="pill" value={tab} onChange={setTab} items={[{ id: "all", label: "All guides" }, { id: "saved", label: "Saved", count: st.saved.length }, { id: "mine", label: "My guides", count: all.filter((g) => g.mine).length }]} />
            <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
              <SearchBar className="min-w-0 flex-1 bg-white sm:w-64 sm:flex-none" placeholder="Search guides" aria-label="Search guides" value={q} onChange={(e) => setQ(e.target.value)} />
              <Select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} options={[{ value: "popular", label: "Most popular" }, { value: "saves", label: "Most saved" }, { value: "new", label: "Newest" }]} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">{tags.map((t) => <Chip key={t} selected={tag === t} onClick={() => setTag(t)}>{t}</Chip>)}</div>
        </div>

        {list.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((g) => <Card key={g.id} g={g} />)}</div>
        ) : (
          <EmptyState title={tab === "mine" ? "You haven't written a guide yet" : tab === "saved" ? "No saved guides" : "No guides match"} description={tab === "mine" ? "Share your favourite places with other travellers." : "Try another search or topic."}
            action={tab === "mine" ? <Button href="#/guides/new">Write a guide</Button> : <Button onClick={() => { setQ(""); setTag("All"); setTab("all"); }}>Show all guides</Button>} />
        )}
      </Container>
    </Page>
  );
}
