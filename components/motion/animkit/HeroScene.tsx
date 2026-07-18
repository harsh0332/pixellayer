"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import type { LooseProps } from "@/components/motion/animkit";

/* ssr:false requires a client boundary — Hero itself stays a server
   component so the LCP headline needs no JS. */
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
