import type { TimeOfDay } from "@/store/useStore";

export const FH = 1; // floor height (scene units)
export const MID_Y = 7.5; // rough vertical centre of the tower
export const LIFT = 2.6; // how far floors above the selected one lift in the exploded view

/** Mutable value shared by all floors (window glow strength), animated by <Atmosphere/>. Not React state on purpose. */
export const atmos = { glow: 0.5 };

export interface TodPreset {
  bg: string; fog: string; sun: string; sunI: number; sunPos: [number, number, number];
  amb: number; ambColor: string; glow: number; ground: string; water: string;
}

export const TOD: Record<TimeOfDay, TodPreset> = {
  morning: { bg: "#cfdde6", fog: "#d7e3ea", sun: "#fff4e0", sunI: 2.2, sunPos: [14, 18, 8], amb: 0.85, ambColor: "#e8f0ff", glow: 0.05, ground: "#6f8a62", water: "#7fb4c8" },
  golden: { bg: "#e8b98c", fog: "#e2b48a", sun: "#ffb36b", sunI: 2.6, sunPos: [-16, 7, 11], amb: 0.55, ambColor: "#ffd9b0", glow: 0.55, ground: "#55654a", water: "#d9a56a" },
  night: { bg: "#0a0f1f", fog: "#0a0f1f", sun: "#8fa8ff", sunI: 0.3, sunPos: [-8, 14, 4], amb: 0.22, ambColor: "#4a5a99", glow: 1.7, ground: "#1a2218", water: "#3d6a86" },
};
