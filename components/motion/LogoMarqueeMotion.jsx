"use client";

import React from "react";
/**
 * PixelLayerr Motion — LogoMarqueeMotion ("02 · Trusted by" client strip)
 * An infinite, very slow marquee of client names with soft edge-fade masks. rAF-driven
 * (transform-only, 60fps), pauses when offscreen (IntersectionObserver) and on hover;
 * hovered name brightens to full white, its lime dot glows. Names separated by small lime dots.
 * Peer deps: react. Next.js: import { LogoMarqueeMotion } from "@/components/motion/LogoMarqueeMotion" —
 * direct client import; pass your client names as `items`.
 * Props: items (string[]) | speed (px/s, default 24) | accentColor | textColor | mutedColor | fontSize | gap
 * Reduced motion → static centered wrap (no scroll). Touch → no hover pause needed (still pauses offscreen).
 */

const PLX_LM_DEFAULT = ["La Vallée Farms", "Baby Steps", "AI Buddies", "Aranyaani Healing Forest", "DPM Entertainment", "KliqCraft", "Apna Dental Clinic", "8FlowLabs AI", "Shoolin Chemicals", "Harsh Traders", "Ivy Estate"];

function LogoMarqueeMotion({ items = PLX_LM_DEFAULT, speed = 24, accentColor = "#c6ff5a", textColor = "#f4f2eb", mutedColor = "#969ba5", fontSize = 15, gap = 44 }) {
  speed = +speed || 24; fontSize = +fontSize || 15; gap = +gap || 44;
  if (typeof items === "string") items = items.split(",").map((s) => s.trim()).filter(Boolean);
  const [reduced, setReduced] = React.useState(false);
  const [hovered, setHovered] = React.useState(-1);
  const wrapRef = React.useRef(null);
  const trackRef = React.useRef(null);
  const pausedRef = React.useRef(false);
  const visRef = React.useRef(true);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const f = () => setReduced(m.matches);
    f(); m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => { visRef.current = e.isIntersecting; }, { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  React.useEffect(() => {
    if (reduced) return;
    const el = trackRef.current;
    if (!el) return;
    let raf, x = 0, last = null;
    const step = (t) => {
      if (last == null) last = t;
      const dt = Math.min(48, t - last); last = t;
      if (!pausedRef.current && visRef.current) {
        x -= (speed * dt) / 1000;
        const w = el.scrollWidth / 2;
        if (w > 0 && -x >= w) x += w;
        el.style.transform = `translate3d(${x}px,0,0)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced, speed]);
  const name = (label, i, copy) => (
    <span key={`${copy}-${i}`} aria-hidden={copy === 1 ? "true" : undefined}
      onMouseEnter={() => setHovered(copy * 1000 + i)} onMouseLeave={() => setHovered(-1)}
      style={{ display: "inline-flex", alignItems: "center", gap, whiteSpace: "nowrap" }}>
      <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize, fontWeight: 500, letterSpacing: "0.01em",
        color: hovered === copy * 1000 + i ? textColor : mutedColor, transition: "color .35s" }}>{label}</span>
      <span style={{ width: 4, height: 4, borderRadius: "50%", background: accentColor, flex: "none",
        opacity: hovered === copy * 1000 + i ? 1 : 0.45,
        boxShadow: hovered === copy * 1000 + i ? `0 0 10px ${accentColor}` : "none", transition: "opacity .35s, box-shadow .35s" }} />
    </span>
  );
  if (reduced) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `14px ${gap}px`, padding: "6px 0" }}>
        {items.map((l, i) => name(l, i, 0))}
      </div>
    );
  }
  return (
    <div ref={wrapRef}
      onMouseEnter={() => { pausedRef.current = true; }} onMouseLeave={() => { pausedRef.current = false; setHovered(-1); }}
      style={{ overflow: "hidden", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)", maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)" }}>
      <div ref={trackRef} style={{ display: "inline-flex", alignItems: "center", gap, padding: "6px 0", willChange: "transform" }}>
        {items.map((l, i) => name(l, i, 0))}
        {items.map((l, i) => name(l, i, 1))}
      </div>
    </div>
  );
}

export { LogoMarqueeMotion };
export default LogoMarqueeMotion;
