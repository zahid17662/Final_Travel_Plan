import { useId } from "react";
import type { ReactElement, ReactNode } from "react";

export default function Tooltip({ content, children, side = "top" }: { content: ReactNode; children: ReactElement; side?: "top" | "bottom" }) {
  const id = useId();
  return (
    <span className="group/tip relative inline-flex" aria-describedby={id}>
      {children}
      <span id={id} role="tooltip"
        className={`pointer-events-none absolute left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-lg bg-navy px-2.5 py-1.5 text-[11px] font-semibold text-white opacity-0 shadow-pop transition group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 ${side === "top" ? "bottom-full mb-2" : "top-full mt-2"}`}>
        {content}
      </span>
    </span>
  );
}
