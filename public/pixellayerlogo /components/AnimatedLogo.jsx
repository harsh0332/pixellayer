"use client";
/**
 * PixelLayerr Motion — AnimatedLogo (v3)
 * A calmer, more premium take. Variants:
 *  - "wordmark": letters cascade-resolve one by one (rise + blur→sharp, expo-out) while a lime
 *    baseline draws underneath and fades once settled. "Pixel" in DM Sans 600, "Layerr" in
 *    Instrument Serif italic (the brand's display accent). After settle: a faint ambient wave
 *    breathes through the letters and a narrow lime scan sweeps across every ~9s; the pixel-dot
 *    pulses. Hover → a soft ripple runs through the letters.
 *  - "mark": an isometric 3-plane "layers" glyph. Planes drop in from above with stagger and
 *    resolve; gentle bob at rest; hover → planes separate along depth, settle back.
 *  - "lockup": mark assembles first, wordmark follows, dot lands last.
 * Peer deps: react. Fonts: DM Sans + Instrument Serif expected from the site.
 * Next.js: import { AnimatedLogo } from "@/components/motion/AnimatedLogo" — direct client import. SSR-safe.
 * Props: accentColor | textColor | size(px) | variant "wordmark"|"mark"|"lockup" | animate(ambient loop) | speed | text
 * Reduced motion → static resolved logo, no loops. Touch → no hover states.
 */
// Preview shim (React is ambient here) — in Next.js DELETE the next line and add:  import React from "react";
if (typeof React === "undefined") { throw new Error("React peer dep missing — add: import React from 'react'"); }

const PLX_LOGO_EASE = "cubic-bezier(.16,.66,.2,1)";
const PLX_LOGO_CSS = `
@keyframes plx-logo-pulse{0%,12%,100%{transform:scale(1)}5%{transform:scale(1.25)}}
@keyframes plx-logo-wave{0%,100%{transform:translateY(0)}3.5%{transform:translateY(-2px)}8%{transform:translateY(0)}}
@keyframes plx-logo-ripple{0%{transform:translateY(0)}38%{transform:translateY(-4px)}100%{transform:translateY(0)}}
@keyframes plx-logo-scan{0%,84%{transform:translateX(-130%) skewX(-14deg);opacity:0}86%{opacity:1}99%{transform:translateX(720%) skewX(-14deg)}100%{opacity:0}}
@keyframes plx-logo-bob{from{transform:translateY(-1.4px)}to{transform:translateY(1.4px)}}`;

function usePlxLogoMedia() {
  const [m, setM] = React.useState({ reduced: false, hover: false });
  React.useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hm = window.matchMedia("(hover: hover) and (pointer: fine)");
    const f = () => setM({ reduced: rm.matches, hover: hm.matches });
    f();
    rm.addEventListener("change", f); hm.addEventListener("change", f);
    return () => { rm.removeEventListener("change", f); hm.removeEventListener("change", f); };
  }, []);
  return m;
}

function usePlxLogoPhases(reduced, speed, delay, settleMs) {
  const [settled, setSettled] = React.useState(false);
  const [live, setLive] = React.useState(false);
  React.useEffect(() => {
    if (reduced) { setSettled(true); setLive(true); return; }
    let t0, t2;
    const t1 = requestAnimationFrame(() => requestAnimationFrame(() => {
      t0 = setTimeout(() => {
        setSettled(true);
        t2 = setTimeout(() => setLive(true), settleMs / speed);
      }, delay / speed);
    }));
    return () => { cancelAnimationFrame(t1); clearTimeout(t0); clearTimeout(t2); };
  }, [reduced, speed, delay, settleMs]);
  return [settled, live];
}

function PlxMark({ accentColor, size, animate, speed, reduced, hoverOk, delay = 0 }) {
  const [settled, live] = usePlxLogoPhases(reduced, speed, delay, 900);
  const [hovered, setHovered] = React.useState(false);
  const p = size * 0.74, gap = size * 0.17, m = hovered && !reduced ? 1.9 : 1;
  return (
    <span onMouseEnter={hoverOk ? () => setHovered(true) : undefined} onMouseLeave={hoverOk ? () => setHovered(false) : undefined}
      style={{ display: "inline-grid", placeItems: "center", width: size * 1.25, height: size * 1.2, flex: "none", perspective: size * 5, animation: live && animate && !reduced ? `plx-logo-bob ${6 / speed}s ease-in-out infinite alternate` : "none" }}>
      <span aria-hidden="true" style={{ position: "relative", width: p, height: p, transformStyle: "preserve-3d", transform: "rotateX(56deg) rotateZ(45deg)" }}>
        {[0, 1, 2].map((i) => {
          const top = i === 2, z = (i - 1) * gap * m;
          return (
            <span key={i} style={{
              position: "absolute", inset: 0, borderRadius: size * 0.13,
              border: `1px solid ${top ? accentColor : "rgba(255,255,255,0.18)"}`,
              background: top ? `color-mix(in oklab, ${accentColor} 14%, transparent)` : `rgba(255,255,255,${0.03 + i * 0.015})`,
              boxShadow: top ? `0 0 ${size * 0.45}px color-mix(in oklab, ${accentColor} 30%, transparent)` : "none",
              transform: settled ? `translateZ(${z}px)` : `translateZ(${z + size * 1.1}px)`,
              filter: settled ? "blur(0px)" : "blur(5px)",
              opacity: settled ? 1 : 0.001,
              transition: reduced ? "none" : `transform ${(hovered || !settled ? 480 : 620) / speed}ms ${PLX_LOGO_EASE} ${(settled && !hovered ? 0 : i * 90) / speed}ms, filter ${560 / speed}ms ${PLX_LOGO_EASE} ${(i * 90) / speed}ms, opacity ${340 / speed}ms linear ${(i * 90) / speed}ms`,
            }} />
          );
        })}
      </span>
    </span>
  );
}

