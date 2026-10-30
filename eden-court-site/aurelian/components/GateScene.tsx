"use client";
import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { site } from "@/config/site";
import { useStore } from "@/store/useStore";
import { dict } from "@/lib/i18n";

/**
 * STAGE 1 — The Gate. Pinned + scroll-scrubbed.
 * Two lacquered doors swing open in 3D, light pours through, the arch grows to fill the screen.
 * (DOM + CSS 3D + GSAP; no WebGL needed so it stays 60fps on every device.)
 */
export default function GateScene() {
  const stage = useRef<HTMLDivElement>(null);
  const lang = useStore((s) => s.lang);

  useEffect(() => {
    if (reduced()) return; // reduced motion: gate stays as a calm, static opening
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: stage.current, start: "top top", end: "+=260%", pin: true, scrub: 1.2, anticipatePin: 1 },
      });
      tl.to(".gate-head", { opacity: 0, y: -60, duration: 0.15 }, 0)
        .to(".door-l", { rotateY: -108, duration: 0.4, ease: "power2.inOut" }, 0.02)
        .to(".door-r", { rotateY: 108, duration: 0.4, ease: "power2.inOut" }, 0.02)
        .to(".gate-glow", { opacity: 1, scale: 1.6, duration: 0.4 }, 0.05)
        .fromTo(".gate-img", { scale: 1.15, filter: "blur(6px) brightness(.5)" }, { scale: 1, filter: "blur(0px) brightness(1)", duration: 0.6 }, 0.1)
        .to(".gate-arch", { scale: 7.5, duration: 0.6, ease: "power2.in" }, 0.4)
        .to(".gate-flare", { opacity: 0.85, duration: 0.15 }, 0.75)
        .to(".gate-flare", { opacity: 0, duration: 0.25 }, 0.9);
    }, stage);
    return () => ctx.revert();
  }, []);

  const reducedStatic = typeof window !== "undefined" && reduced();

  return (
    <section id="top" aria-label="Gate">
      <div ref={stage} className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-ink">
        {/* distant golden-hour glow of the building */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 55% at 50% 60%, rgba(194,168,120,.22), transparent 70%)" }} />

        <div className="gate-head absolute inset-x-0 top-[14vh] z-10 px-gutter text-center">
          <p className="label label-gold mb-8">{site.name} · {site.byline}</p>
          <h1 className="headline mx-auto max-w-[14ch]">
            Make room for <em>a different</em> rhythm.
          </h1>
        </div>

        {/* arch + doors */}
        <div className="gate-arch relative mt-[22vh] h-[62vh] w-[min(70vw,420px)]" style={{ perspective: 1400, transformOrigin: "50% 60%" }}>
          <div className="arch absolute inset-0 border border-gold/40">
            {/* what is seen through the gap */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="gate-img absolute inset-0 h-full w-full object-cover" src={site.images.hero} alt={`${site.name} at golden hour`} style={reducedStatic ? undefined : { filter: "brightness(.5)" }} />
            <div className="gate-glow absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 50% 70%, rgba(255,226,170,.9), transparent 60%)" }} />
            {/* doors */}
            <div className="absolute inset-0 flex" style={{ transformStyle: "preserve-3d" }}>
              {(["l", "r"] as const).map((s) => (
                <div key={s} className={`door-${s} relative h-full w-1/2`}
                  style={{
                    transformOrigin: s === "l" ? "0% 50%" : "100% 50%",
                    transform: reducedStatic ? `rotateY(${s === "l" ? -108 : 108}deg)` : undefined,
                    background: "linear-gradient(135deg,#27362c 0%,#1B2620 45%,#101813 100%)",
                    boxShadow: "inset 0 0 60px rgba(0,0,0,.6)",
                    backfaceVisibility: "hidden",
                  }}>
                  {/* fine gold inlay lines */}
                  <div className="absolute inset-[7%] border border-gold/35" style={{ borderRadius: s === "l" ? "999px 0 0 0" : "0 999px 0 0" }} />
                  <div className="absolute inset-[14%] border border-gold/20" style={{ borderRadius: s === "l" ? "999px 0 0 0" : "0 999px 0 0" }} />
                  <div className={`absolute top-1/2 h-24 w-px bg-gold/60 ${s === "l" ? "right-4" : "left-4"}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="label absolute bottom-10 left-1/2 z-10 -translate-x-1/2 text-gold">{dict[lang].scroll}</p>
        <div className="gate-flare pointer-events-none absolute inset-0 opacity-0" style={{ background: "radial-gradient(circle at 50% 55%, #fff6df, rgba(255,236,190,.6) 40%, transparent 75%)" }} />
      </div>
    </section>
  );
}
