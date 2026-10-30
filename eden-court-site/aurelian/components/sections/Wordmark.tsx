"use client";
import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { site } from "@/config/site";

/** 9 — Giant wordmark: project name in huge serif letters, arched tower image slides up through them. */
export default function Wordmark() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".wm-img", { yPercent: 60 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top 80%", end: "center center", scrub: 1 } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} className="section section-ivory flex flex-col items-center justify-center overflow-hidden text-center">
      <div className="relative w-full">
        <h2 className="serif relative z-0 select-none whitespace-nowrap text-[clamp(72px,19vw,400px)] uppercase leading-[0.9] tracking-[-0.02em]" aria-label={site.name}>{site.name}</h2>
        {/* arched tower rises through the letters (mix-blend keeps the lettering readable) */}
        <div className="arch absolute left-1/2 top-[-18%] z-10 h-[150%] w-[min(30vw,360px)] -translate-x-1/2 mix-blend-multiply" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="wm-img h-full w-full object-cover" src={site.images.dusk} alt="" />
        </div>
      </div>
      <p className="serif mt-[clamp(48px,8vh,120px)] text-[clamp(22px,2.4vw,40px)] italic">{site.tagline}</p>
      <p className="label mt-6 text-ink/60">{site.byline}</p>
    </section>
  );
}
