"use client";
import { useRef } from "react";
import { gsap } from "@/lib/gsap";

/** Magnetic wrapper: element and its inner text subtly follow the cursor. */
export default function Magnetic({ children, strength = 0.3, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => {
    const r = outer.current!.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(outer.current, { x: x * strength, y: y * strength, duration: 0.6, ease: "power3.out" });
    gsap.to(inner.current, { x: x * strength * 0.5, y: y * strength * 0.5, duration: 0.6, ease: "power3.out" });
  };
  const leave = () => {
    gsap.to([outer.current, inner.current], { x: 0, y: 0, duration: 1.2, ease: "elastic.out(1,0.4)" });
  };
  return (
    <div ref={outer} onMouseMove={move} onMouseLeave={leave} className={`inline-block ${className}`}>
      <div ref={inner}>{children}</div>
    </div>
  );
}
