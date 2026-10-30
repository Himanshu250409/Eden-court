"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { useStore } from "@/store/useStore";
import { getFloor, units, type UnitId } from "@/data/floors";
import { formatPrice } from "@/lib/format";
import { dict } from "@/lib/i18n";
import { site } from "@/config/site";
import UnitSelector from "./UnitSelector";

const ease = [0.22, 1, 0.36, 1] as const;

/** Plan image with 3D mouse tilt (max 6°) and animated gold highlight of the selected unit. */
function PlanCard({ unit, mode }: { unit: UnitId; mode: "2d" | "3d" }) {
  const ref = useRef<HTMLDivElement>(null);
  const u = units[unit];
  const move = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ref.current!.style.transform = `perspective(900px) rotateX(${(-py * 12).toFixed(2)}deg) rotateY(${(px * 12).toFixed(2)}deg)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)"; };
  return (
    <div className="p-6"> {/* 24px of space around the card */}
      <div ref={ref} onMouseMove={move} onMouseLeave={leave}
        className="relative overflow-hidden rounded-[20px] bg-ivory shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)]"
        style={{ transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1)", transformStyle: "preserve-3d" }}>
        <AnimatePresence mode="wait">
          <motion.div key={unit + mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="relative p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mode === "2d" ? u.plan : u.iso} alt={`${u.title} ${mode === "2d" ? "plan" : "3D layout"}`} className="block h-auto w-full" />
            {mode === "2d" && (
              <svg className="pointer-events-none absolute inset-4" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
                <motion.rect x={u.region.x} y={u.region.y} width={u.region.w} height={u.region.h} rx="1.5"
                  fill="rgba(194,168,120,0.22)" stroke="#C2A878" strokeWidth="0.5" vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 1.6, ease }} />
              </svg>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="label text-[10px] opacity-60">{label}</span>
      <span className="serif text-[24px] leading-tight">{value}</span>
    </div>
  );
}

/**
 * Floating glass layout panel. It never blocks the page:
 *  - tap/click outside, or Esc → minimises to <PlanPill/>
 *  - tapping another floor swaps content in place
 *  - mobile: bottom sheet (80vh), drag the handle down to minimise
 */
export default function PlanPanel() {
  const { selectedFloor, selectedUnit, isPanelOpen, isPanelMinimised, currency, lang } = useStore();
  const { setUnit, minimise, dismiss, openEnquiry, setInside } = useStore.getState();
  const panel = useRef<HTMLElement>(null);
  const drag = useDragControls();
  const [mode, setMode] = useState<"2d" | "3d">("2d");
  const [mobile, setMobile] = useState(false);
  const visible = isPanelOpen && !isPanelMinimised && selectedFloor != null;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setMobile(mq.matches);
    set(); mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Outside click / tap and Escape → minimise. Clicks inside never trigger this.
  useEffect(() => {
    if (!visible) return;
    const down = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (panel.current?.contains(t)) return;
      if (t.closest("[data-keep-panel]") || t.closest("[data-tower-canvas]")) return; // canvas handles itself (swap / miss)
      minimise();
    };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") minimise(); };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", down); document.removeEventListener("keydown", key); };
  }, [visible, minimise]);

  useEffect(() => { setMode("2d"); }, [selectedFloor]);

  const floor = selectedFloor != null ? getFloor(selectedFloor) : null;
  const unitId: UnitId | null = floor && floor.units.length ? (selectedUnit && floor.units.includes(selectedUnit) ? selectedUnit : floor.units[0]) : null;
  const unit = unitId ? units[unitId] : null;
  const typeName = floor?.type === "residential" ? "Residences" : floor?.type === "amenity" ? "Amenities & Sky Club" : floor?.type === "podium" ? "Podium Parking" : "Stilt Parking";

  return (
    <AnimatePresence>
      {visible && floor && (
        <motion.aside
          ref={panel} key="panel" data-lenis-prevent
          initial={mobile ? { y: "100%" } : { x: 80, opacity: 0 }} animate={mobile ? { y: 0 } : { x: 0, opacity: 1 }} exit={mobile ? { y: "100%" } : { x: 80, opacity: 0 }}
          transition={{ duration: 1.1, ease }}
          drag={mobile ? "y" : false} dragListener={false} dragControls={drag} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.4 }}
          onDragEnd={(_, i) => { if (i.offset.y > 120) minimise(); }}
          className="glass fixed inset-x-0 bottom-0 z-[72] h-[80vh] overflow-y-auto !rounded-b-none p-9 md:inset-x-auto md:bottom-6 md:right-6 md:top-24 md:h-auto md:w-[460px] md:!rounded-[28px]"
          aria-label={`${floor.label} layout`}>
          {mobile && <div onPointerDown={(e) => drag.start(e)} className="-mt-4 mb-6 flex cursor-grab touch-none justify-center py-3"><span className="h-1 w-12 rounded-full bg-gold/60" /></div>}

          <button onClick={dismiss} aria-label="Close" className="label absolute right-8 top-8" data-cursor="Close">✕</button>

          <AnimatePresence mode="wait">
            <motion.div key={floor.level} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.7, ease }}>
              {/* header */}
              <p className="label label-gold">{floor.level === 0 ? "GROUND" : `LEVEL ${String(floor.level).padStart(2, "0")}`}</p>
              <h3 className="serif mt-3 text-[34px] leading-[1.1]">{unit ? unit.title : typeName}</h3>
              <div className="gold-line my-7" /> {/* 28px margins */}

              {floor.type === "residential" && unit && unitId ? (
                <>
                  <UnitSelector available={floor.units} value={unitId} onChange={setUnit} />
                  <div className="mt-6 flex gap-3">
                    {(["2d", "3d"] as const).map((m) => (
                      <button key={m} onClick={() => setMode(m)} className={`label text-[10px] ${mode === m ? "text-gold" : "opacity-50"}`}>{m === "2d" ? "Floor plan" : "3D layout"}</button>
                    ))}
                  </div>
                  <PlanCard unit={unitId} mode={mode} />
                  <div className="grid grid-cols-2 gap-6">
                    <Stat label="Living room" value={unit.stats.living} />
                    <Stat label="Balcony" value={unit.stats.balcony} />
                    <Stat label="Bedrooms" value={unit.stats.bedrooms} />
                    <Stat label="Bathrooms" value={unit.stats.bathrooms} />
                    <Stat label="View" value={unit.stats.view} />
                    <Stat label={dict[lang].price} value={formatPrice(unit.stats.price, currency, dict[lang].onRequest)} />
                  </div>
                  <div className="mt-10 flex flex-col gap-4">
                    <button className="btn btn-solid" onClick={() => { setMode("3d"); setInside(true); }} data-cursor="View">{dict[lang].view3d}</button>
                    <a className="btn" href={site.brochureUrl} download data-cursor="Download">{dict[lang].brochure}</a>
                    <button className="btn" onClick={() => openEnquiry(floor.level, unitId)} data-cursor="Enquire">{dict[lang].enquireUnit}</button>
                  </div>
                </>
              ) : (
                <>
                  <p className="body-lux text-[17px]">
                    {floor.type === "amenity"
                      ? "The top floor is given over to residents: sky lounge, pool deck and gardens above the valley. See the full list below."
                      : floor.type === "podium"
                      ? "A podium level of covered parking, with landscaped decks above."
                      : "Stilt-level parking at ground, keeping the garden and entrance forecourt open."}
                  </p>
                  {floor.type === "amenity" && (
                    <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
                      {site.amenities.map((a) => <li key={a.title} className="label text-[10px] leading-relaxed opacity-80">{a.title}</li>)}
                    </ul>
                  )}
                  <div className="mt-10 flex flex-col gap-4">
                    <button className="btn" onClick={() => openEnquiry(floor.level)} data-cursor="Enquire">{dict[lang].enquire}</button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
