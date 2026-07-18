"use client";

import React from "react";
/**
 * PixelLayerr Motion — StatCounterMotion ("11 Products live · 6 Industries served")
 * On scroll into view the numbers count up with expo-out easing (fast start, gentle landing),
 * digits stay tabular so nothing jitters; a small lime tick draws under each number as it lands,
 * and the label wipes in. rAF-driven, runs once, disposes cleanly.
 * Peer deps: react. Next.js: import { StatCounterMotion } from "@/components/motion/StatCounterMotion" —
 * direct client import; pass your stats as `stats`.
 * Props: stats [{value, suffix?, label}] | accentColor | textColor | mutedColor | numberSize | duration(ms) | delay
 * Reduced motion → final values rendered immediately.
 */

const PLX_SC_EASE = "cubic-bezier(.16,.66,.2,1)";
const PLX_SC_DEFAULT = [{ value: 11, label: "Products live" }, { value: 6, label: "Industries served" }];

function StatCounterMotion({ stats = PLX_SC_DEFAULT, accentColor = "#c6ff5a", textColor = "#f4f2eb", mutedColor = "#969ba5", numberSize = 58, duration = 1400, delay = 0 }) {
  numberSize = +numberSize || 58; duration = +duration || 1400; delay = +delay || 0;
  const [reduced, setReduced] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const [vals, setVals] = React.useState(() => stats.map(() => 0));
  const [done, setDone] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const f = () => setReduced(m.matches);
    f(); m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setStarted(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setStarted(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  React.useEffect(() => {
    if (!started) return;
    if (reduced) { setVals(stats.map((s) => +s.value || 0)); setDone(true); return; }
    let raf, t0 = null;
    const expo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const step = (t) => {
      if (t0 == null) t0 = t + delay;
      const p = Math.min(1, Math.max(0, (t - t0) / duration));
      const e = expo(p);
      setVals(stats.map((s) => Math.round((+s.value || 0) * e)));
      if (p < 1) raf = requestAnimationFrame(step);
      else setDone(true);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, reduced]); // eslint-disable-line
  return (
    <div ref={ref} style={{ display: "flex", flexWrap: "wrap", gap: "28px 64px" }}>
      {stats.map((s, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8,
          transform: started || reduced ? "translateY(0)" : "translateY(10px)",
          filter: started || reduced ? "blur(0px)" : "blur(5px)",
          opacity: started || reduced ? 1 : 0.001,
          transition: reduced ? "none" : `transform 620ms ${PLX_SC_EASE} ${i * 110}ms, filter 620ms ${PLX_SC_EASE} ${i * 110}ms, opacity 380ms linear ${i * 110}ms` }}>
          <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 600, fontSize: numberSize, lineHeight: 1, letterSpacing: "-0.03em", color: textColor, fontVariantNumeric: "tabular-nums" }}>
            {vals[i]}{s.suffix ? <span style={{ color: accentColor, fontSize: "0.7em" }}>{s.suffix}</span> : null}
          </span>
          <span aria-hidden="true" style={{ width: 26, height: 2, borderRadius: 2, background: accentColor, transformOrigin: "left center",
            transform: done ? "scaleX(1)" : "scaleX(0)", opacity: 0.8,
            transition: reduced ? "none" : `transform 460ms ${PLX_SC_EASE} ${i * 90}ms` }} />
          <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, color: mutedColor,
            clipPath: started || reduced ? "inset(-10% -4% -10% -4%)" : "inset(-10% 100% -10% -4%)",
            transition: reduced ? "none" : `clip-path 560ms ${PLX_SC_EASE} ${i * 110 + 220}ms` }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export { StatCounterMotion };
export default StatCounterMotion;
