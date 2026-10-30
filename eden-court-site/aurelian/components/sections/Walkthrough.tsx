"use client";
import { useRef, useState } from "react";
import { site } from "@/config/site";
import { units, type UnitId } from "@/data/floors";
import Divider from "../Divider";

const order: UnitId[] = ["2bhk-cosy", "2bhk-premium", "3bhk", "5bhk"];

/** 8 — Video walkthrough with a custom player and a caption per unit type. REPLACE /public/media/walkthrough.mp4. */
export default function Walkthrough() {
  const v = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  const toggle = () => { const el = v.current; if (!el) return; if (el.paused) { void el.play(); } else el.pause(); };
  const onTime = () => {
    const el = v.current; if (!el || !el.duration) return;
    setProgress(el.currentTime / el.duration);
    setIdx(Math.min(order.length - 1, Math.floor((el.currentTime / el.duration) * order.length))); // caption follows playback
  };
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = v.current; if (!el || !el.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - r.left) / r.width) * el.duration;
  };

  return (
    <section id="walkthrough" className="section section-forest">
      <div className="mx-auto max-w-[1400px]">
        <p className="label label-gold mb-10">Walkthrough</p>
        <h2 className="headline-md mb-[clamp(48px,8vh,96px)]">Walk through <em>your home.</em></h2>
        <div className="arch relative aspect-[16/10] w-full bg-ink" data-cursor={playing ? "Pause" : "Play"} onClick={toggle}>
          <video ref={v} className="absolute inset-0 h-full w-full object-cover" poster={site.video.poster} preload="none" playsInline
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={onTime}>
            <source src={site.video.src} type="video/mp4" />
          </video>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-[clamp(24px,4vw,56px)] pt-24">
            <p className="label label-gold">{String(idx + 1).padStart(2, "0")} / {String(order.length).padStart(2, "0")}</p>
            <p className="serif mt-3 text-[clamp(24px,3vw,44px)]">{units[order[idx]].title}</p>
            <div className="mt-8 flex items-center gap-6" onClick={(e) => e.stopPropagation()}>
              <button onClick={toggle} className="label" aria-label={playing ? "Pause" : "Play"}>{playing ? "Pause" : "Play"}</button>
              <div className="h-[2px] flex-1 cursor-pointer bg-ivory/25" onClick={seek}><div className="h-full bg-gold" style={{ width: `${progress * 100}%` }} /></div>
            </div>
          </div>
        </div>
      </div>
      <Divider />
    </section>
  );
}
