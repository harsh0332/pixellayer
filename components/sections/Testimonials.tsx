"use client";

import { useState, useSyncExternalStore } from "react";

import {
  AnimatedEyebrow,
  SectionHeadingMotion,
  TestimonialDeckMotion,
} from "@/components/motion/v2";
import { cn } from "@/lib/utils";

/* Six REAL testimonials, provided by the client. No invented quotes. If a
   name is later cleared, keep a {{}} slot rather than inventing one. */
const TESTIMONIALS = [
  {
    quote:
      "The interactive masterplan does the selling — buyers explore plots themselves and reach out already convinced. The site feels premium and actually drives enquiries.",
    name: "La Vallée Farms",
    role: "Real Estate",
  },
  {
    quote:
      "The animated site genuinely stands out — parents notice it, and we've had more appointment enquiries since it went live. It finally feels as modern as the care we give.",
    name: "Dr. Sudarshan Arya",
    role: "Baby Steps · Pediatric Clinic",
  },
  {
    quote:
      "The animations do more than look good — they help visitors actually understand what Aranyaani is about. People stay longer and get the vision immediately.",
    name: "Sanjeev Saxena",
    role: "Aranyaani Healing Forest",
  },
  {
    quote:
      "Since the new site, our registrations and conversions have clearly improved. It's fast, clean, and does the selling for us.",
    name: "DPM Entertainment",
    role: "Events & Entertainment",
  },
  {
    quote:
      "Really impressed with how it turned out — polished, professional, and easy for patients to book. Exactly what we wanted.",
    name: "Prince",
    role: "Apna Dental Clinic",
  },
  {
    quote:
      "They built us a genuinely premium website — it makes our business look as serious as it is. Great work start to finish.",
    name: "Sandeep",
    role: "Shoolin Chemicals",
  },
];

/* Deck height hugs the content: taller only where narrow lines wrap more. */
const NARROW_QUERY = "(max-width: 639px)";
function subscribeNarrow(onChange: () => void) {
  const m = window.matchMedia(NARROW_QUERY);
  m.addEventListener("change", onChange);
  return () => m.removeEventListener("change", onChange);
}

export function Testimonials() {
  const [active, setActive] = useState(0);
  const narrow = useSyncExternalStore(
    subscribeNarrow,
    () => window.matchMedia(NARROW_QUERY).matches,
    () => false,
  );

  return (
    <section
      id="testimonials"
      aria-label="Testimonials"
      className="border-y border-hairline bg-elevated"
    >
      <div className="container-site section-y">
        <AnimatedEyebrow index="07" label="Testimonials" />
        <div className="mt-4 max-w-2xl">
          <SectionHeadingMotion
            text="In their *words*."
            fontSize="clamp(28px, 6.5vw, 42px)"
          />
        </div>

        <div className="mt-12 grid items-start gap-x-16 gap-y-10 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <TestimonialDeckMotion
              testimonials={TESTIMONIALS}
              maxWidth={720}
              height={narrow ? 410 : 320}
              activeIndex={active}
              onActiveChange={setActive}
            />
          </div>

          {/* Client index rail — every entry is a real client; clicking flips
              the deck to that card. */}
          <nav aria-label="Choose a testimonial" className="lg:pt-14">
            <p className="font-mono text-micro uppercase tracking-[0.08em] text-muted">
              The clients
            </p>
            <ul className="mt-4 flex flex-col">
              {TESTIMONIALS.map((t, i) => (
                <li key={t.name}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={i === active ? "true" : undefined}
                    className={cn(
                      "group flex w-full items-baseline gap-3 border-b border-hairline py-3 pl-3 text-left",
                      "transition-colors duration-200 ease-out-expo",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "h-0.5 w-3 shrink-0 translate-y-[-3px] transition-all duration-200 ease-out-expo",
                        i === active
                          ? "w-5 bg-accent"
                          : "bg-hairline-strong group-hover:bg-muted",
                      )}
                    />
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block text-small font-medium transition-colors duration-200 ease-out-expo",
                          i === active
                            ? "text-text"
                            : "text-muted group-hover:text-text",
                        )}
                      >
                        {t.name}
                      </span>
                      <span className="block text-micro text-muted">
                        {t.role}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
