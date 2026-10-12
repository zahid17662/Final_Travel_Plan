export type Trip = { id: string; title: string; dates: string; places: string; photo: string; destination: string; status: "upcoming" | "past" | "draft"; privacy?: string; start?: string; collaborators?: string[] };
export type Guide = { id: string; title: string; blurb: string; author: string; likes: number; views: number; photo: string };
export type Destination = { slug: string; name: string; country: string; blurb: string; photo: string; bestTime: string; tags: string[] };
export type Hotel = { id: string; name: string; city: string; price: number; rating: number; photo: string };
export type Flight = { id: string; from: string; to: string; depart: string; arrive: string; airline: string; price: number; stops: number };
export type Post = { id: string; title: string; excerpt: string; date: string; category: string; photo: string };
export type Plan = { id: string; name: string; price: string; period: string; features: string[]; featured?: boolean };

export const currentUser = { name: "Mia Laurent", handle: "@mia", email: "mia@travelplan.app", countries: 0, cities: 0, bio: "Travel Newcomer" };

export const trips: Trip[] = [
  { id: "london-oct", title: "Trip to London", dates: "Nov 2 – 7", start: "2026-11-02", places: "4 places", destination: "London, United Kingdom", photo: "photo-1549483249-f0b359d1e289", status: "upcoming", collaborators: ["Mia", "Jon", "Ana", "Theo"] },
  { id: "kyoto-spring", title: "Kyoto in spring", dates: "Mar 28 – Apr 4", start: "2027-03-28", places: "9 places", destination: "Kyoto, Japan", photo: "photo-1493976040374-85c8e12f0c0e", status: "upcoming", collaborators: ["Mia", "Aiko"] },
  { id: "paris-sep", title: "Trip to Paris", dates: "Sep 26 – 30", start: "2026-09-26", places: "13 places", destination: "Paris, France", photo: "photo-1585944285854-d06c019aaca3", status: "past", collaborators: ["Mia", "Jon"] },
  { id: "lisbon-jun", title: "Lisbon long weekend", dates: "Jun 12 – 15", start: "2026-06-12", places: "8 places", destination: "Lisbon, Portugal", photo: "photo-1585208798174-6cedd86e019a", status: "past", collaborators: ["Mia"] },
  { id: "paris-draft", title: "Paris weekend", dates: "Dates not set", places: "0 places", destination: "Paris, France", photo: "photo-1587648415693-4a5362b2ce41", status: "draft", collaborators: ["Mia"] },
];

export const guides: Guide[] = [
  { id: "salvador", title: "Se é sua primeira vez em Salvador", blurb: "Para quem tá vindo pela primeira vez, seu lugar é aqui. Os clássicos que eu recomendo.", author: "Mill e umas Viagens", likes: 0, views: 74, photo: "photo-1569556420157-6030491766d1" },
  { id: "ximending", title: "Ximending Food Guide: 30+ Spots", blurb: "My husband and I have visited Ximending 10 times over the years, and these are our picks.", author: "Katherine Woo", likes: 1, views: 257, photo: "photo-1542990254-7174ee186dd1" },
  { id: "italy", title: "ITALY", blurb: "I first visited Italy in November 2024 and did Milan, Rome, Florence, Venice.", author: "Jess Page", likes: 4, views: 877, photo: "photo-1523906921802-b5d2d899e93b" },
  { id: "kyoto", title: "Kyoto in 5 days", blurb: "Temples, tea houses and the quietest mornings in Japan.", author: "Aiko Tanaka", likes: 12, views: 1420, photo: "photo-1493976040374-85c8e12f0c0e" },
  { id: "iceland", title: "Iceland ring road", blurb: "Eight days, one rental car and a lot of waterfalls.", author: "Sam Berg", likes: 9, views: 980, photo: "photo-1519092437326-bfd121eb53ae" },
  { id: "amalfi", title: "Amalfi coast escape", blurb: "Lemon groves, cliffside villages and slow lunches.", author: "Jess Page", likes: 7, views: 640, photo: "photo-1533105079780-92b9be482077" },
];

export const destinations: Destination[] = [
  { slug: "paris", name: "Paris", country: "France", blurb: "Cafés, museums and long walks along the Seine.", photo: "photo-1637851058613-95f0d41c3c2f", bestTime: "Apr – Jun", tags: ["City", "Food", "Museums"] },
  { slug: "london", name: "London", country: "United Kingdom", blurb: "Markets, royal parks and world-class theatre.", photo: "photo-1549483249-f0b359d1e289", bestTime: "May – Sep", tags: ["City", "History"] },
  { slug: "kyoto", name: "Kyoto", country: "Japan", blurb: "Ancient temples and bamboo forests.", photo: "photo-1493976040374-85c8e12f0c0e", bestTime: "Mar – May", tags: ["Culture", "Nature"] },
  { slug: "reykjavik", name: "Reykjavik", country: "Iceland", blurb: "Gateway to glaciers, geysers and the northern lights.", photo: "photo-1519092437326-bfd121eb53ae", bestTime: "Jun – Aug", tags: ["Nature", "Road trip"] },
  { slug: "amalfi", name: "Amalfi Coast", country: "Italy", blurb: "Cliffside villages above a deep blue sea.", photo: "photo-1533105079780-92b9be482077", bestTime: "May – Oct", tags: ["Beach", "Food"] },
  { slug: "salvador", name: "Salvador", country: "Brazil", blurb: "Colourful old town, music and Bahian food.", photo: "photo-1569556420157-6030491766d1", bestTime: "Sep – Mar", tags: ["Culture", "Beach"] },
];

