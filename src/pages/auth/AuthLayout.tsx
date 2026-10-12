import type { ReactNode } from "react";
import { Logo, ToastProvider, unsplash } from "../../components/ui";

type Props = { headline: string; tagline: string; children: ReactNode; photo?: string };

export default function AuthLayout({ headline, tagline, children, photo = "photo-1507525428034-b723cf961d3e" }: Props) {
  return (
    <ToastProvider>
      <div className="grid min-h-screen bg-white text-navy lg:grid-cols-[1.05fr_1fr]">
        <aside className="relative isolate flex h-56 flex-col justify-between overflow-hidden bg-navy p-6 text-white sm:h-72 lg:sticky lg:top-0 lg:h-screen lg:p-12">
          <img src={unsplash(photo, 1600)} alt="Turquoise ocean meeting a pale sand beach" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/90 via-navy/35 to-navy/50" />
          <div className="self-start"><Logo overlay inline /></div>
          <div>
            <h1 className="font-display text-[clamp(2.75rem,9vw,7.5rem)] font-bold uppercase leading-[0.95]">{headline}</h1>
            <p className="mt-3 max-w-sm text-sm text-white/85 lg:mt-5 lg:text-base">{tagline}</p>
          </div>
        </aside>
        <main className="flex items-start justify-center px-5 py-10 sm:px-10 lg:items-center lg:py-12">
          <div className="w-full max-w-md">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
