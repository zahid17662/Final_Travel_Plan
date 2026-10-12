import { Button, Container, EmptyState, Page, Skeleton, CardSkeleton, SearchIcon, PlusIcon, HeartIcon, Tabs } from "../../components/ui";
import { useState } from "react";
import { Hero, H2 } from "./bits";

function Big({ code, title, text, children }: { code: string; title: string; text: string; children: React.ReactNode }) {
  return (
    <Page loggedIn={false}>
      <Container className="py-16 text-center md:py-24">
        <svg viewBox="0 0 320 90" className="mx-auto h-24 w-auto text-ocean-300" aria-hidden="true"><path d="M5 70 C60 10 110 90 165 40 S265 20 315 60" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="3 9" strokeLinecap="round" /></svg>
        <p className="font-display text-[8rem] font-bold leading-none text-navy md:text-[12rem]" aria-hidden="true">{code}</p>
        <h1 className="-mt-2 font-display text-4xl font-bold uppercase md:text-5xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-navy/65">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
      </Container>
    </Page>
  );
}
export const NotFound = () => <Big code="404" title="This page took a detour" text="We could not find what you were looking for. It may have moved, or the link may be wrong."><Button href="#/home" size="lg">Back to home</Button><Button href="#/explore" size="lg" variant="secondary">Explore destinations</Button></Big>;
export const ServerError = () => <Big code="500" title="Something went wrong" text="Our servers hit turbulence. It is not you. Please try again in a moment."><Button size="lg" onClick={() => location.reload()}>Try again</Button><Button href="#/help#contact" size="lg" variant="secondary">Contact support</Button></Big>;

export function States() {
  const [t, setT] = useState("loading");
  return (
    <Page loggedIn={false}>
      <Hero eyebrow="Reference" title="Loading and empty states" />
      <Container className="space-y-10 py-12">
        <Tabs variant="pill" value={t} onChange={setT} items={[{ id: "loading", label: "Loading skeletons" }, { id: "empty", label: "Empty states" }]} />
        {t === "loading" ? (
          <div className="space-y-10">
            <section><H2>Cards</H2><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <CardSkeleton key={i} />)}</div></section>
            <section><H2>List and profile</H2><div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="space-y-4 rounded-3xl bg-white p-6 shadow-card" role="status" aria-label="Loading list">{[0, 1, 2, 3].map((i) => <div key={i} className="flex items-center gap-3"><Skeleton className="h-12 w-12" /><div className="flex-1 space-y-2"><Skeleton className="h-3 w-2/3" /><Skeleton className="h-3 w-1/3" /></div></div>)}</div>
              <div className="space-y-4 rounded-3xl bg-white p-6 shadow-card" role="status" aria-label="Loading profile"><div className="flex items-center gap-4"><Skeleton circle className="h-16 w-16" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-3 w-1/3" /></div></div><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-4/5" /><Skeleton className="h-10 w-32 !rounded-full" /></div></div></section>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <EmptyState title="No trips yet" description="Plan your first adventure and it will show up here." action={<Button icon={<PlusIcon size={14} />}>Plan new trip</Button>} />
            <EmptyState title="No results" description="Try a different search or clear your filters." action={<Button variant="secondary" icon={<SearchIcon size={14} />}>Clear filters</Button>} />
            <EmptyState title="No saved places" description="Tap the heart on any place to keep it here." action={<Button variant="secondary" icon={<HeartIcon size={14} />}>Explore places</Button>} />
            <EmptyState title="You're offline" description="Reconnect to sync your latest changes. Downloaded trips still work." action={<Button variant="secondary" onClick={() => location.reload()}>Retry</Button>} />
          </div>
        )}
      </Container>
    </Page>
  );
}
