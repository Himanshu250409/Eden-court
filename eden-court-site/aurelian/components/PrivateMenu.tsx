"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useStore } from "@/store/useStore";
import { dict } from "@/lib/i18n";
import { site } from "@/config/site";

const links = [
  { label: "The Residences", href: "#tower" },
  { label: "Life at Eden Court", href: "#amenities" },
  { label: "Neighbourhood", href: "#neighbourhood" },
  { label: "Walkthrough", href: "#walkthrough" },
  { label: "Private Viewing", href: "#enquire" },
];

/** "Private Collection" full-screen overlay with staggered serif links + curtain transition. */
export default function PrivateMenu() {
  const open = useStore((s) => s.menuOpen);
  const setMenu = useStore((s) => s.setMenu);
  const lang = useStore((s) => s.lang);
  const root = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    if (open) {
      gsap.set(root.current, { display: "flex" });
      gsap.fromTo(root.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.2, ease: "expo.inOut" });
      gsap.fromTo(".pm-link", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.09, delay: 0.5, ease: "expo.out" });
      window.__lenis?.stop();
    } else {
      gsap.to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut", onComplete: () => { gsap.set(root.current, { display: "none" }); } });
      window.__lenis?.start();
    }
  }, [open]);

  // Page-transition curtain: wipe up, jump to section, wipe away.
  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const tl = gsap.timeline();
    tl.set(curtain.current, { display: "block", yPercent: 100 })
      .to(curtain.current, { yPercent: 0, duration: 0.9, ease: "expo.inOut" })
      .add(() => {
        setMenu(false);
        window.__lenis?.start();
        const el = document.querySelector(href);
        if (el) { if (window.__lenis) window.__lenis.scrollTo(el as HTMLElement, { immediate: true }); else el.scrollIntoView(); }
      })
      .to(curtain.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut", delay: 0.15 })
      .set(curtain.current, { display: "none" });
  };

  return (
    <>
      <div ref={root} style={{ display: "none" }} className="fixed inset-0 z-[80] flex-col justify-center bg-forest px-gutter text-ivory">
        <button onClick={() => setMenu(false)} className="label absolute right-[clamp(24px,4vw,64px)] top-6" data-cursor="Close">Close ✕</button>
        <p className="label label-gold mb-12">{dict[lang].menu}</p>
        <nav className="flex flex-col gap-4">
          {links.map((l, i) => (
            <a key={l.href} href={l.href} onClick={go(l.href)} data-cursor="View" className="pm-link headline-md link-gold w-fit">
              <span className="label label-gold mr-6 align-middle">0{i + 1}</span>{l.label}
            </a>
          ))}
        </nav>
        <p className="label mt-16 opacity-60">{site.phone} · {site.email}</p>
      </div>
      <div ref={curtain} style={{ display: "none" }} className="fixed inset-0 z-[85] bg-ink" />
    </>
  );
}
