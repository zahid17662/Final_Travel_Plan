import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AvatarGroup, Badge, Button, CalendarIcon, Container, EmptyState, LockIcon, Page, PinIcon, StarIcon, unsplash, useToast } from "../components/ui";
import { loadTrips, saveTrip } from "../data";
import type { Trip } from "../data";
import { canView, loadDoc, loadShare } from "./planner/collab";
import { photoFor } from "./planner/itineraryData";
import MapPanel from "./planner/MapPanel";
import { uid } from "./planner/seed";
import type { Doc } from "./planner/seed";

function Body({ trip, doc, owner, names }: { trip: Trip; doc: Doc; owner: string; names: string[] }) {
  const { show } = useToast();
  const nav = useNavigate();
  const [selected, setSelected] = useState<string>();
  const dayNums = Array.from({ length: doc.days }, (_, i) => i + 1);
  const groups = [...dayNums.map((n) => ({ label: `Day ${n}`, items: doc.places.filter((p) => p.day === n) })), { label: "More ideas", items: doc.places.filter((p) => !p.day) }].filter((g) => g.items.length);

  const copyTrip = () => {
    const id = `copy-${uid()}`; const title = `Copy of ${trip.title}`;
    saveTrip({ ...trip, id, title, status: "draft", privacy: "Private", collaborators: [], places: `${doc.places.length} places` });
    const next: Doc = { ...doc, title, budget: 0, reservations: [], expenses: [], notes: [], richNotes: undefined, attachments: [], places: doc.places.map((p) => ({ ...p, id: uid() })) };
    try { localStorage.setItem(`tp_plan_${id}`, JSON.stringify(next)); } catch { /* ignore */ }
    show({ title: "Trip copied to your drafts", description: title, tone: "success" }); nav(`/trip/${id}`);
  };

  return (
    <>
      <section className="relative">
        <img src={unsplash(trip.photo, 1800)} alt="" className="h-72 w-full object-cover sm:h-96" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-navy-900/10" />
        <Container className="absolute inset-x-0 bottom-0 pb-8 text-white">
          <Badge tone="ocean">Shared trip</Badge>
          <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-wide sm:text-6xl">{trip.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-white/90">
            <span className="inline-flex items-center gap-1.5"><PinIcon size={15} />{trip.destination}</span>
            {trip.dates && <span className="inline-flex items-center gap-1.5"><CalendarIcon size={15} />{trip.dates}</span>}
            <span>{doc.places.length} places</span>
            <span className="inline-flex items-center gap-2"><AvatarGroup names={names} max={4} />by {owner}</span>
          </div>
        </Container>
      </section>

      <Container className="py-8">
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-card">
          <p className="min-w-0 flex-1 text-sm font-semibold text-navy/75">You are viewing a read-only copy. Make it yours to edit, reorder and book.</p>
          <Button onClick={copyTrip}>Copy this trip</Button>
          <Button variant="secondary" href="#/signup">Sign up to plan your own</Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_26rem]">
          <div className="space-y-8">
            {groups.length ? groups.map((g) => (
              <section key={g.label} aria-label={g.label}>
                <h2 className="mb-3 font-display text-2xl uppercase tracking-wide">{g.label}</h2>
                <ol className="space-y-3">
                  {g.items.map((p) => (
                    <li key={p.id}>
                      <button type="button" onClick={() => setSelected(p.id)} className={`flex w-full gap-3 rounded-2xl bg-white p-3 text-left shadow-card transition hover:shadow-pop ${selected === p.id ? "ring-2 ring-ocean-500" : ""}`}>
                        <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ocean-100 sm:h-24 sm:w-24">
                          <img src={unsplash(p.photo ?? photoFor(p.name), 300)} alt="" loading="lazy" className="h-full w-full object-cover" />
                          <span className="absolute left-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-navy text-[11px] font-bold text-white ring-2 ring-white">{doc.places.indexOf(p) + 1}</span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-bold">{p.name}</span>
                          <span className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-navy/65"><span className="font-semibold">{p.category}</span>{p.time && <span>{p.time}</span>}
                            {p.rating && <span className="inline-flex items-center gap-1 font-semibold"><span className="text-amber-500"><StarIcon size={12} /></span>{p.rating.toFixed(1)}</span>}</span>
                          {p.note && <span className="mt-2 block text-xs text-navy/75">{p.note}</span>}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </section>
            )) : <EmptyState title="Nothing planned yet" description="The owner hasn't added any places to this trip." />}
          </div>
          <aside aria-label="Map" className="h-[24rem] overflow-hidden rounded-3xl shadow-card lg:sticky lg:top-6 lg:h-[34rem]">
            <MapPanel readOnly places={doc.places} nearby={[]} selectedId={selected} onSelect={setSelected} onAddNearby={() => {}} onSearchArea={() => {}} searching={false} />
          </aside>
        </div>

        <section className="mt-12 rounded-3xl bg-navy p-8 text-center text-white sm:p-12">
          <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">Plan your own trip</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/75">Build itineraries, map your places and plan with friends, free.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3"><Button variant="glass" href="#/signup">Sign up to plan your own</Button><Button variant="ghost" onClick={copyTrip} className="!text-white hover:!bg-white/10">Copy this trip</Button></div>
        </section>
      </Container>
    </>
  );
}

export default function SharedTrip() {
  const { id } = useParams();
  const trip = loadTrips().find((t) => t.id === id);
  const share = trip ? loadShare(trip) : undefined;
  if (!trip || !share) return <Page loggedIn={false}><Container className="py-20"><EmptyState title="We couldn't find that trip" description="The link may be wrong, or the trip was deleted." action={<Link to="/home"><Button>Go to Travel Plan</Button></Link>} /></Container></Page>;
  if (!canView(share)) return (
    <Page loggedIn={false}><Container className="py-20">
      <EmptyState title="This trip is private" description="Ask the owner to turn on link sharing, or log in if you have been invited."
        illustration={<span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ocean-100"><LockIcon size={28} /></span>}
        action={<div className="flex gap-2"><Button href="#/login">Log in</Button><Button variant="secondary" href="#/signup">Sign up</Button></div>} />
    </Container></Page>
  );
  const owner = share.members.find((m) => m.role === "owner")?.name ?? "A traveler";
  return <Page loggedIn={false}><Body trip={trip} doc={loadDoc(trip)} owner={owner} names={share.members.map((m) => m.name)} /></Page>;
}
