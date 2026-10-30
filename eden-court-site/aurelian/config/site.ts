/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIG — the ONLY file you need to edit to re-skin the
 *  template for another project. Search for "REPLACE" markers.
 * ─────────────────────────────────────────────────────────────
 */
export const site = {
  name: "Eden Court",
  byline: "by Silverbill Properties",
  city: "Saily, Silvassa",
  region: "Dadra & Nagar Haveli",
  // Full address (taken from the brochure)
  address: "Survey No. 2229, Alok Pada, Village Saily, Silvassa, Daman & Diu and Dadra & Nagar Haveli, PIN 396240",
  locality: "Rakholi, Saily, Silvassa",
  tagline: "Make room for a different rhythm.",
  poeticLine: "A step into the world of luxury.",
  reraNumber: "PR3000002600273", // MahaRERA registration from brochure
  reraUrl: "https://maharera.mahaonline.gov.in",
  phone: "+91 99749 48800",
  whatsapp: "919974948800", // digits only, with country code
  email: "edencourt@silverbillgroup.com",
  brochureUrl: "/brochure.pdf", // REPLACE: your full brochure PDF in /public
  disclaimer:
    "Pictures, visuals, perspective views, plans and furnishings are indicative and for representation only. Subject to approval of competent authorities and RERA rules.",

  // Palette is mirrored in app/globals.css (:root). Keep both in sync.
  colors: {
    ivory: "#F4EFE6",
    ink: "#0A0A0A",
    forest: "#1B2620",
    gold: "#C2A878",
    stone: "#D9D2C5",
  },

  // Building structure (from brief): Ground = stilt parking, L1 = podium parking,
  // L2–L13 residences, L14 = amenities on the top floor.
  building: {
    stiltLevel: 0,
    podiumLevel: 1,
    firstResidential: 2,
    lastResidential: 13,
    amenityLevel: 14,
  },

  // Image paths — REPLACE placeholders with real photography in /public/images
  images: {
    hero: "/images/tower-night.jpg",
    dusk: "/images/tower-dusk.jpg",
    day: "/images/tower-day.jpg",
    // Lifestyle photos are NOT in the brochure. Drop files here to replace the
    // gradient placeholders (each falls back gracefully if missing).
    interiorA: "/images/interior-a.jpg",
    interiorB: "/images/interior-b.jpg",
    wellness: "/images/wellness.jpg",
    lifestyle: "/images/lifestyle.jpg",
    collage: ["/images/collage-1.jpg", "/images/collage-2.jpg", "/images/collage-3.jpg"],
    whyCity: "/images/why-city.jpg",
  },
  video: { src: "/media/walkthrough.mp4", poster: "/images/tower-dusk.jpg" }, // REPLACE

  stats: [
    // REPLACE with verified project facts
    { value: 13, suffix: "", label: "Levels above podium" },
    { value: 4, suffix: "", label: "Residence types" },
    { value: 24, suffix: "", label: "Lifestyle amenities" },
  ],

  whyCity: {
    title: ["Why", "Silvassa"],
    body: "A calm, green gateway between Gujarat and Maharashtra, with wide roads, rolling hills and the Damanganga close by. Eden Court gives you the quiet of the valley with the whole region within reach.",
  },

  // Neighbourhood drive times — REPLACE with verified values
  neighbourhood: [
    { name: "Eden Court", minutes: 0, x: 50, y: 52, home: true },
    { name: "Silvassa town", minutes: 15, x: 66, y: 38 },
    { name: "Vapi railway station", minutes: 35, x: 24, y: 28 },
    { name: "Daman beaches", minutes: 50, x: 20, y: 74 },
    { name: "Mumbai highway (NH48)", minutes: 30, x: 80, y: 70 },
  ],

  // 12 ways to spend a day — mapped from the brochure's amenity icons
  amenities: [
    { title: "Swimming Pool", copy: "Slow mornings by the water." },
    { title: "Spa", copy: "Quiet rooms to reset." },
    { title: "Gym", copy: "Equipped for every routine." },
    { title: "Home Theatre", copy: "Cinema evenings at home." },
    { title: "Roof Top Sky Garden", copy: "Dinner under open sky." },
    { title: "Yoga Studio", copy: "Stillness above the city." },
    { title: "Cafe Dining", copy: "Coffee, without leaving home." },
    { title: "Garden & Seating Area", copy: "Green rooms outdoors." },
    { title: "Walking & Jogging Tracks", copy: "Laps in the open air." },
    { title: "Multipurpose Hall", copy: "Gatherings of every size." },
    { title: "Sports Courts", copy: "Football, cricket, badminton, basketball, pickleball." },
    { title: "Party Area & Pergola", copy: "Celebrations, beautifully hosted." },
  ],

  languages: ["en", "ar", "zh", "ru", "fr"] as const,
  currencies: {
    // REPLACE rates with a live source before launch
    INR: { symbol: "₹", rate: 1 },
    USD: { symbol: "$", rate: 0.012 },
    AED: { symbol: "AED ", rate: 0.044 },
    EUR: { symbol: "€", rate: 0.011 },
    GBP: { symbol: "£", rate: 0.0095 },
  },
} as const;

export type Lang = (typeof site.languages)[number];
export type Currency = keyof typeof site.currencies;
