"use client";
import { units, type UnitId } from "@/data/floors";

/** Unit pills (12px gaps). */
export default function UnitSelector({ available, value, onChange }: { available: UnitId[]; value: UnitId; onChange: (u: UnitId) => void }) {
  return (
    <div className="flex flex-wrap gap-3" role="tablist">
      {available.map((id) => {
        const on = id === value;
        return (
          <button key={id} role="tab" aria-selected={on} onClick={() => onChange(id)} data-cursor="View"
            className={`label rounded-full border px-5 py-3 text-[11px] transition-all duration-[900ms] ${on ? "border-gold bg-gold text-ink" : "border-gold/30 hover:border-gold"}`}>
            {units[id].name}
          </button>
        );
      })}
    </div>
  );
}
