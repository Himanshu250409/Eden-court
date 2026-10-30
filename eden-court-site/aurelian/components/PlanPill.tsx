"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { getFloor, units } from "@/data/floors";

/** Minimised plan panel: small floating pill "Floor 12 · 2 BHK". Tap to re-open, ✕ to dismiss. */
export default function PlanPill() {
  const { selectedFloor, selectedUnit, isPanelOpen, isPanelMinimised, expand, dismiss } = useStore();
  const show = isPanelOpen && isPanelMinimised && selectedFloor != null;
  const f = selectedFloor != null ? getFloor(selectedFloor) : null;
  const text = f ? `Floor ${f.level}${selectedUnit ? ` · ${units[selectedUnit].name}` : f.type === "amenity" ? " · Amenities" : ""}` : "";
  return (
    <AnimatePresence>
      {show && (
        <motion.div data-keep-panel initial={{ opacity: 0, y: 24, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.92 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="glass fixed bottom-24 right-6 z-[75] flex items-center gap-2 !rounded-full p-2 pl-7 md:bottom-6">
          <button onClick={expand} className="label flex items-center gap-4 py-3 pr-3 text-[11px]" data-cursor="Open" aria-label="Re-open floor plan">
            {text}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden><path d="M2 8v4h4M12 6V2H8M12 2 7.5 6.5M2 12l4.5-4.5" /></svg>
          </button>
          <button onClick={dismiss} aria-label="Dismiss" className="label flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 hover:border-gold" data-cursor="Close">✕</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
