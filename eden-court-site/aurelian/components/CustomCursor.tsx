"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useStore } from "@/store/useStore";
import { getFloor } from "@/data/floors";

/** Gold dot → ring with label ("Explore", "View", "Drag", "Floor 12") over [data-cursor]. Desktop only. */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const hovered = useStore((s) => s.hoveredFloor);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const xd = gsap.quickTo(dot.current, "x", { duration: 0.15 });
    const yd = gsap.quickTo(dot.current, "y", { duration: 0.15 });
    const xr = gsap.quickTo(ring.current, "x", { duration: 0.6, ease: "power3.out" });
    const yr = gsap.quickTo(ring.current, "y", { duration: 0.6, ease: "power3.out" });
    const move = (e: MouseEvent) => { xd(e.clientX); yd(e.clientY); xr(e.clientX); yr(e.clientY); };
    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-cursor]") as HTMLElement | null;
      setLabel(el ? el.dataset.cursor ?? "" : null);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); };
  }, []);

  const text = hovered != null ? `Floor ${getFloor(hovered).level}` : label;
  const active = text != null;

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[95] hidden lg:block" aria-hidden>
      <div ref={dot} className="absolute -left-[3px] -top-[3px] h-[6px] w-[6px] rounded-full bg-gold" />
      <div
        ref={ring}
        className="absolute -left-[3px] -top-[3px]"
      >
        <div
          className="flex items-center justify-center rounded-full border border-gold/70 text-gold transition-all duration-[900ms]"
          style={{
            width: active ? 96 : 0, height: active ? 96 : 0,
            marginLeft: active ? -45 : 0, marginTop: active ? -45 : 0,
            transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
            backdropFilter: active ? "blur(4px)" : undefined,
          }}
        >
          <span className="label whitespace-nowrap text-[10px] tracking-[0.2em]" style={{ opacity: active ? 1 : 0, transition: "opacity .6s" }}>{text}</span>
        </div>
      </div>
    </div>
  );
}
