import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Chip, Container, EmptyState, Input, Page, PlusIcon, Textarea, Toggle, TrashIcon, ArrowUpIcon, ArrowDownIcon, CloseIcon, useToast } from "../../components/ui";
import { coverSrc, deleteGuide, getGuide, gplace, newGuide, placeCount, upsertGuide } from "../../data/guidesStore";
import type { FullGuide, GSection } from "../../data/guidesStore";
import { uid } from "../planner/seed";

const topics = ["City", "Food", "Culture", "Nature", "Beach", "Road trip", "History", "Budget"];
const iconBtn = "grid h-8 w-8 place-items-center rounded-full text-navy/60 transition hover:bg-navy/5 hover:text-navy disabled:opacity-30";

function Editor({ initial, isNew }: { initial: FullGuide; isNew: boolean }) {
  const nav = useNavigate();
  const { show } = useToast();
  const [g, setG] = useState(initial);
  const [errs, setErrs] = useState<{ title?: string; publish?: string; cover?: string }>({});
  const [draftPlace, setDraftPlace] = useState<Record<string, string>>({});
  const file = useRef<HTMLInputElement>(null);
  const set = (p: Partial<FullGuide>) => setG((x) => ({ ...x, ...p }));
  const setSec = (id: string, f: (s: GSection) => GSection) => setG((x) => ({ ...x, sections: x.sections.map((s) => (s.id === id ? f(s) : s)) }));
  const move = (i: number, d: number) => setG((x) => { const a = [...x.sections]; const j = i + d; if (j < 0 || j >= a.length) return x; [a[i], a[j]] = [a[j], a[i]]; return { ...x, sections: a }; });

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; e.target.value = "";
    if (!f) return;
    if (!f.type.startsWith("image/")) return setErrs((x) => ({ ...x, cover: "Please choose an image file." }));
    if (f.size > 1_500_000) return setErrs((x) => ({ ...x, cover: "Image must be under 1.5 MB." }));
    const r = new FileReader();
    r.onload = () => { set({ cover: String(r.result) }); setErrs((x) => ({ ...x, cover: undefined })); };
    r.readAsDataURL(f);
  };
  const addPlace = (sid: string) => {
    const name = (draftPlace[sid] ?? "").trim(); if (!name) return;
    setSec(sid, (s) => ({ ...s, places: [...s.places, gplace(name)] })); setDraftPlace((d) => ({ ...d, [sid]: "" }));
  };

  const save = (publish: boolean) => {
    const e: typeof errs = {};
    if (!g.title.trim()) e.title = "Give your guide a title.";
    if (publish && placeCount(g) < 1) e.publish = "Add at least one place before publishing.";
    setErrs(e); if (e.title || e.publish) return;
    const clean = { ...g, title: g.title.trim(), published: publish, sections: g.sections.filter((s) => s.title.trim() || s.places.length).map((s) => ({ ...s, title: s.title.trim() || "Places" })) };
    upsertGuide(clean);
    show({ title: publish ? "Guide published" : "Draft saved", tone: "success" });
    nav(publish ? `/guide/${g.id}` : "/guides");
  };
  const remove = () => { if (confirm("Delete this guide? This can't be undone.")) { deleteGuide(g.id); nav("/guides"); } };

  return (
    <Container className="max-w-4xl py-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-navy/50"><Link to="/guides" className="hover:underline">Guides</Link> / {isNew ? "New" : "Edit"}</p>
      <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl md:text-6xl">{isNew ? "Write a guide" : "Edit guide"}</h1>

      <div className="mt-8 space-y-6">
        <section className="space-y-4 rounded-3xl bg-white p-5 shadow-card sm:p-6" aria-label="Basics">
          <Input label="Title" placeholder="e.g. Kyoto in 5 days" value={g.title} error={errs.title} onChange={(e) => set({ title: e.target.value })} />
          <Textarea label="Short description" rows={3} placeholder="What makes this guide worth reading?" value={g.blurb} onChange={(e) => set({ blurb: e.target.value })} />
          <Input label="Destination" placeholder="City, Country" value={g.destination} onChange={(e) => set({ destination: e.target.value })} />
          <div><p className="mb-1.5 text-xs font-bold">Topics</p><div className="flex flex-wrap gap-2">{topics.map((t) => <Chip key={t} selected={g.tags.includes(t)} onClick={() => set({ tags: g.tags.includes(t) ? g.tags.filter((x) => x !== t) : [...g.tags, t] })}>{t}</Chip>)}</div></div>
          <div>
            <p className="mb-1.5 text-xs font-bold">Cover photo</p>
            <div className="relative aspect-[16/7] overflow-hidden rounded-2xl border-2 border-dashed border-navy/15 bg-surface">
              {g.cover ? <img src={coverSrc(g.cover, 1200)} alt="Cover preview" className="h-full w-full object-cover" /> : (
                <button type="button" onClick={() => file.current?.click()} className="grid h-full w-full place-items-center text-sm font-semibold text-navy/60 hover:text-navy">
                  <span className="text-center"><span className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-white shadow-card"><PlusIcon size={18} /></span>Upload a cover image<span className="mt-1 block text-xs font-normal">JPG or PNG, up to 1.5 MB</span></span>
                </button>
              )}
              {g.cover && <div className="absolute right-3 top-3 flex gap-2"><Button size="sm" variant="secondary" onClick={() => file.current?.click()}>Replace</Button><Button size="sm" variant="secondary" onClick={() => set({ cover: "" })}>Remove</Button></div>}
            </div>
            <input ref={file} type="file" accept="image/*" className="sr-only" aria-label="Upload cover image" onChange={onFile} />
            {errs.cover && <p className="mt-1.5 text-xs text-red-600">{errs.cover}</p>}
          </div>
        </section>

        {g.sections.map((s, i) => (
          <section key={s.id} className="rounded-3xl bg-white p-5 shadow-card sm:p-6" aria-label={`Section ${i + 1}`}>
            <div className="flex items-end gap-2">
              <Input className="flex-1" label={`Section ${i + 1}`} placeholder="e.g. Temples at dawn" value={s.title} onChange={(e) => setSec(s.id, (x) => ({ ...x, title: e.target.value }))} />
              <button type="button" aria-label="Move section up" disabled={i === 0} onClick={() => move(i, -1)} className={iconBtn}><ArrowUpIcon size={16} /></button>
              <button type="button" aria-label="Move section down" disabled={i === g.sections.length - 1} onClick={() => move(i, 1)} className={iconBtn}><ArrowDownIcon size={16} /></button>
              <button type="button" aria-label="Delete section" disabled={g.sections.length === 1} onClick={() => setG((x) => ({ ...x, sections: x.sections.filter((y) => y.id !== s.id) }))} className={iconBtn}><TrashIcon size={16} /></button>
            </div>
            <ul className="mt-4 space-y-3">
              {s.places.map((p, pi) => (
                <li key={p.id} className="flex gap-3 rounded-2xl bg-surface p-3">
                  <span className="mt-2 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy text-[11px] font-bold text-white">{pi + 1}</span>
                  <div className="min-w-0 flex-1 space-y-2">
                    <Input aria-label="Place name" value={p.name} onChange={(e) => setSec(s.id, (x) => ({ ...x, places: x.places.map((y) => (y.id === p.id ? { ...y, name: e.target.value } : y)) }))} />
                    <Textarea aria-label="Note" rows={2} placeholder="Add a tip or note" value={p.note} onChange={(e) => setSec(s.id, (x) => ({ ...x, places: x.places.map((y) => (y.id === p.id ? { ...y, note: e.target.value } : y)) }))} />
                  </div>
                  <button type="button" aria-label={`Remove ${p.name}`} onClick={() => setSec(s.id, (x) => ({ ...x, places: x.places.filter((y) => y.id !== p.id) }))} className={`${iconBtn} mt-1`}><CloseIcon size={14} /></button>
                </li>
              ))}
            </ul>
            <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); addPlace(s.id); }}>
              <Input className="flex-1" aria-label="Add a place" placeholder="Add a place" value={draftPlace[s.id] ?? ""} onChange={(e) => setDraftPlace((d) => ({ ...d, [s.id]: e.target.value }))} />
              <Button type="submit" variant="secondary" icon={<PlusIcon size={16} />}>Add</Button>
            </form>
          </section>
        ))}
        <Button variant="secondary" icon={<PlusIcon size={16} />} onClick={() => setG((x) => ({ ...x, sections: [...x.sections, { id: uid(), title: "", places: [] }] }))}>Add section</Button>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-5 shadow-card sm:p-6" aria-label="Publish">
          <Toggle checked={g.published} onChange={(v) => set({ published: v })} label="Publish guide" description={g.published ? "Anyone can find and read this guide." : "Only you can see this draft."} />
          <div className="flex flex-wrap items-center gap-2">
            {!isNew && <Button variant="ghost" icon={<TrashIcon size={16} />} onClick={remove}>Delete</Button>}
            <Button variant="secondary" href="#/guides">Cancel</Button>
            <Button onClick={() => save(g.published)}>{g.published ? "Publish guide" : "Save draft"}</Button>
          </div>
          {errs.publish && <p role="alert" className="w-full text-xs text-red-600">{errs.publish}</p>}
        </section>
      </div>
    </Container>
  );
}

export default function GuideEditor() {
  const { id } = useParams();
  const existing = id ? getGuide(id) : undefined;
  const [fresh] = useState(newGuide);
  if (id && (!existing || !existing.mine)) return <Page><Container className="py-20"><EmptyState title="You can't edit this guide" description="Only guides you wrote can be edited." action={<Button href="#/guides">Back to guides</Button>} /></Container></Page>;
  return <Page><Editor key={existing?.id ?? fresh.id} initial={existing ?? fresh} isNew={!existing} /></Page>;
}
