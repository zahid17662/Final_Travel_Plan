import { currentUser, guides as baseGuides } from "./index";
import { hashPos, uid } from "../pages/planner/seed";

export type GPlace = { id: string; name: string; note: string; photo?: string; x: number; y: number };
export type GSection = { id: string; title: string; places: GPlace[] };
export type FullGuide = {
  id: string; title: string; blurb: string; author: string; authorBio: string; cover: string; destination: string; tags: string[];
  published: boolean; sections: GSection[]; likes: number; saves: number; views: number; mine?: boolean; updated: number;
};
export type GComment = { id: string; guideId: string; name: string; text: string; at: number };
type UserState = { liked: string[]; saved: string[] };

export const gplace = (name: string, note = "", photo?: string): GPlace => ({ id: uid(), name, note, photo, ...hashPos(name) });
const sec = (title: string, ...places: [string, string, string?][]): GSection => ({ id: uid(), title, places: places.map(([n, no, ph]) => gplace(n, no, ph)) });
export const placeCount = (g: FullGuide) => g.sections.reduce((n, s) => n + s.places.length, 0);

const F = { f1: "photo-1414235077428-338989a2e8c0", f2: "photo-1517248135467-4c7edcad34c4", f3: "photo-1555396273-367ea4eb4db5", f4: "photo-1504674900247-0877df9cc836" };
const extra: Record<string, Pick<FullGuide, "destination" | "tags" | "authorBio" | "sections" | "saves">> = {
  salvador: { destination: "Salvador, Brazil", tags: ["Culture", "Beach"], saves: 12, authorBio: "Bahia local sharing the classics.", sections: [
    sec("Historic centre", ["Pelourinho", "Start early, before the crowds. The colours are best in morning light.", "photo-1569556420157-6030491766d1"], ["Elevador Lacerda", "Costs pennies and the view of the bay is worth it.", "photo-1544989164-31dc3c645987"], ["Igreja de Sao Francisco", "Gold from floor to ceiling. Dress modestly.", "photo-1569556420157-6030491766d1"]),
    sec("Beaches & food", ["Porto da Barra", "Join locals for sunset.", "photo-1507525428034-b723cf961d3e"], ["Acaraje da Cira", "Try the acaraje with everything.", F.f2], ["Solar do Unhao", "Moqueca with a bay view.", F.f1]),
  ] },
  ximending: { destination: "Taipei, Taiwan", tags: ["Food", "City"], saves: 31, authorBio: "Ten visits and a very full stomach.", sections: [
    sec("Street snacks", ["Ay-Chung Flour-Rice Noodle", "Standing room only. Order the large.", F.f2], ["Ximen Red House", "Browse the creative market upstairs.", "photo-1542990254-7174ee186dd1"], ["Hot-Star Fried Chicken", "Huge, crispy and shareable.", F.f4]),
    sec("Sit-down meals", ["Ten Ren Tea", "Pearl milk tea done properly.", F.f3], ["Modern Toilet", "Quirky, but the food is good.", F.f1], ["Din Tai Fung Ximen", "Book ahead. Get the pork dumplings.", F.f4]),
  ] },
  italy: { destination: "Milan, Rome, Florence, Venice", tags: ["Culture", "Food"], saves: 58, authorBio: "Visited Italy in November 2024 and loved every minute.", sections: [
    sec("Rome", ["Colosseum", "Pre-book the underground tour.", "photo-1552832230-c0197dd311b5"], ["Trastevere", "Wander for dinner. Skip the menu with photos.", F.f3], ["Vatican Museums", "Go at opening time and head to the Sistine first.", "photo-1523906921802-b5d2d899e93b"]),
    sec("Florence & Venice", ["Duomo di Firenze", "Climb the dome. Book a slot.", "photo-1523906921802-b5d2d899e93b"], ["Rialto Market", "Fish and produce at dawn.", "photo-1523906834658-6e24ef2386f9"], ["Burano", "Quiet by late afternoon.", "photo-1523906834658-6e24ef2386f9"]),
  ] },
  kyoto: { destination: "Kyoto, Japan", tags: ["Culture", "Nature"], saves: 96, authorBio: "Tea, temples and quiet mornings.", sections: [
    sec("Temples at dawn", ["Fushimi Inari", "Arrive by 6:30am. You will have it to yourself.", "photo-1478436127897-769e1b3f0f36"], ["Kiyomizu-dera", "Go for the evening illumination in autumn.", "photo-1493976040374-85c8e12f0c0e"], ["Kinkaku-ji", "Short visit, big payoff.", "photo-1545569341-9eb8b30979d9"]),
    sec("Tea & eating", ["Nishiki Market", "Graze, do not sit down.", "photo-1528164344705-47542687000d"], ["Omen Ginkakuji", "Udon with seasonal vegetables.", F.f2], ["Gion Corner", "Evening tea ceremony and performances.", F.f3]),
  ] },
  iceland: { destination: "Iceland", tags: ["Nature", "Road trip"], saves: 74, authorBio: "Eight days, one rental car.", sections: [
    sec("South coast", ["Seljalandsfoss", "Walk behind the falls. Bring a rain jacket.", "photo-1531168556467-80aace0d0144"], ["Skogafoss", "Climb the stairs for the top view.", "photo-1531168556467-80aace0d0144"], ["Reynisfjara", "Stay back from the waves.", "photo-1519092437326-bfd121eb53ae"]),
    sec("Golden Circle", ["Thingvellir", "Walk between two continents.", "photo-1504893524553-b855bce32c67"], ["Geysir", "Strokkur erupts every few minutes.", "photo-1504893524553-b855bce32c67"], ["Secret Lagoon", "Quieter than the Blue Lagoon.", "photo-1520769945061-0a448c463865"]),
  ] },
  amalfi: { destination: "Amalfi Coast, Italy", tags: ["Beach", "Food"], saves: 43, authorBio: "Lemon groves and slow lunches.", sections: [
    sec("Villages", ["Positano", "Stay a night. Day-trippers leave by 5.", "photo-1612698093158-e07ac200d44e"], ["Ravello", "Gardens and a calmer pace.", "photo-1498307833015-e7b400441eb8"], ["Praiano", "Sunset aperitivo.", "photo-1533105079780-92b9be482077"]),
    sec("Hikes & lunch", ["Path of the Gods", "Start in Bomerano and walk down.", "photo-1534113414509-0eec2bfb493f"], ["Da Adolfo", "Boat to the beach club, order the mozzarella on lemon leaf.", F.f1], ["Il Ritrovo", "Mountain trattoria worth the taxi.", F.f4]),
  ] },
};
const bios: Record<string, string> = {};

