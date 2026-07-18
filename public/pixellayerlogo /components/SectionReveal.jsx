"use client";
/**
 * PixelLayerr Motion — SectionReveal
 * Optical reveal: clip-path resolve + blur→sharp + small rise (never opacity-only).
 * Peer deps: react (CSS transitions only, no animation libs).
 * Next.js: import { SectionReveal } from "@/components/motion/SectionReveal" — wrap any block. SSR-safe client component.
 * Props: as | delay(ms) | duration(ms) | y(px) | stagger(ms between direct children) | once | style | className
 * Reduced motion → renders resolved instantly.
 */
// Preview shim (React is ambient here) — in Next.js DELETE the next line and add:  import React from "react";
if (typeof React === "undefined") { throw new Error("React peer dep missing — add: import React from 'react'"); }

const PLX_EASE = "cubic-bezier(.16,.66,.2,1)";

function usePlxReduced() {
  const [r, setR] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
    const f = (e) => setR(e.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  return r;
}

function usePlxInView(ref, once = true) {
  const [v, setV] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setV(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setV(true); if (once) io.disconnect(); }
      else if (!once) setV(false);
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return v;
}

function SectionReveal({ children, as = "div", delay = 0, duration = 700, y = 12, stagger = 0, once = true, style, className }) {
  delay = +delay || 0; duration = +duration || 700; y = +y || 0; stagger = +stagger || 0;
  const ref = React.useRef(null);
  const reduced = usePlxReduced();
  const shown = usePlxInView(ref, once !== false && once !== "false") || reduced;
  const styleFor = (extra) => reduced ? {} : {
    clipPath: shown ? "inset(-4% -4% -4% -4%)" : "inset(16% 3% 4% 3%)",
    transform: shown ? "none" : `translateY(${y}px)`,
    filter: shown ? "blur(0px)" : "blur(9px)",
    opacity: shown ? 1 : 0.001,
    transition: ["clip-path", "transform", "filter"].map((p) => `${p} ${duration}ms ${PLX_EASE} ${delay + extra}ms`).join(", ") + `, opacity ${Math.round(duration * 0.55)}ms linear ${delay + extra}ms`,
    willChange: shown ? "auto" : "clip-path, transform, filter",
  };
  const content = stagger > 0
    ? React.Children.map(children, (c, i) => <div key={i} style={styleFor(i * stagger)}>{c}</div>)
    : children;
  return React.createElement(as, { ref, className, style: { ...(stagger > 0 ? {} : styleFor(0)), ...style } }, content);
}

if (typeof module !== "undefined") module.exports = { SectionReveal };
// Next.js: replace the line above with:  export { SectionReveal }; export default SectionReveal;
