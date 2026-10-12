import { useSyncExternalStore } from "react";

export type NotifKind = "comment" | "invite" | "edit" | "trip" | "system";
export type Notif = { id: string; kind: NotifKind; title: string; body?: string; at: number; read: boolean; href?: string };

const KEY = "tp_notifs";
const m = 60_000, h = 60 * m, d = 24 * h;
const seed = (): Notif[] => {
  const n = Date.now();
  return [
    { id: "n1", kind: "comment", title: "Jon commented on Tower Bridge", body: "“Should we book the sunset slot or go in the morning?”", at: n - 12 * m, read: false, href: "#/trip/london-oct" },
    { id: "n2", kind: "invite", title: "Ana accepted your invite to Trip to London", at: n - 2 * h, read: false, href: "#/trip/london-oct" },
    { id: "n3", kind: "edit", title: "Theo added 3 places to Kyoto in spring", body: "Fushimi Inari Shrine, Nishiki Market and 1 more", at: n - 5 * h, read: false, href: "#/trip/kyoto-spring" },
    { id: "n4", kind: "comment", title: "Aiko replied to your comment", body: "“Perfect, I will reserve the tea house for Friday.”", at: n - 20 * h, read: true, href: "#/trip/kyoto-spring" },
    { id: "n5", kind: "trip", title: "Trip to London starts soon", body: "Check your reservations and download the trip for offline use.", at: n - 1 * d - 2 * h, read: false, href: "#/trip/london-oct" },
    { id: "n6", kind: "invite", title: "Priya invited you to Tokyo food crawl", body: "You can view and comment on this trip.", at: n - 2 * d, read: true, href: "#/trips" },
    { id: "n7", kind: "edit", title: "Jon updated the Day 2 itinerary in Trip to London", at: n - 3 * d, read: true, href: "#/trip/london-oct" },
    { id: "n8", kind: "system", title: "Welcome to Travel Plan", body: "Start by planning a trip or browsing guides for inspiration.", at: n - 9 * d, read: true, href: "#/home" },
  ];
};

let state: Notif[] = (() => { try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw) as Notif[]; } catch { /* ignore */ } return seed(); })();
const listeners = new Set<() => void>();
const commit = (next: Notif[]) => { state = next; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } listeners.forEach((l) => l()); };

export const useNotifications = () => useSyncExternalStore((cb) => { listeners.add(cb); return () => { listeners.delete(cb); }; }, () => state);
export const setRead = (id: string, read = true) => commit(state.map((n) => (n.id === id ? { ...n, read } : n)));
export const markAllRead = () => commit(state.map((n) => ({ ...n, read: true })));
export const removeNotif = (id: string) => commit(state.filter((n) => n.id !== id));
export const pushNotif = (n: Omit<Notif, "id" | "at" | "read">) => commit([{ ...n, id: Math.random().toString(36).slice(2), at: Date.now(), read: false }, ...state]);

export function timeAgo(at: number) {
  const s = Math.max(1, Math.round((Date.now() - at) / 1000));
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  const days = Math.round(s / 86400);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}
