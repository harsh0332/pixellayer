"use client";
/**
 * PixelLayerr Motion — ProcessGridMotion ("06 · How we work" principle cards)
 * A hairline draws across the top of the grid, then the four principle cards optical-rise in
 * with stagger; each card's DM Mono index ("01") sits above a lime tick that draws on reveal.
 * Hover (pointer only): card lifts 3px, surface brightens a touch, the index turns lime and its
 * tick extends — quiet, no tilt (the services cards already carry the 3D moment).
 * Peer deps: react. Next.js: import { ProcessGridMotion } from "@/components/motion/ProcessGridMotion" —
 * direct client import; pass your principles as `items`.
 * Props: items [{title, copy}] | accentColor | surfaceColor | borderColor | textColor | mutedColor | minColumnWidth
 * Reduced motion → static resolved grid. Touch → no hover states.
 */
// Preview shim (React is ambient here) — in Next.js DELETE the next line and add:  import React from "react";
if (typeof React === "undefined") { throw new Error("React peer dep missing — add: import React from 'react'"); }

const PLX_PG_EASE = "cubic-bezier(.16,.66,.2,1)";
const PLX_PG_DEFAULT = [
  { title: "One roof", copy: "Design and engineering as one team; nothing lost in handoff." },
  { title: "AI-native", copy: "Automation built in from the start, not bolted on." },
  { title: "Product thinking", copy: "Outcomes over page counts." },
  { title: "Full ownership", copy: "Your code, your data, your infrastructure." },
];

function ProcessGridMotion({ items = PLX_PG_DEFAULT, accentColor = "#c6ff5a", surfaceColor = "#0e121b", borderColor = "rgba(255,255,255,0.13)", textColor = "#f4f2eb", mutedColor = "#969ba5", minColumnWidth = 200 }) {
  minColumnWidth = +minColumnWidth || 200;
  const [reduced, setReduced] = React.useState(false);
  const [hoverOk, setHoverOk] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const [hovered, setHovered] = React.useState(-1);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hm = window.matchMedia("(hover: hover) and (pointer: fine)");
    const f = () => { setReduced(rm.matches); setHoverOk(hm.matches); };
    f(); rm.addEventListener("change", f); hm.addEventListener("change", f);
    return () => { rm.removeEventListener("change", f); hm.removeEventListener("change", f); };
  }, []);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const shown = inView || reduced;
  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div aria-hidden="true" style={{ height: 1, background: `linear-gradient(90deg, ${borderColor}, transparent)`, transformOrigin: "left center",
        transform: shown ? "scaleX(1)" : "scaleX(0)",
        transition: reduced ? "none" : `transform 900ms ${PLX_PG_EASE}` }} />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`, gap: 14 }}>
        {items.map((it, i) => {
          const h = hoverOk && hovered === i && !reduced;
          const d = 150 + i * 110;
          return (
            <div key={i}
              onMouseEnter={hoverOk ? () => setHovered(i) : undefined}
              onMouseLeave={hoverOk ? () => setHovered(-1) : undefined}
              style={{ border: `1px solid ${h ? "rgba(255,255,255,0.22)" : borderColor}`, borderRadius: 16,
                background: h ? "color-mix(in oklab, #ffffff 3.5%, " + surfaceColor + ")" : surfaceColor,
                padding: "22px 22px 24px", display: "flex", flexDirection: "column", gap: 10,
                clipPath: shown ? "inset(-8% -4% -8% -4% round 16px)" : "inset(0 0 100% 0 round 16px)",
                transform: shown ? (h ? "translateY(-3px)" : "translateY(0)") : "translateY(14px)",
                filter: shown ? "blur(0px)" : "blur(6px)",
                opacity: shown ? 1 : 0.001,
                transition: reduced ? "none" : `clip-path 680ms ${PLX_PG_EASE} ${shown && hovered >= 0 ? 0 : d}ms, transform ${h || hovered >= 0 ? 320 : 680}ms ${PLX_PG_EASE} ${shown && hovered >= 0 ? 0 : d}ms, filter 680ms ${PLX_PG_EASE} ${d}ms, opacity 400ms linear ${d}ms, border-color .35s, background .35s`,
              }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.16em", color: h ? accentColor : mutedColor, transition: "color .35s" }}>{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden="true" style={{ width: h ? 30 : 18, height: 2, borderRadius: 2, background: accentColor, transformOrigin: "left center",
                  transform: shown ? "scaleX(1)" : "scaleX(0)", opacity: h ? 1 : 0.6,
                  transition: reduced ? "none" : `transform 480ms ${PLX_PG_EASE} ${d + 260}ms, width 320ms ${PLX_PG_EASE}, opacity .35s` }} />
              </div>
              <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 600, fontSize: 18, color: textColor }}>{it.title}</div>
              <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13.5, lineHeight: 1.55, color: mutedColor, textWrap: "pretty" }}>{it.copy}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

if (typeof module !== "undefined") module.exports = { ProcessGridMotion };
// Next.js: replace the line above with:  export { ProcessGridMotion }; export default ProcessGridMotion;
