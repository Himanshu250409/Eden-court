"use client";
import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/useStore";
import { getFloor, units } from "@/data/floors";
import { formatPrice } from "@/lib/format";
import { dict } from "@/lib/i18n";

/** Follows the cursor over the tower: floor, unit types, starting price, availability. 32px padding. */
export default function FloorTooltip() {
  const hovered = useStore((s) => s.hoveredFloor);
  const currency = useStore((s) => s.currency);
  const lang = useStore((s) => s.lang);
  const ref = useRef<HTMLDivElement>(null);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    const move = (e: MouseEvent) => {
      const el = ref.current; if (!el) return;
      const w = el.offsetWidth, h = el.offsetHeight;
      const x = Math.min(e.clientX + 36, window.innerWidth - w - 24);
      const y = Math.min(Math.max(e.clientY - h / 2, 88), window.innerHeight - h - 24);
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (!fine || hovered == null) return null;
  const f = getFloor(hovered);
  const prices = f.units.map((u) => units[u].stats.price).filter((p): p is number => p != null);
  const from = prices.length ? Math.min(...prices) : null;

  return (
    <div ref={ref} className="glass pointer-events-none fixed left-0 top-0 z-[70] w-[300px] p-8" style={{ transform: "translate(-999px,-999px)" }}>
      <p className="label label-gold">{f.label}</p>
      {f.type === "residential" ? (
        <dl className="mt-5 flex flex-col gap-5">
          <div><dt className="label mb-2 text-[10px] opacity-60">Residences</dt><dd className="serif text-[20px] leading-snug">{f.units.map((u) => units[u].name).join(" · ")}</dd></div>
          <div><dt className="label mb-2 text-[10px] opacity-60">{dict[lang].price}</dt><dd className="serif text-[20px]">{formatPrice(from, currency, dict[lang].onRequest)}</dd></div>
          <div><dt className="label mb-2 text-[10px] opacity-60">Availability</dt><dd className="serif text-[20px]">{f.availability}</dd></div>
        </dl>
      ) : (
        <p className="serif mt-5 text-[20px] leading-snug">{f.availability}</p>
      )}
    </div>
  );
}
