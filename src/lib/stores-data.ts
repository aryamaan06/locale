export interface StoreLocation {
  id: string;
  name: string;
  neighborhood: string;
  city: string;
  state: string;
  address: string;
  lat: number;
  lng: number;
  radiusKm: number;
  cohortAge: "24_and_younger" | "25_to_29" | "30_to_34" | "35_to_44" | "45_to_54";
  anchorSeedEntities: string[];
}

export interface BrandProfile {
  id: string;
  name: string;
  category: string;
  tagline: string;
  brandVoice: string;
  seedEntities: string[];
  guardrails: string[];
  stores: StoreLocation[];
}

export const SHARED_STORE_FLEET: StoreLocation[] = [
  {
    id: "store-williamsburg",
    name: "Store #01 — Williamsburg",
    neighborhood: "Williamsburg",
    city: "Brooklyn",
    state: "NY",
    address: "184 Wythe Ave, Brooklyn, NY 11249",
    lat: 40.7181,
    lng: -73.9571,
    radiusKm: 2.5,
    cohortAge: "25_to_29",
    anchorSeedEntities: [],
  },
  {
    id: "store-soco",
    name: "Store #02 — South Congress",
    neighborhood: "South Congress",
    city: "Austin",
    state: "TX",
    address: "1415 S Congress Ave, Austin, TX 78704",
    lat: 30.2494,
    lng: -97.7498,
    radiusKm: 3.0,
    cohortAge: "25_to_29",
    anchorSeedEntities: [],
  },
  {
    id: "store-silverlake",
    name: "Store #03 — Silver Lake",
    neighborhood: "Silver Lake",
    city: "Los Angeles",
    state: "CA",
    address: "3515 Sunset Blvd, Los Angeles, CA 90026",
    lat: 34.0897,
    lng: -118.2768,
    radiusKm: 2.5,
    cohortAge: "30_to_34",
    anchorSeedEntities: [],
  },
  {
    id: "store-wynwood",
    name: "Store #04 — Wynwood Arts District",
    neighborhood: "Wynwood",
    city: "Miami",
    state: "FL",
    address: "250 NW 24th St, Miami, FL 33127",
    lat: 25.8007,
    lng: -80.1994,
    radiusKm: 2.5,
    cohortAge: "25_to_29",
    anchorSeedEntities: [],
  },
  {
    id: "store-capitolhill",
    name: "Store #05 — Capitol Hill",
    neighborhood: "Capitol Hill",
    city: "Seattle",
    state: "WA",
    address: "1524 E Pike St, Seattle, WA 98122",
    lat: 47.6141,
    lng: -122.3125,
    radiusKm: 2.5,
    cohortAge: "25_to_29",
    anchorSeedEntities: [],
  },
  {
    id: "store-wickerpark",
    name: "Store #06 — Wicker Park",
    neighborhood: "Wicker Park",
    city: "Chicago",
    state: "IL",
    address: "1422 N Milwaukee Ave, Chicago, IL 60622",
    lat: 41.9088,
    lng: -87.6796,
    radiusKm: 2.5,
    cohortAge: "25_to_29",
    anchorSeedEntities: [],
  },
  {
    id: "store-shoreditch",
    name: "Store #07 — Shoreditch",
    neighborhood: "Shoreditch",
    city: "London",
    state: "UK",
    address: "132 Commercial St, London E1 6AZ, UK",
    lat: 51.5205,
    lng: -0.0754,
    radiusKm: 2.0,
    cohortAge: "25_to_29",
    anchorSeedEntities: [],
  },
  {
    id: "store-shibuya",
    name: "Store #08 — Shibuya",
    neighborhood: "Shibuya",
    city: "Tokyo",
    state: "JP",
    address: "1-22-10 Jinnan, Shibuya-ku, Tokyo 150-0041, JP",
    lat: 35.6628,
    lng: 139.7003,
    radiusKm: 2.5,
    cohortAge: "25_to_29",
    anchorSeedEntities: [],
  },
  {
    id: "store-marais",
    name: "Store #09 — Le Marais",
    neighborhood: "Le Marais",
    city: "Paris",
    state: "FR",
    address: "32 Rue Vieille-du-Temple, 75004 Paris, FR",
    lat: 48.8575,
    lng: 2.3582,
    radiusKm: 2.0,
    cohortAge: "30_to_34",
    anchorSeedEntities: [],
  },
  {
    id: "store-kreuzberg",
    name: "Store #10 — Kreuzberg",
    neighborhood: "Kreuzberg",
    city: "Berlin",
    state: "DE",
    address: "Oranienstraße 24, 10999 Berlin, DE",
    lat: 52.4990,
    lng: 13.4180,
    radiusKm: 2.5,
    cohortAge: "25_to_29",
    anchorSeedEntities: [],
  },
];

