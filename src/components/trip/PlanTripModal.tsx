import { useId, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar, Badge, Button, CalendarIcon, Chip, DateRangePicker, GlobeIcon, Input, LockIcon, Modal, PinIcon,
  SearchIcon, Select, SparkleIcon, Toggle, UsersIcon, formatRange,
} from "../ui";
import type { DateRange } from "../ui";
import { destinations, places, saveTrip } from "../../data";
import type { Place } from "../../data";

type Privacy = "private" | "friends" | "public";
const privacyOptions: { id: Privacy; label: string; hint: string; icon: ReactNode }[] = [
  { id: "private", label: "Private", hint: "Only you can see this trip.", icon: <LockIcon size={14} /> },
  { id: "friends", label: "Friends", hint: "Only the friends you invite can view and edit.", icon: <UsersIcon size={14} /> },
  { id: "public", label: "Public", hint: "Anyone with the link can view. Only invited friends can edit.", icon: <GlobeIcon size={14} /> },
];
const typeTone = { city: "soft", country: "ocean", region: "navy" } as const;
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

const Label = ({ children, id }: { children: ReactNode; id?: string }) => <p id={id} className="mb-1.5 text-xs font-bold text-navy">{children}</p>;

function DestinationSearch({ selected, onAdd, error }: { selected: Place[]; onAdd: (p: Place) => void; error?: string }) {
  const listId = useId();
  const [q, setQ] = useState(selected.length ? selected[selected.length - 1].name : "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const term = q.trim().toLowerCase();
  const results = useMemo(() => {
    const pool = places.filter((p) => !selected.some((s) => s.id === p.id));
    return term ? pool.filter((p) => `${p.name} ${p.sub} ${p.type}`.toLowerCase().includes(term)) : pool.slice(0, 5);
  }, [term, selected]);
  const custom = term && !places.some((p) => p.name.toLowerCase() === term) ? q.trim() : "";
  const total = results.length + (custom ? 1 : 0);

  const add = (p: Place) => {
    onAdd(p);
    setQ(p.name);
    setActive(0);
    setOpen(false);
  };
  const addCustom = () => {
    const customPlace: Place = { id: `custom-${custom.toLowerCase()}`, name: custom, sub: "Custom destination", type: "city" };
    onAdd(customPlace);
    setQ(custom);
    setOpen(false);
  };
  const choose = (i: number) => (i < results.length ? add(results[i]) : custom && addCustom());

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => (a + 1) % Math.max(total, 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => (a - 1 + total) % Math.max(total, 1)); }
    else if (e.key === "Enter" && open && total) { e.preventDefault(); choose(active); }
    else if (e.key === "Escape" && open) { e.stopPropagation(); setOpen(false); }
  };

  return (
    <div className="relative">
      <Input
        label="Where to?"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && total ? `${listId}-${active}` : undefined}
        leading={<SearchIcon size={16} />}
        placeholder="Search a city, country or region"
        autoComplete="off"
        value={q}
        error={error}
        onChange={(e) => {
          setQ(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        onKeyDown={onKey}
        trailing={
          q ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                setQ("");
                setOpen(true);
              }}
              className="rounded-full p-1 text-navy/40 hover:bg-navy/5 hover:text-navy cursor-pointer transition"
              aria-label="Clear destination"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ) : undefined
        }
      />
      {open && (
        <ul id={listId} role="listbox" aria-label="Destination suggestions" className="absolute left-0 right-0 z-20 mt-1 max-h-60 overflow-y-auto rounded-xl border border-navy/10 bg-white p-1.5 shadow-pop">
          {!term && <li role="presentation" className="px-3 pb-1 pt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-navy/45">Popular</li>}
          {results.map((p, i) => (
            <li
              key={p.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                add(p);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 ${i === active ? "bg-surface" : "hover:bg-surface/60"}`}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ocean-100 text-ocean-700"><PinIcon size={14} /></span>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-navy">{p.name}</span><span className="block truncate text-xs text-navy/55">{p.sub}</span></span>
              <Badge tone={typeTone[p.type]} className="capitalize">{p.type}</Badge>
            </li>
          ))}
          {custom && (
            <li
              id={`${listId}-${results.length}`}
              role="option"
              aria-selected={active === results.length}
              onMouseDown={(e) => {
                e.preventDefault();
                addCustom();
              }}
              onMouseEnter={() => setActive(results.length)}
              className={`cursor-pointer rounded-lg px-3 py-2 text-sm text-navy ${active === results.length ? "bg-surface" : "hover:bg-surface/60"}`}
            >
              {results.length === 0 && <span className="block text-xs text-navy/55">No matches for “{custom}”</span>}
              Add <strong>“{custom}”</strong> as typed
            </li>
          )}
          {!total && <li role="presentation" className="px-3 py-2 text-sm text-navy/55">All popular places are already added.</li>}
        </ul>
      )}
    </div>
  );
}

function Inner({ onClose, initial }: { onClose: () => void; initial?: Place }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [dests, setDests] = useState<Place[]>(initial ? [initial] : []);
  const [range, setRange] = useState<DateRange>({});
  const [noDates, setNoDates] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState<string>();
  const [privacy, setPrivacy] = useState<Privacy>("friends");
  const [pace, setPace] = useState("balanced");
  const [interests, setInterests] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    dest: dests.length ? undefined : "Add at least one destination to start planning.",
    dates: noDates || (range.start && range.end) ? undefined : range.start ? "Pick an end date, or choose “No dates yet”." : "Choose your dates, or select “No dates yet”.",
  };
  const errorCount = Object.values(errors).filter(Boolean).length;
  const dateLabel = noDates ? "No dates yet" : formatRange(range) || "Select dates";

  const addEmail = () => {
    const v = email.trim().toLowerCase();
    if (!v) return;
    if (!emailOk(v)) return setEmailErr("That doesn't look like an email address.");
    if (emails.includes(v)) return setEmailErr("You've already added that person.");
    setEmails((l) => [...l, v]); setEmail(""); setEmailErr(undefined);
  };

  const start = () => {
    setSubmitted(true);
    if (errorCount) return;
    const first = destinations.find((d) => d.name === dests[0].name || d.country === dests[0].sub);
    const id = `trip-${Date.now()}`;
    saveTrip({
      id, title: `Trip to ${dests[0].name}${dests.length > 1 ? ` + ${dests.length - 1} more` : ""}`,
      dates: noDates ? "Dates not set" : formatRange(range), places: mode === "ai" ? "AI draft" : "0 places",
      destination: dests.map((d) => d.name).join(", "), photo: first?.photo ?? "photo-1507525428034-b723cf961d3e",
      status: noDates ? "draft" : "upcoming", privacy,
      start: noDates ? undefined : range.start?.toISOString().slice(0, 10), collaborators: ["Mia", ...emails],
    });
    onClose();
    navigate(`/trip/${id}`);
  };

  const optionCard = (id: "manual" | "ai", icon: ReactNode, title: string, desc: string, badge?: string) => (
    <button type="button" role="radio" aria-checked={mode === id} onClick={() => setMode(id)}
      className={`relative flex flex-1 flex-col gap-1.5 rounded-xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${mode === id ? "border-navy bg-navy/[0.04] ring-1 ring-navy" : "border-navy/15 bg-white hover:bg-navy/[0.03]"}`}>
      <span className="flex items-center gap-2 text-navy"><span className={`grid h-8 w-8 place-items-center rounded-full ${mode === id ? "bg-navy text-white" : "bg-surface"}`}>{icon}</span>{badge && <Badge tone="ocean">{badge}</Badge>}</span>
      <span className="text-sm font-bold text-navy">{title}</span>
      <span className="text-xs leading-relaxed text-navy/60">{desc}</span>
    </button>
  );

  return (
    <Modal open onClose={onClose} title="Plan new trip" size="lg"
      footer={
        <>
          {submitted && errorCount > 0 && <p role="alert" className="w-full rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">Fix {errorCount} {errorCount === 1 ? "thing" : "things"} above to continue.</p>}
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button size="lg" icon={mode === "ai" ? <SparkleIcon size={16} /> : undefined} onClick={start}>{mode === "ai" ? "Start planning with AI" : "Start planning"}</Button>
        </>
      }>
      <div className="space-y-6">
        <div role="radiogroup" aria-label="How do you want to plan?" className="grid gap-3 sm:grid-cols-2">
          {optionCard("manual", <PinIcon size={16} />, "Plan it yourself", "Add places, build each day and reorder as you go.")}
          {optionCard("ai", <SparkleIcon size={16} />, "Plan a trip with AI", "Auto-fill an itinerary from your destinations, dates and interests.", "New")}
        </div>

        <section>
          <DestinationSearch selected={dests} onAdd={(p) => setDests((l) => l.some((x) => x.id === p.id) ? l : [...l, p])} error={submitted ? errors.dest : undefined} />
          {dests.length ? (
            <div className="mt-3 flex flex-wrap gap-2" aria-label="Selected destinations">
              {dests.map((d) => <Chip key={d.id} icon={<PinIcon size={12} />} className="!pr-8" onRemove={() => setDests((l) => l.filter((x) => x.id !== d.id))}>{d.name}</Chip>)}
            </div>
          ) : (
            <p className="mt-2 text-xs text-navy/55">No destinations yet. You can add as many as you like.</p>
          )}
        </section>

        <section>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <Label id="dates-label">Dates</Label>
            <label className="-mt-1.5 flex items-center gap-2 text-xs font-semibold text-navy">No dates yet<Toggle checked={noDates} onChange={(v) => { setNoDates(v); if (v) setCalOpen(false); }} label="" /></label>
          </div>
          <button type="button" aria-labelledby="dates-label" aria-expanded={calOpen} disabled={noDates} onClick={() => setCalOpen((o) => !o)}
            className={`flex w-full items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-left text-sm transition focus-visible:outline-2 focus-visible:outline-navy disabled:bg-surface disabled:text-navy/50 ${submitted && errors.dates ? "border-red-500" : "border-navy/15"} ${noDates || !range.start ? "text-navy/50" : "text-navy"}`}>
            <CalendarIcon size={16} />{dateLabel}
          </button>
          {submitted && errors.dates && <p role="alert" className="mt-1.5 text-xs text-red-600">{errors.dates}</p>}
          {calOpen && !noDates && <div className="mt-2"><DateRangePicker value={range} onChange={(r) => { setRange(r); if (r.end) setCalOpen(false); }} /></div>}
        </section>

        {mode === "ai" && (
          <section className="grid gap-4 rounded-xl bg-surface p-4 sm:grid-cols-2">
            <Input label="Interests (optional)" placeholder="Food, museums, hiking…" value={interests} onChange={(e) => setInterests(e.target.value)} />
            <Select label="Pace" value={pace} onChange={(e) => setPace(e.target.value)} options={[{ value: "relaxed", label: "Relaxed" }, { value: "balanced", label: "Balanced" }, { value: "packed", label: "Packed" }]} />
          </section>
        )}

        <section>
          <Label>Travelers</Label>
          <div className="flex gap-2">
            <Input className="flex-1" type="email" aria-label="Friend's email" placeholder="Add friends by email" value={email} error={emailErr}
              onChange={(e) => { setEmail(e.target.value); setEmailErr(undefined); }} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEmail(); } }} />
            <Button variant="secondary" onClick={addEmail} className="h-fit !py-3">Add</Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Chip icon={<Avatar name="You" size="sm" />}>You</Chip>
            {emails.map((m) => <Chip key={m} icon={<Avatar name={m} size="sm" />} className="!pr-8" onRemove={() => setEmails((l) => l.filter((x) => x !== m))}>{m}</Chip>)}
          </div>
          {!emails.length && <p className="mt-2 text-xs text-navy/55">Just you for now. Invite friends to plan together.</p>}
        </section>

        <section>
          <Label id="privacy-label">Who can see this trip?</Label>
          <div role="radiogroup" aria-labelledby="privacy-label" className="flex w-full rounded-full bg-surface p-1">
            {privacyOptions.map((o) => (
              <button key={o.id} type="button" role="radio" aria-checked={privacy === o.id} onClick={() => setPrivacy(o.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition ${privacy === o.id ? "bg-navy text-white shadow-card" : "text-navy/70 hover:text-navy"}`}>{o.icon}{o.label}</button>
            ))}
          </div>
          <p className="mt-2 text-xs text-navy/55" aria-live="polite">{privacyOptions.find((o) => o.id === privacy)?.hint}</p>
        </section>
      </div>
    </Modal>
  );
}

export default function PlanTripModal({ open, onClose, initial }: { open: boolean; onClose: () => void; initial?: Place }) {
  return open ? <Inner onClose={onClose} initial={initial} /> : null;
}