export const hotels: Hotel[] = [
  { id: "h1", name: "Maison Seine", city: "Paris", price: 189, rating: 4.7, photo: "photo-1566073771259-6a8506099945" },
  { id: "h2", name: "The Larkspur", city: "London", price: 226, rating: 4.5, photo: "photo-1551882547-ff40c63fe5fa" },
  { id: "h3", name: "Kamo River Inn", city: "Kyoto", price: 142, rating: 4.8, photo: "photo-1582719508461-905c673771fd" },
  { id: "h4", name: "Blue Cove Resort", city: "Amalfi", price: 310, rating: 4.9, photo: "photo-1520250497591-112f2f40a3f4" },
];

export const flights: Flight[] = [
  { id: "f1", from: "JFK", to: "CDG", depart: "18:40", arrive: "08:05", airline: "Air France", price: 512, stops: 0 },
  { id: "f2", from: "JFK", to: "LHR", depart: "21:15", arrive: "09:10", airline: "British Airways", price: 468, stops: 0 },
  { id: "f3", from: "LAX", to: "KIX", depart: "11:50", arrive: "16:20", airline: "ANA", price: 894, stops: 1 },
];

export const posts: Post[] = [
  { id: "p1", title: "How to plan a trip with friends without the chaos", excerpt: "Voting, budgets and who books what.", date: "Oct 8, 2026", category: "Tips", photo: "photo-1539635278303-d4002c07eae3" },
  { id: "p2", title: "Ten underrated cities for autumn", excerpt: "Fewer crowds, golden light, better prices.", date: "Sep 29, 2026", category: "Inspiration", photo: "photo-1507699622108-4be3abd695ad" },
  { id: "p3", title: "What's new in Travel Plan", excerpt: "Offline maps, shared budgets and a faster itinerary builder.", date: "Sep 12, 2026", category: "Product", photo: "photo-1488646953014-85cb44e25828" },
];

export const plans: Plan[] = [
  { id: "free", name: "Free", price: "$0", period: "forever", features: ["Unlimited trips", "Shared guides", "Collaborative planning"] },
  { id: "pro", name: "Pro", price: "$7", period: "per month", featured: true, features: ["Everything in Free", "Offline maps", "Route optimisation", "Priority support"] },
  { id: "team", name: "Team", price: "$19", period: "per month", features: ["Everything in Pro", "Up to 10 travellers", "Shared budgets"] },
];

export const helpTopics = [
  { id: "start", title: "Getting started", items: ["Create your first trip", "Invite friends", "Import a booking"] },
  { id: "account", title: "Account & billing", items: ["Change your email", "Update payment method", "Cancel Pro"] },
  { id: "maps", title: "Maps & offline", items: ["Download offline maps", "Optimise a route"] },
];

export const img = (id: string, w = 800) => `https://images.unsplash.com/${id}?w=${w}&q=80&fit=crop`;

export const travelStyles = ["Beach & sun", "City breaks", "Adventure", "Food & drink", "Culture & history", "Nature & hiking", "Road trips", "Luxury", "Budget", "Wellness", "Nightlife", "Family"];
export const homeCities = ["New York, USA", "London, UK", "Paris, France", "Lisbon, Portugal", "Berlin, Germany", "Toronto, Canada", "São Paulo, Brazil", "Tokyo, Japan", "Sydney, Australia", "Mexico City, Mexico", "Dubai, UAE", "Singapore"];

export type Place = { id: string; name: string; sub: string; type: "city" | "country" | "region" };
export const places: Place[] = [
  { id: "paris", name: "Paris", sub: "France", type: "city" },
  { id: "london", name: "London", sub: "United Kingdom", type: "city" },
  { id: "kyoto", name: "Kyoto", sub: "Japan", type: "city" },
  { id: "tokyo", name: "Tokyo", sub: "Japan", type: "city" },
  { id: "rome", name: "Rome", sub: "Italy", type: "city" },
  { id: "lisbon", name: "Lisbon", sub: "Portugal", type: "city" },
  { id: "barcelona", name: "Barcelona", sub: "Spain", type: "city" },
  { id: "reykjavik", name: "Reykjavik", sub: "Iceland", type: "city" },
  { id: "salvador", name: "Salvador", sub: "Brazil", type: "city" },
  { id: "new-york", name: "New York", sub: "United States", type: "city" },
  { id: "bali", name: "Bali", sub: "Indonesia", type: "region" },
  { id: "amalfi", name: "Amalfi Coast", sub: "Italy", type: "region" },
  { id: "tuscany", name: "Tuscany", sub: "Italy", type: "region" },
  { id: "provence", name: "Provence", sub: "France", type: "region" },
  { id: "patagonia", name: "Patagonia", sub: "Argentina & Chile", type: "region" },
  { id: "algarve", name: "Algarve", sub: "Portugal", type: "region" },
  { id: "france", name: "France", sub: "Europe", type: "country" },
  { id: "italy", name: "Italy", sub: "Europe", type: "country" },
  { id: "japan", name: "Japan", sub: "Asia", type: "country" },
  { id: "iceland", name: "Iceland", sub: "Europe", type: "country" },
  { id: "portugal", name: "Portugal", sub: "Europe", type: "country" },
  { id: "brazil", name: "Brazil", sub: "South America", type: "country" },
];

const ALL_KEY = "tp_trips_all";
export const loadTrips = (): Trip[] => {
  try { const raw = localStorage.getItem(ALL_KEY); return raw ? (JSON.parse(raw) as Trip[]) : trips; } catch { return trips; }
};
export const persistTrips = (list: Trip[]) => { try { localStorage.setItem(ALL_KEY, JSON.stringify(list)); } catch { /* storage unavailable */ } };
export const saveTrip = (t: Trip) => persistTrips([t, ...loadTrips()]);
