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

/* The Sugar Story pairs with the masterplan in the live-proof block. */
const SUGAR = PROJECTS.find((p) => p.slug === "the-sugar-story");

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

        {/* ---- Live proof: masterplan + Sugar Story, one coherent block ---- */}
        <motion.div
          {...reveal(0)}
          onMouseMove={spotlightMove}
          className="group relative mt-12 overflow-hidden rounded-xl border border-hairline bg-surface transition-[border-color] duration-200 ease-out-expo hover:border-hairline-strong"
        >
          <SpotlightOverlay />
          <div className="relative grid lg:grid-cols-2">
            {/* La Vallée Farms — interactive masterplan */}
            <div className="flex flex-col border-b border-hairline lg:border-r lg:border-b-0">
              <a
                href={FEATURED.masterplanUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open the live interactive masterplan of ${FEATURED.name} (opens in new tab)`}
                className="group/img relative block aspect-[16/9] overflow-hidden"
              >
                <Image
                  src={`/work/${FEATURED.imageSlug}.webp`}
                  alt={FEATURED.alt}
                  fill
                  sizes="(min-width: 1024px) 38rem, 100vw"
                  className="object-cover object-top transition-transform duration-500 ease-out-expo group-hover/img:scale-[1.02]"
                />
              </a>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-accent-fill px-3 py-1 text-micro uppercase tracking-[0.08em] text-on-accent">
                    Featured
                  </span>
                  <CategoryChip label={FEATURED.category} />
                </div>
                <h3 className="mt-4 font-display text-title">{FEATURED.name}</h3>
                <p className="mt-2 text-small text-muted">{FEATURED.line}</p>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {FEATURED.masterplan.slice(0, 3).map((item) => (
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
                <div className="mt-6">
                  <Button
                    href={FEATURED.masterplanUrl}
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

            {/* The Sugar Story — live storefront */}
            {SUGAR && (
              <div className="flex flex-col">
                <a
                  href={SUGAR.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Live proof: ${SUGAR.name} — visit the live store (opens in new tab)`}
                  className="group/img relative block aspect-[16/9] overflow-hidden"
                >
                  <Image
                    src={`/work/${SUGAR.slug}.webp`}
                    alt={SUGAR.alt}
                    fill
                    sizes="(min-width: 1024px) 38rem, 100vw"
                    className="object-cover object-top transition-transform duration-500 ease-out-expo group-hover/img:scale-[1.02]"
                  />
                </a>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-hairline bg-deep/85 px-3 py-1 text-micro uppercase tracking-[0.08em] text-text">
                      Live store
                    </span>
                    <CategoryChip label={SUGAR.category} />
                  </div>
                  <h3 className="mt-4 font-display text-title">{SUGAR.name}</h3>
                  <p className="mt-2 text-small text-muted">{SUGAR.line}</p>
                  <div className="mt-auto pt-6">
                    <Button
                      href={SUGAR.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="secondary"
                    >
                      Visit the live store
                      <span aria-hidden>↗</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
        vhPerCard={40}
        leadIn={0.85}
        reducedMotion={reducedMotion || undefined}
      />
    </section>
  );
}
