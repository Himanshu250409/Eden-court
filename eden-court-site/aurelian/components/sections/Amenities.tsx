"use client";
import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { site } from "@/config/site";
import ImageSlot from "../ImageSlot";

/** 3 — "Twelve ways to spend a day": pinned horizontal scroll, huge numbered serif captions. */
export default function Amenities() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduced() || !track.current) return;
    const ctx = gsap.context(() => {
      const dist = () => track.current!.scrollWidth - window.innerWidth;
      gsap.to(track.current, { x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true } });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} id="amenities" className="relative h-screen overflow-hidden bg-forest text-ivory">
      <div className="absolute left-gutter top-[clamp(96px,12vh,160px)] z-10">
        <p className="label label-gold mb-6">Life at Eden Court</p>
        <h2 className="headline-md">Twelve ways to <em>spend a day.</em></h2>
      </div>
      <div ref={track} className="flex h-full w-max items-end gap-[clamp(32px,5vw,96px)] px-gutter pb-[clamp(64px,10vh,140px)]">
        {site.amenities.map((a, i) => (
          <article key={a.title} className="relative flex h-[62vh] w-[clamp(300px,52vw,760px)] shrink-0 flex-col justify-end overflow-hidden p-[clamp(24px,3vw,48px)]" data-cursor="Drag">
            <ImageSlot tone={i % 2 ? "ink" : "forest"} className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <span className="serif relative text-[clamp(96px,14vw,240px)] leading-none text-gold/90">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="serif relative mt-4 text-[clamp(28px,3vw,52px)] leading-tight">{a.title}</h3>
            <p className="relative mt-4 max-w-[36ch] text-[17px] opacity-80">{a.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
