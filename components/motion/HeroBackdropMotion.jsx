"use client";

import React from "react";
/**
 * PixelLayerr Motion — HeroBackdropMotion (optional hero upgrade)
 * A depth backdrop that sits BEHIND the existing hero content to make it feel more prominent —
 * three parallax layers of faint pixel-dot grids drift very slowly and respond to the pointer
 * (≤12px, expo-smoothed); a soft lime glow trails the cursor at low opacity; occasional single
 * "pixels" of the grid light up lime and fade (one at a time, every few seconds). Edges vignette
 * into the page background so it never competes with the headline.
 * Peer deps: react. Next.js: import { HeroBackdropMotion } from "@/components/motion/HeroBackdropMotion" —
 * place as the first child of the hero <section style={{position:"relative"}}>:
 *   <HeroBackdropMotion style={{position:"absolute", inset:0}} /> — content stays above it.
 * Props: accentColor | backgroundColor | dotOpacity | parallax (px, default 12) | sparks (on/off) | speed
 * Reduced motion → static grid, no drift/sparks. Touch → drift only, no pointer parallax.
 */

function HeroBackdropMotion({ accentColor = "#c6ff5a", backgroundColor = "#07090e", dotOpacity = 0.16, parallax = 12, sparks = true, speed = 1, style }) {
  dotOpacity = +dotOpacity || 0.16; parallax = +parallax || 12; speed = +speed || 1;
  sparks = sparks !== false && sparks !== "false";
  const [reduced, setReduced] = React.useState(false);
  const [hoverOk, setHoverOk] = React.useState(false);
  const [spark, setSpark] = React.useState(null);
  const wrapRef = React.useRef(null);
  const layerRefs = [React.useRef(null), React.useRef(null), React.useRef(null)];
  const glowRef = React.useRef(null);
  const visRef = React.useRef(true);
  React.useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hm = window.matchMedia("(hover: hover) and (pointer: fine)");
    const f = () => { setReduced(rm.matches); setHoverOk(hm.matches); };
    f(); rm.addEventListener("change", f); hm.addEventListener("change", f);
    return () => { rm.removeEventListener("change", f); hm.removeEventListener("change", f); };
  }, []);
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => { visRef.current = e.isIntersecting; }, { threshold: 0.02 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  React.useEffect(() => {
    if (reduced) return;
    const el = wrapRef.current;
    if (!el) return;
    let raf, t0 = null;
    const target = { x: 0, y: 0, gx: -1, gy: -1 }, cur = { x: 0, y: 0, gx: 0.5, gy: 0.4, go: 0 };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      target.gx = (e.clientX - r.left) / r.width;
      target.gy = (e.clientY - r.top) / r.height;
    };
    const onLeave = () => { target.x = 0; target.y = 0; target.gx = -1; };
    if (hoverOk) { el.addEventListener("pointermove", onMove); el.addEventListener("pointerleave", onLeave); }
    const step = (t) => {
      raf = requestAnimationFrame(step);
      if (!visRef.current) { t0 = null; return; }
      if (t0 == null) t0 = t;
      const drift = ((t - t0) / 1000) * speed;
      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      const wantGo = target.gx >= 0 ? 1 : 0;
      cur.go += (wantGo - cur.go) * 0.05;
      if (target.gx >= 0) { cur.gx += (target.gx - cur.gx) * 0.07; cur.gy += (target.gy - cur.gy) * 0.07; }
      layerRefs.forEach((lr, i) => {
        const n = lr.current; if (!n) return;
        const depth = (i + 1) / 3;
        const dx = Math.sin(drift * 0.05 + i * 2.1) * 6 * depth + cur.x * parallax * depth;
        const dy = Math.cos(drift * 0.04 + i * 1.3) * 4 * depth + cur.y * parallax * depth * 0.7;
        n.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });
      const g = glowRef.current;
      if (g) {
        g.style.transform = `translate3d(${cur.gx * 100 - 50}%, ${cur.gy * 100 - 50}%, 0)`;
        g.style.opacity = String(0.05 + cur.go * 0.1);
      }
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); if (hoverOk) { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); } };
  }, [reduced, hoverOk, parallax, speed]);
  React.useEffect(() => {
    if (reduced || !sparks) return;
    let alive = true, t1, t2;
    const loop = () => {
      if (!alive) return;
      t1 = setTimeout(() => {
        if (!alive) return;
        if (visRef.current) setSpark({ x: 8 + Math.random() * 84, y: 10 + Math.random() * 75, k: Math.random() });
        t2 = setTimeout(() => { if (alive) setSpark(null); loop(); }, 1600 / speed);
      }, (2600 + Math.random() * 3200) / speed);
    };
    loop();
    return () => { alive = false; clearTimeout(t1); clearTimeout(t2); };
  }, [reduced, sparks, speed]);
  const grid = (gapPx, sizePx, op) =>
    `radial-gradient(circle at 1px 1px, rgba(255,255,255,${op}) ${sizePx}px, transparent ${sizePx + 0.5}px)`;
  const layers = [
    { gap: 26, size: 1, op: dotOpacity * 0.45 },
    { gap: 44, size: 1.2, op: dotOpacity * 0.7 },
    { gap: 72, size: 1.5, op: dotOpacity },
  ];
  return (
    <div ref={wrapRef} aria-hidden="true" style={{ position: "relative", overflow: "hidden", pointerEvents: hoverOk ? "auto" : "none", ...style }}>
      {layers.map((l, i) => (
        <div key={i} ref={layerRefs[i]} style={{ position: "absolute", inset: -80, backgroundImage: grid(l.gap, l.size, l.op), backgroundSize: `${l.gap}px ${l.gap}px`, willChange: "transform" }} />
      ))}
      {!reduced && (
        <div ref={glowRef} style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", opacity: 0.05,
          background: `radial-gradient(circle 340px at 50% 50%, color-mix(in oklab, ${accentColor} 55%, transparent), transparent 70%)`,
          filter: "blur(30px)", willChange: "transform, opacity", pointerEvents: "none" }} />
      )}
      {spark && (
        <span key={spark.k} style={{ position: "absolute", left: `${spark.x}%`, top: `${spark.y}%`, width: 3, height: 3, borderRadius: 1,
          background: accentColor, boxShadow: `0 0 12px ${accentColor}, 0 0 3px ${accentColor}`,
          animation: "plx-hb-spark 1.6s cubic-bezier(.16,.66,.2,1) both", pointerEvents: "none" }} />
      )}
      <style>{`@keyframes plx-hb-spark{0%{opacity:0;transform:scale(.4)}18%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.6)}}`}</style>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse 120% 90% at 50% 45%, transparent 55%, ${backgroundColor} 100%)` }} />
    </div>
  );
}

export { HeroBackdropMotion };
export default HeroBackdropMotion;
