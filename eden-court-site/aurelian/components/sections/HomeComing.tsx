"use client";
import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { site } from "@/config/site";
import ImageSlot from "../ImageSlot";
import WordReveal from "../WordReveal";
import Divider from "../Divider";

/** 6 — "The luxury of coming home": layered interior collage with parallax. */
export default function HomeComing() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".cl").forEach((el, i) => {
        gsap.fromTo(el, { yPercent: 20 + i * 14 }, { yPercent: -(10 + i * 10), ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  const sizes = ["col-span-7 aspect-[4/5]", "col-span-5 mt-[18vh] aspect-[3/4]", "col-span-6 col-start-4 aspect-[16/10]"];
  return (
    <section ref={root} className="section section-ivory overflow-hidden">
      <div className="mx-auto max-w-[1400px]">
        <p className="label mb-10 text-ink/60">Interiors</p>
        <WordReveal text="The luxury of *coming home.*" />
        <div className="mt-[clamp(64px,10vh,140px)] grid grid-cols-12 gap-[clamp(16px,3vw,48px)]">
          {site.images.collage.map((src, i) => (
            <div key={src} className={`cl ${sizes[i]} ${i === 0 ? "arch" : ""}`}><ImageSlot src={src} tone={i === 1 ? "stone" : "forest"} className="h-full w-full" /></div>
          ))}
        </div>
      </div>
      <Divider />
    </section>
  );
}
