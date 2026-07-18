"use client";

import {
  AnimatedEyebrow,
  SectionHeadingMotion,
  ServiceCardMotion,
} from "@/components/motion/v2";

/* The 5 real service categories — real desc + items, one featured. */
const CARDS = [
  {
    icon: "frame",
    title: "Websites & Web Apps",
    desc: "Premium sites that feel engineered, not templated.",
    items: [
      "Next.js + React builds",
      "Design systems",
      "Headless CMS",
      "Core Web Vitals performance",
    ],
    cta: "Discuss your build",
    href: "#contact",
  },
  {
    icon: "layers",
    title: "SaaS & Product Engineering",
    desc: "From first wireframe to production, as one team.",
    items: [
      "MVP to scale",
      "Architecture & multi-tenancy",
      "Auth + billing",
      "APIs & integrations",
    ],
    cta: "Discuss your build",
    href: "#contact",
    featured: true,
  },
  {
    icon: "motion",
    title: "AI — Agents, Chatbots & Automation",
    desc: "Working AI in your product and your operations.",
    items: [
      "Custom agents",
      "Chatbots",
      "Workflow automation",
      "LLM integration & RAG",
    ],
    cta: "Discuss your build",
    href: "#contact",
  },
  {
    icon: "layers",
    title: "Business Systems",
    desc: "Software your business actually runs on.",
    items: [
      "CRMs & ERPs",
      "Dashboards & reporting",
      "Industry-specific software",
      "Internal tools",
    ],
    cta: "Discuss your build",
    href: "#contact",
  },
  {
    icon: "frame",
    title: "Growth & Platform",
    desc: "Built to be found, fast, and secure.",
    items: [
      "SEO / GEO / AEO",
      "Performance",
      "Security",
      "Cloud & deployment",
    ],
    cta: "Discuss your build",
    href: "#contact",
  },
];

export function WhatWeDo() {
  return (
    <section id="services" aria-label="What we do">
      <div className="container-site section-y">
        <AnimatedEyebrow index="03" label="What we do" />
        <div className="mt-4 max-w-2xl">
          <SectionHeadingMotion
            text="Every *layer* of a digital product."
            fontSize={42}
          />
        </div>

        <div className="mt-14">
          <ServiceCardMotion cards={CARDS} />
        </div>
      </div>
    </section>
  );
}
