"use client";
import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";

/** Blur-to-sharp, word-by-word headline reveal on scroll. Wrap emphasised words in *asterisks* for italics. */
export default function WordReveal({ text, className = "headline" }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (reduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".wr", { opacity: 0, filter: "blur(14px)", y: 24 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 1.4, stagger: 0.09, ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 80%" } });
    }, ref);
    return () => ctx.revert();
  }, []);
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <h2 ref={ref} className={className}>
      {parts.flatMap((p, i) => {
        const em = p.startsWith("*");
        return (em ? p.slice(1, -1) : p).split(" ").filter(Boolean).map((w, j) => (
          <span key={`${i}-${j}`} className="wr mr-[0.25em] inline-block">{em ? <em>{w}</em> : w}</span>
        ));
      })}
    </h2>
  );
}
