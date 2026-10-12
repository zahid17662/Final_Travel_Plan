import type { ReactNode } from "react";

export type BadgeTone = "navy" | "soft" | "ocean" | "success" | "warning" | "danger";
const tones: Record<BadgeTone, string> = {
  navy: "bg-navy text-white",
  soft: "bg-navy/8 text-navy",
  ocean: "bg-ocean-100 text-navy",
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-700",
};

export default function Badge({ tone = "soft", children, className = "" }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${tones[tone]} ${className}`}>{children}</span>;
}
