"use client";

import {
  AnimatedEyebrow,
  ProcessGridMotion,
  SectionHeadingMotion,
} from "@/components/motion/v2";

/* Four real principles (the v2 defaults already match our copy). */
const PRINCIPLES = [
  {
    title: "One roof",
    copy: "Design and engineering as one team; nothing lost in handoff.",
  },
  {
    title: "AI-native",
    copy: "Automation built in from the start, not bolted on.",
  },
  {
    title: "Product thinking",
    copy: "Outcomes over page counts.",
  },
  {
    title: "Full ownership",
    copy: "Your code, your data, your infrastructure.",
  },
];

export function HowWeWork() {
  return (
    <section id="process" aria-label="How we work">
      <div className="container-site section-y">
        <AnimatedEyebrow index="06" label="How we work" />
        <div className="mt-4 max-w-2xl">
          <SectionHeadingMotion
            text="A process built for *certainty*."
            fontSize={42}
          />
        </div>

        <div className="mt-14">
          <ProcessGridMotion items={PRINCIPLES} />
        </div>
      </div>
    </section>
  );
}
