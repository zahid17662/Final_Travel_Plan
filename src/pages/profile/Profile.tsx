import { useMemo, useState } from "react";
import { Avatar, Badge, Button, Chip, Container, EditIcon, EmptyState, GlobeIcon, Page, PinIcon, Tabs, TripCard, unsplash } from "../../components/ui";
import { loadTrips } from "../../data";
import { coverSrc, loadGuides, loadState, placeCount } from "../../data/guidesStore";
import { loadProfile, toggleVisited, visitedCountries } from "../../data/profile";
import WorldMap from "./WorldMap";

const Stat = ({ n, label }: { n: number; label: string }) => <div className="text-center"><p className="font-display text-4xl font-bold leading-none">{n}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-navy/55">{label}</p></div>;

export default function Profile() {
  const p = useMemo(loadProfile, []);
  const [tab, setTab] = useState("trips");
  const [visited, setVisited] = useState(visitedCountries);
  const trips = loadTrips();
  const all = useMemo(() => loadGuides(), []);
  const mine = all.filter((g) => g.mine);
  const savedIds = loadState().saved;
  const savedPlaces = useMemo(() => all.filter((g) => savedIds.includes(g.id)).flatMap((g) => g.sections.flatMap((s) => s.places.map((pl) => ({ ...pl, from: g.title, gid: g.id, dest: g.destination })))), [all, savedIds]);

  return (
    <Page>
      <section className="relative">
        <div className="h-44 overflow-hidden bg-navy sm:h-60">
          {p.cover ? <img src={coverSrc(p.cover, 1800)} alt="" className="h-full w-full object-cover" /> : <img src={unsplash("photo-1488646953014-85cb44e25828", 1800)} alt="" className="h-full w-full object-cover opacity-70" />}
          <div className="absolute inset-0 h-44 bg-gradient-to-t from-navy-900/60 to-transparent sm:h-60" />
        </div>
        <Container className="relative">
          <div className="-mt-14 flex flex-wrap items-end gap-5 sm:-mt-16">
            <span className="rounded-full bg-surface p-1.5"><Avatar name={p.name} src={p.avatar || undefined} size="lg" tone="solid" className="!h-24 !w-24 !text-3xl sm:!h-28 sm:!w-28" /></span>
            <div className="min-w-0 flex-1 pb-1"><h1 className="font-display text-4xl font-bold uppercase leading-tight sm:text-5xl">{p.name}</h1><p className="text-sm text-navy/60">{p.handle}{p.location && <> · <PinIcon size={12} /> {p.location}</>}</p></div>
            <Button variant="secondary" icon={<EditIcon size={14} />} href="#/settings/profile">Edit profile</Button>
          </div>
          <div className="mt-5 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div><p className="max-w-xl text-sm text-navy/80">{p.bio}</p>{p.website && <a href={p.website} rel="noopener noreferrer" className="mt-2 inline-block text-xs font-semibold underline">{p.website.replace(/^https?:\/\//, "")}</a>}</div>
            <div className="flex gap-8 rounded-3xl bg-white px-8 py-4 shadow-card"><Stat n={visited.length} label="Countries" /><Stat n={trips.length} label="Trips" /><Stat n={mine.length} label="Guides" /></div>
          </div>
        </Container>
      </section>

      <Container className="py-8">
        <Tabs value={tab} onChange={setTab} items={[{ id: "trips", label: "Trips", count: trips.length }, { id: "guides", label: "Guides", count: mine.length }, { id: "places", label: "Saved places", count: savedPlaces.length }, { id: "map", label: "Travel map", count: visited.length }]} />
        <div className="mt-6">
          {tab === "trips" && (trips.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{trips.map((t) => <TripCard key={t.id} image={unsplash(t.photo, 700)} title={t.title} dates={t.dates} places={t.places} destination={t.destination} collaborators={t.collaborators} href={`#/trip/${t.id}`} />)}</div>
            : <EmptyState title="No trips yet" description="Plan your first trip and it will show up here." action={<Button href="#/trips">Go to trips</Button>} />)}

          {tab === "guides" && (mine.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{mine.map((g) => (
            <a key={g.id} href={`#/guide/${g.id}`} className="group relative block aspect-[4/3.2] overflow-hidden rounded-3xl bg-navy shadow-card">
              {g.cover && <img src={coverSrc(g.cover)} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}<div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/10 to-transparent" />
              {!g.published && <span className="absolute left-3 top-3"><Badge tone="navy">Draft</Badge></span>}
              <div className="absolute inset-x-5 bottom-5 text-white"><h3 className="text-sm font-bold uppercase tracking-wide">{g.title || "Untitled guide"}</h3><p className="text-xs text-white/75">{placeCount(g)} places · {g.likes} likes</p></div></a>))}</div>
            : <EmptyState title="You haven't written a guide yet" description="Share your favourite places with other travellers." action={<Button href="#/guides/new">Write a guide</Button>} />)}

          {tab === "places" && (savedPlaces.length ? <ul className="grid gap-3 sm:grid-cols-2">{savedPlaces.map((pl) => (
            <li key={pl.id}><a href={`#/guide/${pl.gid}`} className="flex gap-3 rounded-3xl bg-white p-3 shadow-card transition hover:shadow-pop">
              <span className="h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-ocean-100">{pl.photo && <img src={coverSrc(pl.photo, 300)} alt="" loading="lazy" className="h-full w-full object-cover" />}</span>
              <span className="min-w-0 py-1"><span className="block truncate text-sm font-bold">{pl.name}</span><span className="block truncate text-xs text-navy/60">{pl.dest}</span><span className="mt-1 block truncate text-[11px] text-navy/50">From “{pl.from}”</span></span></a></li>))}</ul>
            : <EmptyState title="No saved places yet" description="Save a guide and its places appear here." action={<Button href="#/guides">Browse guides</Button>} />)}

          {tab === "map" && (
            <div className="space-y-5">
              <WorldMap visited={visited} onToggle={(n) => setVisited(toggleVisited(n))} />
              <div className="flex flex-wrap items-center gap-2"><span className="mr-1 inline-flex items-center gap-1.5 text-sm font-bold"><GlobeIcon size={16} />{visited.length} of 195 countries · {Math.round((visited.length / 195) * 100)}% of the world</span>
                {[...visited].sort().map((c) => <Chip key={c} selected onRemove={() => setVisited(toggleVisited(c))}>{c}</Chip>)}{!visited.length && <span className="text-sm text-navy/55">Click countries on the map to add them.</span>}</div>
            </div>
          )}
        </div>
      </Container>
    </Page>
  );
}
