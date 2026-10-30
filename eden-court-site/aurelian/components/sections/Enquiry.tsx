"use client";
import { site } from "@/config/site";
import EnquiryForm from "../EnquiryForm";

/** 10 — Private enquiry (dark green) + minimal footer. */
export default function Enquiry() {
  return (
    <section id="enquire" className="section section-forest flex flex-col justify-between">
      <div className="grid gap-[clamp(48px,8vw,128px)] lg:grid-cols-2">
        <div>
          <p className="label label-gold mb-10">Private enquiry</p>
          <h2 className="headline">Let&apos;s talk about <em>{site.name}.</em></h2>
        </div>
        <div className="lg:pt-24"><EnquiryForm /></div>
      </div>

      <footer className="mt-[clamp(96px,14vh,200px)] grid gap-10 border-t border-gold/30 pt-12 sm:grid-cols-3">
        <div>
          <p className="serif text-[24px] uppercase tracking-[0.2em]">{site.name}</p>
          <p className="label mt-3 opacity-60">{site.byline}</p>
        </div>
        <address className="not-italic">
          <p className="label label-gold mb-4">Site</p>
          <p className="text-[16px] leading-[1.8] opacity-80">{site.address}</p>
        </address>
        <div>
          <p className="label label-gold mb-4">Contact</p>
          <p className="text-[16px] leading-[1.8] opacity-80">
            <a className="link-gold" href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a><br />
            <a className="link-gold" href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <p className="label text-[10px] leading-[2] opacity-50 sm:col-span-3">
          MahaRERA Reg. No. {site.reraNumber} · <a className="link-gold" href={site.reraUrl} target="_blank" rel="noopener noreferrer">maharera.mahaonline.gov.in</a><br />
          {site.disclaimer}
        </p>
      </footer>
    </section>
  );
}
