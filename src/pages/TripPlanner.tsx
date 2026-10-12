import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AvatarGroup, Badge, Button, CalendarIcon, EmptyState, Input, Modal, PlusIcon, Select, ShareIcon, Tabs, ToastProvider, Toggle,
  unsplash, useToast,
} from "../components/ui";
import { currentUser, loadTrips, persistTrips } from "../data";
import { loadShare, saveShare } from "./planner/collab";
import type { Share } from "./planner/collab";
import { CommentsProvider } from "./planner/comments";
import { EditingPill, EditingProvider, PresenceBar, useSimulatedPresence } from "./planner/Presence";
import ShareModal from "./planner/ShareModal";
import type { Trip } from "../data";
import MapPanel from "./planner/MapPanel";
import TopBar from "./planner/TopBar";
import { Overview } from "./planner/panes";
import Budget from "./planner/Budget";
import Checklist from "./planner/Checklist";
import Notes from "./planner/Notes";
import Reservations from "./planner/Reservations";
import Itinerary from "./planner/Itinerary";
import { hashPos, nearbyIdeas, seedDoc, uid } from "./planner/seed";
import type { Doc } from "./planner/seed";
import { useHistory } from "./planner/useHistory";

const tabItems = ["Overview", "Itinerary", "Reservations", "Budget", "Notes", "Checklist"].map((l) => ({ id: l.toLowerCase(), label: l }));

