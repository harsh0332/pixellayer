"use client";
import Image from "next/image";
import Link from "next/link";
import { FEATURED } from "@/lib/work";

export function SpecialtyShowcase() {
  return (
    <section id="specialty" className="studio-specialty eco-section">
      <div className="eco-container">
        <div className="specialty-heading" data-reveal><span>BEYOND THE BROCHURE</span><h2>A website can do<br /><em>more than tell a story.</em></h2><p>Give people something useful to explore.<br />Make the next step feel natural.</p></div>
        <div className="specialty-masterplan" data-reveal>
          <a className="specialty-image" href={FEATURED.masterplanUrl} target="_blank" rel="noopener noreferrer" aria-label="Explore the live La Vallée Farms masterplan (opens in new tab)">
            <div className="specialty-image-bar"><span>LA VALLÉE FARMS / INTERACTIVE MASTERPLAN</span><span>OPEN LIVE ↗</span></div>
            <Image src="/work/la-vallee-masterplan.webp" alt={FEATURED.alt} width={1440} height={900} sizes="(max-width:849px) 90vw, 60vw" style={{ width: "100%", height: "auto" }} />
            <span className="specialty-live-badge">Explore the actual experience ↗</span>
          </a>
          <div className="specialty-detail"><span>BUILT FOR REAL ESTATE</span><h3>From a plot on a map<br />to a real conversation.</h3><p>For La Vallée Farms, we made the masterplan part of the buying journey.</p><ol><li><b>01</b><span>Explore the development<small>Zoom into the layout and find a plot.</small></span></li><li><b>02</b><span>Understand the details<small>See plot information and availability.</small></span></li><li><b>03</b><span>Start an enquiry<small>Carry the selected plot into WhatsApp.</small></span></li></ol><Link href="/work/la-vallee-farms">Inside the build <span>↗</span></Link></div>
        </div>
        <div className="specialty-commerce" data-reveal><span className="specialty-commerce-icon" aria-hidden="true">↗</span><div><span>BUILDING A STOREFRONT?</span><h3>Good discovery. A considered checkout.</h3><p>Explore Shopify development, product journeys and connected store experiences.</p></div><Link href="/services/ecommerce-shopify">Explore e-commerce ↗</Link></div>
      </div>
    </section>
  );
}
