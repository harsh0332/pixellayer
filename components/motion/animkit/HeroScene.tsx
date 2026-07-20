"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import type { LooseProps } from "@/components/motion/animkit";

/* ssr:false requires a client boundary — the Hero's headline stays SSR'd so
   the LCP element needs no JS. The scene is decorative (aria-hidden), caps
   DPR at 2, pauses offscreen, runs autonomously on touch, and renders a
   static composition under prefers-reduced-motion (all built in). */
const ExplodedInterfaceHero = dynamic(
  () =>
    import("@/components/motion/animkit/ExplodedInterfaceHero").then(
      (m) => m.default as unknown as ComponentType<LooseProps>,
    ),
  { ssr: false },
);

export function HeroScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <ExplodedInterfaceHero
        accentColor="#c6ff5a"
        signalColor="#c6ff5a"
        secondaryColor="#87c2ff"
        backgroundColor="#07090e"
      />
    </div>
  );
}
