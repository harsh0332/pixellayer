"use client";
/**
 * PixelLayerr Motion — AmbientGlow
 * Slow-breathing lime/blue radial backdrop glow. Decorative, pointer-events:none.
 * Peer deps: react. Parent MUST be position:relative (glow fills it, absolutely).
 * Next.js: import { AmbientGlow } from "@/components/motion/AmbientGlow" — drop inside any relative section. SSR-safe.
 * Props: colors[] | opacity | size(px) | x,y (CSS pos of first blob) | speed | blur(px) | style
 * Pauses offscreen (IntersectionObserver). Reduced motion → static glow (no breathing).
 */
// Preview shim (React is ambient here) — in Next.js DELETE the next line and add:  import React from "react";
if (typeof React === "undefined") { throw new Error("React peer dep missing — add: import React from 'react'"); }

function AmbientGlow({ colors = ["#c6ff5a", "#5a8dff"], opacity = 0.07, size = 620, x = "30%", y = "55%", speed = 1, blur = 70, style }) {
  opacity = +opacity || 0.07; size = +size || 620; speed = +speed || 1; blur = +blur || 70;
  const ref = React.useRef(null);
  const [reduced, setReduced] = React.useState(false);
  const [inView, setInView] = React.useState(true);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const f = (e) => setReduced(e.matches);
    m.addEventListener("change", f);
    let io;
    if (ref.current && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
      io.observe(ref.current);
    }
    return () => { m.removeEventListener("change", f); io && io.disconnect(); };
  }, []);
  const positions = [{ left: x, top: y }, { left: `calc(100% - ${typeof x === "string" ? x : x + "px"})`, top: `calc(100% - ${typeof y === "string" ? y : y + "px"})` }];
  return (
    <div ref={ref} aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", ...style }}>
      <style>{`@keyframes plx-glow-breathe{0%,100%{transform:translate(-50%,-50%) scale(.92)}50%{transform:translate(-50%,-50%) scale(1.09)}}`}</style>
      {colors.slice(0, 3).map((c, i) => (
        <div key={i} style={{
          position: "absolute", left: (positions[i] || positions[0]).left, top: (positions[i] || positions[0]).top,
          width: size * (1 - i * 0.28), height: size * (1 - i * 0.28), borderRadius: "50%",
          background: `radial-gradient(circle, ${c} 0%, transparent 68%)`,
          opacity: opacity * (1 - i * 0.25), filter: `blur(${blur}px)`,
          transform: "translate(-50%,-50%)",
          animation: reduced ? "none" : `plx-glow-breathe ${(9 + i * 3.5) / speed}s ease-in-out ${i * -4}s infinite`,
          animationPlayState: inView ? "running" : "paused",
        }} />
      ))}
    </div>
  );
}

if (typeof module !== "undefined") module.exports = { AmbientGlow };
// Next.js: replace the line above with:  export { AmbientGlow }; export default AmbientGlow;
