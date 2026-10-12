import type { ReactNode } from "react";

export function TravelIllustration() {
  return (
    <svg viewBox="0 0 240 160" className="mx-auto h-36 w-auto" aria-hidden="true">
      <circle cx="120" cy="84" r="62" fill="#cfe6fb" />
      <path d="M0 132 C50 118 90 140 130 128 C170 116 210 138 240 126 V160 H0Z" fill="#1F2B5E" opacity="0.08" />
      <path d="M34 112 C60 70 96 120 124 82 S190 60 206 40" fill="none" stroke="#1F2B5E" strokeWidth="2.5" strokeDasharray="2 8" strokeLinecap="round" opacity="0.55" />
      <path d="M206 22c-7 0-12 5-12 12 0 9 12 22 12 22s12-13 12-22c0-7-5-12-12-12z" fill="#2b8fb5" />
      <circle cx="206" cy="34" r="4.5" fill="#fff" />
      <rect x="82" y="86" width="76" height="52" rx="10" fill="#1F2B5E" />
      <path d="M108 86v-8a6 6 0 0 1 6-6h12a6 6 0 0 1 6 6v8" fill="none" stroke="#1F2B5E" strokeWidth="5" strokeLinecap="round" />
      <rect x="96" y="86" width="7" height="52" fill="#fff" opacity="0.18" />
      <rect x="137" y="86" width="7" height="52" fill="#fff" opacity="0.18" />
      <circle cx="120" cy="112" r="6" fill="#cfe6fb" />
      <rect x="96" y="138" width="10" height="5" rx="2" fill="#1F2B5E" /><rect x="134" y="138" width="10" height="5" rx="2" fill="#1F2B5E" />
    </svg>
  );
}

export default function EmptyState({ title, description, action, illustration = <TravelIllustration /> }: { title: string; description?: string; action?: ReactNode; illustration?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-navy/15 bg-white px-6 py-14 text-center">
      {illustration}
      <h3 className="mt-6 text-xl font-extrabold tracking-tight">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-sm text-sm text-navy/60">{description}</p>}
      {action && <div className="mt-6 flex justify-center gap-3">{action}</div>}
    </div>
  );
}
