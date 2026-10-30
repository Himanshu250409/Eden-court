import { site } from "@/config/site";

export interface Enquiry { name: string; contact: string; interest: string }

/**
 * REPLACE: wire this to your CRM / email / API route.
 * Default behaviour: opens WhatsApp with a prefilled message to the sales number.
 */
export async function submitEnquiry(e: Enquiry) {
  const text = `Hello ${site.name}, I'm ${e.name} (${e.contact}). I'm interested in: ${e.interest}. Please arrange a private viewing.`;
  window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
}
