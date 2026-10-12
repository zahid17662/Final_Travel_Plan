export type Continent = "Europe" | "Asia" | "North America" | "South America" | "Africa" | "Oceania";
export type Season = "Spring" | "Summer" | "Autumn" | "Winter";
export type Budget = "$" | "$$" | "$$$";
export type Attraction = { name: string; blurb: string; photo: string; rating: number; time: string };
export type Eatery = { name: string; cuisine: string; price: Budget; rating: number; photo: string };
export type Area = { name: string; vibe: string; from: number };
export type Sample = { title: string; days: number; stops: string[]; photo: string };
export type Dest = {
  slug: string; name: string; country: string; continent: Continent; seasons: Season[]; budget: Budget;
  blurb: string; photo: string; bestTime: string; tags: string[]; currency: string; language: string; avgCost: number;
  trend?: number; hi: number[]; rain: number[];
  attractions: Attraction[]; restaurants: Eatery[]; areas: Area[]; samples: Sample[]; guides: string[];
};

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const continents: Continent[] = ["Europe", "Asia", "North America", "South America", "Africa", "Oceania"];
export const seasons: Season[] = ["Spring", "Summer", "Autumn", "Winter"];
export const categories = ["City", "Beach", "Nature", "Culture", "Food", "History", "Road trip", "Museums"];

const P = {
  food1: "photo-1414235077428-338989a2e8c0", food2: "photo-1517248135467-4c7edcad34c4", food3: "photo-1555396273-367ea4eb4db5",
  food4: "photo-1504674900247-0877df9cc836", hotel1: "photo-1566073771259-6a8506099945", hotel2: "photo-1551882547-ff40c63fe5fa",
  hotel3: "photo-1582719508461-905c673771fd", hotel4: "photo-1520250497591-112f2f40a3f4",
};
const a = (name: string, blurb: string, photo: string, rating: number, time: string): Attraction => ({ name, blurb, photo, rating, time });
const e = (name: string, cuisine: string, price: Budget, rating: number, photo: string): Eatery => ({ name, cuisine, price, rating, photo });

