import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { CloseIcon } from "./icons";

type Props = { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; size?: "md" | "lg" };

export default function Modal({ open, onClose, title, children, footer, size = "md" }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="tp-fade absolute inset-0 bg-navy-900/70 backdrop-blur-sm" onClick={onClose} />
      <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}
        className={`tp-pop relative flex max-h-[calc(100dvh-2rem)] w-full flex-col rounded-2xl bg-white p-5 text-navy shadow-pop outline-none sm:p-7 ${size === "lg" ? "max-w-2xl" : "max-w-lg"}`}>
        <div className="flex shrink-0 items-start justify-between gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-navy/5 active:bg-navy/10"><CloseIcon /></button>
        </div>
        <div className="-mx-2 mt-4 flex-1 overflow-y-auto px-2 text-sm text-navy/75">{children}</div>
        {footer && <div className="mt-5 flex shrink-0 flex-wrap items-center justify-end gap-3 sm:mt-7">{footer}</div>}
      </div>
    </div>
  );
}
