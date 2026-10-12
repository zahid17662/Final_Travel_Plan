import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Button, CommentIcon } from "../../components/ui";
import { timeAgo } from "../../data/notifications";
import { currentUser } from "../../data";
import { colorFor, firstName } from "./collab";
import { uid } from "./seed";

export type Reply = { id: string; author: string; text: string; at: number };
export type Comment = Reply & { placeId: string; replies: Reply[] };
type Ctx = { enabled: boolean; forPlace: (id: string) => Comment[]; count: (id: string) => number; add: (id: string, text: string) => void; reply: (cid: string, text: string) => void };
const C = createContext<Ctx | null>(null);
export const useComments = () => { const c = useContext(C); if (!c) throw new Error("CommentsProvider missing"); return c; };

export function CommentsProvider({ tripId, seed, enabled = true, children }: { tripId: string; enabled?: boolean; seed?: { placeId: string; place: string; by: string; replyBy: string }; children: ReactNode }) {
  const key = `tp_comments_${tripId}`;
  const [list, setList] = useState<Comment[]>(() => {
    try { const raw = localStorage.getItem(key); if (raw) return JSON.parse(raw) as Comment[]; } catch { /* ignore */ }
    if (!seed) return [];
    const n = Date.now();
    return [{ id: uid(), placeId: seed.placeId, author: seed.by, at: n - 3_600_000, text: `Should we book ${seed.place} ahead or just turn up?`, replies: [{ id: uid(), author: seed.replyBy, at: n - 1_800_000, text: "Booking ahead is safer, it sells out on weekends." }] }];
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(list)); } catch { /* ignore */ } }, [list, key]);
  const add = useCallback((placeId: string, text: string) => setList((l) => [...l, { id: uid(), placeId, author: currentUser.name, at: Date.now(), text, replies: [] }]), []);
  const reply = useCallback((cid: string, text: string) => setList((l) => l.map((c) => (c.id === cid ? { ...c, replies: [...c.replies, { id: uid(), author: currentUser.name, at: Date.now(), text }] } : c))), []);
  const forPlace = useCallback((id: string) => list.filter((c) => c.placeId === id), [list]);
  const count = useCallback((id: string) => list.filter((c) => c.placeId === id).reduce((s, c) => s + 1 + c.replies.length, 0), [list]);
  return <C.Provider value={{ enabled, forPlace, count, add, reply }}>{children}</C.Provider>;
}

export const Dot = ({ name, size = 28 }: { name: string; size?: number }) => (
  <span role="img" aria-label={name} className="grid shrink-0 place-items-center rounded-full font-bold text-white" style={{ background: colorFor(name), width: size, height: size, fontSize: size * 0.42 }}>{name.trim().charAt(0).toUpperCase()}</span>
);

export function CommentButton({ placeId, name, open, onClick }: { placeId: string; name: string; open: boolean; onClick: () => void }) {
  const { count, enabled } = useComments(); const n = count(placeId);
  if (!enabled) return null;
  return (
    <button type="button" aria-expanded={open} aria-label={`Comments on ${name}, ${n}`} onClick={onClick}
      className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition ${open ? "bg-navy text-white" : "bg-surface text-navy/75 hover:bg-navy/10"}`}>
      <CommentIcon size={14} />{n > 0 ? n : "Comment"}
    </button>
  );
}

function Box({ placeholder, label, onSubmit, small }: { placeholder: string; label: string; onSubmit: (t: string) => void; small?: boolean }) {
  const [t, setT] = useState("");
  const send = () => { if (t.trim()) { onSubmit(t.trim()); setT(""); } };
  return (
    <div className="flex gap-2">
      <input aria-label={label} value={t} placeholder={placeholder} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }}
        className={`min-w-0 flex-1 rounded-full border border-navy/15 bg-white px-4 text-sm outline-none focus:border-navy ${small ? "h-9" : "h-10"}`} />
      <Button size="sm" onClick={send} disabled={!t.trim()}>{small ? "Reply" : "Post"}</Button>
    </div>
  );
}

export function CommentThread({ placeId, name }: { placeId: string; name: string }) {
  const { forPlace, add, reply } = useComments();
  const [replying, setReplying] = useState<string>();
  const threads = forPlace(placeId);
  const Msg = ({ r }: { r: Reply }) => (
    <div className="flex gap-2.5"><Dot name={r.author} size={26} />
      <div className="min-w-0 flex-1"><p className="text-xs"><strong>{r.author === currentUser.name ? "You" : firstName(r.author)}</strong> <span className="text-navy/50">· {timeAgo(r.at)}</span></p><p className="mt-0.5 break-words text-sm">{r.text}</p></div></div>
  );
  return (
    <div className="mt-3 space-y-4 rounded-xl bg-surface p-3" role="group" aria-label={`Comments on ${name}`}>
      {threads.length === 0 && <p className="text-xs text-navy/55">No comments yet. Start the conversation.</p>}
      {threads.map((c) => (
        <div key={c.id} className="space-y-3">
          <Msg r={c} />
          {c.replies.length > 0 && <div className="ml-3 space-y-3 border-l-2 border-navy/10 pl-4">{c.replies.map((r) => <Msg key={r.id} r={r} />)}</div>}
          {replying === c.id
            ? <div className="ml-3 pl-4"><Box small label={`Reply to ${firstName(c.author)}`} placeholder={`Reply to ${firstName(c.author)}…`} onSubmit={(t) => { reply(c.id, t); setReplying(undefined); }} /></div>
            : <button type="button" onClick={() => setReplying(c.id)} className="ml-3 pl-4 text-xs font-semibold text-navy/65 underline hover:text-navy">Reply</button>}
        </div>
      ))}
      <Box label={`Add a comment on ${name}`} placeholder="Add a comment…" onSubmit={(t) => add(placeId, t)} />
    </div>
  );
}
