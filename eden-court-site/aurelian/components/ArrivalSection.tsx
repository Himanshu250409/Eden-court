"use client";
import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { site } from "@/config/site";
import { useStore } from "@/store/useStore";
import { dict } from "@/lib/i18n";

/**
 * STAGE 2 — Arrival at the Tower. Continues straight from the gate:
 * an aerial establishing shot that settles as dusk deepens, then the name + prompt.
 * The floor-by-floor 3D build-up continues in the Interactive Tower that follows.
 */
export default function ArrivalSection() {
  const stage = useRef<HTMLDivElement>(null);
  const lang = useStore((s) => s.lang);

  useEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: stage.current, start: "top top", end: "+=200%", pin: true, scrub: 1 },
      });
      tl.fromTo(".arr-img", { scale: 1.3, yPercent: -6 }, { scale: 1, yPercent: 0, duration: 1 }, 0)
        .fromTo(".arr-dusk", { opacity: 0 }, { opacity: 0.6, duration: 1 }, 0)
        .fromTo(".arr-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 0.35)
        .fromTo(".arr-cta", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }, 0.7);
    }, stage);
    return () => ctx.revert();
  }, []);

  return (
    <section aria-label="Arrival">
      <div ref={stage} className="relative h-screen w-full overflow-hidden bg-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="arr-img absolute inset-0 h-full w-full object-cover" src={site.images.hero} alt={`${site.name} tower`} />
        <div className="arr-dusk absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60" style={{ opacity: 0.2 }} />
        <div className="absolute inset-x-0 bottom-0 px-gutter pb-[clamp(96px,14vh,220px)]">
          <h2 className="arr-title headline max-w-[16ch]">
            {site.name}. <em>{site.poeticLine}</em>
          </h2>
          <a href="#tower" className="arr-cta label link-gold mt-12 text-gold" data-cursor="Explore">{dict[lang].explore} ↓</a>
        </div>
      </div>
    </section>
  );
}
