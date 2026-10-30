"use client";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { site, type Currency, type Lang } from "@/config/site";
import { rtl } from "@/lib/i18n";

/** Language (EN, AR, ZH, RU, FR) + currency (INR, USD, AED, EUR, GBP). Arabic flips the page to RTL. */
export default function LanguageSwitcher() {
  const { lang, currency, setLang, setCurrency } = useStore();
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = rtl.includes(lang) ? "rtl" : "ltr";
  }, [lang]);
  const sel = "label bg-transparent text-[11px] tracking-[0.2em] outline-none [&>option]:bg-ink [&>option]:text-ivory";
  return (
    <div className="flex items-center gap-4">
      <select aria-label="Language" className={sel} value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
        {site.languages.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}
      </select>
      <span className="h-3 w-px bg-current opacity-40" />
      <select aria-label="Currency" className={sel} value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
        {Object.keys(site.currencies).map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
}
