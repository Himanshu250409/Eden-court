"use client";
import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";

/** Thin gold divider that draws itself across as it enters view. Used at the end of sections. */
export default function Divider() {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el.current, { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: el.current, start: "top 95%" } });
    });
    return () => ctx.revert();
  }, []);
  return <div ref={el} className="gold-line absolute inset-x-[clamp(24px,6vw,120px)] bottom-0" />;
}