export const dests: Dest[] = [
  {
    slug: "paris", name: "Paris", country: "France", continent: "Europe", seasons: ["Spring", "Autumn"], budget: "$$$", trend: 38,
    blurb: "Cafes, museums and long walks along the Seine.", photo: "photo-1502602898657-3e91760cbb34", bestTime: "Apr – Jun", tags: ["City", "Food", "Museums", "Culture"],
    currency: "Euro (EUR)", language: "French", avgCost: 180,
    hi: [7, 8, 12, 16, 19, 23, 25, 25, 21, 16, 10, 7], rain: [51, 41, 47, 51, 63, 54, 63, 43, 49, 62, 51, 58],
    attractions: [
      a("Eiffel Tower", "Summit at sunset, then watch it sparkle on the hour.", "photo-1511739001486-6bfe10ce785f", 4.7, "2–3 h"),
      a("Louvre Museum", "Go late on a Friday and head straight for the Denon wing.", "photo-1499856871958-5b9627545d1a", 4.8, "3–4 h"),
      a("Montmartre & Sacre-Coeur", "Cobbled lanes, painters and the best view over the rooftops.", "photo-1550340499-a6c60fc8287c", 4.6, "Half day"),
      a("Musee d'Orsay", "Impressionists in a converted Beaux-Arts railway station.", "photo-1431274172761-fca41d930114", 4.8, "2–3 h"),
    ],
    restaurants: [e("Le Comptoir du Relais", "Bistro", "$$", 4.6, P.food1), e("Bouillon Chartier", "Classic French", "$", 4.3, P.food2), e("Septime", "Modern French", "$$$", 4.8, P.food3)],
    areas: [{ name: "Le Marais", vibe: "Historic, walkable, great for first-timers", from: 190 }, { name: "Saint-Germain", vibe: "Elegant, bookish, café terraces", from: 240 }, { name: "Canal Saint-Martin", vibe: "Local, creative, relaxed", from: 130 }],
    samples: [{ title: "Paris in 3 days", days: 3, stops: ["Eiffel Tower", "Louvre", "Montmartre"], photo: "photo-1499856871958-5b9627545d1a" }, { title: "Art lover's weekend", days: 2, stops: ["Orsay", "Orangerie", "Pompidou"], photo: "photo-1431274172761-fca41d930114" }],
    guides: ["italy", "ximending"],
  },
  {
    slug: "london", name: "London", country: "United Kingdom", continent: "Europe", seasons: ["Spring", "Summer"], budget: "$$$", trend: 12,
    blurb: "Markets, royal parks and world-class theatre.", photo: "photo-1513635269975-59663e0ac1ad", bestTime: "May – Sep", tags: ["City", "History", "Museums", "Culture"],
    currency: "Pound (GBP)", language: "English", avgCost: 200,
    hi: [8, 9, 12, 15, 18, 21, 24, 23, 20, 15, 11, 8], rain: [55, 40, 42, 44, 49, 45, 45, 50, 49, 69, 59, 55],
    attractions: [
      a("Tower of London", "Crown jewels and a thousand years of drama.", "photo-1529655683826-aba9b3e77383", 4.6, "3 h"),
      a("British Museum", "Free entry, endless galleries. Pick three wings.", "photo-1486299267070-83823f5448dd", 4.7, "3 h"),
      a("Borough Market", "Come hungry on a weekday morning.", "photo-1534190760961-74e8c1c5c3da", 4.6, "1–2 h"),
      a("Hyde Park & Kensington", "Row a boat, then wander to the palace gardens.", "photo-1520986606214-8b456906c813", 4.5, "2 h"),
    ],
    restaurants: [e("Dishoom", "Bombay cafe", "$$", 4.6, P.food4), e("Padella", "Fresh pasta", "$", 4.7, P.food3), e("The Palomar", "Middle Eastern", "$$$", 4.6, P.food1)],
    areas: [{ name: "Covent Garden", vibe: "Central, theatres, lively", from: 260 }, { name: "Shoreditch", vibe: "Street art, bars, creative", from: 170 }, { name: "South Bank", vibe: "Riverside, culture, views", from: 210 }],
    samples: [{ title: "London classics in 4 days", days: 4, stops: ["Tower", "British Museum", "Borough Market"], photo: "photo-1529655683826-aba9b3e77383" }, { title: "Parks and pubs", days: 2, stops: ["Hyde Park", "Notting Hill", "Camden"], photo: "photo-1520986606214-8b456906c813" }],
    guides: ["italy"],
  },
  {
    slug: "kyoto", name: "Kyoto", country: "Japan", continent: "Asia", seasons: ["Spring", "Autumn"], budget: "$$", trend: 64,
    blurb: "Ancient temples, tea houses and bamboo forests.", photo: "photo-1493976040374-85c8e12f0c0e", bestTime: "Mar – May", tags: ["Culture", "Nature", "Food", "History"],
    currency: "Yen (JPY)", language: "Japanese", avgCost: 120,
    hi: [10, 10, 14, 20, 25, 28, 32, 33, 29, 23, 17, 12], rain: [50, 62, 104, 117, 160, 204, 218, 138, 185, 109, 61, 46],
    attractions: [
      a("Fushimi Inari Shrine", "Ten thousand torii gates. Go at dawn for empty paths.", "photo-1478436127897-769e1b3f0f36", 4.8, "2–3 h"),
      a("Arashiyama Bamboo Grove", "Pair it with Tenryu-ji and a riverside lunch.", "photo-1528360983277-13d401cdc186", 4.5, "2 h"),
      a("Kinkaku-ji", "The Golden Pavilion mirrored in its pond.", "photo-1545569341-9eb8b30979d9", 4.6, "1 h"),
      a("Nishiki Market", "Pickles, tofu doughnuts and street snacks.", "photo-1528164344705-47542687000d", 4.4, "1–2 h"),
    ],
    restaurants: [e("Gion Karyo", "Kaiseki", "$$$", 4.7, P.food3), e("Ippudo Nishiki", "Ramen", "$", 4.4, P.food4), e("Omen Ginkakuji", "Udon", "$$", 4.5, P.food2)],
    areas: [{ name: "Gion", vibe: "Traditional, geisha district, evening lanterns", from: 160 }, { name: "Kyoto Station", vibe: "Practical, connected, great for day trips", from: 95 }, { name: "Higashiyama", vibe: "Temples and quiet lanes", from: 140 }],
    samples: [{ title: "Kyoto in 5 days", days: 5, stops: ["Fushimi Inari", "Arashiyama", "Gion"], photo: "photo-1478436127897-769e1b3f0f36" }, { title: "Temples at your own pace", days: 3, stops: ["Kinkaku-ji", "Ginkaku-ji", "Kiyomizu-dera"], photo: "photo-1545569341-9eb8b30979d9" }],
    guides: ["kyoto"],
  },
  {
    slug: "reykjavik", name: "Reykjavik", country: "Iceland", continent: "Europe", seasons: ["Summer", "Winter"], budget: "$$$", trend: 21,
    blurb: "Gateway to glaciers, geysers and the northern lights.", photo: "photo-1519092437326-bfd121eb53ae", bestTime: "Jun – Aug", tags: ["Nature", "Road trip"],
    currency: "Krona (ISK)", language: "Icelandic", avgCost: 210,
    hi: [2, 3, 4, 6, 10, 13, 15, 14, 11, 7, 4, 2], rain: [76, 72, 82, 58, 44, 50, 52, 62, 67, 86, 73, 79],
    attractions: [
      a("Golden Circle", "Thingvellir, Geysir and Gullfoss in one loop.", "photo-1504893524553-b855bce32c67", 4.7, "Full day"),
      a("Blue Lagoon", "Book the evening slot and bring a towel.", "photo-1520769945061-0a448c463865", 4.5, "3 h"),
      a("Hallgrimskirkja", "Ride the tower for a rooftop panorama.", "photo-1529963183134-61a90db47eaf", 4.6, "1 h"),
      a("Skogafoss", "Walk behind the curtain of water on the south coast.", "photo-1531168556467-80aace0d0144", 4.8, "1–2 h"),
    ],
    restaurants: [e("Baejarins Beztu", "Hot dogs", "$", 4.5, P.food2), e("Fiskmarkadurinn", "Seafood", "$$$", 4.6, P.food1), e("Apotek", "Nordic", "$$", 4.4, P.food3)],
    areas: [{ name: "Downtown 101", vibe: "Walkable, bars and cafes", from: 190 }, { name: "Harbour", vibe: "Whale tours, seafood, views", from: 170 }, { name: "Laugardalur", vibe: "Quiet, pools and parks", from: 120 }],
    samples: [{ title: "Ring road in 8 days", days: 8, stops: ["Vik", "Jokulsarlon", "Myvatn"], photo: "photo-1531168556467-80aace0d0144" }, { title: "Reykjavik stopover", days: 2, stops: ["Blue Lagoon", "Hallgrimskirkja"], photo: "photo-1520769945061-0a448c463865" }],
    guides: ["iceland"],
  },
  {
    slug: "amalfi", name: "Amalfi Coast", country: "Italy", continent: "Europe", seasons: ["Spring", "Summer", "Autumn"], budget: "$$$",
    blurb: "Cliffside villages above a deep blue sea.", photo: "photo-1533105079780-92b9be482077", bestTime: "May – Oct", tags: ["Beach", "Food", "Road trip"],
    currency: "Euro (EUR)", language: "Italian", avgCost: 220,
    hi: [13, 13, 15, 18, 22, 26, 29, 30, 26, 22, 17, 14], rain: [110, 95, 85, 75, 45, 25, 15, 25, 80, 125, 150, 125],
    attractions: [
      a("Positano", "Stacked pastel houses and a pebble beach.", "photo-1612698093158-e07ac200d44e", 4.7, "Half day"),
      a("Path of the Gods", "A cliff-edge hike with endless sea views.", "photo-1534113414509-0eec2bfb493f", 4.8, "4 h"),
      a("Amalfi Cathedral", "Striped facade and a cloister of arches.", "photo-1533105079780-92b9be482077", 4.5, "1 h"),
      a("Ravello Gardens", "Villa Cimbrone's terrace of infinity.", "photo-1498307833015-e7b400441eb8", 4.7, "2 h"),
    ],
    restaurants: [e("Da Adolfo", "Seafood beach shack", "$$", 4.6, P.food1), e("Marina Grande", "Neapolitan", "$$", 4.4, P.food3), e("Il Ritrovo", "Mountain trattoria", "$$", 4.6, P.food4)],
    areas: [{ name: "Positano", vibe: "Iconic, steep and photogenic", from: 330 }, { name: "Amalfi town", vibe: "Practical base with ferries", from: 210 }, { name: "Praiano", vibe: "Quiet, sunset terraces", from: 180 }],
    samples: [{ title: "Coast in 4 days", days: 4, stops: ["Positano", "Amalfi", "Ravello"], photo: "photo-1612698093158-e07ac200d44e" }],
    guides: ["amalfi", "italy"],
  },
  {
    slug: "salvador", name: "Salvador", country: "Brazil", continent: "South America", seasons: ["Summer", "Winter"], budget: "$",
    blurb: "Colourful old town, music and Bahian food.", photo: "photo-1569556420157-6030491766d1", bestTime: "Sep – Mar", tags: ["Culture", "Beach", "Food"],
    currency: "Real (BRL)", language: "Portuguese", avgCost: 70,
    hi: [30, 31, 31, 30, 29, 28, 27, 27, 28, 29, 30, 30], rain: [95, 120, 190, 280, 290, 190, 160, 110, 100, 120, 160, 140],
    attractions: [
      a("Pelourinho", "UNESCO old town of bright facades and drumming.", "photo-1569556420157-6030491766d1", 4.6, "Half day"),
      a("Elevador Lacerda", "A 1873 lift between the upper and lower city.", "photo-1544989164-31dc3c645987", 4.4, "30 min"),
      a("Porto da Barra", "Sunset swims with the whole city.", "photo-1507525428034-b723cf961d3e", 4.5, "2 h"),
    ],
    restaurants: [e("Casa de Tereza", "Bahian", "$$", 4.5, P.food4), e("Acaraje da Cira", "Street food", "$", 4.7, P.food2), e("Solar do Unhao", "Moqueca", "$$", 4.4, P.food1)],
    areas: [{ name: "Pelourinho", vibe: "Historic and lively", from: 55 }, { name: "Barra", vibe: "Beach, lighthouse, nightlife", from: 70 }, { name: "Rio Vermelho", vibe: "Bohemian bars and food", from: 60 }],
    samples: [{ title: "Salvador in 4 days", days: 4, stops: ["Pelourinho", "Barra", "Itapua"], photo: "photo-1569556420157-6030491766d1" }],
    guides: ["salvador"],
  },
  {
    slug: "lisbon", name: "Lisbon", country: "Portugal", continent: "Europe", seasons: ["Spring", "Summer", "Autumn"], budget: "$$", trend: 29,
    blurb: "Tiled hills, yellow trams and custard tarts.", photo: "photo-1585208798174-6cedd86e019a", bestTime: "Mar – Oct", tags: ["City", "Food", "Culture"],
    currency: "Euro (EUR)", language: "Portuguese", avgCost: 110,
    hi: [15, 16, 18, 20, 23, 27, 29, 30, 27, 23, 18, 15], rain: [100, 85, 55, 65, 40, 15, 3, 5, 25, 75, 100, 105],
    attractions: [
      a("Belem Tower", "Pair it with pasteis de Belem next door.", "photo-1548707309-dcebeab9ea9b", 4.5, "1–2 h"),
      a("Alfama", "Get lost in the oldest quarter, then find a fado bar.", "photo-1555881400-74d7acaacd8b", 4.7, "Half day"),
      a("Tram 28", "Ride early to beat the queues.", "photo-1558370781-d6196949e317", 4.3, "1 h"),
      a("Sintra", "Fairy-tale palaces an easy train ride away.", "photo-1513735492246-483525079686", 4.7, "Full day"),
    ],
    restaurants: [e("Time Out Market", "Food hall", "$$", 4.4, P.food2), e("Cervejaria Ramiro", "Seafood", "$$", 4.7, P.food1), e("Taberna da Rua das Flores", "Petiscos", "$$", 4.6, P.food3)],
    areas: [{ name: "Baixa", vibe: "Flat, central, great transit", from: 120 }, { name: "Bairro Alto", vibe: "Nightlife and views", from: 100 }, { name: "Alfama", vibe: "Charming and steep", from: 110 }],
    samples: [{ title: "Lisbon long weekend", days: 3, stops: ["Alfama", "Belem", "LX Factory"], photo: "photo-1555881400-74d7acaacd8b" }],
    guides: ["italy"],
  },
  {
    slug: "new-york", name: "New York", country: "United States", continent: "North America", seasons: ["Spring", "Autumn", "Winter"], budget: "$$$", trend: 9,
    blurb: "Skyline views, pizza slices and a show every night.", photo: "photo-1496442226666-8d4d0e62e6e9", bestTime: "Apr – Jun", tags: ["City", "Food", "Museums", "Culture"],
    currency: "Dollar (USD)", language: "English", avgCost: 230,
    hi: [4, 6, 10, 17, 23, 28, 30, 29, 25, 19, 12, 7], rain: [85, 80, 105, 105, 110, 100, 110, 105, 100, 95, 95, 100],
    attractions: [
      a("Central Park", "Bike the loop, then rest at Bethesda Terrace.", "photo-1534430480872-3498386e7856", 4.8, "3 h"),
      a("The Met", "Pick the Egyptian wing and the rooftop.", "photo-1518998053901-5348d3961a04", 4.8, "3 h"),
      a("Brooklyn Bridge", "Walk toward Manhattan at golden hour.", "photo-1496442226666-8d4d0e62e6e9", 4.7, "1–2 h"),
      a("High Line", "Elevated park through Chelsea.", "photo-1522083165195-3424ed129620", 4.6, "1–2 h"),
    ],
    restaurants: [e("Joe's Pizza", "Slice shop", "$", 4.6, P.food2), e("Katz's Delicatessen", "Deli", "$$", 4.5, P.food4), e("Via Carota", "Italian", "$$$", 4.7, P.food3)],
    areas: [{ name: "Midtown", vibe: "Central, Broadway, transit hub", from: 280 }, { name: "Lower Manhattan", vibe: "Quiet nights, harbour views", from: 240 }, { name: "Williamsburg", vibe: "Cool, waterfront, nightlife", from: 220 }],
    samples: [{ title: "NYC first-timer, 4 days", days: 4, stops: ["Central Park", "The Met", "Brooklyn Bridge"], photo: "photo-1534430480872-3498386e7856" }],
    guides: ["ximending"],
  },
  {
    slug: "bali", name: "Bali", country: "Indonesia", continent: "Asia", seasons: ["Spring", "Summer"], budget: "$", trend: 17,
    blurb: "Rice terraces, surf breaks and temple sunsets.", photo: "photo-1537996194471-e657df975ab4", bestTime: "Apr – Oct", tags: ["Beach", "Nature", "Culture"],
    currency: "Rupiah (IDR)", language: "Indonesian", avgCost: 65,
    hi: [30, 30, 31, 31, 31, 30, 30, 30, 31, 31, 31, 30], rain: [345, 300, 235, 100, 85, 60, 50, 35, 40, 85, 160, 260],
    attractions: [
      a("Tegallalang Rice Terraces", "Arrive before 8am for light and space.", "photo-1555400038-63f5ba517a47", 4.5, "2 h"),
      a("Uluwatu Temple", "Cliffside sunsets and Kecak fire dance.", "photo-1518548419970-58e3b4079ab2", 4.6, "2 h"),
      a("Sacred Monkey Forest", "Shaded paths, ancient shrines, cheeky macaques.", "photo-1573790387438-4da905039392", 4.4, "1–2 h"),
    ],
    restaurants: [e("Warung Babi Guling Ibu Oka", "Balinese", "$", 4.4, P.food4), e("Locavore", "Modern Indonesian", "$$$", 4.8, P.food3), e("Naughty Nuri's", "Grill", "$", 4.4, P.food2)],
    areas: [{ name: "Ubud", vibe: "Green, wellness and art", from: 60 }, { name: "Canggu", vibe: "Surf, cafes, remote workers", from: 75 }, { name: "Uluwatu", vibe: "Cliffs and clifftop bars", from: 90 }],
    samples: [{ title: "Bali in 7 days", days: 7, stops: ["Ubud", "Uluwatu", "Nusa Penida"], photo: "photo-1537996194471-e657df975ab4" }],
    guides: ["amalfi"],
  },
  {
    slug: "cape-town", name: "Cape Town", country: "South Africa", continent: "Africa", seasons: ["Spring", "Summer"], budget: "$",
    blurb: "Table Mountain, penguin beaches and winelands.", photo: "photo-1580060839134-75a5edca2e99", bestTime: "Nov – Mar", tags: ["Nature", "Beach", "Road trip", "Food"],
    currency: "Rand (ZAR)", language: "English, Afrikaans, Xhosa", avgCost: 80,
    hi: [26, 27, 25, 23, 20, 18, 18, 18, 19, 22, 23, 25], rain: [15, 17, 20, 41, 69, 93, 82, 77, 40, 30, 20, 17],
    attractions: [
      a("Table Mountain", "Hike up Platteklip Gorge or take the cable car.", "photo-1580060839134-75a5edca2e99", 4.8, "Half day"),
      a("Boulders Beach", "Swim alongside African penguins.", "photo-1591017403286-fd8493524e1e", 4.5, "2 h"),
      a("Cape Point", "Where two oceans meet, with wild coastal drives.", "photo-1576485290814-1c72aa4bbb8e", 4.6, "Half day"),
    ],
    restaurants: [e("The Test Kitchen", "Fine dining", "$$$", 4.8, P.food3), e("Bo-Kaap Kitchen", "Cape Malay", "$", 4.5, P.food4), e("Kloof Street House", "Eclectic", "$$", 4.4, P.food1)],
    areas: [{ name: "City Bowl", vibe: "Central, restaurants and museums", from: 85 }, { name: "Camps Bay", vibe: "Beach and sunset bars", from: 130 }, { name: "Woodstock", vibe: "Street art and design", from: 70 }],
    samples: [{ title: "Cape Town in 5 days", days: 5, stops: ["Table Mountain", "Cape Point", "Winelands"], photo: "photo-1576485290814-1c72aa4bbb8e" }],
    guides: ["iceland"],
  },
  {
    slug: "sydney", name: "Sydney", country: "Australia", continent: "Oceania", seasons: ["Spring", "Summer", "Autumn"], budget: "$$", trend: 6,
    blurb: "Harbour ferries, surf beaches and a famous opera house.", photo: "photo-1506973035872-a4ec16b8e8d9", bestTime: "Sep – Nov", tags: ["City", "Beach", "Nature"],
    currency: "Dollar (AUD)", language: "English", avgCost: 150,
    hi: [26, 26, 25, 22, 19, 17, 16, 18, 20, 22, 23, 25], rain: [101, 118, 131, 127, 123, 132, 97, 80, 69, 77, 83, 78],
    attractions: [
      a("Sydney Opera House", "Take a backstage tour, then eat at the water's edge.", "photo-1523059623039-a9ed027e7fad", 4.7, "2 h"),
      a("Bondi to Coogee Walk", "Six kilometres of cliffs and rock pools.", "photo-1523428461295-92770e70078a", 4.8, "3 h"),
      a("Manly Ferry", "The best cheap harbour cruise in the world.", "photo-1506973035872-a4ec16b8e8d9", 4.6, "Half day"),
    ],
    restaurants: [e("Quay", "Modern Australian", "$$$", 4.7, P.food3), e("Mr Wong", "Cantonese", "$$", 4.5, P.food4), e("Bills", "Brunch", "$$", 4.4, P.food2)],
    areas: [{ name: "The Rocks", vibe: "Historic, near the harbour", from: 200 }, { name: "Surry Hills", vibe: "Cafes and bars", from: 160 }, { name: "Bondi", vibe: "Surf and sun", from: 170 }],
    samples: [{ title: "Sydney in 4 days", days: 4, stops: ["Opera House", "Bondi", "Manly"], photo: "photo-1523059623039-a9ed027e7fad" }],
    guides: ["amalfi"],
  },
];

export const findDest = (slug?: string) => dests.find((d) => d.slug === slug);
