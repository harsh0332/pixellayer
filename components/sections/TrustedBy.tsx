"use client";

import { AnimatedEyebrow, LogoMarqueeMotion } from "@/components/motion/v2";
import { FEATURED, PROJECTS } from "@/lib/work";

/* All real project names — no invented clients. */
const NAMES = [FEATURED.name, ...PROJECTS.map((p) => p.name)];

/* Word-stats only — the spec bans numeric counts anywhere. */
const WORD_STATS = [
  { label: "Reach", line: "Across multiple industries" },
  { label: "Ownership", line: "Your code, fully yours" },
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
          <dl className="flex shrink-0 items-center gap-10">
            {WORD_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={
                  i > 0
                    ? "border-l border-hairline pl-10"
                    : undefined
                }
              >
                <dt className="font-mono text-micro uppercase tracking-[0.08em] text-muted">
                  {stat.label}
                </dt>
                <dd className="mt-1.5 ml-0 font-display text-title text-text">
                  {stat.line}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
