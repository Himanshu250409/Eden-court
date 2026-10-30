"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reduced } from "@/lib/gsap";
import { useStore, type TimeOfDay } from "@/store/useStore";
import { floors } from "@/data/floors";
import FloorSlider from "./FloorSlider";
import FloorTooltip from "./FloorTooltip";

// Canvas is client-only (no SSR)
const TowerCanvas = dynamic(() => import("./tower/TowerCanvas"), { ssr: false, loading: () => <div className="absolute inset-0 bg-ink" /> });

const TODS: { id: TimeOfDay; label: string }[] = [
  { id: "morning", label: "Morning" },
  { id: "golden", label: "Golden hour" },
  { id: "night", label: "Night" },
];

/**
 * STAGE 3 — Interactive tower. Pinned while the tower builds itself floor by floor (scroll-scrubbed).
 * Hover = preview, tap/click = open plan, outside = minimise.
 */
export default function TowerSection() {
  const root = useRef<HTMLElement>(null);
  const tod = useStore((s) => s.timeOfDay);
  const selected = useStore((s) => s.selectedFloor);
  const hovered = useStore((s) => s.hoveredFloor);
  const inView = useRef(false);

  useEffect(() => {
    const st = useStore.getState();
    const ctx = gsap.context(() => {
      if (reduced()) { st.setBuild(1); }
      else {
        ScrollTrigger.create({
          trigger: root.current, start: "top top", end: "+=140%", pin: true, scrub: true,
          onUpdate: (self) => useStore.getState().setBuild(Math.min(1, self.progress * 1.15)),
        });
      }
      // Panel auto-minimises when the user scrolls away from the tower.
      ScrollTrigger.create({
        trigger: root.current, start: "top bottom", end: "bottom top",
        onToggle: (self) => { inView.current = self.isActive; if (!self.isActive) { useStore.getState().minimise(); useStore.getState().setHovered(null); } },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // ↑ / ↓ change floor (when the tower is in view)
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (!inView.current || (e.key !== "ArrowUp" && e.key !== "ArrowDown")) return;
      const s = useStore.getState();
      const cur = s.hoveredFloor ?? s.selectedFloor ?? 1;
      const next = Math.max(0, Math.min(floors.length - 1, cur + (e.key === "ArrowUp" ? 1 : -1)));
      e.preventDefault();
      if (s.isPanelOpen && !s.isPanelMinimised) s.selectFloor(next, floors[next].units[0]);
      else s.setHovered(next);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  const active = hovered ?? selected;

  return (
    <section ref={root} id="tower" className="relative h-screen min-h-screen overflow-hidden bg-ink" aria-label="Interactive tower">
      <TowerCanvas />

      {/* overlays: never block the canvas except on their own controls */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute left-gutter top-[clamp(96px,14vh,160px)] max-w-[34ch]">
          <p className="label label-gold mb-6">The Residences</p>
          <h2 className="headline-md">Choose <em>your level.</em></h2>
          <p className="label mt-8 hidden opacity-60 md:block">Hover to preview · Click to open · ↑ ↓ to change floor</p>
          <p className="label mt-8 opacity-60 md:hidden">Tap a level below</p>
        </div>

        {/* day / dusk / night */}
        <div data-keep-panel className="pointer-events-auto absolute bottom-[clamp(24px,5vh,56px)] left-gutter hidden gap-8 md:flex">
          {TODS.map((t) => (
            <button key={t.id} onClick={() => useStore.getState().setTimeOfDay(t.id)} className={`label relative pb-2 text-[11px] transition-opacity duration-[900ms] ${tod === t.id ? "opacity-100" : "opacity-50 hover:opacity-100"}`} data-cursor="View">
              {t.label}
              <span className={`absolute bottom-0 left-0 h-px w-full origin-left bg-gold transition-transform duration-[1100ms] ${tod === t.id ? "scale-x-100" : "scale-x-0"}`} />
            </button>
          ))}
        </div>
      </div>

      <FloorSlider />
      <FloorTooltip />

      {/* mobile: time-of-day + floor chips */}
      <div data-keep-panel className="absolute inset-x-0 bottom-6 z-20 flex flex-col gap-4 md:hidden">
        <div className="flex justify-center gap-6">
          {TODS.map((t) => (<button key={t.id} onClick={() => useStore.getState().setTimeOfDay(t.id)} className={`label text-[10px] ${tod === t.id ? "text-gold" : "opacity-50"}`}>{t.label}</button>))}
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto px-6">
          {[...floors].reverse().map((f) => (
            <button key={f.level} onClick={() => useStore.getState().selectFloor(f.level, f.units[0])}
              className={`label shrink-0 rounded-full border px-5 py-3 text-[11px] ${active === f.level ? "border-gold bg-gold text-ink" : "border-gold/30"}`}>
              {f.level === 0 ? "G" : String(f.level).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
