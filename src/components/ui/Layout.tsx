import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { ToastProvider } from "./Toast";

type PageProps = { children: ReactNode; loggedIn?: boolean; activeHref?: string; user?: { name: string; image?: string } };

export function Page({ children, loggedIn = true, activeHref, user }: PageProps) {
  const { pathname } = useLocation();
  activeHref ??= `#${pathname}`;
  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-surface text-navy">
        <Navbar loggedIn={loggedIn} activeHref={activeHref} user={user} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ToastProvider>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export const PageContainer = Container;

export function SidebarLayout({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  return (
    <Container className="grid grid-cols-[minmax(0,1fr)] gap-6 py-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 lg:py-12">
      {sidebar}
      <div className="min-w-0">{children}</div>
    </Container>
  );
}

export function PageTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-navy/50">{eyebrow}</p>}
        <h1 className="mt-2 font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl md:text-7xl">{title}</h1>
      </div>
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">{children}</h2>
      {action}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white p-6 shadow-card ${className}`}>{children}</div>;
}