export const PRESET_BRANDS: BrandProfile[] = [
  {
    id: "aura-coffee",
    name: "Aura Specialty Roasters",
    category: "Specialty Coffee & Listening Lounges",
    tagline: "Single-origin espresso bars with neighborhood vinyl & book programming.",
    brandVoice: "Warm, editorial, design-forward, unhurried, rooted in local independent culture.",
    seedEntities: ["Blue Bottle Coffee", "A24", "Kinfolk", "Khruangbin"],
    guardrails: [
      "Zero Seed Echo: Strip brand seeds from both local and baseline lists",
      "Geospatial Boundary: Partner venues must be verified places within the store's radius",
      "Retail Tone Filter: Exclude hotel/lodging categories and require complexity <= 8",
    ],
    stores: SHARED_STORE_FLEET,
  },
  {
    id: "pulse-fitness",
    name: "Pulse Movement & Recovery",
    category: "Boutique Movement & Contrast Therapy Studios",
    tagline: "Rhythmic movement and recovery lounges tuned to local neighborhood tempo.",
    brandVoice: "Athletic, architectural, rhythmic, recovery-focused.",
    seedEntities: ["Alo Yoga", "Fred again..", "Equinox", "Outdoor Voices"],
    guardrails: [
      "Zero Seed Echo: Strip brand seeds from both local and baseline lists",
      "Geospatial Boundary: Partner venues must sit within the store's WKT radius",
      "Wellness Alignment: Focus co-promotions on organic dining, design, or outdoor culture",
    ],
    stores: SHARED_STORE_FLEET,
  },
  {
    id: "verde-kitchen",
    name: "Verde Fire-Roasted Kitchen",
    category: "Chef-Driven Fast-Casual Mediterranean",
    tagline: "Seasonal wood-fired bowls and natural wine programs rooted in local culture.",
    brandVoice: "Vibrant, culinary-forward, social, warm evening hospitality.",
    seedEntities: ["Sweetgreen", "Bon Appétit", "Anderson .Paak", "Momofuku"],
    guardrails: [
      "Zero Seed Echo: Strip brand seeds from both local and baseline lists",
      "Geospatial Boundary: Partner venues must sit within the store's WKT radius",
      "Culinary & Arts Focus: Feature local independent bookstores, galleries, or cinema",
    ],
    stores: SHARED_STORE_FLEET,
  },
  {
    id: "komorebi-atelier",
    name: "Komorebi Design Atelier",
    category: "Architectural Objects & Independent Print",
    tagline: "Minimalist home objects, art monographs, and neighborhood design workshops.",
    brandVoice: "Monastic, materials-first, quiet luxury, rooted in artisanal craft.",
    seedEntities: ["Aesop", "Muji", "Cereal Magazine", "Noguchi"],
    guardrails: [
      "Zero Seed Echo: Strip brand seeds from both local and baseline lists",
      "Geospatial Boundary: Partner venues must sit within the store's WKT radius",
      "Craft Alignment: Feature independent ceramic studios, bookbinders, and specialty tea",
    ],
    stores: SHARED_STORE_FLEET,
  },
];