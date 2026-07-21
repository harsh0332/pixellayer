"use client";

import { useId, useState } from "react";

import { AnimatedEyebrow, SectionHeadingMotion } from "@/components/motion/v2";
import { Button } from "@/components/ui/Button";
import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { cn } from "@/lib/utils";

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://calendly.com/harshhchouksey/30min";

/* Three real, objection-handling answers — no invented numbers. */
const FAQS = [
  {
    q: "How long does a build take?",
    a: "It depends on scope — a focused site is a matter of weeks, while SaaS and larger platforms run in phased milestones. You get a clear, honest timeline at scoping, before anything is committed.",
  },
  {
    q: "Do I own the code and data?",
    a: "Yes — fully. Your code, your data, your infrastructure. Everything is handed over completely, with no lock-in.",
  },
  {
    q: "How do we start?",
    a: "Book a call, we scope the build together, and then we get to work — design and engineering as one team, with a clear next step at every stage.",
  },
];

export function Faq() {
  const reducedMotion = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [open, setOpen] = useState(-1);

  return (
    <section id="faq" aria-label="Frequently asked questions">
      <div className="container-site section-y-compact">
        <AnimatedEyebrow index="08" label="FAQ" />
        <div className="mt-4 max-w-2xl">
          <SectionHeadingMotion
            text="Answers, *upfront*."
            fontSize="clamp(28px, 6.5vw, 42px)"
          />
        </div>

        <div className="mt-10 max-w-3xl border-t border-hairline">
          {FAQS.map((item, i) => {
            const expanded = reducedMotion || open === i;
            return (
              <div key={item.q} className="border-b border-hairline">
                <h3 className="m-0">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`faq-${uid}-${i}`}
                    id={`faq-${uid}-head-${i}`}
                    onClick={() =>
                      !reducedMotion && setOpen(expanded ? -1 : i)
                    }
                    className={cn(
                      "group flex w-full items-baseline justify-between gap-6 py-5 text-left",
                      "focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                    )}
                  >
                    <span className="text-body-lg font-medium text-text transition-colors duration-200 ease-out-expo group-hover:text-accent-text">
                      {item.q}
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden
                      className={cn(
                        "shrink-0 translate-y-0.5 text-muted transition-transform duration-300 ease-out-expo",
                        expanded && "rotate-45 text-accent",
                      )}
                    >
                      <path
                        d="M7 1v12M1 7h12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </h3>
                <div
                  id={`faq-${uid}-${i}`}
                  role="region"
                  aria-labelledby={`faq-${uid}-head-${i}`}
                  className="grid transition-[grid-template-rows] duration-500 ease-out-expo motion-reduce:transition-none"
                  style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-xl pb-5 text-body text-muted">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a call
            <span aria-hidden>↗</span>
          </Button>
          <Button href="#contact" variant="secondary">
            Send a brief
          </Button>
        </div>
      </div>
    </section>
  );
}
