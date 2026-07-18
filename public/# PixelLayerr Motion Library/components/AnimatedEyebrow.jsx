"use client";
/**
 * PixelLayerr Motion — AnimatedEyebrow
 * "05 · INDUSTRIES" mono section label; lime tick draws in, label optically resolves on scroll.
 * Peer deps: react. Font: DM Mono expected from the site (falls back to monospace).
 * Next.js: import { AnimatedEyebrow } from "@/components/motion/AnimatedEyebrow" — direct client import. SSR-safe.
 * Props: index | label | accentColor | color | fontSize | delay(ms)
 * Reduced motion → static.
 */
// Preview shim (React is ambient here) — in Next.js DELETE the next line and add:  import React from "react";
if (typeof React === "undefined") { throw new Error("React peer dep missing — add: import React from 'react'"); }

const PLX_EB_EASE = "cubic-bezier(.16,.66,.2,1)";

function AnimatedEyebrow({ index = "01", label = "SECTION", accentColor = "#c6ff5a", color = "#969ba5", fontSize = 12, delay = 0 }) {
  fontSize = +fontSize || 12; delay = +delay || 0;
  const ref = React.useRef(null);
  const [reduced, setReduced] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const f = (e) => setReduced(e.matches);
    m.addEventListener("change", f);
    let io;
    if (ref.current && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.5 });
      io.observe(ref.current);
    } else setInView(true);
    return () => { m.removeEventListener("change", f); io && io.disconnect(); };
  }, []);
  const shown = inView || reduced;
  const t = (p, d, extra) => reduced ? "none" : `${p} ${d}ms ${PLX_EB_EASE} ${delay + extra}ms`;
  return (
    <div ref={ref} style={{ display: "inline-flex", alignItems: "center", gap: 12, fontFamily: "'DM Mono', ui-monospace, monospace", fontSize, letterSpacing: "0.16em", textTransform: "uppercase", color, lineHeight: 1 }}>
      <span aria-hidden="true" style={{ width: 18, height: 2, background: accentColor, transformOrigin: "left center", transform: shown ? "scaleX(1)" : "scaleX(0)", transition: t("transform", 550, 0), boxShadow: `0 0 8px color-mix(in oklab, ${accentColor} 50%, transparent)` }} />
      <span style={{ display: "inline-block", clipPath: shown ? "inset(-10% -4% -10% -4%)" : "inset(-10% 100% -10% 0)", filter: shown ? "blur(0px)" : "blur(4px)", transition: `${t("clip-path", 700, 140)}, ${t("filter", 700, 140)}` }}>
        {index} · {label}
      </span>
    </div>
  );
}

if (typeof module !== "undefined") module.exports = { AnimatedEyebrow };
// Next.js: replace the line above with:  export { AnimatedEyebrow }; export default AnimatedEyebrow;
