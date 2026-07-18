"use client";

import { useRef } from "react";
import type { MouseEvent, ReactNode } from "react";

import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

const MAX_PULL = 6;

/**
 * Subtle magnetic wrapper for primary CTAs only. Follows the cursor by a few
 * pixels (≤6px, expo-out) and settles back on leave. Fine pointers only —
 * touch devices and reduced-motion get a plain wrapper.
 */
export function Magnetic({
  children,
  strength = 0.18,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const finePointer = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches;

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !finePointer() || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const clamp = (v: number) => Math.max(-MAX_PULL, Math.min(MAX_PULL, v));
    const x = clamp((event.clientX - rect.left - rect.width / 2) * strength);
    const y = clamp((event.clientY - rect.top - rect.height / 2) * strength);
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };

  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="inline-block transition-transform duration-300 ease-out-expo will-change-transform"
    >
      {children}
    </div>
  );
}
