"use client";
import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { site } from "@/config/site";
import ImageSlot from "../ImageSlot";

/** 4 — Wellness: an arch-shaped image that expands to full bleed on scroll. */
export default function Wellness() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top top", end: "+=150%", pin: true, scrub: 1 } });
      tl.fromTo(".wl-arch", { width: "min(40vw,520px)", height: "70vh", borderRadius: "999px 999px 0 0" }, { width: "100vw", height: "100vh", borderRadius: "0px 0px 0 0", duration: 1 })
        .fromTo(".wl-text", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.6);
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} className="relative flex h-screen items-center justify-center overflow-hidden bg-ivory text-ink">
      <div className="wl-arch relative overflow-hidden" style={{ width: "min(40vw,520px)", height: "70vh", borderRadius: "999px 999px 0 0" }}>
        <ImageSlot src={site.images.wellness} tone="forest" className="absolute inset-0" />
        <div className="absolute inset-0 bg-ink/30" />
      </div>
      <div className="wl-text pointer-events-none absolute inset-x-0 bottom-[clamp(64px,12vh,160px)] px-gutter text-ivory">
        <p className="label label-gold mb-6">Wellness</p>
        <h2 className="headline max-w-[14ch]">Room to <em>breathe.</em></h2>
        <p className="body-lux mt-8">Pool, spa, yoga studio, gym and tracks, all within the compound.</p>
      </div>
    </section>
  );
}
