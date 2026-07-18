"use client";

import {
  AnimatedEyebrow,
  IndustrySelectorMotion,
  SectionHeadingMotion,
} from "@/components/motion/v2";
import { FEATURED, PROJECTS } from "@/lib/work";

/* Resolve a live URL by slug from the real portfolio (no hardcoded links). */
function urlFor(slug: string): string {
  if (slug === FEATURED.slug) return FEATURED.url;
  return PROJECTS.find((p) => p.slug === slug)?.url ?? "#work";
}
const link = (slug: string, label: string) => ({ label, href: urlFor(slug) });

/* 6 real verticals — real copy, real portfolio links. No invented defaults. */
const INDUSTRIES = [
  {
    index: "01",
    label: "Healthcare & Clinics",
    title: "Booking-first clinic sites",
    copy: "Services, doctors, treatment information and appointment flows that turn trust into visits.",
    links: [
      link("baby-steps", "Baby Steps"),
      link("apna-dental", "Apna Dental Clinic"),
    ],
  },
  {
    index: "02",
    label: "Real Estate & Builders",
    title: "Projects you can feel",
    copy: "Immersive project sites with interactive masterplans, live plot availability and WhatsApp-direct enquiries.",
    links: [
      link("la-vallee-farms", "La Vallée Farms"),
      link("ivy-estate", "Ivy Estate"),
    ],
  },
  {
    index: "03",
    label: "AI & Automation",
    title: "Sites that prove their caliber",
    copy: "Motion-rich, cursor-reactive sites — plus the agents, chatbots and automations working behind them.",
    links: [
      link("ai-buddies", "AI Buddies"),
      link("8flowlabs", "8FlowLabs AI"),
    ],
  },
  {
    index: "04",
    label: "Industrial & B2B",
    title: "Catalog-first B2B",
    copy: "Product ranges, brochures and distributorship funnels that qualify serious enquiries.",
    links: [link("shoolin-chemicals", "Shoolin Chemicals")],
  },
  {
    index: "05",
    label: "Local Business",
    title: "WhatsApp-first local",
    copy: "Rates, delivery and quote requests, in the language customers actually speak.",
    links: [link("harsh-traders", "Harsh Traders")],
  },
  {
    index: "06",
    label: "Events & Entertainment",
    title: "Registration that converts",
    copy: "High-urgency flows — countdowns, secured payments and steps clear enough to finish on a phone.",
    links: [link("dpm-entertainment", "DPM Entertainment")],
  },
];

export function Industries() {
  return (
    <section id="industries" aria-label="Industries">
      <div className="container-site section-y-compact">
        <AnimatedEyebrow index="05" label="Industries" />
        <div className="mt-4 max-w-2xl">
          <SectionHeadingMotion
            text="Fluent in your *vertical*."
            fontSize={42}
          />
        </div>

        <div className="mt-12">
          <IndustrySelectorMotion industries={INDUSTRIES} />
        </div>
      </div>
    </section>
  );
}
