export const helpCategories = [
  { id: "start", title: "Getting started", blurb: "Create trips, invite friends, import bookings.", icon: "sparkle" },
  { id: "planning", title: "Planning and itineraries", blurb: "Days, places, routes and notes.", icon: "calendar" },
  { id: "offline", title: "Maps and offline", blurb: "Download trips and optimise routes.", icon: "map" },
  { id: "sharing", title: "Sharing and collaboration", blurb: "Permissions, comments and shared pages.", icon: "users" },
  { id: "billing", title: "Account and billing", blurb: "Plans, invoices and refunds.", icon: "settings" },
  { id: "privacy", title: "Privacy and security", blurb: "Your data, your control.", icon: "lock" },
] as const;

export type Article = { id: string; cat: string; title: string; body: string[] };
export const articles: Article[] = [
  { id: "first-trip", cat: "start", title: "Create your first trip", body: ["Choose Plan new trip, pick a destination and your dates, and you land in the planner.", "Add places from search or from the map, then drag them into the day you want."] },
  { id: "invite", cat: "sharing", title: "Invite friends to plan together", body: ["Open Share on your trip and enter an email or copy the invite link.", "Choose whether each person can view, comment or edit."] },
  { id: "import", cat: "start", title: "Import a booking from your email", body: ["Forward a confirmation to your trip's unique address and we add it to Reservations.", "Flights, hotels and rentals are supported."] },
  { id: "offline", cat: "offline", title: "Download a trip for offline use", body: ["Offline access is a Pro feature. Open the trip menu and choose Download for offline.", "Itinerary, notes, reservations and maps stay available without a signal."] },
  { id: "optimise", cat: "offline", title: "Optimise a route for the day", body: ["Open a day, then choose Optimise route. We reorder stops to reduce travel time.", "You can undo the change straight afterwards."] },
  { id: "cancel", cat: "billing", title: "Cancel or change your Pro plan", body: ["Go to Settings, then Subscription.", "You keep Pro until the end of the billing period and everything you created stays."] },
  { id: "refund", cat: "billing", title: "Request a refund", body: ["Contact us within 14 days of your first payment and we will refund you in full."] },
  { id: "privacy", cat: "privacy", title: "Make a trip private or public", body: ["In Share settings choose Only me, People with the link or Public.", "Public trips can appear in guides and search."] },
  { id: "export", cat: "planning", title: "Export a trip to Google Maps", body: ["Pro members can export any day as a Google Maps route from the day menu."] },
  { id: "notes", cat: "planning", title: "Add notes, checklists and budgets", body: ["Use the tabs inside the planner to keep packing lists, notes and expenses next to your plan."] },
];
export const popularArticles = ["first-trip", "invite", "offline", "cancel", "import"];

export type BlogPost = { id: string; title: string; excerpt: string; date: string; category: string; photo: string; author: string; read: string; body: string[] };
export const blogCategories = ["All", "Tips", "Inspiration", "Product", "Stories"];
export const blogPosts: BlogPost[] = [
  { id: "plan-with-friends", title: "How to plan a trip with friends without the chaos", excerpt: "Voting, budgets and who books what.", date: "Oct 8, 2026", category: "Tips", photo: "photo-1539635278303-d4002c07eae3", author: "Maya Ortiz", read: "6 min",
    body: ["Group trips fall apart in the same three places: money, dates and who is in charge of what. The fix is boring and it works: decide the rules before you decide the destination.", "Start with a shared trip and a single budget range. When everyone can see the number, the awkward conversations happen early and politely.", "Then give each person one thing to own. One books the stay, one maps the food, one keeps the checklist. Ownership beats a group chat every time.", "Finally, vote on the big choices and move on. Perfect agreement is rare. A fair process is enough."] },
  { id: "autumn-cities", title: "Ten underrated cities for autumn", excerpt: "Fewer crowds, golden light, better prices.", date: "Sep 29, 2026", category: "Inspiration", photo: "photo-1507699622108-4be3abd695ad", author: "Jonas Weber", read: "8 min",
    body: ["Shoulder season is the best-kept secret in travel. The light is softer, the queues are shorter and prices drop.", "Think Porto for river walks, Ljubljana for cafe terraces, and Kanazawa for gardens in colour.", "Pack layers, book a refundable stay, and leave room in each day for wandering."] },
  { id: "whats-new", title: "What's new in Travel Plan", excerpt: "Offline maps, shared budgets and a faster itinerary builder.", date: "Sep 12, 2026", category: "Product", photo: "photo-1488646953014-85cb44e25828", author: "The Travel Plan team", read: "3 min",
    body: ["This release is about confidence on the road. Offline maps now cover your whole itinerary, and shared budgets split costs automatically.", "We also rebuilt the itinerary builder so dragging a place between days feels instant."] },
  { id: "kyoto-slow", title: "Three slow days in Kyoto", excerpt: "A gentle itinerary away from the crowds.", date: "Aug 30, 2026", category: "Stories", photo: "photo-1493976040374-85c8e12f0c0e", author: "Aiko Tanaka", read: "5 min",
    body: ["Kyoto rewards the early riser. Be at Fushimi Inari by seven and you will have the gates almost to yourself.", "Spend afternoons in a tea house, evenings in Pontocho, and leave one day empty on purpose."] },
  { id: "packing", title: "The carry-on packing list we actually use", excerpt: "Two weeks, one bag, no regrets.", date: "Aug 14, 2026", category: "Tips", photo: "photo-1553531384-cc64ac80f931", author: "Maya Ortiz", read: "4 min",
    body: ["Pack for seven days and do laundry. Choose one colour palette so everything mixes.", "Use the checklist tab in your trip so the list travels with the plan."] },
  { id: "road-trip", title: "A coastal road trip in 5 stops", excerpt: "Sea views, small towns and no rush.", date: "Jul 22, 2026", category: "Inspiration", photo: "photo-1469854523086-cc02fe5d8800", author: "Jonas Weber", read: "7 min",
    body: ["The best road trips are short on miles and long on stops. Five towns, three hours of driving a day at most.", "Book the first and last night, and stay flexible in between."] },
];

export const legal = {
  privacy: [
    ["What we collect", "We collect the information you give us, such as your name, email and the trips you plan, plus basic usage data that helps us fix bugs and improve the product."],
    ["How we use it", "We use your data to run Travel Plan, to sync your trips between devices and to send messages you ask for. We do not sell your personal data."],
    ["Sharing", "Trips are private by default. Content you make public or share with a link can be seen by anyone with access to it."],
    ["Your choices", "You can export or delete your data at any time from Settings. Deleting your account removes your trips within 30 days."],
    ["Cookies", "We use essential cookies to keep you signed in. Analytics and marketing cookies are optional and off until you accept them."],
    ["Contact", "Questions about privacy? Write to privacy@travelplan.example."],
  ],
  terms: [
    ["Using Travel Plan", "You must be at least 16 to use Travel Plan. You are responsible for the content you add and for keeping your login secure."],
    ["Your content", "You own your trips and guides. You give us permission to store and display them so the service works, and to show public content to other users."],
    ["Acceptable use", "Do not misuse the service, attempt to break it, or post unlawful or harmful content."],
    ["Subscriptions", "Pro renews automatically until cancelled. You can cancel any time and keep access until the end of the period. Refunds are available within 14 days of first payment."],
    ["Third-party links", "Hotel, flight and booking links go to partner sites. Their terms apply once you leave Travel Plan."],
    ["Changes", "We may update these terms and will tell you about material changes before they apply."],
  ],
};
