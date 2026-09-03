"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import type { LooseProps } from "@/components/motion/animkit";

/* Part E: the retired ExplodedInterfaceHero, repurposed as a dimmed, isolated
   backdrop for the 404 page only — never on the homepage (one hero rule). */
const ExplodedInterfaceHero = dynamic(
  () =>
    import("@/components/motion/animkit/ExplodedInterfaceHero").then(
      (m) => m.default as unknown as ComponentType<LooseProps>,
    ),
  { ssr: false },
);

export function NotFoundScene() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 opacity-40">
      <ExplodedInterfaceHero
        accentColor="#eef0ff"
        signalColor="#eef0ff"
        secondaryColor="#87c2ff"
        backgroundColor="#07090e"
      />
    </div>
  );
}
