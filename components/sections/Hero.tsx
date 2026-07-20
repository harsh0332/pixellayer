"use client";

import { useEffect, useRef, useState } from "react";

import { HeroScene } from "@/components/motion/animkit/HeroScene";
import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://calendly.com/harshhchouksey/30min";

const HEADLINE_LINES = [
  <span key="l1">Digital products, designed</span>,
  <span key="l2">
    and <em>engineered</em> as one.
  </span>,
];

/*
 * The second beat of the single opening: the OS intro's stage fades out as
 * its pin releases, and this section's ExplodedInterfaceHero ASSEMBLE
 * entrance picks up the story ("system ready" → the built site assembles).
 * The text entrance is view-gated (.hero-entrance/.is-in in globals.css) so
 * it plays on arrival, not at page load. On mobile and reduced-motion the
 * intro is skipped entirely and this section IS the opening.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      id="hero"
      aria-labelledby="hero-heading"
      className={cn(
        "hero-entrance relative flex min-h-[100dvh] items-center overflow-hidden bg-deep",
        inView && "is-in",
      )}
    >
      <HeroScene />
      {/* Readability scrim: keeps AA over the scene's bright spots */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-deep/85 via-deep/40 to-transparent"
      />
      {/* Focal glow: pulls the eye to the text column; part of the SAME
          background, not a second one. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-[8%] h-[70vh] w-[52rem] max-w-full -translate-y-1/2 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(closest-side, rgba(198,255,90,0.10), rgba(135,194,255,0.05) 55%, transparent 75%)",
        }}
      />
      <div className="container-site section-y relative z-10 w-full pt-28 pb-20">
        <p className="os-rise [animation-delay:100ms] font-mono text-micro uppercase tracking-[0.08em] text-muted">
          Digital Product Engineering Studio
        </p>

        <h1
          id="hero-heading"
          className="mt-4 font-display text-display-xl text-text"
        >
          {HEADLINE_LINES.map((line, index) => (
            <span key={index} className="block overflow-hidden">
              <span
                className="os-line block"
                style={{ animationDelay: `${150 + index * 90}ms` }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p className="os-rise [animation-delay:350ms] mt-8 max-w-2xl text-body-lg text-text">
          We don&rsquo;t just build websites &mdash; we build{" "}
          <em className="font-serif italic">sales systems</em> that convert.
        </p>
        <p className="os-rise [animation-delay:400ms] mt-3 max-w-xl text-body text-muted">
          Design, engineering, AI and automation &mdash; built to turn visitors
          into customers.
        </p>

        <div className="os-rise [animation-delay:450ms] mt-12 flex flex-wrap items-center gap-4">
          <Magnetic>
            <Button
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              Book a call
            </Button>
          </Magnetic>
          <Button href="#work" size="lg" variant="secondary">
            See our work
          </Button>
        </div>
      </div>
    </section>
  );
}
