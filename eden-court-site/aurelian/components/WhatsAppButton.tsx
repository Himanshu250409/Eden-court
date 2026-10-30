"use client";
import { site } from "@/config/site";

/** Floating "Private concierge" — gold on ivory. */
export default function WhatsAppButton() {
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hello, I'd like to know more about ${site.name}.`)}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" data-cursor="Chat"
      className="label fixed bottom-6 left-6 z-[60] flex items-center gap-3 border border-gold bg-ivory px-6 py-4 text-[11px] text-ink shadow-xl transition-colors duration-[1200ms] hover:bg-gold"
      style={{ borderRadius: "999px 999px 0 0" }}>
      <span className="inline-block h-2 w-2 rounded-full bg-gold" aria-hidden />
      <span className="hidden sm:inline">Private concierge</span>
      <span className="sm:hidden">Concierge</span>
    </a>
  );
}
