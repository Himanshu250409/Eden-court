"use client";
import { site } from "@/config/site";
import Divider from "../Divider";
import WordReveal from "../WordReveal";

/** 7 — Neighbourhood: stylised dark map, glowing gold pins, drive-time rings. REPLACE pins/minutes in config/site.ts. */
export default function Neighbourhood() {
  const home = site.neighbourhood.find((n) => "home" in n && n.home)!;
  return (
    <section id="neighbourhood" className="section section-ink">
      <div className="mx-auto grid max-w-[1500px] gap-[clamp(32px,6vw,96px)] lg:grid-cols-[1fr_1.3fr] lg:items-center">
        <div>
          <p className="label label-gold mb-10">Neighbourhood</p>
          <WordReveal text="Everything, *within reach.*" className="headline-md" />
          <ul className="mt-12 flex flex-col gap-6">
            {site.neighbourhood.filter((n) => !("home" in n && n.home)).map((n) => (
              <li key={n.name} className="flex items-baseline justify-between gap-8 border-b border-ivory/15 pb-6">
                <span className="serif text-[24px]">{n.name}</span>
                <span className="label label-gold">{n.minutes} min</span>
              </li>
            ))}
          </ul>
        </div>
        <svg viewBox="0 0 100 100" className="aspect-square w-full" role="img" aria-label="Neighbourhood map">
          <defs>
            <radialGradient id="mapglow"><stop offset="0%" stopColor="#C2A878" stopOpacity=".35" /><stop offset="100%" stopColor="#C2A878" stopOpacity="0" /></radialGradient>
          </defs>
          <rect width="100" height="100" fill="#101512" rx="2" />
          {/* faux streets */}
          {[18, 34, 52, 70, 86].map((p) => (<g key={p} stroke="#1f2a24" strokeWidth=".4"><line x1="0" x2="100" y1={p} y2={p + (p % 3)} /><line y1="0" y2="100" x1={p} x2={p - (p % 5)} /></g>))}
          {/* drive-time rings */}
          {[15, 30, 45].map((r) => (<circle key={r} cx={home.x} cy={home.y} r={r * 0.9} fill="none" stroke="#C2A878" strokeOpacity=".3" strokeWidth=".25" strokeDasharray="1 1.4" />))}
          <circle cx={home.x} cy={home.y} r="26" fill="url(#mapglow)" />
          {site.neighbourhood.map((n) => {
            const isHome = "home" in n && n.home;
            return (
              <g key={n.name}>
                <circle className="pin-pulse" cx={n.x} cy={n.y} r="1.6" fill="#C2A878" opacity=".5" />
                <circle cx={n.x} cy={n.y} r={isHome ? 1.6 : 1} fill="#C2A878" />
                <text x={n.x + 2.4} y={n.y + 0.8} fontSize="2.6" fill="#F4EFE6" fontFamily="var(--font-serif)">{n.name}</text>
              </g>
            );
          })}
        </svg>
      </div>
      <Divider />
    </section>
  );
}
