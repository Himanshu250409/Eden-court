"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, reduced } from "@/lib/gsap";

declare global {
  interface Window { __lenis?: Lenis }
}

/** Lenis smooth scroll wired into GSAP's ticker so ScrollTrigger stays in sync. */
export default function SmoothScroll() {
  useEffect(() => {
    if (reduced()) return; // respect prefers-reduced-motion: native scroll
    const lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);
  return null;
}
