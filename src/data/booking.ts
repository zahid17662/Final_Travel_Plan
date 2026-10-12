export type Deal = { site: string; price: number; perks?: string };
export type HotelReview = { name: string; score: number; text: string; date: string };
export type HotelX = {
  id: string; name: string; city: string; country: string; area: string; stars: number; rating: number; reviews: number; price: number;
  photos: string[]; amenities: string[]; desc: string; x: number; y: number; deals: Deal[]; review: HotelReview[];
};

export const amenityList = ["Free Wi-Fi", "Breakfast included", "Pool", "Spa", "Gym", "Free cancellation", "Pet friendly", "Air conditioning", "Airport shuttle", "Bar"];
const photoPool = ["photo-1566073771259-6a8506099945", "photo-1551882547-ff40c63fe5fa", "photo-1582719508461-905c673771fd", "photo-1520250497591-112f2f40a3f4", "photo-1445019980597-93fa8acb246c", "photo-1542314831-068cd1dbfeeb", "photo-1564501049412-61c2a3083791", "photo-1571896349842-33c89424de2d", "photo-1590490360182-c33d57733427", "photo-1578683010236-d716f9a3f461", "photo-1455587734955-081b22074882", "photo-1618773928121-c32242e63f39"];
export const hotelPhoto = (id: string, w = 900) => `https://images.unsplash.com/${id}?w=${w}&q=80&fit=crop`;

const hash = (s: string) => { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; };
const rnd = (seed: string, i = 0) => (hash(seed + i) % 1000) / 1000;

const base: [string, string, string, [string, string, number, number, string][]][] = [
  ["Paris", "France", "paris", [["Maison Seine", "Le Marais", 4, 189, "Boutique hotel in a 17th-century townhouse steps from the Place des Vosges."], ["Hotel Lumiere", "Saint-Germain", 5, 342, "Elegant rooms, a hidden courtyard and a bar loved by locals."], ["Canal Nine", "Canal Saint-Martin", 3, 124, "Bright, design-led rooms on the quietest stretch of the canal."], ["Gare du Nord Stay", "10th arr.", 2, 89, "Simple, clean and a two-minute walk from the Eurostar."]]],
  ["London", "United Kingdom", "london", [["The Larkspur", "Covent Garden", 4, 226, "Theatre-district hotel with a rooftop terrace and afternoon tea."], ["Thames House", "South Bank", 5, 395, "Riverside suites with views of the Houses of Parliament."], ["Shoreditch Yard", "Shoreditch", 3, 138, "Industrial-chic rooms above a well-known coffee roastery."], ["Paddington Lodge", "Paddington", 2, 96, "Compact rooms near the Heathrow Express."]]],
  ["Kyoto", "Japan", "kyoto", [["Kamo River Inn", "Higashiyama", 4, 142, "Tatami rooms facing the Kamo River with onsen-style baths."], ["Gion Ryokan Sora", "Gion", 5, 410, "A traditional ryokan with kaiseki dinners and private gardens."], ["Station Capsule", "Kyoto Station", 2, 48, "Efficient and tidy base for day trips."], ["Arashiyama Retreat", "Arashiyama", 4, 205, "Quiet riverside stay beside the bamboo grove."]]],
  ["Lisbon", "Portugal", "lisbon", [["Alfama Terrace", "Alfama", 3, 118, "Whitewashed rooms with terraces over the red rooftops."], ["Baixa Grand", "Baixa", 4, 164, "Historic building on Rua Augusta with a rooftop pool."], ["Bairro Alto House", "Bairro Alto", 3, 102, "Lively area, lively rooms. Earplugs provided."], ["Belem Garden Hotel", "Belem", 5, 276, "Calm, leafy and a stroll from the tower."]]],
  ["New York", "United States", "new-york", [["Midtown Standard", "Midtown", 3, 215, "Central rooms and an easy walk to Broadway."], ["Hudson Row Hotel", "Hudson Yards", 5, 460, "Skyline views, a spa and a rooftop bar."], ["Williamsburg Loft", "Williamsburg", 4, 238, "Waterfront hotel across the river from Manhattan."], ["Lower East Inn", "Lower East Side", 3, 172, "Tiny rooms, big neighbourhood."]]],
  ["Amalfi Coast", "Italy", "amalfi", [["Blue Cove Resort", "Positano", 5, 310, "Cliffside resort with infinity pool and sea views."], ["Casa Limone", "Amalfi", 4, 214, "Family-run hotel surrounded by lemon groves."], ["Praiano Sunset", "Praiano", 4, 188, "Terraces built for aperitivo."], ["Ravello Garden", "Ravello", 4, 232, "Quiet hillside stay with gardens and sea panoramas."]]],
];

const siteNames = ["Booking.com", "Expedia", "Hotels.com", "Agoda", "Official site"];
const reviewers = [["Jon W.", "Spotless room and a fantastic breakfast. Staff went out of their way."], ["Ana R.", "Great location. A bit noisy at night but we would stay again."], ["Theo P.", "Good value for the area. The bed was very comfortable."], ["Aiko T.", "Beautiful building and a lovely welcome."]];

