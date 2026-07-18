"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { FEATURED, PROJECTS } from "@/lib/work";

/* Real client wordmarks from the portfolio — text until real logo files are
   provided (no invented logos). */
const CLIENTS = [FEATURED.name, ...PROJECTS.map((p) => p.name)];

/* Honest, derived-from-portfolio numbers only. */
const STATS = [
  { value: 11, label: "Products live" },
  { value: 6, label: "Industries served" },
];

function CountUp({ value, reduced }: { value: number; reduced: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    el.textContent = "0";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const duration = 600;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          el.textContent = String(Math.round(eased * value));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, reduced]);

  /* SSR/static render shows the final value; the effect rewinds and counts. */
  return <span ref={ref}>{value}</span>;
}

export function TrustedBy() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="trusted-by"
      aria-labelledby="trusted-by-heading"
      className="border-y border-hairline"
    >
      <div className="container-site section-y-compact">
        <h2
          id="trusted-by-heading"
          className="text-micro uppercase tracking-[0.08em] text-muted"
        >
          02 · Trusted by
        </h2>

        <div className="mt-8 flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <ul className="flex max-w-3xl flex-wrap items-baseline gap-x-8 gap-y-4">
            {CLIENTS.map((name) => (
              <li
                key={name}
                className="text-small font-medium tracking-tight text-muted transition-colors duration-200 ease-out-expo hover:text-text"
              >
                {name}
              </li>
            ))}
          </ul>

          <dl className="flex shrink-0 gap-12">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-heading text-text">
                  <CountUp value={stat.value} reduced={reducedMotion} />
                </dd>
                <dt className="mt-1 text-small text-muted">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
