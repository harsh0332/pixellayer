/**
 * JS mirror of the CSS motion tokens (styles/tokens.css) so Framer Motion
 * and GSAP never drift from CSS transitions. Locked: expo-out, 200–600ms,
 * no bounce/overshoot.
 */

export const EASE_OUT_EXPO: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];

export const DURATION = {
  fast: 0.2,
  base: 0.3,
  slow: 0.5,
  /** Spec ceiling (600ms) — hero-scale reveals only. */
  slower: 0.6,
} as const;

/** Default Framer Motion transition for UI moves. */
export const transitionBase = {
  duration: DURATION.base,
  ease: EASE_OUT_EXPO,
} as const;

/** Reveal-on-scroll transition (slower, still expo-out). */
export const transitionSlow = {
  duration: DURATION.slow,
  ease: EASE_OUT_EXPO,
} as const;
