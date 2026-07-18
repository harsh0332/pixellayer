"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { DURATION, EASE_OUT_EXPO } from "@/lib/motion";
import { FEATURED, PROJECTS } from "@/lib/work";
import { cn } from "@/lib/utils";

/* Same icon set as What We Do: 24px, 1.5 stroke, currentColor, decorative. */
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
      className="shrink-0 text-muted"
    >
      {children}
    </svg>
  );
}

/* Portfolio references come from lib/work — the single source of real URLs. */
function refFor(slug: string) {
  if (slug === FEATURED.slug)
    return { name: FEATURED.name, url: FEATURED.url };
  const project = PROJECTS.find((p) => p.slug === slug);
  return project ? { name: project.name, url: project.url } : null;
}

const VERTICALS = [
  {
    id: "healthcare",
    label: "Healthcare & Clinics",
    pain: "Patients decide in minutes — phone-tag and clunky sites lose them.",
    system:
      "We build booking-first clinic sites: services, doctors, treatment information, and appointment flows that turn trust into visits.",
    refs: ["baby-steps", "apna-dental"],
    icon: (
      <Icon>
        <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
        <path d="M12 8.5v7M8.5 12h7" />
      </Icon>
    ),
  },
  {
    id: "real-estate",
    label: "Real Estate & Builders",
    pain: "Buyers can't feel a project from a brochure PDF.",
    system:
      "We build immersive project sites with interactive masterplans, live plot availability, and WhatsApp-direct enquiry flows.",
    refs: ["la-vallee-farms", "ivy-estate"],
    icon: (
      <Icon>
        <path d="M3.5 20.5h17M5.5 20.5v-15l6.5-2v17M18.5 20.5v-11l-6.5-2" />
        <path d="M8.5 8h.01M8.5 11.5h.01M8.5 15h.01" />
      </Icon>
    ),
  },
  {
    id: "ai-automation",
    label: "AI & Automation",
    pain: "An AI company's site has to prove its caliber on sight.",
    system:
      "We build motion-rich, cursor-reactive sites — and the agents, chatbots, and automations working behind them.",
    refs: ["ai-buddies", "8flowlabs"],
    icon: (
      <Icon>
        <circle cx="5" cy="12" r="1.75" />
        <circle cx="19" cy="5.5" r="1.75" />
        <circle cx="19" cy="18.5" r="1.75" />
        <path d="M6.6 11.2 17.3 6.3M6.6 12.8l10.7 4.9" />
      </Icon>
    ),
  },
  {
    id: "industrial",
    label: "Industrial & B2B",
    pain: "Distributors and buyers research you long before they call.",
    system:
      "We build catalog-first B2B sites: product ranges, brochures, and distributorship funnels that qualify serious enquiries.",
    refs: ["shoolin-chemicals"],
    icon: (
      <Icon>
        <path d="M3.5 20.5V9.5l5.5 3.5V9.5l5.5 3.5V4.5h6v16H3.5Z" />
        <path d="M17 16.5h.01M13.5 16.5h.01M10 16.5h.01" opacity="0.55" />
      </Icon>
    ),
  },
  {
    id: "local-business",
    label: "Local Business",
    pain: "Local buyers check you on their phone before they walk in.",
    system:
      "We build WhatsApp-first local sites — rates, delivery, quote requests — in the language customers actually speak.",
    refs: ["harsh-traders"],
    icon: (
      <Icon>
        <path d="M4.5 9.5 6 4.5h12l1.5 5" />
        <path d="M5.5 9.5V19.5h13V9.5" />
        <path d="M9.75 19.5v-4.75h4.5v4.75" />
      </Icon>
    ),
  },
  {
    id: "events",
    label: "Events & Entertainment",
    pain: "Registrations die in slow, confusing forms.",
    system:
      "We build high-urgency registration flows: countdowns, secured payments, and steps clear enough to finish on a phone.",
    refs: ["dpm-entertainment"],
    icon: (
      <Icon>
        <path d="M3.5 9.5v-3h17v3a2.5 2.5 0 0 0 0 5v3h-17v-3a2.5 2.5 0 0 0 0-5Z" />
        <path d="M14.5 6.5v11" opacity="0.55" />
      </Icon>
    ),
  },
] as const;

export function Industries() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (index: number) => {
    const next = (index + VERTICALS.length) % VERTICALS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const handlers: Record<string, () => void> = {
      ArrowDown: () => select(active + 1),
      ArrowRight: () => select(active + 1),
      ArrowUp: () => select(active - 1),
      ArrowLeft: () => select(active - 1),
      Home: () => select(0),
      End: () => select(VERTICALS.length - 1),
    };
    const handler = handlers[event.key];
    if (handler) {
      event.preventDefault();
      handler();
    }
  };

  const vertical = VERTICALS[active];

  return (
    <section id="industries" aria-labelledby="industries-heading">
      <div className="container-site section-y-compact">
        <p className="text-micro uppercase tracking-[0.08em] text-muted">
          05 · Industries
        </p>
        <h2
          id="industries-heading"
          className="mt-4 max-w-2xl font-display text-display-lg"
        >
          Fluent in your <em>vertical</em>.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Master: chip row on mobile, vertical rail on desktop */}
          <div
            role="tablist"
            aria-label="Industries we build for"
            onKeyDown={onKeyDown}
            className="-mx-1 flex gap-1 overflow-x-auto p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:col-span-4 lg:mx-0 lg:flex-col lg:overflow-visible lg:p-0"
          >
            {VERTICALS.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`industry-tab-${item.id}`}
                  aria-selected={selected}
                  aria-controls={`industry-panel-${item.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-3 rounded-md px-4 py-3 text-left text-small whitespace-nowrap",
                    "transition-colors duration-200 ease-out-expo",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                    selected ? "text-text" : "text-muted hover:text-text",
                  )}
                >
                  {selected && (
                    <motion.span
                      layoutId="industry-indicator"
                      aria-hidden
                      className="absolute inset-0 rounded-md border border-hairline-strong bg-surface-hover"
                      transition={{
                        duration: DURATION.base,
                        ease: EASE_OUT_EXPO,
                      }}
                    />
                  )}
                  <span
                    aria-hidden
                    className={cn(
                      "relative hidden h-4 w-0.5 rounded-full lg:block",
                      selected ? "bg-accent" : "bg-transparent",
                    )}
                  />
                  <span className="relative">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-8">
            <div className="h-full rounded-lg border border-hairline bg-surface p-8 sm:p-10 lg:min-h-80">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={vertical.id}
                  role="tabpanel"
                  id={`industry-panel-${vertical.id}`}
                  aria-labelledby={`industry-tab-${vertical.id}`}
                  initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{
                    duration: DURATION.base,
                    ease: EASE_OUT_EXPO,
                  }}
                >
                  {vertical.icon}
                  <h3 className="mt-5 text-title">{vertical.label}</h3>
                  <p className="mt-3 max-w-xl text-body text-muted">
                    {vertical.pain}
                  </p>
                  <p className="mt-3 max-w-xl text-body">{vertical.system}</p>

                  <p className="mt-8 text-micro uppercase tracking-[0.08em] text-muted">
                    From the portfolio
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                    {vertical.refs.map((slug) => {
                      const ref = refFor(slug);
                      if (!ref) return null;
                      return (
                        <li key={slug}>
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Visit live site: ${ref.name} (opens in new tab)`}
                            className="link-underline inline-flex items-center gap-1.5 text-small text-accent-text transition-colors duration-200 ease-out-expo hover:text-text"
                          >
                            {ref.name}
                            <span aria-hidden>↗</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