export const hotelsX: HotelX[] = base.flatMap(([city, country, slug, list]) => list.map(([name, area, stars, price, desc], i) => {
  const id = `${slug}-${i + 1}`;
  const photos = [0, 1, 2, 3].map((k) => photoPool[(hash(id) + k * 3) % photoPool.length]);
  const amenities = amenityList.filter((_, k) => (stars >= 4 || k < 5 ? rnd(id, k) > (stars >= 4 ? 0.25 : 0.45) : rnd(id, k) > 0.8));
  if (!amenities.includes("Free Wi-Fi")) amenities.unshift("Free Wi-Fi");
  const rating = Math.round((6.8 + stars * 0.45 + rnd(id, 20) * 0.9) * 10) / 10;
  const best = Math.round(price * (0.93 + rnd(id, 30) * 0.04));
  const deals = siteNames.map((site, k) => ({ site, price: k === Math.floor(rnd(id, 31) * 5) ? best : Math.round(price * (0.98 + rnd(id, 40 + k) * 0.14)), perks: k === 0 ? "Free cancellation" : k === 4 ? "Breakfast offer" : undefined })).sort((a, b) => a.price - b.price);
  return {
    id, name, city, country, area, stars, rating: Math.min(9.8, rating), reviews: 180 + Math.floor(rnd(id, 50) * 2400), price: deals[0].price, photos, amenities, desc,
    x: 14 + Math.floor(rnd(id, 60) * 72), y: 16 + Math.floor(rnd(id, 61) * 66), deals,
    review: reviewers.slice(0, 3).map(([n, t], k) => ({ name: n, text: t, score: Math.min(10, Math.round((rating + (k - 1) * 0.6) * 10) / 10), date: ["Sep 2026", "Aug 2026", "Jul 2026"][k] })),
  };
}));
export const hotelCities = base.map((b) => b[0]);
export const getHotel = (id?: string) => hotelsX.find((h) => h.id === id);

export type Airport = { code: string; city: string; name: string };
export const airports: Airport[] = [
  { code: "JFK", city: "New York", name: "John F. Kennedy" }, { code: "LAX", city: "Los Angeles", name: "Los Angeles Intl" }, { code: "LHR", city: "London", name: "Heathrow" },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle" }, { code: "KIX", city: "Osaka / Kyoto", name: "Kansai Intl" }, { code: "LIS", city: "Lisbon", name: "Humberto Delgado" },
  { code: "NAP", city: "Naples (Amalfi)", name: "Naples Intl" }, { code: "REK", city: "Reykjavik", name: "Keflavik" }, { code: "SSA", city: "Salvador", name: "Salvador Intl" },
  { code: "DPS", city: "Bali", name: "Ngurah Rai" }, { code: "SYD", city: "Sydney", name: "Kingsford Smith" }, { code: "CPT", city: "Cape Town", name: "Cape Town Intl" },
];
export type FlightX = { id: string; airline: string; code: string; from: string; to: string; depart: number; arrive: number; mins: number; stops: number; via?: string; price: number; back?: { depart: number; arrive: number } };
export const airlines = ["Air France", "British Airways", "ANA", "Delta", "Lufthansa", "TAP Portugal", "Icelandair", "Emirates"];
const dur = (a: string, b: string) => 90 + (hash([a, b].sort().join()) % 700);
export const fmtTime = (m: number) => { const t = ((m % 1440) + 1440) % 1440; return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`; };
export const fmtDur = (m: number) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;

export function genFlights(from: string, to: string, cls: string, pax: number, roundTrip: boolean): FlightX[] {
  const base = dur(from, to);
  const mult = { Economy: 1, "Premium economy": 1.6, Business: 3.2, First: 5 }[cls] ?? 1;
  return Array.from({ length: 10 }, (_, i) => {
    const key = `${from}${to}${i}`;
    const stops = rnd(key, 1) < 0.4 ? 0 : rnd(key, 2) < 0.7 ? 1 : 2;
    const mins = base + stops * (70 + Math.floor(rnd(key, 3) * 120));
    const depart = 330 + Math.floor(rnd(key, 4) * 17) * 60 + (Math.floor(rnd(key, 5) * 4) * 15);
    const price = Math.round(((base / 60) * 28 + 90 + (stops === 0 ? 70 : 0) + rnd(key, 6) * 160 - stops * 30) * mult * (roundTrip ? 1.85 : 1)) * pax;
    const airline = airlines[hash(key) % airlines.length];
    const bd = 360 + Math.floor(rnd(key, 7) * 14) * 60;
    return { id: key, airline, code: airline.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() + (100 + Math.floor(rnd(key, 8) * 800)), from, to, depart, arrive: depart + mins, mins, stops, via: stops ? airports[hash(key + "v") % airports.length].code : undefined, price, back: roundTrip ? { depart: bd, arrive: bd + mins + Math.floor(rnd(key, 9) * 30) } : undefined };
  });
}
