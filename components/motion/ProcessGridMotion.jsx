"use client";

import React from "react";
/**
 * PixelLayerr Motion — ProcessGridMotion ("06 · How we work" principle cards)
 * SCROLL-DRIVEN sequence: a lime progression line draws with the user's scroll
 * (horizontal above the grid on desktop; a vertical timeline rail on mobile),
 * and each stage activates one by one as the line reaches it — optical-rise,
 * index flash, tick draw. No pinning; plain window scroll drives progress.
 * Hover (pointer only): card lifts 3px, surface brightens a touch, the index turns lime and its
 * tick extends — quiet, no tilt (the services cards already carry the 3D moment).
 * Peer deps: react. Next.js: import { ProcessGridMotion } from "@/components/motion/ProcessGridMotion" —
 * direct client import; pass your principles as `items`.
 * Props: items [{title, copy}] | accentColor | surfaceColor | borderColor | textColor | mutedColor | minColumnWidth
 * Reduced motion → static resolved grid. Touch → no hover states.
 */

const PLX_PG_EASE = "cubic-bezier(.16,.66,.2,1)";
const PLX_PG_DEFAULT = [
  { title: "One roof", copy: "Design and engineering as one team; nothing lost in handoff." },
  { title: "AI-native", copy: "Automation built in from the start, not bolted on." },
  { title: "Product thinking", copy: "Outcomes over page counts." },
  { title: "Full ownership", copy: "Your code, your data, your infrastructure." },
];

function ProcessGridMotion({ items = PLX_PG_DEFAULT, accentColor = "#c6ff5a", surfaceColor = "#0e121b", borderColor = "rgba(255,255,255,0.13)", textColor = "#f4f2eb", mutedColor = "#969ba5", minColumnWidth = 200 }) {
  minColumnWidth = +minColumnWidth || 200;
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `plxpg${uid}`;
  const [reduced, setReduced] = React.useState(false);
  const [hoverOk, setHoverOk] = React.useState(false);
  const [narrow, setNarrow] = React.useState(false);
  const [activeCount, setActiveCount] = React.useState(0);
  const [hovered, setHovered] = React.useState(-1);
  const ref = React.useRef(null);
  const lineRef = React.useRef(null);
  React.useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hm = window.matchMedia("(hover: hover) and (pointer: fine)");
    const nm = window.matchMedia("(max-width: 767px)");
    const f = () => { setReduced(rm.matches); setHoverOk(hm.matches); setNarrow(nm.matches); };
    f(); rm.addEventListener("change", f); hm.addEventListener("change", f); nm.addEventListener("change", f);
    return () => { rm.removeEventListener("change", f); hm.removeEventListener("change", f); nm.removeEventListener("change", f); };
  }, []);
  /* Scroll drives the sequence: progress 0→1 as the grid moves through the
     viewport; the line scales with it and stage i activates at i/n. */
  const nItems = items.length;
  React.useEffect(() => {
    if (reduced) {
      setActiveCount(nItems);
      if (lineRef.current) lineRef.current.style.transform = "none";
      return;
    }
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = ref.current;
      if (!el) return;
      const vh = window.innerHeight || 1;
      const r = el.getBoundingClientRect();
      const total = Math.max(Math.min(r.height, vh * 0.55), 1) + vh * 0.15;
      const p = Math.min(Math.max((vh * 0.9 - r.top) / total, 0), 1);
      if (lineRef.current)
        lineRef.current.style.transform = (window.innerWidth < 768)
          ? `scaleY(${p.toFixed(4)})`
          : `scaleX(${p.toFixed(4)})`;
      const count = Math.min(Math.max(Math.ceil(p * nItems + 0.05), 0), nItems);
      setActiveCount((c) => (c === count ? c : count));
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [reduced, nItems]);
  const css = `
@keyframes ${cls}-idx{0%{color:${mutedColor}}30%{color:${accentColor}}100%{color:${mutedColor}}}
@media (prefers-reduced-motion:reduce){.${cls} *{animation:none!important;transition:none!important}}`;
  return (
    <div ref={ref} className={cls} style={{ position: "relative", display: "flex", flexDirection: "column", gap: 22, paddingLeft: narrow ? 22 : 0 }}>
      <style>{css}</style>
      {/* Progression line: horizontal above the row on desktop, a vertical
          timeline rail on mobile — scaled directly by scroll progress. */}
      <div
        aria-hidden="true"
        ref={lineRef}
        style={narrow ? {
          position: "absolute", left: 4, top: 6, bottom: 6, width: 2, borderRadius: 2,
          background: `linear-gradient(180deg, color-mix(in oklab, ${accentColor} 70%, transparent), color-mix(in oklab, ${accentColor} 25%, ${borderColor}))`,
          transformOrigin: "top center", transform: "scaleY(0)",
        } : {
          height: 2, borderRadius: 2,
          background: `linear-gradient(90deg, color-mix(in oklab, ${accentColor} 70%, transparent), color-mix(in oklab, ${accentColor} 25%, ${borderColor}) 60%, transparent)`,
          transformOrigin: "left center", transform: "scaleX(0)",
        }}
      />
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`, gap: 14 }}>
        {items.map((it, i) => {
          const h = hoverOk && hovered === i && !reduced;
          const d = 60;
          const shownCard = reduced || i < activeCount;
          return (
            <div key={i}
              onMouseEnter={hoverOk ? () => setHovered(i) : undefined}
              onMouseLeave={hoverOk ? () => setHovered(-1) : undefined}
              style={{ border: `1px solid ${h ? `color-mix(in oklab, ${accentColor} 32%, ${borderColor})` : borderColor}`, borderRadius: 16,
                boxShadow: h ? `0 8px 28px -14px color-mix(in oklab, ${accentColor} 45%, transparent)` : "none",
                background: h ? "color-mix(in oklab, #ffffff 3.5%, " + surfaceColor + ")" : surfaceColor,
                padding: "22px 22px 24px", display: "flex", flexDirection: "column", gap: 10,
                clipPath: shownCard ? "inset(-8% -4% -8% -4% round 16px)" : "inset(0 0 100% 0 round 16px)",
                transform: shownCard ? (h ? "translateY(-3px)" : "translateY(0)") : "translateY(14px)",
                filter: shownCard ? "blur(0px)" : "blur(6px)",
                opacity: shownCard ? 1 : 0.001,
                transition: reduced ? "none" : `clip-path 680ms ${PLX_PG_EASE} ${d}ms, transform ${h || hovered >= 0 ? 320 : 680}ms ${PLX_PG_EASE} ${d}ms, filter 680ms ${PLX_PG_EASE} ${d}ms, opacity 400ms linear ${d}ms, border-color .35s, background .35s, box-shadow .35s`,
              }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "0.16em", color: h ? accentColor : mutedColor, transition: "color .35s",
                  animation: shownCard && !reduced ? `${cls}-idx 900ms ${PLX_PG_EASE} ${d + 260}ms both` : "none" }}>{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden="true" style={{ width: h ? 30 : 18, height: 2, borderRadius: 2, background: accentColor, transformOrigin: "left center",
                  transform: shownCard ? "scaleX(1)" : "scaleX(0)", opacity: h ? 1 : 0.6,
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

export { ProcessGridMotion };
export default ProcessGridMotion;
