"use client";

import {
  AnimatedEyebrow,
  LogoMarqueeMotion,
  StatCounterMotion,
} from "@/components/motion/v2";
import { FEATURED, PROJECTS } from "@/lib/work";

/* All 11 real project names — no invented clients. */
const NAMES = [FEATURED.name, ...PROJECTS.map((p) => p.name)];

/* Honest, NON-capping stats only. No total-projects count (that would wrongly
   cap perception). */
const STATS = [
  { value: 6, label: "Industries served" },
  { value: 100, suffix: "%", label: "Code ownership" },
];

export function TrustedBy() {
  return (
    <section
      id="trusted-by"
      aria-label="Trusted by"
      className="border-y border-hairline"
    >
      <div className="container-site section-y-compact">
        <AnimatedEyebrow index="02" label="Trusted by" />

        <div className="mt-8">
          <LogoMarqueeMotion items={NAMES} />
        </div>

        <div className="mt-12">
          <StatCounterMotion stats={STATS} numberSize={44} />
        </div>
      </div>
    </section>
  );
}
