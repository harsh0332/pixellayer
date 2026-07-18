import { HeroScene } from "@/components/motion/animkit/HeroScene";
import { Magnetic } from "@/components/motion/Magnetic";
import { Button } from "@/components/ui/Button";

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://calendly.com/harshhchouksey/30min";

const HEADLINE_LINES = [
  <>Digital products, designed</>,
  <>
    and <em>engineered</em> as one.
  </>,
];

/*
 * Server component on purpose: the headline is the LCP element, so its
 * entrance is pure CSS (hero-line / hero-rise keyframes in globals.css) —
 * it starts at first paint with zero JS dependency, and prefers-reduced-motion
 * disables it at the media-query level.
 */
export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      <HeroScene />
      {/* Readability scrim: keeps AA over the animated scene's bright spots */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-deep/85 via-deep/40 to-transparent"
      />
      <div className="container-site section-y relative z-10 w-full pt-28 pb-20">
        <p className="hero-rise [animation-delay:100ms] text-micro uppercase tracking-[0.08em] text-muted">
          Digital Product Engineering Studio
        </p>

        <h1 id="hero-heading" className="mt-6 font-display text-display-xl text-text">
          {HEADLINE_LINES.map((line, index) => (
            <span key={index} className="block overflow-hidden">
              <span
                className="hero-line block"
                style={{ animationDelay: `${150 + index * 90}ms` }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-rise [animation-delay:350ms] mt-8 max-w-xl text-body-lg text-muted">
          PixelLayerr designs and builds premium websites, web apps, SaaS, AI
          agents, and industry software — end to end.
        </p>

        <div className="hero-rise [animation-delay:450ms] mt-12 flex flex-wrap items-center gap-4">
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
