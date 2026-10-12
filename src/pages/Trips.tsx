import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Button, Container, CopyIcon, EditIcon, EmptyState, GridIcon, GuideCard, Input, ListIcon, Modal, Page,
  PageTitle, Panel, PlusIcon, SearchBar, SectionTitle, Select, ShareIcon, Tabs, TrashIcon, TripCard, unsplash, useToast,
} from "../components/ui";
import type { DropdownItem } from "../components/ui";
import PlanTripModal from "../components/trip/PlanTripModal";
import { guides, loadTrips, persistTrips } from "../data";
import type { Trip } from "../data";

type Sort = "date-asc" | "date-desc" | "name-asc" | "name-desc";
const sortOptions = [
  { value: "date-asc", label: "Date: soonest first" },
  { value: "date-desc", label: "Date: latest first" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];
const tabs = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
  { id: "draft", label: "Drafts" },
] as const;
const emptyCopy: Record<string, { title: string; description: string }> = {
  upcoming: { title: "No upcoming trips", description: "Your next adventure starts with a destination. Pick one and we'll help with the rest." },
  past: { title: "No past trips yet", description: "Trips you've taken will show up here, ready to relive or reuse." },
  draft: { title: "No drafts", description: "Trips without dates are saved here until you're ready to lock them in." },
};

function sortTrips(list: Trip[], sort: Sort) {
  const [key, dir] = sort.split("-");
  const sign = dir === "asc" ? 1 : -1;
  if (key === "name") return [...list].sort((a, b) => sign * a.title.localeCompare(b.title));
  const dated = list.filter((t) => t.start).sort((a, b) => sign * a.start!.localeCompare(b.start!));
  return [...dated, ...list.filter((t) => !t.start)];
}

