"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { units, getFloor } from "@/data/floors";
import EnquiryForm from "./EnquiryForm";

/** Opened by "Enquire about this unit" — form is prefilled with floor + unit. */
export default function EnquiryModal() {
  const { open, floor, unit } = useStore((s) => s.enquiry);
  const close = useStore((s) => s.closeEnquiry);
  const interest = unit != null && floor != null ? `${units[unit].name} · ${getFloor(floor).label}` : "";
  return (
    <AnimatePresence>
      {open && (
        <motion.div key="enq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[88] flex items-center justify-center bg-ink/80 p-6 backdrop-blur-md" onClick={close} data-lenis-prevent>
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()} className="glass max-h-[90vh] w-full max-w-[720px] overflow-y-auto p-[clamp(32px,5vw,64px)]">
            <div className="mb-10 flex items-start justify-between gap-6">
              <div>
                <p className="label label-gold">Private enquiry</p>
                <p className="serif mt-4 text-[clamp(28px,3vw,44px)] leading-tight">{interest || "Request a private viewing"}</p>
              </div>
              <button onClick={close} aria-label="Close" className="label" data-cursor="Close">✕</button>
            </div>
            <EnquiryForm defaultInterest={interest} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
