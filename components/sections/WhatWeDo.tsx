"use client";

import Image from "next/image";

import {
  AnimatedEyebrow,
  SectionHeadingMotion,
  SectionReveal,
  ServiceAccordionMotion,
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
    line: "clean PDPs, fast checkout, never template-feeling.",
  },
  {
    title: "AI that wins back lost sales",
    line: "abandoned-cart recovery working around the clock.",
  },
  {
    title: "Omnichannel automation wired in",
    line: "calling, email and WhatsApp follow-ups.",
  },
];

/* The six services, numbered — real copy from the spec, nothing invented. */
const SERVICES = [
  {
    title: "Web Development & Design",
    desc: "Fast, scalable sites and web apps that convert — from storefronts to complex platforms, every line purposeful.",
    deliverables: [
      "Custom websites & landing pages",
      "E-commerce & Shopify builds",
      "SaaS & web-app development",
      "Performance & Core Web Vitals",
      "SEO/GEO/AEO",
    ],
  },
  {
    title: "SaaS & Product Engineering",
    desc: "From first wireframe to production, as one team.",
    deliverables: [
      "MVP to scale",
      "Architecture & multi-tenancy",
      "Auth + billing",
      "APIs & integrations",
    ],
  },
  {
    title: "AI Automation",
    desc: "Intelligent automation across your product and operations — eliminate bottlenecks, free your team.",
    deliverables: [
      "Custom AI agents",
      "CRM & workflow automation",
      "Lead qualification pipelines",
      "Data processing & reporting",
    ],
  },
  {
    title: "AI Chatbots",
    desc: "Chatbots that understand and respond — from FAQs to complex conversational flows.",
    deliverables: [
      "Conversational AI chatbots",
      "WhatsApp & voice-enabled bots",
      "Context-aware conversation design",
      "Intelligent intent routing",
    ],
  },
  {
    title: "Business Systems",
    desc: "Software your business actually runs on.",
    deliverables: [
      "CRMs & ERPs",
      "Dashboards & reporting",
      "Industry-specific software",
      "Internal tools",
    ],
  },
  {
    title: "E-commerce & Growth",
    desc: "Stores that convert, wired for revenue.",
    deliverables: [
      "Conversion-first Shopify stores",
      "Abandoned-cart recovery",
      "Omnichannel automation (call/email/WhatsApp)",
      "Security & cloud deploy",
    ],
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
        <p className="mt-5 max-w-xl text-body text-muted">
          We engineer systems that sell — design, engineering, AI and
          automation working as one.
        </p>

        {/* ---- Featured offering: E-commerce & Shopify (Part B) ---- */}
        <SectionReveal>
          <div
            onMouseMove={spotlightMove}
            className="group relative mt-8 overflow-hidden rounded-2xl border border-hairline bg-surface transition-[border-color] duration-200 ease-out-expo hover:border-hairline-strong"
          >
            <SpotlightOverlay />
            <div className="relative grid lg:grid-cols-12">
              <div className="flex flex-col p-5 sm:p-6 lg:col-span-7">
                <span className="w-fit rounded-full bg-accent-fill px-3 py-1 font-mono text-micro uppercase tracking-[0.08em] text-on-accent">
                  Featured · E-commerce &amp; Shopify
                </span>
                <h3 className="mt-4 font-display text-title text-text">
                  Stores that turn products into <em>sales</em>.
                </h3>
                <p className="mt-2 text-small text-muted">
                  PixelLayerr builds Shopify stores with AI abandoned-cart
                  recovery and WhatsApp automation, from Indore, India.
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {ECOM_PILLARS.map((pillar) => (
                    <li key={pillar.title} className="flex items-baseline gap-3">
                      <span
                        aria-hidden
                        className="h-0.5 w-4 shrink-0 translate-y-[-4px] bg-accent"
                      />
                      <p className="text-small">
                        <span className="font-medium text-text">
                          {pillar.title}
                        </span>{" "}
                        <span className="text-muted">— {pillar.line}</span>
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                  >
                    Book a call
                  </Button>
                </div>
              </div>
              <a
                href={SUGAR_STORY_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live proof: The Sugar Story — visit the live store (opens in new tab)"
                className="group relative block aspect-[16/10] overflow-hidden border-t border-hairline lg:col-span-5 lg:aspect-auto lg:min-h-full lg:border-t-0 lg:border-l"
              >
                <Image
                  src="/work/the-sugar-story.webp"
                  alt="Homepage of The Sugar Story, a premium homemade bakery in Bhopal, with online ordering"
                  fill
                  sizes="(min-width: 1024px) 32rem, 100vw"
                  className="object-cover object-top transition-transform duration-500 ease-out-expo group-hover:scale-[1.02]"
                />
                <span className="absolute bottom-3 left-3 rounded-full border border-hairline bg-deep/85 px-3 py-1.5 font-mono text-micro uppercase tracking-[0.08em] text-text backdrop-blur-sm">
                  Live proof: The Sugar Story <span aria-hidden>↗</span>
                </span>
              </a>
            </div>
          </div>
        </SectionReveal>

        <div className="mt-10">
          <ServiceAccordionMotion items={SERVICES} accentColor="#c6ff5a" />
        </div>
      </div>
    </section>
  );
}
