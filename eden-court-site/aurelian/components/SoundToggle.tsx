"use client";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { startAmbient, stopAmbient } from "@/lib/audio";
import { dict } from "@/lib/i18n";

/** Off by default. Starts a soft ambient pad when toggled on (needs a user gesture). */
export default function SoundToggle() {
  const on = useStore((s) => s.soundOn);
  const toggle = useStore((s) => s.toggleSound);
  const lang = useStore((s) => s.lang);
  useEffect(() => { on ? startAmbient() : stopAmbient(); }, [on]);
  return (
    <button onClick={toggle} aria-pressed={on} aria-label={dict[lang].sound} data-cursor="Sound" className="label flex items-center gap-3 text-[11px]">
      <span className="flex h-4 items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="w-px bg-current transition-all duration-[1200ms]" style={{ height: on ? `${6 + ((i * 5) % 9)}px` : "2px" }} />
        ))}
      </span>
      <span className="hidden sm:inline">{on ? "On" : "Off"}</span>
    </button>
  );
}
