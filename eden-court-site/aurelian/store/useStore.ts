import { create } from "zustand";
import type { Currency, Lang } from "@/config/site";
import type { UnitId } from "@/data/floors";

export type TimeOfDay = "morning" | "golden" | "night";

interface State {
  hoveredFloor: number | null;
  selectedFloor: number | null;
  selectedUnit: UnitId | null;
  isPanelOpen: boolean;
  isPanelMinimised: boolean;
  timeOfDay: TimeOfDay;
  soundOn: boolean;
  lang: Lang;
  currency: Currency;
  buildProgress: number; // 0..1, driven by scroll in TowerSection
  menuOpen: boolean;
  enquiry: { open: boolean; floor?: number; unit?: UnitId };
  insideUnit: boolean;

  setHovered: (f: number | null) => void;
  selectFloor: (f: number, unit?: UnitId) => void;
  setUnit: (u: UnitId) => void;
  minimise: () => void;
  expand: () => void;
  dismiss: () => void;
  setTimeOfDay: (t: TimeOfDay) => void;
  toggleSound: () => void;
  setLang: (l: Lang) => void;
  setCurrency: (c: Currency) => void;
  setBuild: (p: number) => void;
  setMenu: (o: boolean) => void;
  openEnquiry: (floor?: number, unit?: UnitId) => void;
  closeEnquiry: () => void;
  setInside: (v: boolean) => void;
}

export const useStore = create<State>((set) => ({
  hoveredFloor: null,
  selectedFloor: null,
  selectedUnit: null,
  isPanelOpen: false,
  isPanelMinimised: false,
  timeOfDay: "golden",
  soundOn: false,
  lang: "en",
  currency: "INR",
  buildProgress: 0,
  menuOpen: false,
  enquiry: { open: false },
  insideUnit: false,

  setHovered: (hoveredFloor) => set({ hoveredFloor }),
  // Selecting a floor (also swaps content when the panel is already open)
  selectFloor: (selectedFloor, unit) =>
    set((s) => ({
      selectedFloor,
      selectedUnit: unit ?? null,
      isPanelOpen: true,
      isPanelMinimised: false,
      insideUnit: false,
      hoveredFloor: s.hoveredFloor,
    })),
  setUnit: (selectedUnit) => set({ selectedUnit }),
  minimise: () => set((s) => (s.isPanelOpen ? { isPanelMinimised: true, insideUnit: false } : s)),
  expand: () => set({ isPanelMinimised: false }),
  dismiss: () => set({ selectedFloor: null, selectedUnit: null, isPanelOpen: false, isPanelMinimised: false, insideUnit: false }),
  setTimeOfDay: (timeOfDay) => set({ timeOfDay }),
  toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
  setLang: (lang) => set({ lang }),
  setCurrency: (currency) => set({ currency }),
  setBuild: (buildProgress) => set({ buildProgress }),
  setMenu: (menuOpen) => set({ menuOpen }),
  openEnquiry: (floor, unit) => set({ enquiry: { open: true, floor, unit } }),
  closeEnquiry: () => set({ enquiry: { open: false } }),
  setInside: (insideUnit) => set({ insideUnit }),
}));
