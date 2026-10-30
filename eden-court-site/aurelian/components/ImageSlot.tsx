"use client";
import { useState } from "react";

/**
 * Image with a graceful luxury-gradient fallback, so the template looks finished
 * even before real photography is dropped into /public/images.
 * REPLACE: put your file at the `src` path configured in config/site.ts.
 */
export default function ImageSlot({
  src, alt = "", className = "", tone = "forest", style,
}: { src?: string; alt?: string; className?: string; tone?: "forest" | "ink" | "stone"; style?: React.CSSProperties }) {
  const [failed, setFailed] = useState(!src);
  const bg = {
    forest: "linear-gradient(160deg,#2c3a31 0%,#1B2620 55%,#0d1411 100%)",
    ink: "linear-gradient(160deg,#242424 0%,#0A0A0A 100%)",
    stone: "linear-gradient(160deg,#e8e1d3 0%,#cfc6b4 100%)",
  }[tone];
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: bg, ...style }}>
      {/* soft gold glow so placeholders still feel intentional */}
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(60% 50% at 70% 20%, rgba(194,168,120,.35), transparent 70%)" }} />
      {!failed && src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover" />
      )}
    </div>
  );
}