function TripsBody() {
  const toast = useToast();
  const [all, setAll] = useState<Trip[]>(loadTrips);
  const [tab, setTab] = useState<string>("upcoming");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("date-asc");
  const [planOpen, setPlanOpen] = useState(false);
  const [renaming, setRenaming] = useState<Trip>();
  const [name, setName] = useState("");
  const [deleting, setDeleting] = useState<Trip>();

  const commit = (next: Trip[]) => { setAll(next); persistTrips(next); };
  const count = (s: string) => all.filter((t) => t.status === s).length;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = all.filter((t) => t.status === tab && (!q || `${t.title} ${t.destination}`.toLowerCase().includes(q)));
    return sortTrips(list, sort);
  }, [all, tab, query, sort]);

  const share = async (t: Trip) => {
    const url = `${window.location.origin}${window.location.pathname}#/trip/${t.id}`;
    try { await navigator.clipboard.writeText(url); toast.show({ title: "Link copied", description: `Share “${t.title}” with anyone you like.`, tone: "success" }); }
    catch { toast.show({ title: "Couldn't copy the link", description: url, tone: "error" }); }
  };
  const duplicate = (t: Trip) => {
    const copy = { ...t, id: `trip-${Date.now()}`, title: `${t.title} (copy)` };
    const i = all.findIndex((x) => x.id === t.id);
    commit([...all.slice(0, i + 1), copy, ...all.slice(i + 1)]);
    toast.show({ title: "Trip duplicated", description: copy.title, tone: "success" });
  };
  const openRename = (t: Trip) => { setRenaming(t); setName(t.title); };
  const saveRename = () => {
    if (!renaming || !name.trim()) return;
    commit(all.map((t) => (t.id === renaming.id ? { ...t, title: name.trim() } : t)));
    toast.show({ title: "Trip renamed", description: name.trim(), tone: "success" });
    setRenaming(undefined);
  };
  const confirmDelete = () => {
    if (!deleting) return;
    commit(all.filter((t) => t.id !== deleting.id));
    toast.show({ title: "Trip deleted", description: deleting.title, tone: "info" });
    setDeleting(undefined);
  };
  const menuFor = (t: Trip): DropdownItem[] => [
    { label: "Rename", icon: <EditIcon size={16} />, onSelect: () => openRename(t) },
    { label: "Duplicate", icon: <CopyIcon size={16} />, onSelect: () => duplicate(t) },
    { label: "Share", icon: <ShareIcon size={16} />, onSelect: () => share(t) },
    { label: "Delete", icon: <TrashIcon size={16} />, danger: true, onSelect: () => setDeleting(t) },
  ];
  const cardProps = (t: Trip) => ({
    image: unsplash(t.photo), title: t.title, dates: t.dates, places: t.places, href: `#/trip/${t.id}`,
    destination: t.destination, collaborators: t.collaborators ?? ["Mia"], menu: menuFor(t), onShare: () => share(t),
  });
  const savedGuides = guides.slice(0, 3);

  const toggleBtn = (id: "grid" | "list", label: string, icon: ReactNode) => (
    <button type="button" aria-pressed={view === id} aria-label={label} onClick={() => setView(id)}
      className={`grid h-9 w-9 place-items-center rounded-full transition ${view === id ? "bg-navy text-white shadow-card" : "text-navy/70 hover:text-navy"}`}>{icon}</button>
  );

  return (
    <Container className="space-y-12 py-10 md:py-14">
      <PageTitle eyebrow="Travel Plan" title="Your trips">
        <Button icon={<PlusIcon size={16} />} onClick={() => setPlanOpen(true)}>Plan new trip</Button>
      </PageTitle>

      <section className="space-y-6" aria-label="Trips">
        <Tabs value={tab} onChange={setTab} items={tabs.map((t) => ({ id: t.id, label: t.label, count: count(t.id) }))} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar className="flex-1 sm:max-w-xs" placeholder="Search trips" aria-label="Search trips" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="flex items-center gap-3 sm:ml-auto">
            <Select aria-label="Sort trips" className="flex-1 sm:w-52 sm:flex-none" value={sort} onChange={(e) => setSort(e.target.value as Sort)} options={sortOptions} />
            <div role="group" aria-label="View" className="flex rounded-full bg-white p-1 shadow-card">
              {toggleBtn("grid", "Grid view", <GridIcon size={16} />)}
              {toggleBtn("list", "List view", <ListIcon size={16} />)}
            </div>
          </div>
        </div>

        {visible.length === 0 ? (
          query ? (
            <EmptyState title="No trips match your search" description={`Nothing in ${tabs.find((t) => t.id === tab)?.label.toLowerCase()} matches “${query}”.`} action={<Button variant="secondary" onClick={() => setQuery("")}>Clear search</Button>} />
          ) : (
            <EmptyState {...emptyCopy[tab]} action={<Button icon={<PlusIcon size={16} />} onClick={() => setPlanOpen(true)}>Plan a new trip</Button>} />
          )
        ) : view === "grid" ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{visible.map((t) => <TripCard key={t.id} {...cardProps(t)} />)}</div>
        ) : (
          <Panel className="divide-y divide-navy/10 !py-1">{visible.map((t) => <TripCard key={t.id} variant="row" {...cardProps(t)} />)}</Panel>
        )}
      </section>

      <section className="space-y-6" aria-label="Guides">
        <SectionTitle action={<Button href="#/guides" variant="ghost" size="sm">Browse guides →</Button>}>Guides</SectionTitle>
        <p className="-mt-3 text-sm text-navy/60">Saved guides from travellers you follow.</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {savedGuides.map((g) => <GuideCard key={g.id} href={`#/guide/${g.id}`} image={unsplash(g.photo)} title={g.title} blurb={g.blurb} author={g.author} likes={g.likes} views={g.views} />)}
        </div>
      </section>

      <PlanTripModal open={planOpen} onClose={() => setPlanOpen(false)} />

      <Modal open={!!renaming} onClose={() => setRenaming(undefined)} title="Rename trip"
        footer={<><Button variant="ghost" onClick={() => setRenaming(undefined)}>Cancel</Button><Button onClick={saveRename} disabled={!name.trim()}>Save</Button></>}>
        <form onSubmit={(e) => { e.preventDefault(); saveRename(); }}>
          <Input label="Trip name" value={name} autoFocus onChange={(e) => setName(e.target.value)} error={name.trim() ? undefined : "Give your trip a name"} />
        </form>
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(undefined)} title="Delete this trip?"
        footer={<><Button variant="ghost" onClick={() => setDeleting(undefined)}>Keep trip</Button><Button className="!bg-red-600" onClick={confirmDelete} icon={<TrashIcon size={16} />}>Delete trip</Button></>}>
        <p>“<strong className="text-navy">{deleting?.title}</strong>” and its itinerary will be removed for you and everyone you planned it with. This can't be undone.</p>
      </Modal>
    </Container>
  );
}

export function Trips() {
  return <Page><TripsBody /></Page>;
}
