"use client";
import { useEffect, useRef, useState } from "react";
import { gsap, reduced } from "@/lib/gsap";
import { site } from "@/config/site";

/** STAGE 0 — black screen, gold arch draws itself, counter, name letter-by-letter. */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const counter = { v: 0 };
    const fast = reduced();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = "";
          window.__lenis?.start();
          setDone(true);
        },
      });
      tl.to(path.current, { strokeDashoffset: 0, duration: fast ? 0.4 : 2.4, ease: "power2.inOut" }, 0)
        .to(counter, { v: 100, duration: fast ? 0.4 : 2.4, ease: "power2.inOut", onUpdate: () => setPct(Math.round(counter.v)) }, 0)
        .to(".pl-letter", { opacity: 1, y: 0, duration: fast ? 0.2 : 1, stagger: 0.07, ease: "power3.out" }, fast ? 0.3 : 1.6)
        .to({}, { duration: fast ? 0.2 : 0.8 }) // hold
        .to(root.current, { yPercent: -100, duration: fast ? 0.4 : 1.4, ease: "expo.inOut" });
    }, root);
    return () => ctx.revert();
  }, []);

  if (done) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-ivory" aria-label="Loading">
      <svg viewBox="0 0 200 220" className="h-[min(44vh,360px)] w-auto" fill="none">
        <path ref={path} d="M20 210 V95 A80 80 0 0 1 180 95 V210" pathLength={1} strokeDasharray={1} strokeDashoffset={1} stroke="#C2A878" strokeWidth={1} />
      </svg>
      <div className="serif mt-8 text-[14px] tracking-[0.2em] text-gold">{String(pct).padStart(3, "0")}</div>
      <div className="serif mt-10 flex gap-[0.08em] text-[clamp(28px,4vw,52px)] uppercase tracking-[0.18em]" aria-hidden>
        {site.name.split("").map((c, i) => (
          <span key={i} className="pl-letter inline-block translate-y-3 opacity-0">{c === " " ? " " : c}</span>
        ))}
      </div>
    </div>
  );
}
