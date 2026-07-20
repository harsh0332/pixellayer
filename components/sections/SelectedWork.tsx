"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { useSyncExternalStore } from "react";

import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { SpotlightOverlay, spotlightMove } from "@/components/motion/spotlight";
import { useReveal } from "@/components/motion/useReveal";
import { AnimatedEyebrow, SectionHeadingMotion } from "@/components/motion/v2";
import { Button } from "@/components/ui/Button";
import { FEATURED, PROJECTS } from "@/lib/work";

import type { LooseProps } from "@/components/motion/animkit";

const ScrollFanPortfolio = dynamic(
  () =>
    import("@/components/motion/animkit/ScrollFanPortfolio").then(
      (m) => m.default as unknown as ComponentType<LooseProps>,
    ),
  { ssr: false },
);

/* All real projects → fan items: real names, real categories, real
   screenshots, live URLs. No placeholder cards ever render. */
const FAN_ITEMS = [
  {
    title: FEATURED.name,
    tag: FEATURED.category.toUpperCase(),
    image: `/work/${FEATURED.slug}.webp`,
    href: FEATURED.url,
  },
  ...PROJECTS.map((project) => ({
    title: project.name,
    tag: project.category.toUpperCase(),
    image: `/work/${project.slug}.webp`,
    href: project.url,
  })),
];

/* Fan cards drop to 280px under 480px viewports (touch-safe sizing). */
const SMALL_QUERY = "(max-width: 479px)";
function subscribeSmall(onChange: () => void) {
  const m = window.matchMedia(SMALL_QUERY);
  m.addEventListener("change", onChange);
  return () => m.removeEventListener("change", onChange);
}

function CategoryChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-hairline bg-deep/85 px-3 py-1 text-micro uppercase tracking-[0.08em] text-text">
      {label}
    </span>
  );
}

export function SelectedWork() {
  const reducedMotion = useReducedMotion();
  const reveal = useReveal();
  const small = useSyncExternalStore(
    subscribeSmall,
    () => window.matchMedia(SMALL_QUERY).matches,
    () => false,
  );

  return (
    <section id="work" aria-label="Selected work" className="bg-elevated">
      <div className="container-site section-y">
        <AnimatedEyebrow index="04" label="Selected work" />
        <div className="mt-4 max-w-2xl">
          <SectionHeadingMotion
            text="Real products, *live* in production."
            fontSize="clamp(28px, 6.5vw, 42px)"
          />
        </div>
        <p className="mt-6 max-w-xl text-body-lg text-muted">
          Every project below is real and running — open any of them.
        </p>

        {/* ---- Featured case: La Vallée Farms masterplan ---- */}
        <motion.div
          {...reveal(0)}
          onMouseMove={spotlightMove}
          className="group relative mt-12 overflow-hidden rounded-xl border border-hairline bg-surface transition-[border-color] duration-200 ease-out-expo hover:border-hairline-strong"
        >
          <SpotlightOverlay />
          <div className="relative grid lg:grid-cols-12">
            <a
              href={FEATURED.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit live site: ${FEATURED.name} (opens in new tab)`}
              className="group relative block aspect-[16/10] overflow-hidden lg:col-span-7 lg:aspect-auto lg:min-h-full"
            >
              <Image
                src={`/work/${FEATURED.imageSlug}.webp`}
                alt={FEATURED.alt}
                fill
                sizes="(min-width: 1024px) 44rem, 100vw"
                className="object-cover object-top transition-transform duration-500 ease-out-expo group-hover:scale-[1.02]"
              />
            </a>
            <div className="flex flex-col p-7 sm:p-8 lg:col-span-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-accent-fill px-3 py-1 text-micro uppercase tracking-[0.08em] text-on-accent">
                  Featured
                </span>
                <CategoryChip label={FEATURED.category} />
              </div>
              <h3 className="mt-6 font-display text-heading">
                {FEATURED.name}
              </h3>
              <p className="mt-3 text-body text-muted">{FEATURED.line}</p>

              <p className="mt-6 text-micro uppercase tracking-[0.08em] text-muted">
                The interactive masterplan
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {FEATURED.masterplan.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3 text-small text-muted"
                  >
                    <span
                      aria-hidden
                      className="h-px w-3 shrink-0 translate-y-[-3px] bg-hairline-strong"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  href={FEATURED.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                >
                  Explore the live masterplan
                  <span aria-hidden>↗</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ---- The wheel: all projects, scroll-driven ---- */}
      <ScrollFanPortfolio
        items={FAN_ITEMS}
        accentColor="#c6ff5a"
        secondaryColor="#87c2ff"
        cardWidth={small ? 280 : 320}
        cardHeight={small ? 360 : 400}
        vhPerCard={45}
        reducedMotion={reducedMotion || undefined}
      />
    </section>
  );
}
