"use client";
import { site } from "@/config/site";
import { useStore } from "@/store/useStore";
import { dict } from "@/lib/i18n";
import SoundToggle from "./SoundToggle";
import LanguageSwitcher from "./LanguageSwitcher";

/** Fixed header. mix-blend-mode keeps it legible over both ivory and ink sections. */
export default function Header() {
  const lang = useStore((s) => s.lang);
  const setMenu = useStore((s) => s.setMenu);
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-[clamp(24px,4vw,64px)] py-6 text-white mix-blend-difference">
      <a href="#top" className="pointer-events-auto serif text-[20px] uppercase tracking-[0.22em]" data-cursor="Home">{site.name}</a>
      <div className="pointer-events-auto flex items-center gap-6 sm:gap-10">
        <div className="hidden md:block"><LanguageSwitcher /></div>
        <SoundToggle />
        <button onClick={() => setMenu(true)} className="label flex items-center gap-4 text-[11px]" data-cursor="Menu" aria-label={dict[lang].menu}>
          <span className="hidden sm:inline">{dict[lang].menu}</span>
          <span className="flex flex-col gap-[6px]" aria-hidden><span className="h-px w-8 bg-current" /><span className="h-px w-5 self-end bg-current" /></span>
        </button>
      </div>
    </header>
  );
}
