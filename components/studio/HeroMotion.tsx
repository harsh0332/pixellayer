"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useStudioMotion } from "./StudioMotion";

/** The whole hero shares one restrained pointer and scroll coordinate system. */
export function HeroMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { paused, reduced } = useStudioMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (paused || reduced) {
      root.dataset.moving = "false";
      root.style.setProperty("--hero-x", "0px");
      root.style.setProperty("--hero-y", "0px");
      root.style.setProperty("--hero-scroll", "0px");
      return;
    }
    let frame = 0;
    let inView = true;
    let x = 0;
    let y = 0;
    const update = () => {
      frame = 0;
      if (!inView || document.hidden) return;
      const rect = root.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      root.style.setProperty("--hero-x", `${x}px`);
      root.style.setProperty("--hero-y", `${y}px`);
      root.style.setProperty("--hero-scroll", `${progress * 70}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const visibility = () => {
      root.dataset.moving = String(inView && !document.hidden);
      schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      visibility();
    });
    const pointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = root.getBoundingClientRect();
      x = ((event.clientX - rect.left) / Math.max(1, rect.width) - .5) * 22;
      y = ((event.clientY - rect.top) / Math.max(1, rect.height) - .5) * 16;
      schedule();
    };
    const leave = () => { x = 0; y = 0; schedule(); };
    observer.observe(root);
    root.addEventListener("pointermove", pointer);
    root.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", visibility);
    visibility();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      root.removeEventListener("pointermove", pointer);
      root.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [paused, reduced]);

  return <section ref={ref} id="hero" className="eco-hero hero-orchestrated" aria-labelledby="eco-hero-title" data-still={paused || reduced}>
    <div className="hero-design-field hero-studio-backdrop" aria-hidden="true" />
    {children}
  </section>;
}
