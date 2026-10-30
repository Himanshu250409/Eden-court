import { site, type Currency } from "@/config/site";

/** Format an INR price in the selected currency. null => "On request". */
export function formatPrice(inr: number | null, currency: Currency, onRequest = "On request") {
  if (inr == null) return onRequest;
  const c = site.currencies[currency];
  const v = inr * c.rate;
  if (currency === "INR") return `${c.symbol}${(inr / 1e7).toFixed(2)} Cr`;
  return `${c.symbol}${Math.round(v).toLocaleString("en-US")}`;
}
