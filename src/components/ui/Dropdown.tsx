import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDownIcon } from "./icons";

export type DropdownItem = { label: string; onSelect?: () => void; href?: string; icon?: ReactNode; danger?: boolean };

type Props = { label?: ReactNode; trigger?: ReactNode; items: DropdownItem[]; align?: "left" | "right"; className?: string };

export default function Dropdown({ label, trigger, items, align = "left", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}
        className={trigger ? "rounded-full" : "inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-semibold hover:bg-navy/5"}>
        {trigger ?? <>{label}<ChevronDownIcon size={14} /></>}
      </button>
      {open && (
        <ul role="menu" className={`absolute z-40 mt-2 min-w-48 overflow-hidden rounded-xl border border-navy/10 bg-white py-1.5 text-navy shadow-pop ${align === "right" ? "right-0" : "left-0"}`}>
          {items.map((it) => {
            const cls = `flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm hover:bg-navy/5 ${it.danger ? "text-red-600" : ""}`;
            const done = () => { it.onSelect?.(); setOpen(false); };
            return (
              <li key={it.label} role="none">
                {it.href ? <a role="menuitem" href={it.href} onClick={done} className={cls}>{it.icon}{it.label}</a>
                  : <button role="menuitem" type="button" onClick={done} className={cls}>{it.icon}{it.label}</button>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
