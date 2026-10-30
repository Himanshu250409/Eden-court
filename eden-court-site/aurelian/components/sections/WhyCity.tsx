"use client";
import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { site } from "@/config/site";
import ImageSlot from "../ImageSlot";
import WordReveal from "../WordReveal";
import Counter from "../Counter";
import Divider from "../Divider";

/** 1 — "Why [CITY]": large image with slow parallax, 3 stats counting up. */
export default function WhyCity() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".why-img", { yPercent: -12 }, { yPercent: 12, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} className="section section-ivory flex flex-col justify-center gap-[clamp(64px,10vh,140px)]">
      <div className="grid gap-[clamp(32px,6vw,96px)] lg:grid-cols-2 lg:items-center">
        <div>
          <p className="label mb-10 text-ink/60">Location</p>
          <WordReveal text={`${site.whyCity.title[0]} *${site.whyCity.title[1]}*`} />
          <div className="body-lux mt-12"><p>{site.whyCity.body}</p><p>{site.locality}, {site.region}.</p></div>
        </div>
        <div className="arch relative aspect-[3/4] w-full max-w-[560px] justify-self-end">
          <div className="why-img absolute inset-x-0 -inset-y-[15%]">
            <ImageSlot src={site.images.whyCity} tone="forest" className="h-full w-full" />
            {/* fallback to the brochure render if no location photo yet */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.images.day} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90 mix-blend-multiply" aria-hidden />
          </div>
        </div>
      </div>
      <dl className="grid gap-[clamp(32px,5vw,80px)] sm:grid-cols-3">
        {site.stats.map((s) => (
          <div key={s.label} className="border-t border-ink/20 pt-8">
            <dd className="headline-md"><Counter value={s.value} suffix={s.suffix} /></dd>
            <dt className="label mt-4 text-ink/60">{s.label}</dt>
          </div>
        ))}
      </dl>
      <Divider />
    </section>
  );
}
