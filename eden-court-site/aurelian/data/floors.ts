import { site } from "@/config/site";

/**
 * FLOOR + UNIT DATA
 * Unit layouts, room sizes and counts come from the Eden Court brochure.
 * Carpet areas, prices and per-floor availability are NOT in the brochure —
 * they are marked PLACEHOLDER and show "On request" until you fill them in.
 */

export type UnitId = "2bhk-cosy" | "2bhk-premium" | "3bhk" | "5bhk";

export interface Unit {
  id: UnitId;
  name: string; // pill label
  title: string; // large serif heading
  plan: string; // 2D plan image
  iso: string; // 3D layout image
  /** Highlight region on the plan, in % of the image: x, y, w, h (approximate) */
  region: { x: number; y: number; w: number; h: number };
  stats: {
    living: string;
    bedrooms: string;
    bathrooms: string;
    balcony: string;
    view: string;
    carpet: string; // PLACEHOLDER
    price: number | null; // PLACEHOLDER, in INR. null => "On request"
  };
}

export const units: Record<UnitId, Unit> = {
  "2bhk-cosy": {
    id: "2bhk-cosy",
    name: "2 BHK Cosy",
    title: "2 Bedroom · Cosy Living",
    plan: "/images/2bhk-cosy-plan.jpg",
    iso: "/images/2bhk-cosy-iso.jpg",
    region: { x: 3, y: 22, w: 58, h: 50 },
    stats: { living: "10'2\" × 18'5\"", bedrooms: "2", bathrooms: "2", balcony: "10'5\" × 5'10\"", view: "Valley / Podium", carpet: "On request", price: null },
  },
  "2bhk-premium": {
    id: "2bhk-premium",
    name: "2 BHK Premium",
    title: "2 Bedroom · Premium",
    plan: "/images/2bhk-premium-plan.jpg",
    iso: "/images/2bhk-premium-iso.jpg",
    region: { x: 20, y: 6, w: 52, h: 42 },
    stats: { living: "11'11\" × 9'6\"", bedrooms: "2", bathrooms: "3", balcony: "11'7\" × 5'10\"", view: "Hills / Garden", carpet: "On request", price: null },
  },
  "3bhk": {
    id: "3bhk",
    name: "3 BHK",
    title: "3 Bedroom Residence",
    plan: "/images/3bhk-plan.jpg",
    iso: "/images/3bhk-iso.jpg",
    region: { x: 28, y: 36, w: 34, h: 50 },
    stats: { living: "11'5\" × 13'11\"", bedrooms: "3", bathrooms: "4", balcony: "3 balconies", view: "Hills / Garden", carpet: "On request", price: null },
  },
  "5bhk": {
    id: "5bhk",
    name: "5 BHK Jodi",
    title: "5 Bedroom · Residence / Jodi",
    plan: "/images/5bhk-plan.jpg",
    iso: "/images/5bhk-iso.jpg",
    region: { x: 22, y: 30, w: 56, h: 36 },
    stats: { living: "24'9\" × 21'2\"", bedrooms: "4 + Study", bathrooms: "5", balcony: "15'2\" × 5'8\"", view: "Skyline / Hills", carpet: "On request", price: null },
  },
};

export interface FloorData {
  level: number; // 0 = ground
  label: string; // "Ground", "Podium", "Level 04" …
  type: "stilt" | "podium" | "residential" | "amenity";
  units: UnitId[]; // PLACEHOLDER availability
  availability: string; // PLACEHOLDER
}

const { stiltLevel, podiumLevel, firstResidential, lastResidential, amenityLevel } = site.building;

// PLACEHOLDER mix of units per floor — replace with the real inventory.
function unitsFor(level: number): UnitId[] {
  if (level >= 12) return ["3bhk", "5bhk"];
  if (level >= 8) return ["2bhk-premium", "3bhk"];
  return ["2bhk-cosy", "2bhk-premium", "3bhk"];
}

export const floors: FloorData[] = Array.from({ length: amenityLevel + 1 }, (_, level) => {
  const pad = String(level).padStart(2, "0");
  if (level === stiltLevel) return { level, label: "Ground · Stilt Parking", type: "stilt", units: [], availability: "Parking" };
  if (level === podiumLevel) return { level, label: "Level 01 · Podium Parking", type: "podium", units: [], availability: "Parking" };
  if (level === amenityLevel) return { level, label: `Level ${pad} · Amenities`, type: "amenity", units: [], availability: "Residents' club" };
  return {
    level,
    label: `Level ${pad}`,
    type: "residential",
    units: unitsFor(level),
    availability: "Available", // PLACEHOLDER
  } as FloorData;
});

export const residentialRange = [firstResidential, lastResidential] as const;
export const getFloor = (level: number) => floors.find((f) => f.level === level)!;