function Planner({ initial }: { initial: Trip }) {
  const { show } = useToast();
  const [trip, setTrip] = useState(initial);
  const key = `tp_plan_${trip.id}`;
  const { doc, set, undo, redo, canUndo, canRedo } = useHistory<Doc>(() => {
    try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw) as Doc; } catch { /* ignore */ }
    return { ...seedDoc(initial) };
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(doc)); } catch { /* ignore */ } }, [doc, key]);

  const updateTrip = useCallback((patch: Partial<Trip>) => {
    setTrip((t) => { const n = { ...t, ...patch }; persistTrips(loadTrips().map((x) => (x.id === n.id ? n : x))); return n; });
  }, []);

  const [tab, setTab] = useState("overview");
  const [mobile, setMobile] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState<string>();
  const [hoverId, setHoverId] = useState<string>();
  const [nearby, setNearby] = useState<{ id: string; name: string; x: number; y: number }[]>([]);
  const [searching, setSearching] = useState(false);
  const [offline, setOffline] = useState<"idle" | "loading" | "ready">("idle");
  const [modal, setModal] = useState<null | "share" | "invite" | "settings" | "dates">(null);
  const [title, setTitle] = useState(trip.title);
  const [comments, setComments] = useState(true); const [notify, setNotify] = useState(false);
  const [dates, setDates] = useState(trip.dates);
  const scroller = useRef<HTMLDivElement>(null);
  const [share, setShareState] = useState<Share>(() => loadShare(initial));
  const setShare = useCallback((fn: (s: Share) => Share) => setShareState(fn), []);
  const shareMounted = useRef(false);
  useEffect(() => {
    saveShare(trip.id, share);
    if (!shareMounted.current) { shareMounted.current = true; return; }
    const collaborators = share.members.filter((m) => m.role !== "owner").map((m) => m.name);
    const privacy = share.public ? "Public" : share.link ? "Friends" : "Private";
    setTrip((t) => { const n = { ...t, collaborators, privacy }; persistTrips(loadTrips().map((x) => (x.id === n.id ? n : x))); return n; });
  }, [share, trip.id]);
  const travelers = share.members.map((m) => m.name);
  const others = share.members.filter((m) => m.role !== "owner");
  const { online, editing } = useSimulatedPresence(others, doc.places);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "z") return;
      const t = e.target as HTMLElement;
      if (/INPUT|TEXTAREA|SELECT/.test(t.tagName)) return;
      e.preventDefault(); if (e.shiftKey) redo(); else undo();
    };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [undo, redo]);

  const changeTab = (id: string) => { setTab(id); scroller.current?.scrollTo({ top: 0 }); };
  const select = (id?: string) => {
    setSelectedId(id);
    if (id) { setTab("overview"); requestAnimationFrame(() => document.getElementById(`place-${id}`)?.scrollIntoView({ block: "center", behavior: "smooth" })); }
  };
  const addPlace = (name: string, pos = hashPos(name), category = "Activity") =>
    set((d) => ({ ...d, places: [...d.places, { id: uid(), name, category, note: "", x: pos.x, y: pos.y }] }));
  const searchArea = () => {
    setSearching(true);
    setTimeout(() => {
      const base = Date.now().toString();
      setNearby(nearbyIdeas.map((n, i) => ({ id: `n-${base}-${i}`, name: n, ...hashPos(n + base + i) })));
      setSearching(false); show({ title: "Found 4 places nearby", description: "Tap a dot on the map to add it." });
    }, 700);
  };
  const goOffline = () => {
    if (offline !== "idle") return;
    setOffline("loading");
    setTimeout(() => { setOffline("ready"); show({ title: "Available offline", description: "This trip is saved to your device.", tone: "success" }); }, 1000);
  };
  const commitTitle = () => {
    const v = title.trim() || trip.title; setTitle(v);
    if (v !== trip.title) { updateTrip({ title: v }); set((d) => ({ ...d, title: v })); }
  };
  const common = { doc, set, selectedId, onSelect: select, onHover: setHoverId, onAdd: (n: string) => addPlace(n) };
  const pane = {
    overview: <Overview {...common} onSeeReservations={() => changeTab("reservations")} />,
    itinerary: <Itinerary doc={doc} set={set} start={trip.start} city={trip.destination.split(",")[0]} selectedId={selectedId} onSelect={select} onHover={setHoverId} />,
    reservations: <Reservations doc={doc} set={set} tripId={trip.id} />,
    budget: <Budget doc={doc} set={set} travelers={travelers} />,
    notes: <Notes doc={doc} set={set} />,
    checklist: <Checklist doc={doc} set={set} />,
  }[tab];

  return (
    <CommentsProvider tripId={trip.id} enabled={comments} seed={doc.places[0] && others.length ? { placeId: doc.places[0].id, place: doc.places[0].name, by: others[0].name, replyBy: (others[1] ?? others[0]).name } : undefined}>
    <EditingProvider value={editing}>
    <div className="flex h-dvh flex-col bg-surface text-navy">
      <TopBar title={trip.title} canUndo={canUndo} canRedo={canRedo} onUndo={undo} onRedo={redo} offline={offline} onOffline={goOffline} onSettings={() => setModal("settings")} onShare={() => setModal("share")}
        presence={<PresenceBar you={currentUser.name} others={others} online={online} />} />
      <div className="relative flex min-h-0 flex-1">
        <div ref={scroller} className={`min-h-0 flex-1 overflow-y-auto lg:block lg:w-[55%] lg:flex-none ${mobile === "map" ? "hidden" : ""}`}>
          <header>
            <div className="relative h-44 sm:h-56">
              <img src={unsplash(trip.photo, 1400)} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/20 to-transparent" />
              <div className="absolute right-3 top-3 sm:right-5"><EditingPill editing={editing} /></div>
              <div className="absolute inset-x-0 bottom-0 px-5 pb-4 sm:px-8">
                <Badge tone="ocean">{trip.destination}</Badge>
                <input aria-label="Trip title" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={commitTitle} onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); if (e.key === "Escape") { setTitle(trip.title); e.currentTarget.blur(); } }}
                  className="mt-2 w-full rounded-lg bg-transparent font-display text-3xl font-bold uppercase tracking-wide text-white outline-none hover:bg-white/10 focus:bg-white/15 sm:text-4xl" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 px-5 py-4 sm:px-8">
              <button type="button" onClick={() => { setDates(trip.dates); setModal("dates"); }} className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold shadow-card hover:bg-navy/5"><CalendarIcon size={16} />{trip.dates || "Add dates"}</button>
              <AvatarGroup names={travelers} max={4} size="md" />
              <div className="ml-auto flex gap-2">
                <Button variant="secondary" size="sm" icon={<PlusIcon size={14} />} onClick={() => setModal("invite")}>Invite</Button>
                <Button size="sm" icon={<ShareIcon size={14} />} onClick={() => setModal("share")}>Share</Button>
              </div>
            </div>
          </header>
          <div className="sticky top-0 z-20 border-b border-navy/10 bg-surface/95 px-3 backdrop-blur sm:px-6"><Tabs items={tabItems} value={tab} onChange={changeTab} /></div>
          <main className="px-5 py-6 pb-28 sm:px-8 lg:pb-10">{pane}</main>
        </div>
        <aside aria-label="Map" className={`min-h-0 flex-1 p-0 lg:block lg:w-[45%] lg:flex-none lg:p-3 lg:pl-0 ${mobile === "list" ? "hidden" : ""}`}>
          <MapPanel places={doc.places} nearby={nearby} selectedId={selectedId} hoverId={hoverId} onSelect={select} onSearchArea={searchArea} searching={searching}
            onAddNearby={(n) => { addPlace(n.name, { x: n.x, y: n.y }, "Suggestion"); setNearby((l) => l.filter((x) => x.id !== n.id)); show({ title: `Added ${n.name}` }); }} />
        </aside>
        <button type="button" onClick={() => setMobile(mobile === "list" ? "map" : "list")} className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 rounded-full bg-navy px-6 py-3 text-sm font-bold text-white shadow-pop lg:hidden">
          {mobile === "list" ? "Show map" : "Show list"}
        </button>
      </div>

      {(modal === "share" || modal === "invite") && <ShareModal share={share} setShare={setShare} tripId={trip.id} tripTitle={trip.title} focusInvite={modal === "invite"} onClose={() => setModal(null)} />}
      <Modal open={modal === "settings"} onClose={() => setModal(null)} title="Trip settings" footer={<Button onClick={() => setModal(null)}>Done</Button>}>
        <div className="space-y-5">
          <Select label="Currency" value={doc.currency ?? "USD"} onChange={(e) => set((d) => ({ ...d, currency: e.target.value }))} options={["USD", "EUR", "GBP", "JPY", "CAD", "AUD"].map((c) => ({ value: c, label: c }))} />
          <Toggle checked={comments} onChange={setComments} label="Allow comments" description="Travelers can comment on places." />
          <Toggle checked={notify} onChange={setNotify} label="Email me about changes" />
        </div>
      </Modal>
      <Modal open={modal === "dates"} onClose={() => setModal(null)} title="Trip dates" footer={<><Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button><Button onClick={() => { updateTrip({ dates: dates.trim() }); setModal(null); }}>Save</Button></>}>
        <Input label="Dates" placeholder="e.g. Nov 2 - 8, 2026" value={dates} onChange={(e) => setDates(e.target.value)} />
      </Modal>
    </div>
    </EditingProvider>
    </CommentsProvider>
  );
}

export default function TripPlanner() {
  const { id } = useParams();
  const trip = loadTrips().find((t) => t.id === id);
  if (!trip) return (
    <div className="grid min-h-dvh place-items-center bg-surface p-6 text-navy">
      <EmptyState title="We couldn't find that trip" description="It may have been deleted." action={<Link to="/trips"><Button>Back to trips</Button></Link>} />
    </div>
  );
  return <ToastProvider><Planner key={trip.id} initial={trip} /></ToastProvider>;
}
