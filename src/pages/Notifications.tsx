import { useState } from "react";
import { Button, Container, EmptyState, Page, PageTitle, Tabs } from "../components/ui";
import { kindMeta } from "../components/ui/NotificationsMenu";
import { markAllRead, removeNotif, setRead, timeAgo, useNotifications } from "../data/notifications";
import type { Notif } from "../data/notifications";

const bucket = (at: number) => { const d = (Date.now() - at) / 86_400_000; return d < 1 ? "Today" : d < 7 ? "This week" : "Earlier"; };

export default function Notifications() {
  const all = useNotifications();
  const [tab, setTab] = useState("all");
  const unread = all.filter((n) => !n.read).length;
  const filter: Record<string, (n: Notif) => boolean> = { all: () => true, unread: (n) => !n.read, comment: (n) => n.kind === "comment", invite: (n) => n.kind === "invite" };
  const list = all.filter(filter[tab]);
  const groups = ["Today", "This week", "Earlier"].map((g) => [g, list.filter((n) => bucket(n.at) === g)] as const).filter(([, l]) => l.length);
  return (
    <Page>
      <Container className="max-w-3xl py-10 md:py-14">
        <PageTitle eyebrow="Inbox" title="Notifications">
          <Button variant="secondary" size="sm" disabled={!unread} onClick={markAllRead}>Mark all as read</Button>
        </PageTitle>
        <div className="mb-6 mt-6 overflow-x-auto">
          <Tabs value={tab} onChange={setTab} items={[{ id: "all", label: "All", count: all.length }, { id: "unread", label: "Unread", count: unread }, { id: "comment", label: "Comments" }, { id: "invite", label: "Invites" }]} />
        </div>
        {groups.length ? groups.map(([g, items]) => (
          <section key={g} aria-label={g} className="mb-8">
            <h2 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-navy/55">{g}</h2>
            <ul className="space-y-2">
              {items.map((n) => (
                <li key={n.id} className={`flex items-start gap-3 rounded-2xl p-4 shadow-card ${n.read ? "bg-white" : "bg-white ring-2 ring-ocean-500/40"}`}>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy/10">{kindMeta[n.kind].icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-snug">{!n.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-ocean-500 align-middle"><span className="sr-only">Unread</span></span>}{n.title}</p>
                    {n.body && <p className="mt-1 text-sm text-navy/70">{n.body}</p>}
                    <p className="mt-1.5 text-xs font-semibold text-navy/50">{kindMeta[n.kind].label} · {timeAgo(n.at)}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {n.href && <Button size="sm" href={n.href} onClick={() => setRead(n.id)}>View</Button>}
                      <Button size="sm" variant="ghost" onClick={() => setRead(n.id, !n.read)}>{n.read ? "Mark as unread" : "Mark as read"}</Button>
                      <Button size="sm" variant="ghost" onClick={() => removeNotif(n.id)}>Delete</Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )) : <EmptyState title={tab === "unread" ? "You are all caught up" : "Nothing here yet"} description={tab === "unread" ? "No unread notifications." : "Comments, invites and trip updates will show up here."} />}
      </Container>
    </Page>
  );
}
