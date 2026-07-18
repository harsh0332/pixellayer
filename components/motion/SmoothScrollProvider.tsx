"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis + GSAP ScrollTrigger sharing a single rAF loop: GSAP's ticker drives
 * Lenis, and Lenis notifies ScrollTrigger on scroll. Native scroll is left
 * untouched when the user prefers reduced motion.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return children;
}
