"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { DURATION, EASE_OUT_EXPO } from "@/lib/motion";

const tracks = [
  { label: "fast · 200ms", duration: DURATION.fast, ease: EASE_OUT_EXPO },
  { label: "base · 300ms", duration: DURATION.base, ease: EASE_OUT_EXPO },
  { label: "slow · 500ms", duration: DURATION.slow, ease: EASE_OUT_EXPO },
  {
    label: "linear 300ms (for comparison — never use)",
    duration: DURATION.base,
    ease: "linear" as const,
  },
];

export function MotionDemo() {
  const [run, setRun] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {tracks.map((track) => (
          <div key={track.label} className="flex flex-col gap-1.5">
            <span className="text-micro uppercase tracking-[0.08em] text-muted">
              {track.label}
            </span>
            <div className="relative h-8 rounded-sm border border-hairline bg-surface">
              <motion.div
                key={run}
                className="absolute top-1 left-1 h-6 w-6 rounded-[4px] bg-accent"
                initial={{ x: 0 }}
                animate={{ x: "min(28rem, calc(100vw - 8rem))" }}
                transition={{ duration: track.duration, ease: track.ease }}
              />
            </div>
          </div>
        ))}
      </div>
      <div>
        <Button variant="secondary" onClick={() => setRun((n) => n + 1)}>
          Replay
        </Button>
      </div>
    </div>
  );
}
