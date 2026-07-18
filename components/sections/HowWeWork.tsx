"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import type { LooseProps } from "@/components/motion/animkit";
import { motion } from "framer-motion";

import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { useReveal } from "@/components/motion/useReveal";

const ProcessPipeline = dynamic(
  () =>
    import("@/components/motion/animkit/ProcessPipeline").then(
      (m) => m.default as unknown as ComponentType<LooseProps>,
    ),
  { ssr: false },
);

const CAPABILITIES = [
  {
    title: "One roof",
    line: "Design and engineering as one team; nothing lost in handoff.",
  },
  {
    title: "AI-native",
    line: "Automation built in from the start, not bolted on.",
  },
  {
    title: "Product thinking",
    line: "Outcomes over page counts.",
  },
  {
    title: "Full ownership",
    line: "Your code, your data, your infrastructure.",
  },
];

export function HowWeWork() {
  const reducedMotion = useReducedMotion();
  const reveal = useReveal();

  return (
    <section id="process" aria-labelledby="process-heading">
      <div className="container-site section-y">
        <p className="text-micro uppercase tracking-[0.08em] text-muted">
          06 · How we work
        </p>
        <h2
          id="process-heading"
          className="mt-4 max-w-2xl font-display text-display-lg"
        >
          A process built for <em>certainty</em>.
        </h2>

        {/* Scroll-driven pipeline — its stage copy is real text content,
            readable without JS/motion. deliveryNote overridden: the default
            claims an average delivery time we haven't measured. */}
        <div className="mt-8">
          <ProcessPipeline
            accentColor="#c6ff5a"
            liveColor="#c6ff5a"
            secondaryColor="#87c2ff"
            deliveryNote="END-TO-END · DESIGN TO DEPLOY"
            reducedMotion={reducedMotion || undefined}
          />
        </div>

        {/* ---- Capabilities strip ---- */}
        <motion.ul
          {...reveal(0.1)}
          className="mt-24 grid grid-cols-1 gap-y-8 border-t border-hairline pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8"
        >
          {CAPABILITIES.map((capability, index) => (
            <li
              key={capability.title}
              className={
                index > 0
                  ? "lg:border-l lg:border-hairline lg:pl-8"
                  : undefined
              }
            >
              <h3 className="text-small font-medium text-text">
                {capability.title}
              </h3>
              <p className="mt-2 max-w-[16rem] text-small text-muted">
                {capability.line}
              </p>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
