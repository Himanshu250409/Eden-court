"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once, import { gsap, ScrollTrigger } from "@/lib/gsap" everywhere.
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export const EASE = "power3.out";
export const LUX = "cubic-bezier(0.22, 1, 0.36, 1)";
export const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export { gsap, ScrollTrigger };
