"use client";

import { MotionConfig } from "framer-motion";
import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const ReducedMotionContext = createContext(false);

function subscribe(onChange: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Single source of truth for prefers-reduced-motion. All animation code
 * (Framer Motion via MotionConfig, GSAP/Lenis via useReducedMotion) reads
 * from here.
 */
export function ReducedMotionProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );

  return (
    <ReducedMotionContext.Provider value={reducedMotion}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotion() {
  return useContext(ReducedMotionContext);
}
