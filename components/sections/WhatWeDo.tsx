"use client";

import Image from "next/image";

import {
  AnimatedEyebrow,
  SectionHeadingMotion,
  SectionReveal,
  ServiceCardMotion,
} from "@/components/motion/v2";
import { SpotlightOverlay, spotlightMove } from "@/components/motion/spotlight";
import { Button } from "@/components/ui/Button";

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://calendly.com/harshhchouksey/30min";

const SUGAR_STORY_URL = "https://thesugarstory.co.in";

/* The three pillars of the e-commerce offering — real capabilities. */
const ECOM_PILLARS = [
  {
    title: "Shopify storefronts, conversion-first",
    line: "Clean PDPs, fast checkout, storefronts that sell — engineered, never template-feeling.",
  },
  {
    title: "An AI layer that wins back lost sales",
    line: "Abandoned-cart recovery and cart-recovery flows working around the clock.",
  },
  {
    title: "Omnichannel automation wired in",
    line: "Calling, email and WhatsApp — automated follow-ups, order and nurture flows.",
  },
];

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
            fontSize="clamp(28px, 6.5vw, 42px)"
          />
        </div>

        {/* ---- Featured offering: E-commerce & Shopify (Part B) ---- */}
        <SectionReveal>
          <div
            onMouseMove={spotlightMove}
            className="group relative mt-10 overflow-hidden rounded-2xl border border-hairline bg-surface transition-[border-color] duration-200 ease-out-expo hover:border-hairline-strong"
          >
            <SpotlightOverlay />
            <div className="relative grid lg:grid-cols-12">
              <div className="flex flex-col p-6 sm:p-8 lg:col-span-7">
                <span className="w-fit rounded-full bg-accent-fill px-3 py-1 font-mono text-micro uppercase tracking-[0.08em] text-on-accent">
                  Featured · E-commerce &amp; Shopify
                </span>
                <h3 className="mt-5 font-display text-heading text-text">
                  Stores that turn products into <em>sales</em>.
                </h3>
                <ul className="mt-6 flex flex-col gap-4">
                  {ECOM_PILLARS.map((pillar) => (
                    <li key={pillar.title} className="flex items-baseline gap-4">
                      <span
                        aria-hidden
                        className="h-0.5 w-4 shrink-0 translate-y-[-4px] bg-accent"
                      />
                      <div>
                        <p className="text-body font-medium text-text">
                          {pillar.title}
                        </p>
                        <p className="mt-1 text-small text-muted">
                          {pillar.line}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <Button
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                  >
                    Book a call
                  </Button>
                  <a
                    href={SUGAR_STORY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline text-small text-accent-text transition-colors duration-200 ease-out-expo hover:text-text"
                  >
                    Live proof: The Sugar Story <span aria-hidden>↗</span>
                  </a>
                </div>
              </div>
              <a
                href={SUGAR_STORY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit live store: The Sugar Story (opens in new tab)"
                className="group relative block aspect-[16/10] overflow-hidden border-t border-hairline lg:col-span-5 lg:aspect-auto lg:min-h-full lg:border-t-0 lg:border-l"
              >
                <Image
                  src="/work/the-sugar-story.webp"
                  alt="Homepage of The Sugar Story, a premium homemade bakery in Bhopal, with online ordering"
                  fill
                  sizes="(min-width: 1024px) 32rem, 100vw"
                  className="object-cover object-top transition-transform duration-500 ease-out-expo group-hover:scale-[1.02]"
                />
              </a>
            </div>
          </div>
        </SectionReveal>

        <div className="mt-6">
          <ServiceCardMotion cards={CARDS} />
        </div>
      </div>
    </section>
  );
}
