import type { ReactNode } from "react";

export function Hero({ eyebrow, title, children, tall = false }: { eyebrow: string; title: string; children?: ReactNode; tall?: boolean }) {
  return (
    <section className={`mx-3 mt-3 rounded-2xl bg-navy text-white md:mx-6 ${tall ? "py-16 md:py-24" : "py-12 md:py-16"}`}>
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">{eyebrow}</p>
        <h1 className="mx-auto mt-2 max-w-3xl font-display text-5xl font-bold uppercase leading-[1.02] md:text-7xl">{title}</h1>
        {children}
      </div>
    </section>
  );
}

export const H2 = ({ children, id }: { children: ReactNode; id?: string }) => (
  <h2 id={id} className="font-display text-3xl uppercase tracking-wide md:text-4xl">{children}</h2>
);
