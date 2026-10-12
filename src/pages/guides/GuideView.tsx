import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar, Badge, Button, Container, EmptyState, EyeIcon, HeartIcon, Page, PinIcon, ShareIcon, Textarea, useToast, EditIcon } from "../../components/ui";
import { addComment, coverSrc, getGuide, loadComments, loadState, placeCount, toggleState } from "../../data/guidesStore";
import type { FullGuide } from "../../data/guidesStore";
import { currentUser, saveTrip } from "../../data";
import { uid } from "../planner/seed";
import type { Doc } from "../planner/seed";
import GuideMap from "./GuideMap";

const BookmarkIcon = ({ filled }: { filled?: boolean }) => <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4z" /></svg>;
const ago = (t: number) => { const d = Math.max(1, Math.round((Date.now() - t) / 86400000)); return d < 2 ? "today" : d < 30 ? `${d} days ago` : new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); };

function Body({ g }: { g: FullGuide }) {
  const { show } = useToast();
  const nav = useNavigate();
  const [st, setSt] = useState(loadState);
  const [sel, setSel] = useState<string>();
  const [comments, setComments] = useState(() => loadComments(g.id));
  const [text, setText] = useState("");
  const liked = st.liked.includes(g.id), saved = st.saved.includes(g.id);
  const pins = useMemo(() => g.sections.flatMap((s) => s.places), [g]);
  const n = placeCount(g);

  const share = async () => {
    try { await navigator.clipboard.writeText(location.href); } catch { /* ignore */ }
    show({ title: "Link copied", tone: "success" });
  };
  const useGuide = () => {
    const id = `guide-${uid()}`; const city = g.destination.split(",")[0] || "Trip";
    saveTrip({ id, title: `${city} trip`, dates: "Dates not set", places: `${n} places`, photo: g.cover.startsWith("data:") ? "photo-1488646953014-85cb44e25828" : g.cover, destination: g.destination || city, status: "draft", privacy: "Private", collaborators: [currentUser.name.split(" ")[0]] });
    const doc: Doc = { title: `${city} trip`, overview: `Based on "${g.title}" by ${g.author}.`, days: Math.max(1, g.sections.length), budget: 0, reservations: [], expenses: [], notes: [], checklist: [], attachments: [],
      places: g.sections.flatMap((s, i) => s.places.map((p) => ({ id: uid(), name: p.name, category: "Place", note: p.note, x: p.x, y: p.y, day: i + 1, photo: p.photo }))) };
    try { localStorage.setItem(`tp_plan_${id}`, JSON.stringify(doc)); } catch { /* ignore */ }
    show({ title: "Guide added to a new trip", description: `${n} places imported`, tone: "success" }); nav(`/trip/${id}`);
  };
  const post = () => { const t = text.trim(); if (!t) return; addComment(g.id, t); setComments(loadComments(g.id)); setText(""); };
  let idx = 0;

  return (
    <>
      <section className="relative isolate overflow-hidden bg-navy-900 text-white">
        {g.cover && <img src={coverSrc(g.cover, 1800)} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-80" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900 via-navy-900/40 to-navy-900/10" />
        <Container className="flex min-h-[22rem] flex-col justify-end pb-10 pt-20 md:min-h-[30rem]">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-white/75"><Link to="/guides" className="hover:underline">Guides</Link> / {g.destination || "Guide"}</nav>
          <div className="mt-3 flex flex-wrap gap-2">{!g.published && <Badge tone="navy">Draft</Badge>}{g.tags.map((t) => <Badge key={t} tone="ocean">{t}</Badge>)}</div>
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-bold uppercase leading-[1] tracking-wide md:text-8xl">{g.title}</h1>
          <p className="mt-3 max-w-xl text-sm text-white/85">{g.blurb}</p>
        </Container>
      </section>

      <Container className="py-8">
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-3xl bg-white p-4 shadow-card">
          <Avatar name={g.author} size="lg" />
          <div className="min-w-0 flex-1"><p className="text-sm font-extrabold">{g.author}</p><p className="truncate text-xs text-navy/60">{g.authorBio}</p>
            <p className="mt-0.5 flex flex-wrap gap-x-3 text-[11px] font-semibold text-navy/55"><span><PinIcon size={11} /> {n} places</span><span><EyeIcon size={11} /> {g.views.toLocaleString()} views</span><span>Updated {ago(g.updated)}</span></p></div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant={liked ? "primary" : "secondary"} size="sm" aria-pressed={liked} icon={<HeartIcon size={14} />} onClick={() => setSt(toggleState("liked", g.id))}>{g.likes + (liked ? 1 : 0)}<span className="sr-only"> likes</span></Button>
            <Button variant={saved ? "primary" : "secondary"} size="sm" aria-pressed={saved} icon={<BookmarkIcon filled={saved} />} onClick={() => setSt(toggleState("saved", g.id))}>{saved ? "Saved" : "Save"} · {g.saves + (saved ? 1 : 0)}</Button>
            <Button variant="secondary" size="sm" icon={<ShareIcon size={14} />} onClick={share}>Share</Button>
            {g.mine && <Button variant="secondary" size="sm" icon={<EditIcon size={14} />} href={`#/guide/${g.id}/edit`}>Edit</Button>}
            <Button onClick={useGuide} disabled={!n}>Use this guide in my trip</Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_26rem]">
          <div className="space-y-10">
            {g.sections.map((s) => (
              <section key={s.id} aria-label={s.title}>
                <h2 className="mb-4 font-display text-3xl uppercase tracking-wide">{s.title || "Untitled section"}</h2>
                <ol className="space-y-3">
                  {s.places.map((p) => { idx += 1; return (
                    <li key={p.id}>
                      <button type="button" onClick={() => setSel(p.id)} className={`flex w-full gap-4 rounded-3xl bg-white p-3 text-left shadow-card transition hover:shadow-pop ${sel === p.id ? "ring-2 ring-ocean-500" : ""}`}>
                        <span className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-ocean-100 sm:h-28 sm:w-32">
                          {p.photo && <img src={coverSrc(p.photo, 400)} alt="" loading="lazy" className="h-full w-full object-cover" />}
                          <span className="absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-navy text-[11px] font-bold text-white ring-2 ring-white">{idx}</span>
                        </span>
                        <span className="min-w-0 flex-1 py-1"><span className="block text-base font-bold">{p.name}</span>{p.note && <span className="mt-1 block text-sm text-navy/70">{p.note}</span>}</span>
                      </button>
                    </li>
                  ); })}
                </ol>
                {!s.places.length && <p className="text-sm text-navy/55">No places in this section yet.</p>}
              </section>
            ))}

            <section aria-labelledby="cm" className="rounded-3xl bg-white p-5 shadow-card sm:p-6">
              <h2 id="cm" className="font-display text-3xl uppercase tracking-wide">Comments <span className="text-navy/40">{comments.length}</span></h2>
              <div className="mt-4 flex gap-3"><Avatar name={currentUser.name} /><div className="min-w-0 flex-1">
                <Textarea aria-label="Add a comment" rows={2} placeholder="Ask a question or share a tip" value={text} onChange={(e) => setText(e.target.value)} />
                <div className="mt-2 flex justify-end"><Button size="sm" onClick={post} disabled={!text.trim()}>Post comment</Button></div></div></div>
              <ul className="mt-4 space-y-4">
                {comments.map((c) => (
                  <li key={c.id} className="flex gap-3"><Avatar name={c.name} /><div className="min-w-0 flex-1 rounded-2xl bg-surface px-4 py-3"><p className="text-xs font-bold">{c.name} <span className="font-normal text-navy/50">· {ago(c.at)}</span></p><p className="mt-1 text-sm">{c.text}</p></div></li>
                ))}
                {!comments.length && <li className="text-sm text-navy/55">No comments yet. Be the first.</li>}
              </ul>
            </section>
          </div>
          <aside aria-label="Map" className="h-[22rem] lg:sticky lg:top-6 lg:h-[34rem]"><GuideMap pins={pins} selected={sel} onSelect={setSel} label={g.destination || "Map"} /></aside>
        </div>
      </Container>
    </>
  );
}

export default function GuideView() {
  const { id } = useParams();
  const found = getGuide(id);
  const g = found && (found.published || found.mine) ? found : undefined;
  if (!g) return <Page loggedIn={false}><Container className="py-20"><EmptyState title="We couldn't find that guide" description="It may have been unpublished or deleted." action={<Button href="#/guides">Browse guides</Button>} /></Container></Page>;
  return <Page loggedIn={false}><Body g={g} /></Page>;
}
