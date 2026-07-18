"use client";

import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { DURATION, EASE_OUT_EXPO } from "@/lib/motion";

/**
 * THE reveal-on-scroll for the whole site — one implementation, spec tokens
 * only. Spread the returned props onto any motion.* element:
 *
 *   const reveal = useReveal();
 *   <motion.li {...reveal(0.08)} />
 *
 * Reduced motion → renders static (no initial state, no animation).
 */
export function useReveal() {
  const reducedMotion = useReducedMotion();

  return (delay = 0) =>
    reducedMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" as const },
          transition: { duration: DURATION.slow, ease: EASE_OUT_EXPO, delay },
        };
}