export const seedGuides = (): FullGuide[] => baseGuides.map((g) => ({
  id: g.id, title: g.title, blurb: g.blurb, author: g.author, authorBio: bios[g.id] ?? extra[g.id].authorBio, cover: g.photo, destination: extra[g.id].destination,
  tags: extra[g.id].tags, published: true, sections: extra[g.id].sections, likes: g.likes, saves: extra[g.id].saves, views: g.views, updated: Date.parse("2026-09-01"),
}));

const GK = "tp_guides_user", SK = "tp_guides_state", CK = "tp_guides_comments";
const read = <T,>(k: string, d: T): T => { try { const r = localStorage.getItem(k); return r ? (JSON.parse(r) as T) : d; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };

export const loadGuides = (): FullGuide[] => {
  const mine = read<FullGuide[]>(GK, []);
  const ids = new Set(mine.map((g) => g.id));
  return [...mine, ...seedGuides().filter((g) => !ids.has(g.id))];
};
export const getGuide = (id?: string) => loadGuides().find((g) => g.id === id);
export const upsertGuide = (g: FullGuide) => { write(GK, [{ ...g, mine: true, updated: Date.now() }, ...read<FullGuide[]>(GK, []).filter((x) => x.id !== g.id)]); };
export const deleteGuide = (id: string) => write(GK, read<FullGuide[]>(GK, []).filter((x) => x.id !== id));
export const newGuide = (): FullGuide => ({ id: `g-${uid()}`, title: "", blurb: "", author: currentUser.name, authorBio: currentUser.bio, cover: "", destination: "", tags: [], published: false, sections: [{ id: uid(), title: "", places: [] }], likes: 0, saves: 0, views: 0, mine: true, updated: Date.now() });

export const loadState = (): UserState => read<UserState>(SK, { liked: [], saved: [] });
export const toggleState = (kind: "liked" | "saved", id: string): UserState => {
  const s = loadState(); const has = s[kind].includes(id);
  const next = { ...s, [kind]: has ? s[kind].filter((x) => x !== id) : [...s[kind], id] }; write(SK, next); return next;
};

const seedComments = (): GComment[] => [
  { id: "c1", guideId: "kyoto", name: "Jon Weber", text: "Used this for our trip last month. Fushimi at 6:30 is the tip.", at: Date.parse("2026-09-20") },
  { id: "c2", guideId: "kyoto", name: "Ana Ruiz", text: "Is Gion Corner worth it for a short stay?", at: Date.parse("2026-10-02") },
  { id: "c3", guideId: "italy", name: "Theo Park", text: "Great routing. Would you add Bologna?", at: Date.parse("2026-09-28") },
];
export const loadComments = (guideId: string) => [...read<GComment[]>(CK, []), ...seedComments()].filter((c) => c.guideId === guideId).sort((a, b) => b.at - a.at);
export const addComment = (guideId: string, text: string) => write(CK, [...read<GComment[]>(CK, []), { id: uid(), guideId, name: currentUser.name, text, at: Date.now() }]);

export const coverSrc = (c: string, w = 900) => (!c ? "" : c.startsWith("data:") || c.startsWith("http") ? c : `https://images.unsplash.com/${c}?w=${w}&q=80&fit=crop`);
