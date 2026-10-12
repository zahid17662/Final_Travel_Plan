import { currentUser, loadTrips } from "./index";

export type Profile = { name: string; handle: string; bio: string; location: string; website: string; avatar: string; cover: string };
export type Settings = {
  email: string; twoFactor: boolean;
  nEmailReminders: boolean; nEmailComments: boolean; nEmailInvites: boolean; nEmailNews: boolean; nPushEdits: boolean; nPushComments: boolean; nPushDeals: boolean; digest: string;
  visibility: string; showMap: boolean; showTrips: boolean; showGuides: boolean; findByEmail: boolean; analytics: boolean;
  language: string; currency: string; dateFormat: string; weekStart: string;
  distance: string; temp: string; clock: string;
  connected: string[]; plan: string;
};

export const defaultProfile: Profile = { name: currentUser.name, handle: currentUser.handle, bio: "Collecting city breaks and slow mornings. Always planning the next trip.", location: "Lyon, France", website: "", avatar: "", cover: "" };
export const defaultSettings: Settings = {
  email: currentUser.email, twoFactor: false,
  nEmailReminders: true, nEmailComments: true, nEmailInvites: true, nEmailNews: false, nPushEdits: true, nPushComments: false, nPushDeals: false, digest: "weekly",
  visibility: "public", showMap: true, showTrips: true, showGuides: true, findByEmail: false, analytics: true,
  language: "en", currency: "usd", dateFormat: "mdy", weekStart: "sun",
  distance: "km", temp: "c", clock: "24",
  connected: ["google"], plan: "free",
};

const PK = "tp_profile", SK = "tp_settings", VK = "tp_visited";
const read = <T,>(k: string, d: T): T => { try { const r = localStorage.getItem(k); return r ? { ...d, ...JSON.parse(r) } : d; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };
export const loadProfile = () => read<Profile>(PK, defaultProfile);
export const saveProfile = (p: Profile) => write(PK, p);
export const loadSettings = () => read<Settings>(SK, defaultSettings);
export const saveSettings = (s: Settings) => write(SK, s);

const alias: Record<string, string> = { "United States": "United States of America", USA: "United States of America", UK: "United Kingdom" };
export const countryOfTrip = (destination: string) => { const c = destination.split(",").pop()?.trim() ?? ""; return alias[c] ?? c; };
export const tripCountries = () => Array.from(new Set(loadTrips().filter((t) => t.status === "past").map((t) => countryOfTrip(t.destination)).filter(Boolean)));
type Manual = { added: string[]; removed: string[] };
export const loadManual = (): Manual => { try { const r = localStorage.getItem(VK); return r ? (JSON.parse(r) as Manual) : { added: [], removed: [] }; } catch { return { added: [], removed: [] }; } };
export const visitedCountries = (): string[] => { const m = loadManual(); return Array.from(new Set([...tripCountries(), ...m.added])).filter((c) => !m.removed.includes(c)); };
export const toggleVisited = (name: string): string[] => {
  const m = loadManual(); const now = visitedCountries().includes(name);
  const next: Manual = now ? { added: m.added.filter((c) => c !== name), removed: tripCountries().includes(name) ? [...m.removed, name] : m.removed } : { added: [...m.added, name], removed: m.removed.filter((c) => c !== name) };
  write(VK, next); return visitedCountries();
};
