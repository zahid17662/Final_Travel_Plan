import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ListIcon, Tooltip, useToast } from "../../components/ui";
import { ImageIcon } from "./glyphs";
import type { Doc } from "./seed";
import type { Set } from "./panes";

const allowed = new window.Set(["H1", "H2", "H3", "P", "DIV", "BR", "UL", "OL", "LI", "B", "STRONG", "I", "EM", "U", "BLOCKQUOTE", "IMG", "SPAN"]);
function clean(n: Node) {
  Array.from(n.childNodes).forEach((c) => {
    if (c.nodeType !== 1) return;
    const el = c as HTMLElement;
    if (["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED"].includes(el.tagName)) { el.remove(); return; }
    clean(el);
    if (!allowed.has(el.tagName)) { el.replaceWith(...Array.from(el.childNodes)); return; }
    const src = el.getAttribute("src");
    Array.from(el.attributes).forEach((a) => el.removeAttribute(a.name));
    if (el.tagName === "IMG") { if (src && /^(data:image\/(png|jpe?g|gif|webp);|https:\/\/)/.test(src)) { el.setAttribute("src", src); el.setAttribute("alt", ""); } else el.remove(); }
  });
}
const sanitize = (html: string) => { const d = new DOMParser().parseFromString(html, "text/html"); clean(d.body); return d.body.innerHTML; };
const legacy = (doc: Doc) => doc.notes.map((n) => { const p = document.createElement("p"); p.textContent = n.text; return p.outerHTML; }).join("");

async function shrink(file: File) {
  const bmp = await createImageBitmap(file); const s = Math.min(1, 900 / bmp.width);
  const c = document.createElement("canvas"); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height); return c.toDataURL("image/jpeg", 0.8);
}

function Btn({ label, active, onClick, children }: { label: string; active?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <Tooltip content={label} side="bottom">
      <button type="button" aria-label={label} aria-pressed={active} onMouseDown={(e) => e.preventDefault()} onClick={onClick}
        className={`grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm font-bold transition ${active ? "bg-navy text-white" : "text-navy/75 hover:bg-navy/5"}`}>{children}</button>
    </Tooltip>
  );
}

export default function Notes({ doc, set }: { doc: Doc; set: Set }) {
  const { show } = useToast();
  const ref = useRef<HTMLDivElement>(null);
  const range = useRef<Range | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const setRef = useRef(set); setRef.current = set;
  const [state, setState] = useState<"saved" | "saving">("saved");
  const [fmt, setFmt] = useState({ bold: false, italic: false, ul: false, ol: false, block: "" });

  const save = () => {
    const html = sanitize(ref.current?.innerHTML ?? "");
    setRef.current((d) => (d.richNotes === html ? d : { ...d, richNotes: html })); setState("saved");
  };
  const queue = () => { setState("saving"); window.clearTimeout(timer.current); timer.current = window.setTimeout(save, 600); };

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = sanitize(doc.richNotes ?? legacy(doc));
    document.execCommand("defaultParagraphSeparator", false, "p");
    return () => { window.clearTimeout(timer.current); if (ref.current) save(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const h = () => {
      const sel = window.getSelection(); if (!sel?.rangeCount || !ref.current?.contains(sel.anchorNode)) return;
      range.current = sel.getRangeAt(0).cloneRange();
      setFmt({ bold: document.queryCommandState("bold"), italic: document.queryCommandState("italic"), ul: document.queryCommandState("insertUnorderedList"), ol: document.queryCommandState("insertOrderedList"), block: document.queryCommandValue("formatBlock").toLowerCase() });
    };
    document.addEventListener("selectionchange", h); return () => document.removeEventListener("selectionchange", h);
  }, []);

  const run = (cmd: string, val?: string) => { ref.current?.focus(); document.execCommand(cmd, false, val); queue(); };
  const heading = (tag: "h1" | "h2") => run("formatBlock", fmt.block === tag ? "p" : tag);
  const onImage = async (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { show({ title: "Please choose an image file", tone: "error" }); return; }
    try {
      const url = await shrink(f); ref.current?.focus();
      if (range.current) { const s = window.getSelection(); s?.removeAllRanges(); s?.addRange(range.current); }
      document.execCommand("insertImage", false, url); queue();
    } catch { show({ title: "Couldn't add that image", tone: "error" }); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-extrabold tracking-tight">Notes</h2><span role="status" className="text-xs font-semibold text-navy/55">{state === "saving" ? "Saving…" : "Saved"}</span></div>
      <div className="rounded-2xl bg-white shadow-card focus-within:ring-2 focus-within:ring-navy/15">
        <div role="toolbar" aria-label="Text formatting" className="sticky top-12 z-10 flex flex-wrap items-center gap-1 rounded-t-2xl border-b border-navy/10 bg-white/95 px-2 py-1.5 backdrop-blur">
          <Btn label="Heading 1" active={fmt.block === "h1"} onClick={() => heading("h1")}>H1</Btn>
          <Btn label="Heading 2" active={fmt.block === "h2"} onClick={() => heading("h2")}>H2</Btn>
          <span aria-hidden className="mx-1 h-5 w-px bg-navy/15" />
          <Btn label="Bold" active={fmt.bold} onClick={() => run("bold")}><span className="font-extrabold">B</span></Btn>
          <Btn label="Italic" active={fmt.italic} onClick={() => run("italic")}><span className="italic">I</span></Btn>
          <span aria-hidden className="mx-1 h-5 w-px bg-navy/15" />
          <Btn label="Bulleted list" active={fmt.ul} onClick={() => run("insertUnorderedList")}><ListIcon size={16} /></Btn>
          <Btn label="Numbered list" active={fmt.ol} onClick={() => run("insertOrderedList")}>1.</Btn>
          <Btn label="Quote" active={fmt.block === "blockquote"} onClick={() => run("formatBlock", fmt.block === "blockquote" ? "p" : "blockquote")}>&ldquo;</Btn>
          <span aria-hidden className="mx-1 h-5 w-px bg-navy/15" />
          <Tooltip content="Insert image" side="bottom">
            <label className="grid h-9 min-w-9 cursor-pointer place-items-center rounded-lg px-2 text-navy/75 focus-within:outline-2 focus-within:outline-navy hover:bg-navy/5" onMouseDown={(e) => e.preventDefault()}>
              <ImageIcon size={17} /><span className="sr-only">Insert image</span>
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => { void onImage(e.target.files?.[0]); e.target.value = ""; }} />
            </label>
          </Tooltip>
        </div>
        <div ref={ref} contentEditable suppressContentEditableWarning role="textbox" aria-multiline aria-label="Trip notes" data-placeholder="Start writing. Use headings for days, bullets for ideas, and add photos of tickets or maps."
          onInput={queue} onBlur={() => { window.clearTimeout(timer.current); save(); }} className="rte px-5 py-4 sm:px-6"
          onPaste={(e) => { e.preventDefault(); document.execCommand("insertText", false, e.clipboardData.getData("text/plain")); }} />
      </div>
    </div>
  );
}
