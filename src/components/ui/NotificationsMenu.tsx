import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { markAllRead, setRead, timeAgo, useNotifications } from "../../data/notifications";
import type { NotifKind } from "../../data/notifications";
import { BellIcon, CalendarIcon, CommentIcon, EditIcon, InfoIcon, UsersIcon } from "./icons";

export const kindMeta: Record<NotifKind, { icon: ReactNode; label: string }> = {
  comment: { icon: <CommentIcon size={16} />, label: "Comment" },
  invite: { icon: <UsersIcon size={16} />, label: "Invite" },
  edit: { icon: <EditIcon size={16} />, label: "Edit" },
  trip: { icon: <CalendarIcon size={16} />, label: "Trip" },
  system: { icon: <InfoIcon size={16} />, label: "Update" },
};

export default function NotificationsMenu() {
  const items = useNotifications();
  const unread = items.filter((n) => !n.read).length;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", down); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"} aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}
        className="relative grid h-8 w-8 place-items-center rounded-full hover:bg-navy/5"><BellIcon size={18} />
        {unread > 0 && <span aria-hidden className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-ocean-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">{unread}</span>}
      </button>
      {open && (
        <div role="region" aria-label="Notifications" className="fixed inset-x-3 top-16 z-50 overflow-hidden rounded-2xl border border-navy/10 bg-white text-navy shadow-pop sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[24rem]">
          <div className="flex items-center justify-between border-b border-navy/10 px-4 py-3"><h2 className="text-sm font-extrabold">Notifications</h2>
            <button type="button" disabled={!unread} onClick={markAllRead} className="text-xs font-semibold underline disabled:no-underline disabled:opacity-40">Mark all as read</button></div>
          {items.length ? (
            <ul className="max-h-[22rem] divide-y divide-navy/5 overflow-y-auto">
              {items.slice(0, 5).map((n) => (
                <li key={n.id}>
                  <a href={n.href ?? "#/notifications"} onClick={() => { setRead(n.id); setOpen(false); }} className={`flex gap-3 px-4 py-3 text-left hover:bg-navy/[0.04] ${n.read ? "" : "bg-ocean-100/40"}`}>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy/10 text-navy">{kindMeta[n.kind].icon}</span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-semibold leading-snug">{n.title}</span>{n.body && <span className="mt-0.5 block truncate text-xs text-navy/60">{n.body}</span>}<span className="mt-1 block text-[11px] font-semibold text-navy/45">{timeAgo(n.at)}</span></span>
                    {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ocean-500"><span className="sr-only">Unread</span></span>}
                  </a>
                </li>
              ))}
            </ul>
          ) : <p className="px-4 py-10 text-center text-sm text-navy/60">You are all caught up.</p>}
          <a href="#/notifications" onClick={() => setOpen(false)} className="block border-t border-navy/10 px-4 py-3 text-center text-sm font-bold hover:bg-navy/[0.04]">View all notifications</a>
        </div>
      )}
    </div>
  );
}
