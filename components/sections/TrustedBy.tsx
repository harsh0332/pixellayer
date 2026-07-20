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

        <div className="mt-8 grid grid-cols-1 items-center gap-x-14 gap-y-8 lg:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            <LogoMarqueeMotion items={NAMES} />
          </div>
          <StatCounterMotion stats={STATS} numberSize={36} />
        </div>
      </div>
    </section>
  );
}
