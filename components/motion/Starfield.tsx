"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";

/**
 * Ambient starfield — a slow drift of tiny blue-white dots behind the page.
 * Sits at z-index 0 (above the page background, below the content layer)
 * so it shows through the transparent sections and is covered by the solid ones, giving the scroll a quiet depth rhythm.
 * Runs on the site's single gsap.ticker (the same loop that drives Lenis) —
 * no second rAF. DPR is capped, counts drop on small screens, and the loop
 * idles while the tab is hidden. Reduced motion → one static render.
 */

/* Mostly cool white with a few violet/blue dots so it never reads monochrome. */
const HUES = ["238,240,255", "238,240,255", "238,240,255", "185,170,255", "155,165,255"];

type Star = {
  x: number;
  y: number;
  s: number;
  a: number;
  tw: number;
  ph: number;
  drift: number;
  hue: string;
};

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let hidden = false;

    const build = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Density scales with area; capped so mid-range phones stay at 60fps.
      const count = Math.min(Math.round((w * h) / 11000), w < 640 ? 70 : 150);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        s: Math.random() < 0.82 ? 1 : 1.6,
        a: 0.22 + Math.random() * 0.55,
        tw: 0.4 + Math.random() * 1.1,
        ph: Math.random() * Math.PI * 2,
        drift: 0.012 + Math.random() * 0.05,
        hue: HUES[(Math.random() * HUES.length) | 0],
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const st of stars) {
        const twinkle = reducedMotion
          ? 1
          : 0.55 + 0.45 * Math.sin(t * st.tw + st.ph);
        ctx.fillStyle = `rgba(${st.hue},${(st.a * twinkle).toFixed(3)})`;
        ctx.fillRect(st.x, st.y, st.s, st.s);
      }
    };

    build();
    draw(0);

    const onResize = () => {
      build();
      draw(performance.now() / 1000);
    };
    window.addEventListener("resize", onResize);

    let cleanupTicker: (() => void) | undefined;
    if (!reducedMotion) {
      const onVisibility = () => {
        hidden = document.visibilityState === "hidden";
      };
      document.addEventListener("visibilitychange", onVisibility);

      const tick = () => {
        if (hidden) return;
        const t = performance.now() / 1000;
        // Very slow upward drift; wraps for an endless field.
        for (const st of stars) {
          st.y -= st.drift;
          if (st.y < -2) {
            st.y = h + 2;
            st.x = Math.random() * w;
          }
        }
        draw(t);
      };
      gsap.ticker.add(tick);
      cleanupTicker = () => {
        gsap.ticker.remove(tick);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }

    return () => {
      window.removeEventListener("resize", onResize);
      cleanupTicker?.();
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
