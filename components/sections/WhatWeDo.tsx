"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { TiltSpotlightCard } from "@/components/motion/animkit";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { useReveal } from "@/components/motion/useReveal";

/* One icon set: 24px, 1.5 stroke, currentColor, decorative. */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="text-muted"
    >
      {children}
    </svg>
  );
}

const CATEGORIES = [
  {
    title: "Websites & Web Apps",
    benefit: "Premium sites that feel engineered, not templated.",
    specifics: [
      "Next.js + React builds",
      "Design systems",
      "Headless CMS",
      "Core Web Vitals performance",
      "Motion & interaction design",
    ],
    span: "lg:col-span-7",
    icon: (
      <Icon>
        <rect x="3" y="4.5" width="18" height="15" rx="2" />
        <path d="M3 9h18M6.5 6.75h.01M9.25 6.75h.01" />
      </Icon>
    ),
  },
  {
    title: "SaaS & Product Engineering",
    benefit: "From first wireframe to production, as one team.",
    specifics: [
      "MVP to scale",
      "Architecture & multi-tenancy",
      "Auth + billing",
      "APIs & integrations",
    ],
    span: "lg:col-span-5",
    icon: (
      <Icon>
        <path d="M12 3.5 20 8l-8 4.5L4 8l8-4.5Z" />
        <path d="M4 12.5l8 4.5 8-4.5M4 17l8 4.5 8-4.5" opacity="0.55" />
      </Icon>
    ),
  },
  {
    title: "AI — Agents, Chatbots & Automation",
    benefit: "Working AI in your product and your operations.",
    specifics: [
      "Custom agents",
      "Chatbots",
      "Workflow automation",
      "LLM integration & RAG",
    ],
    span: "lg:col-span-5",
    icon: (
      <Icon>
        <path d="M12 3.5c.9 4.3 3.2 6.6 8.5 8.5-5.3 1.9-7.6 4.2-8.5 8.5-.9-4.3-3.2-6.6-8.5-8.5 5.3-1.9 7.6-4.2 8.5-8.5Z" />
      </Icon>
    ),
  },
  {
    title: "Business Systems",
    benefit: "Software your business actually runs on.",
    specifics: [
      "CRMs",
      "ERPs",
      "Dashboards & reporting",
      "Industry-specific software",
      "Internal tools",
    ],
    span: "lg:col-span-7",
    icon: (
      <Icon>
        <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
        <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5" />
        <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
        <path d="M16.75 13v7.5M13 16.75h7.5" />
      </Icon>
    ),
  },
] as const;

const GROWTH = {
  title: "Growth & Platform",
  benefit: "Built to be found, fast, and secure.",
  specifics: [
    "SEO / GEO / AEO",
    "Performance",
    "Security",
    "Cloud & deployment",
  ],
  icon: (
    <Icon>
      <path d="M3.5 20.5 9.5 14l4 4 7-8" />
      <path d="M15.5 10h5v5" />
    </Icon>
  ),
};

/* TiltSpotlightCard is the card shell now (own surface, border, spotlight,
   3D tilt). Inner icon/heading parallax-pop via data-depth. */
function CardShell({
  children,
  interactive,
}: {
  children: ReactNode;
  interactive: boolean;
}) {
  return (
    <TiltSpotlightCard
      accentColor="#c6ff5a"
      reducedMotion={interactive ? undefined : true}
      className="h-full"
      style={{ height: "100%" }}
    >
      <div className="p-8 sm:p-10">{children}</div>
    </TiltSpotlightCard>
  );
}

function MicroCta() {
  return (
    <a
      href="#contact"
      className="link-underline mt-8 inline-flex items-center gap-1.5 text-small text-accent-text transition-colors duration-200 ease-out-expo hover:text-text"
    >
      Discuss your build
      <span aria-hidden>→</span>
    </a>
  );
}

export function WhatWeDo() {
  const reducedMotion = useReducedMotion();
  const reveal = useReveal();

  return (
    <section id="services" aria-labelledby="services-heading">
      <div className="container-site section-y">
        <p className="text-micro uppercase tracking-[0.08em] text-muted">
          03 · What we do
        </p>
        <h2
          id="services-heading"
          className="mt-4 max-w-2xl font-display text-display-lg"
        >
          Every <em>layer</em> of a digital product.
        </h2>

        <ul className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {CATEGORIES.map((category, index) => (
            <motion.li
              key={category.title}
              {...reveal(index * 0.08)}
              className={category.span}
            >
              <CardShell interactive={!reducedMotion}>
                <div data-depth="1.5">{category.icon}</div>
                <h3 data-depth="1.5" className="mt-6 text-title">
                  {category.title}
                </h3>
                <p className="mt-2 text-body text-muted">{category.benefit}</p>
                <ul className="mt-6 flex flex-col gap-2">
                  {category.specifics.map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-3 text-small text-muted"
                    >
                      <span
                        aria-hidden
                        className="h-px w-3 shrink-0 translate-y-[-3px] bg-hairline-strong"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <MicroCta />
              </CardShell>
            </motion.li>
          ))}

          {/* Full-width low-profile card — third shape in the bento */}
          <motion.li {...reveal(0.32)} className="lg:col-span-12">
            <CardShell interactive={!reducedMotion}>
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-sm">
                  <div data-depth="1.5">{GROWTH.icon}</div>
                  <h3 data-depth="1.5" className="mt-6 text-title">
                    {GROWTH.title}
                  </h3>
                  <p className="mt-2 text-body text-muted">{GROWTH.benefit}</p>
                </div>
                <div className="flex flex-col gap-6 lg:items-end">
                  <ul className="flex flex-wrap gap-3">
                    {GROWTH.specifics.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-hairline px-4 py-1.5 text-small text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <MicroCta />
                </div>
              </div>
            </CardShell>
          </motion.li>
        </ul>
      </div>
    </section>
  );
}
