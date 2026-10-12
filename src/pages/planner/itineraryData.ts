import { hashPos } from "./seed";
import type { Place } from "./seed";

export type Kind = "attraction" | "restaurant" | "cafe" | "hotel" | "shopping" | "nightlife";
export const kinds: { id: Kind; label: string; category: string }[] = [
  { id: "attraction", label: "Attractions", category: "Attraction" },
  { id: "restaurant", label: "Restaurants", category: "Restaurant" },
  { id: "cafe", label: "Cafes", category: "Café" },
  { id: "hotel", label: "Hotels", category: "Hotel" },
  { id: "shopping", label: "Shopping", category: "Shopping" },
  { id: "nightlife", label: "Nightlife", category: "Nightlife" },
];

export const kindOf = (category: string): Kind => {
  const s = category.toLowerCase();
  if (/restaurant|food/.test(s)) return "restaurant";
  if (/caf|coffee/.test(s)) return "cafe";
  if (/hotel|lodg|stay/.test(s)) return "hotel";
  if (/shop|market/.test(s)) return "shopping";
  if (/night|bar/.test(s)) return "nightlife";
  return "attraction";
};

const pool = [
  "photo-1488646953014-85cb44e25828", "photo-1507525428034-b723cf961d3e", "photo-1507699622108-4be3abd695ad", "photo-1519092437326-bfd121eb53ae",
  "photo-1520250497591-112f2f40a3f4", "photo-1523906921802-b5d2d899e93b", "photo-1533105079780-92b9be482077", "photo-1539635278303-d4002c07eae3",
  "photo-1542990254-7174ee186dd1", "photo-1551882547-ff40c63fe5fa", "photo-1566073771259-6a8506099945", "photo-1569556420157-6030491766d1",
  "photo-1582719508461-905c673771fd", "photo-1587648415693-4a5362b2ce41", "photo-1637851058613-95f0d41c3c2f",
];
const h = (s: string) => { let n = 7; for (const c of s) n = (n * 33 + c.charCodeAt(0)) >>> 0; return n; };
export const photosFor = (name: string, n = 4) => Array.from({ length: n }, (_, i) => pool[(h(name) + i * 4) % pool.length]);
export const photoFor = (name: string) => photosFor(name, 1)[0];

export const hoursByKind: Record<Kind, string> = {
  attraction: "9:00 AM – 6:00 PM", restaurant: "12:00 PM – 10:30 PM", cafe: "7:30 AM – 5:00 PM",
  hotel: "Check-in from 3:00 PM", shopping: "10:00 AM – 8:00 PM", nightlife: "8:00 PM – 2:00 AM",
};
export const costByKind: Record<Kind, number> = { attraction: 20, restaurant: 35, cafe: 8, hotel: 140, shopping: 40, nightlife: 25 };
const blurb: Record<Kind, string> = {
  attraction: "A highlight that regularly tops visitors' lists. Go early to beat the crowds, and leave time to wander the surrounding streets.",
  restaurant: "Locally loved kitchen with a short, seasonal menu. Reservations are smart for dinner, especially on weekends.",
  cafe: "A relaxed spot for a slow coffee and something baked. Good for a mid-morning reset between sights.",
  hotel: "Comfortable base within easy reach of transit and the main sights, with a well-reviewed breakfast.",
  shopping: "Browse independent makers, local food and souvenirs you will not find at the airport.",
  nightlife: "A favorite after-dark address with a friendly crowd. Arrive before 10 PM to get a good seat.",
};
const reviewers = ["Priya N.", "Marco D.", "Hannah L.", "Sam O.", "Lucía R.", "Kenji T."];
const quotes = [
  "Worth every minute. Booked ahead and skipped the queue.", "Lovely atmosphere and friendly staff. We stayed longer than planned.",
  "Great value and easy to reach on foot from the centre.", "Busy at midday, but the early slot was calm and beautiful.",
  "A real highlight of our trip. Would happily go back.", "Solid pick. Not a hidden gem anymore, but still excellent.",
];
const streets = ["Rue de la Gare", "Market Street", "Harbour Road", "Old Bridge Lane", "Garden Avenue", "Station Square"];

export function placeInfo(name: string, category: string, city: string) {
  const k = kindOf(category); const s = h(name);
  return {
    kind: k, photos: photosFor(name, 4), desc: blurb[k], hours: hoursByKind[k],
    address: `${1 + (s % 98)} ${streets[s % streets.length]}, ${city}`,
    reviews: [0, 1, 2].map((i) => ({ author: reviewers[(s + i) % reviewers.length], rating: 4 + ((s + i) % 2 ? 1 : 0.5), text: quotes[(s + i * 2) % quotes.length] })),
  };
}

const names: Record<Kind, string[]> = {
  attraction: ["Old Town walking tour", "City history museum", "Riverside promenade", "Grand viewpoint"],
  restaurant: ["The Corner Table", "Harbour Fish House", "Trattoria Nonna", "Night Street Food Market"],
  cafe: ["Blue Door Coffee", "Slow Morning Roasters", "Pastry & Pages", "Garden Tea House"],
  hotel: ["Hotel Central", "The Grand Meridian", "Canal View Suites", "Nomad Boutique Hostel"],
  shopping: ["Artisan Market", "Vintage Lane", "Flagship Arcade", "Local Makers Co-op"],
  nightlife: ["Rooftop Sky Bar", "The Jazz Cellar", "Lantern Night Market", "Craft Beer Hall"],
};
export type Suggestion = { name: string; category: string; kind: Kind; rating: number; x: number; y: number };
export const suggestionsFor = (kind: Kind): Suggestion[] =>
  names[kind].map((name, i) => ({ name, kind, category: kinds.find((k) => k.id === kind)!.category, rating: 4.2 + ((h(name) % 6) / 10), ...hashPos(name + i) }));
export const allSuggestions = () => kinds.flatMap((k) => suggestionsFor(k.id));

export const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y) * 0.09;
export type Mode = "walk" | "transit" | "drive";
export const autoMode = (km: number): Mode => (km <= 1.5 ? "walk" : km <= 4 ? "transit" : "drive");
export const travelMinutes = (km: number, m: Mode) => Math.max(1, Math.round(m === "walk" ? km * 12 : m === "transit" ? 8 + km * 5 : 4 + km * 3));
export const modes: Mode[] = ["walk", "transit", "drive"];
export const pathLength = (ps: Place[]) => ps.slice(1).reduce((s, p, i) => s + dist(ps[i], p), 0);
export function optimizeOrder(ps: Place[]): Place[] {
  if (ps.length < 3) return ps;
  const left = ps.slice(1); const out = [ps[0]];
  while (left.length) {
    const last = out[out.length - 1];
    let bi = 0;
    left.forEach((p, i) => { if (dist(last, p) < dist(last, left[bi])) bi = i; });
    out.push(left.splice(bi, 1)[0]);
  }
  return out;
}
export const normalize = (ps: Place[]) => [...ps].sort((a, b) => (a.day ?? 1e9) - (b.day ?? 1e9));
