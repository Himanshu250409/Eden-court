"use client";
import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { site } from "@/config/site";
import ImageSlot from "../ImageSlot";
import WordReveal from "../WordReveal";
import Divider from "../Divider";

/** 2 — "Step inside the everyday": two arched interiors rising at different speeds. */
export default function Everyday() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true };
      gsap.fromTo(".ev-a", { yPercent: 18 }, { yPercent: -10, ease: "none", scrollTrigger: st });
      gsap.fromTo(".ev-b", { yPercent: 40 }, { yPercent: -24, ease: "none", scrollTrigger: st });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} className="section section-ink overflow-hidden">
      <div className="mx-auto max-w-[1400px]">
        <p className="label label-gold mb-10">The residences</p>
        <WordReveal text="Step inside *the everyday.*" />
        <div className="mt-[clamp(64px,10vh,140px)] grid gap-[clamp(32px,6vw,96px)] md:grid-cols-2">
          <div className="ev-a arch aspect-[3/4]" data-cursor="View"><ImageSlot src={site.images.interiorA} tone="forest" className="h-full w-full" /></div>
          <div className="ev-b arch mt-[12vh] aspect-[3/4]" data-cursor="View"><ImageSlot src={site.images.interiorB} tone="stone" className="h-full w-full" /></div>
        </div>
        <div className="body-lux mt-[clamp(96px,14vh,200px)]"><p>Living rooms that open to balconies, kitchens made for hosting, bedrooms that stay quiet. Four layouts, from cosy two-bedroom homes to the five-bedroom Jodi residence.</p></div>
      </div>
      <Divider />
    </section>
  );
}
