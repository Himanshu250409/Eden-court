"use client";
import { useStore } from "@/store/useStore";
import { floors } from "@/data/floors";

/** Vertical floor slider on the right edge. Two-way synced with hover/selection. */
export default function FloorSlider() {
  const hovered = useStore((s) => s.hoveredFloor);
  const selected = useStore((s) => s.selectedFloor);
  const { setHovered, selectFloor } = useStore.getState();
  const active = hovered ?? selected;
  return (
    <div data-keep-panel className="pointer-events-auto absolute right-[clamp(24px,3vw,48px)] top-1/2 z-20 hidden -translate-y-1/2 md:block" role="slider" aria-label="Floor" aria-valuenow={active ?? 0} aria-valuemin={0} aria-valuemax={floors.length - 1}>
      <p className="label label-gold mb-6 text-center text-[10px]">Floor</p>
      <div className="relative flex flex-col items-center gap-[10px]">
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gold/25" />
        {[...floors].reverse().map((f) => {
          const on = active === f.level;
          return (
            <button key={f.level} onMouseEnter={() => setHovered(f.level)} onMouseLeave={() => setHovered(null)}
              onClick={() => selectFloor(f.level, f.units[0])} data-cursor={`Floor ${f.level}`}
              className="relative z-10 flex items-center gap-4 py-[2px]" aria-label={f.label}>
              <span className={`label text-[10px] transition-all duration-[900ms] ${on ? "translate-x-0 text-gold opacity-100" : "translate-x-2 opacity-0"}`}>{String(f.level).padStart(2, "0")}</span>
              <span className={`block rounded-full transition-all duration-[900ms] ${on ? "h-[9px] w-[9px] bg-gold shadow-[0_0_14px_#C2A878]" : "h-[5px] w-[5px] bg-ivory/50"}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