function PlxWordmark({ accentColor, textColor, size, animate, speed, reduced, hoverOk, text, delay = 0 }) {
  const [hovered, setHovered] = React.useState(false);
  const si = text.slice(1).search(/[A-Z]/);
  const letters = [...text].map((ch, i) => ({ ch, serif: si >= 0 && i > si }));
  const [settled, live] = usePlxLogoPhases(reduced, speed, delay, letters.length * 45 + 700);
  const ds = Math.max(4, size * 0.12);
  const anim = (i) => {
    if (reduced || !live) return "none";
    if (hovered) return `plx-logo-ripple ${0.62 / speed}s ${PLX_LOGO_EASE} ${(i * 30) / speed}ms both`;
    if (animate) return `plx-logo-wave ${7.5 / speed}s ease-in-out ${(i * 95) / speed}ms infinite`;
    return "none";
  };
  return (
    <span onMouseEnter={hoverOk ? () => setHovered(true) : undefined} onMouseLeave={hoverOk ? () => setHovered(false) : undefined}
      style={{ position: "relative", display: "inline-flex", alignItems: "baseline", fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 600, fontSize: size, letterSpacing: "-0.03em", lineHeight: 1.15, color: textColor, whiteSpace: "nowrap" }}>
      <span aria-hidden="true" style={{ position: "relative", display: "inline-flex", alignItems: "baseline", overflow: "visible" }}>
        {letters.map((l, i) => (
          <span key={i} style={{
            display: "inline-block",
            fontFamily: l.serif ? "'Instrument Serif', Georgia, serif" : undefined,
            fontStyle: l.serif ? "italic" : undefined,
            fontWeight: l.serif ? 400 : undefined,
            fontSize: l.serif ? "1.08em" : undefined,
            transform: settled ? "translateY(0) scale(1)" : "translateY(0.35em) scale(0.97)",
            filter: settled ? "blur(0px)" : "blur(7px)",
            opacity: settled ? 1 : 0.001,
            transition: reduced ? "none" : `transform ${620 / speed}ms ${PLX_LOGO_EASE} ${(i * 45) / speed}ms, filter ${620 / speed}ms ${PLX_LOGO_EASE} ${(i * 45) / speed}ms, opacity ${360 / speed}ms linear ${(i * 45) / speed}ms`,
            animation: anim(i),
          }}>{l.ch}</span>
        ))}
        <span aria-hidden="true" style={{
          position: "absolute", left: 0, right: 0, bottom: "-0.14em", height: 2, borderRadius: 2,
          background: `linear-gradient(90deg, ${accentColor}, color-mix(in oklab, ${accentColor} 35%, transparent))`,
          transformOrigin: "left center",
          transform: settled ? "scaleX(1)" : "scaleX(0)",
          opacity: live ? 0 : 0.9,
          transition: reduced ? "none" : `transform ${(letters.length * 45 + 450) / speed}ms ${PLX_LOGO_EASE}, opacity ${700 / speed}ms linear`,
          pointerEvents: "none",
        }} />
        {live && animate && !reduced && (
          <span aria-hidden="true" style={{ position: "absolute", inset: "-8% 0", overflow: "hidden", pointerEvents: "none", borderRadius: 4 }}>
            <span style={{
              position: "absolute", top: 0, bottom: 0, left: 0, width: "16%",
              background: `linear-gradient(90deg, transparent, color-mix(in oklab, ${accentColor} 16%, rgba(255,255,255,0.14)), transparent)`,
              mixBlendMode: "screen",
              animation: `plx-logo-scan ${9 / speed}s linear infinite`,
            }} />
          </span>
        )}
      </span>
      <span aria-hidden="true" style={{
        width: ds, height: ds, marginLeft: size * 0.14, borderRadius: "50%",
        background: accentColor, alignSelf: "flex-end", marginBottom: size * 0.08,
        boxShadow: `0 0 ${size * 0.35}px color-mix(in oklab, ${accentColor} 55%, transparent)`,
        transform: settled ? "scale(1)" : "scale(0)",
        transition: reduced ? "none" : `transform ${420 / speed}ms ${PLX_LOGO_EASE} ${(letters.length * 45 + 180) / speed}ms`,
        animation: live && animate && !reduced ? `plx-logo-pulse ${4.6 / speed}s ease-in-out infinite` : "none",
      }} />
    </span>
  );
}

function AnimatedLogo({ accentColor = "#c6ff5a", textColor = "#f4f2eb", size = 44, variant = "wordmark", animate = true, speed = 1, text = "PixelLayerr" }) {
  size = +size || 44; speed = +speed || 1;
  animate = animate !== false && animate !== "false";
  const { reduced, hover } = usePlxLogoMedia();
  const common = { accentColor, textColor, size, animate, speed, reduced, hoverOk: hover, text };
  return (
    <span role="img" aria-label={text} style={{ display: "inline-flex", alignItems: "center", gap: size * 0.32 }}>
      <style>{PLX_LOGO_CSS}</style>
      {variant === "mark" && <PlxMark {...common} />}
      {variant === "wordmark" && <PlxWordmark {...common} />}
      {variant === "lockup" && (
        <React.Fragment>
          <PlxMark {...common} size={size * 0.94} />
          <PlxWordmark {...common} delay={380} />
        </React.Fragment>
      )}
    </span>
  );
}

if (typeof module !== "undefined") module.exports = { AnimatedLogo };
// Next.js: replace the line above with:  export { AnimatedLogo }; export default AnimatedLogo;
