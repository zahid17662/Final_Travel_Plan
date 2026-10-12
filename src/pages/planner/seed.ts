import type { Trip } from "../../data";

export type Place = { id: string; name: string; category: string; note: string; x: number; y: number; rating?: number; day?: number; time?: string; cost?: number; photo?: string };
export type Reservation = { id: string; type: string; name: string; date: string; confirmation: string; start?: string; end?: string; files?: string[]; notes?: string };
export type Expense = { id: string; name: string; category: string; amount: number; currency?: string; paidBy?: string; split?: string[] };
export type Note = { id: string; text: string };
export type CheckItem = { id: string; text: string; done: boolean; group?: string };
export type Doc = {
  title: string; overview: string; days: number; budget: number;
  places: Place[]; reservations: Reservation[]; expenses: Expense[]; notes: Note[]; checklist: CheckItem[]; attachments: string[]; currency?: string; richNotes?: string;
};

export const uid = () => Math.random().toString(36).slice(2, 10);
export const hashPos = (s: string) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return { x: 16 + (h % 68), y: 18 + ((h >> 8) % 62) };
};

const p = (name: string, category: string, x: number, y: number, rating: number, note = "", day?: number): Place => ({ id: uid(), name, category, note, x, y, rating, day });

const presets: Record<string, () => Place[]> = {
  paris: () => [
    p("Eiffel Tower", "Landmark", 34, 58, 4.7, "Book summit tickets ahead.", 1),
    p("Louvre Museum", "Museum", 58, 40, 4.8, "Closed on Tuesdays.", 1),
    p("Montmartre", "Neighborhood", 66, 18, 4.6, "", 2),
    p("Seine River cruise", "Activity", 46, 52, 4.5, "Golden hour departure.", 2),
    p("Musée d'Orsay", "Museum", 50, 56, 4.7, ""),
    p("Café de Flore", "Café", 52, 64, 4.3, ""),
  ],
  london: () => [
    p("Tower Bridge", "Landmark", 72, 52, 4.7, "", 1),
    p("British Museum", "Museum", 42, 28, 4.8, "Free entry.", 1),
    p("Borough Market", "Food", 62, 58, 4.6, "Go hungry.", 2),
    p("Big Ben", "Landmark", 38, 62, 4.7, ""),
  ],
  kyoto: () => [
    p("Fushimi Inari Shrine", "Shrine", 66, 74, 4.8, "Go at sunrise.", 1),
    p("Kinkaku-ji", "Temple", 24, 22, 4.6, "", 2),
    p("Arashiyama Bamboo Grove", "Nature", 12, 44, 4.5, "", 2),
    p("Nishiki Market", "Food", 52, 46, 4.5, ""),
    p("Gion district", "Neighborhood", 62, 40, 4.6, ""),
  ],
  lisbon: () => [
    p("Alfama", "Neighborhood", 60, 44, 4.6, "", 1),
    p("Belém Tower", "Landmark", 16, 66, 4.5, "", 2),
    p("LX Factory", "Shopping", 26, 56, 4.4, ""),
  ],
};

const reservationSeed = (t: Trip): Reservation[] =>
  t.status === "draft" ? [] : [
    { id: uid(), type: "Flight", name: "JFK → " + (t.destination.split(",")[0]), date: "Day before departure, 18:40", confirmation: "K8D2LQ" },
    { id: uid(), type: "Hotel", name: `Stay in ${t.destination.split(",")[0]}`, date: t.dates, confirmation: "HX-44921" },
  ];

export function seedDoc(t: Trip): Doc {
  const city = t.destination.split(",")[0].trim().toLowerCase();
  const places = t.status === "draft" ? [] : (presets[city]?.() ?? [p("Old town walk", "Neighborhood", 40, 40, 4.5), p("Central market", "Food", 60, 55, 4.4), p("Best viewpoint", "Viewpoint", 30, 65, 4.6)]);
  return {
    title: t.title, overview: "", days: 4, budget: t.status === "draft" ? 0 : 1800, places, reservations: reservationSeed(t), attachments: [],
    expenses: t.status === "draft" ? [] : [{ id: uid(), name: "Flights", category: "Transport", amount: 640 }, { id: uid(), name: "Hotel deposit", category: "Lodging", amount: 280 }],
    notes: [],
    checklist: ([["Passport and visas", "Documents", 1], ["Travel insurance", "Documents"], ["Printed bookings", "Documents"], ["Chargers and adapters", "Packing"], ["Toiletries", "Packing"], ["Weather-appropriate clothes", "Packing"], ["Comfortable walking shoes", "Packing"], ["Notify your bank", "Before leaving"], ["Download offline maps", "Before leaving"], ["Set an out-of-office reply", "Before leaving"]] as [string, string, number?][])
      .map(([text, group, d]) => ({ id: uid(), text, group, done: !!d && t.status !== "draft" })),
  };
}

export const nearbyIdeas = ["Local café", "Riverside walk", "Street market", "Rooftop bar"];
export const categories = ["Transport", "Lodging", "Food", "Activities", "Shopping", "Other"];
