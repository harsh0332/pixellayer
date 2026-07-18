"use client";

import { StackedCardCarousel } from "@/components/motion/animkit";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

/*
 * ANTI-FABRICATION: every quote/name/role/company below is an editable
 * placeholder token, rendered visibly as a token until filled with a real
 * quote. Each slot is mapped 1:1 to a real portfolio project.
 */
const SLOTS = [
  {
    project: "La Vallée Farms",
    quote: "{{TESTIMONIAL_1_QUOTE}}",
    name: "{{NAME_1}}",
    role: "{{ROLE_1}}",
    company: "{{COMPANY_1}}",
  },
  {
    project: "Apna Dental Clinic",
    quote: "{{TESTIMONIAL_2_QUOTE}}",
    name: "{{NAME_2}}",
    role: "{{ROLE_2}}",
    company: "{{COMPANY_2}}",
  },
  {
    project: "AI Buddies",
    quote: "{{TESTIMONIAL_3_QUOTE}}",
    name: "{{NAME_3}}",
    role: "{{ROLE_3}}",
    company: "{{COMPANY_3}}",
  },
  {
    project: "Shoolin Chemicals",
    quote: "{{TESTIMONIAL_4_QUOTE}}",
    name: "{{NAME_4}}",
    role: "{{ROLE_4}}",
    company: "{{COMPANY_4}}",
  },
  {
    project: "DPM Entertainment",
    quote: "{{TESTIMONIAL_5_QUOTE}}",
    name: "{{NAME_5}}",
    role: "{{ROLE_5}}",
    company: "{{COMPANY_5}}",
  },
];

export function Testimonials() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="border-y border-hairline bg-elevated"
    >
      <div className="container-site section-y">
        <p className="text-micro uppercase tracking-[0.08em] text-muted">
          07 · Testimonials
        </p>
        <h2
          id="testimonials-heading"
          className="mt-4 max-w-2xl font-display text-display-lg"
        >
          In their <em>words</em>.
        </h2>

        <div className="mx-auto mt-14 max-w-xl">
          <StackedCardCarousel
            items={SLOTS}
            accentColor="#c6ff5a"
            autoAdvance
            interval={6000}
            ariaLabel="Client testimonials"
            reducedMotion={reducedMotion || undefined}
            renderItem={(slot: (typeof SLOTS)[number]) => (
              <article
                key={slot.project}
                className="flex h-full flex-col rounded-lg border border-hairline bg-elevated p-8"
              >
                <span
                  aria-hidden
                  className="font-display text-heading leading-none text-accent-text"
                >
                  “
                </span>
                <blockquote className="mt-3 flex-1">
                  <p className="font-mono text-small text-muted">
                    {slot.quote}
                  </p>
                </blockquote>
                <footer className="mt-8 border-t border-hairline pt-5">
                  <p className="font-mono text-small text-text">{slot.name}</p>
                  <p className="mt-1 font-mono text-small text-muted">
                    {slot.role} · {slot.company}
                  </p>
                  <p className="mt-4 text-micro uppercase tracking-[0.08em] text-muted">
                    Slot for · {slot.project}
                  </p>
                </footer>
              </article>
            )}
          />
        </div>
      </div>
    </section>
  );
}
