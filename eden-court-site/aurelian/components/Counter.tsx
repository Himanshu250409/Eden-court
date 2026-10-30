"use client";
import { useEffect, useRef } from "react";
import { gsap, reduced } from "@/lib/gsap";

/** Number that rolls up like a watch when scrolled into view. */
export default function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (reduced()) { if (el.current) el.current.textContent = `${value}${suffix}`; return; }
    const o = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.to(o, { v: value, duration: 2.4, ease: "expo.out",
        scrollTrigger: { trigger: el.current, start: "top 85%" },
        onUpdate: () => { if (el.current) el.current.textContent = `${Math.round(o.v)}${suffix}`; } });
    });
    return () => ctx.revert();
  }, [value, suffix]);
  return <span ref={el}>0{suffix}</span>;
}
