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

/* 8 real verticals — real copy grounded in the live sites, real portfolio
   links, real screenshots. No invented defaults. */
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
    image: "/work/baby-steps.webp",
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
    image: "/work/la-vallee-masterplan.webp",
  },
  {
    index: "03",
    label: "Architecture & Interiors",
    title: "Portfolios with atmosphere",
    copy: "Cinematic studio sites where the work breathes — imagery-led, editorial type, quiet motion.",
    links: [link("hued", "HUED")],
    image: "/work/hued.webp",
  },
  {
    index: "04",
    label: "Fitness & Wellness",
    title: "Experience you can feel",
    copy: "Premium gym and retreat sites that sell the experience — facilities, coaching, community and bookings.",
    links: [
      link("tfhq", "The Fitness Headquarters"),
      link("aranyaani", "Aranyaani Healing Forest"),
    ],
    image: "/work/tfhq.webp",
  },
  {
    index: "05",
    label: "AI & Automation",
    title: "Sites that prove their caliber",
    copy: "Motion-rich, cursor-reactive sites — plus the agents, chatbots and automations working behind them.",
    links: [
      link("ai-buddies", "AI Buddies"),
      link("8flowlabs", "8FlowLabs AI"),
    ],
    image: "/work/ai-buddies.webp",
  },
  {
    index: "06",
    label: "Industrial & B2B",
    title: "Catalog-first B2B",
    copy: "Product ranges, brochures and distributorship funnels that qualify serious enquiries.",
    links: [link("shoolin-chemicals", "Shoolin Chemicals")],
    image: "/work/shoolin-chemicals.webp",
  },
  {
    index: "07",
    label: "Media & Entertainment",
    title: "Stories that convert",
    copy: "Cinematic media portfolios and high-urgency registration flows — showreels, countdowns, secured payments.",
    links: [
      link("unofficial-studios", "The Unofficial Studios"),
      link("dpm-entertainment", "DPM Entertainment"),
    ],
    image: "/work/unofficial-studios.webp",
  },
  {
    index: "08",
    label: "Local Business",
    title: "WhatsApp-first local",
    copy: "Rates, delivery and quote requests, in the language customers actually speak.",
    links: [link("harsh-traders", "Harsh Traders")],
    image: "/work/harsh-traders.webp",
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
            fontSize="clamp(28px, 6.5vw, 42px)"
          />
        </div>

        <div className="mt-12">
          <IndustrySelectorMotion industries={INDUSTRIES} />
        </div>
      </div>
    </section>
  );
}
