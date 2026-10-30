"use client";
import { useState } from "react";
import { submitEnquiry } from "@/lib/submitEnquiry";
import { useStore } from "@/store/useStore";
import { dict } from "@/lib/i18n";
import { units } from "@/data/floors";
import Magnetic from "./Magnetic";

const field = "w-full border-0 border-b border-ivory/30 bg-transparent py-5 text-[18px] outline-none transition-colors duration-[1200ms] placeholder:opacity-50 focus:border-gold";

/** Refined enquiry form. `defaultInterest` is prefilled when opened from a floor/unit. */
export default function EnquiryForm({ defaultInterest = "" }: { defaultInterest?: string }) {
  const lang = useStore((s) => s.lang);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    await submitEnquiry({ name: String(f.get("name")), contact: String(f.get("contact")), interest: String(f.get("interest")) });
    setBusy(false);
    setSent(true);
  };

  if (sent) return <p className="serif text-[clamp(28px,3vw,44px)] leading-snug">Thank you. Our private concierge will be in touch shortly.</p>;

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-[640px] flex-col gap-10">
      <input name="name" required placeholder="Your name" className={field} autoComplete="name" />
      <input name="contact" required placeholder="Email or WhatsApp" className={field} autoComplete="email" />
      <select name="interest" defaultValue={defaultInterest} className={`${field} [&>option]:bg-ink [&>option]:text-ivory`}>
        <option value="">I&apos;m interested in…</option>
        {defaultInterest && !Object.values(units).some((u) => u.name === defaultInterest) && <option value={defaultInterest}>{defaultInterest}</option>}
        {Object.values(units).map((u) => <option key={u.id} value={u.name}>{u.title}</option>)}
      </select>
      <div className="pt-4">
        <Magnetic><button type="submit" disabled={busy} className="btn btn-solid" data-cursor="Send">{dict[lang].enquire}</button></Magnetic>
      </div>
    </form>
  );
}
