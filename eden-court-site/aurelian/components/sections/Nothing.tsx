"use client";
import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { site } from "@/config/site";
import ImageSlot from "../ImageSlot";

/** 5 — "Nothing to do. Everything to feel.": a circle mask expands over a lifestyle image. */
export default function Nothing() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top top", end: "+=150%", pin: true, scrub: 1 } })
        .fromTo(".nt-mask", { clipPath: "circle(8% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 1 })
        .fromTo(".nt-text", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.6);
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} className="relative h-screen overflow-hidden bg-ink text-ivory">
      <div className="nt-mask absolute inset-0" style={{ clipPath: "circle(8% at 50% 50%)" }}>
        <ImageSlot src={site.images.lifestyle} tone="forest" className="absolute inset-0" />
        <div className="absolute inset-0 bg-ink/35" />
      </div>
      <div className="nt-text absolute inset-0 flex items-center justify-center px-gutter text-center">
        <h2 className="headline">Nothing to do.<br /><em>Everything to feel.</em></h2>
      </div>
    </section>
  );
}
