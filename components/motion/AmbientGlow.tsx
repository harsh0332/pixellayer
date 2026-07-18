"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Ambient mesh-gradient glow: two low-opacity radial blobs (accent → accent-2)
 * breathing slowly via CSS keyframes. This is how "color" enters the dark
 * canvas — always behind content, never a flat fill.
 *
 * Pure CSS animation (scale/opacity only); freezes under
 * prefers-reduced-motion and pauses while offscreen (--ambient-play,
 * IntersectionObserver). Parent needs `relative`; content above needs a
 * positive z-index or its own stacking context.
 */
export function AmbientGlow({
  className,
  intensity = 1,
}: {
  className?: string;
  /** 0–1 multiplier on the glow opacity. */
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      el.style.setProperty(
        "--ambient-play",
        entry.isIntersecting ? "running" : "paused",
      );
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      style={{ opacity: intensity }}
    >
      <div
        className="ambient-blob absolute left-1/2 top-[-20%] aspect-square w-[60%] min-w-80 -translate-x-[70%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, var(--accent-glow) 0%, transparent 65%)",
        }}
      />
      <div
        className="ambient-blob absolute left-1/2 top-[-10%] aspect-square w-[50%] min-w-72 translate-x-[5%] rounded-full [animation-delay:-6s]"
        style={{
          background:
            "radial-gradient(circle at center, rgba(135, 194, 255, 0.16) 0%, transparent 65%)",
        }}
      />
    </div>
  );
}
