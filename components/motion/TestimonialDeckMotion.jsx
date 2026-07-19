"use client";

import React from "react";
/**
 * PixelLayerr Motion — TestimonialDeckMotion
 * Stacked testimonial cards with real 3D depth: back cards sit deeper with slight tilt and ease
 * forward (expo-out) on advance; drag or click the front card, or use the dots (active dot → lime pill).
 * Serif quote mark resolves in and a soft sheen sweeps the front card on change. Entrance: stack rises + resolves.
 * Peer deps: react. Pure CSS/pointer events — no libs.
 * Next.js: import { TestimonialDeckMotion } from "@/components/motion/TestimonialDeckMotion" — direct client
 *          import, SSR-safe. {{TESTIMONIAL}} slot strings render as intentional placeholder chips.
 * Props: testimonials[{quote,name,role}] | accentColor | surfaceColor | borderColor | textColor | mutedColor | height
 * Reduced motion → flat instant switches; touch drag supported (pan-y preserved).
 */

const PLX_TD_EASE = "cubic-bezier(.16,.66,.2,1)";

const PLX_TD_DEFAULT = [
  { quote: "{{TESTIMONIAL_1}}", name: "{{NAME}}", role: "{{ROLE · COMPANY}}" },
  { quote: "{{TESTIMONIAL_2}}", name: "{{NAME}}", role: "{{ROLE · COMPANY}}" },
  { quote: "{{TESTIMONIAL_3}}", name: "{{NAME}}", role: "{{ROLE · COMPANY}}" },
];

const plxIsSlot = (s) => typeof s === "string" && /^\{\{.*\}\}$/.test(s);

function TestimonialDeckMotion({ testimonials = PLX_TD_DEFAULT, accentColor = "#c6ff5a", surfaceColor = "#0e121b", borderColor = "rgba(255,255,255,0.13)", textColor = "#f4f2eb", mutedColor = "#969ba5", height = 380, maxWidth = 760 }) {
  height = +height || 380; maxWidth = +maxWidth || 760;
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `plxtd${uid}`;
  const n = testimonials.length;
  const rootRef = React.useRef(null);
  const frontRef = React.useRef(null);
  const drag = React.useRef(null);
  const [active, setActive] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const f = (e) => setReduced(e.matches);
    m.addEventListener("change", f);
    let io;
    if (rootRef.current && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.2 });
      io.observe(rootRef.current);
    } else setShown(true);
    return () => { m.removeEventListener("change", f); io && io.disconnect(); };
  }, []);
  const on = shown || reduced;
  const advance = React.useCallback(() => setActive((a) => (a + 1) % n), [n]);
  // Drag with horizontal-intent detection: vertical swipes are ignored so the
  // page scrolls normally (touch-action: pan-y); we only capture the pointer
  // and move the card once a deliberate horizontal drag is confirmed.
  const down = (e) => {
    if (n < 2) return;
    const el = frontRef.current;
    if (!el) return;
    drag.current = { x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, horiz: false, pid: e.pointerId };
  };
  const moveP = (e) => {
    const dg = drag.current, el = frontRef.current;
    if (!dg || !el) return;
    dg.dx = e.clientX - dg.x0;
    dg.dy = e.clientY - dg.y0;
    if (!dg.horiz) {
      // Vertical intent → hand the gesture back to the browser (page scroll).
      if (Math.abs(dg.dy) > 12 && Math.abs(dg.dy) > Math.abs(dg.dx)) { drag.current = null; return; }
      // Horizontal intent → start dragging the card.
      if (Math.abs(dg.dx) > 12 && Math.abs(dg.dx) > Math.abs(dg.dy)) {
        dg.horiz = true;
        el.setPointerCapture && el.setPointerCapture(dg.pid);
      } else return;
    }
    if (!reduced) {
      el.style.transition = "none";
      el.style.transform = `translateX(${dg.dx * 0.65}px) rotate(${(dg.dx * 0.028).toFixed(2)}deg)`;
    }
  };
  const up = () => {
    const dg = drag.current, el = frontRef.current;
    drag.current = null;
    if (!el || !dg) return;
    el.style.transition = ""; el.style.transform = "";
    // Advance on a deliberate horizontal drag, or on a true tap (no movement
    // on EITHER axis) — never on a vertical swipe.
    const tap = Math.abs(dg.dx) < 5 && Math.abs(dg.dy) < 5;
    if ((dg.horiz && Math.abs(dg.dx) > 70) || tap) advance();
  };
  const css = `
@keyframes ${cls}-sheen{from{background-position:210% 0}to{background-position:-110% 0}}
@keyframes ${cls}-qin{from{clip-path:inset(0 100% 0 0);filter:blur(6px);transform:translateY(6px)}to{clip-path:inset(-20% -10% -20% -10%);filter:blur(0px);transform:none}}
.${cls}-dot{border:none;padding:0;cursor:pointer;height:6px;border-radius:99px;transition:width .4s ${PLX_TD_EASE},background .3s}
.${cls}-dot:focus-visible{outline:2px solid ${accentColor};outline-offset:3px}
@media (prefers-reduced-motion:reduce){.${cls} *,.${cls}{animation:none!important;transition:none!important}}`;
  const entrance = reduced ? {} : {
    clipPath: on ? "inset(-8% -8% -8% -8%)" : "inset(14% 4% 4% 4%)",
    transform: on ? "none" : "translateY(20px)",
    filter: on ? "blur(0px)" : "blur(9px)",
    opacity: on ? 1 : 0.001,
    transition: `clip-path .85s ${PLX_TD_EASE}, transform .85s ${PLX_TD_EASE}, filter .85s ${PLX_TD_EASE}, opacity .5s linear`,
  };
  return (
    <div ref={rootRef} className={cls} style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: textColor, maxWidth, touchAction: "pan-y", ...entrance }}>
      <style>{css}</style>
      <div style={{ position: "relative", height, perspective: 1300, marginTop: 56 }}>
        {testimonials.map((t, i) => {
          const depth = (i - active + n) % n;
          const front = depth === 0;
          const style = {
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            background: surfaceColor, border: `1px solid ${front ? `color-mix(in oklab, ${accentColor} 16%, ${borderColor})` : borderColor}`,
            borderRadius: 20, padding: "32px 38px", overflow: "hidden",
            boxShadow: front ? "0 30px 60px rgba(0,0,0,.5)" : "0 12px 30px rgba(0,0,0,.35)",
            zIndex: n - depth,
            transform: reduced ? (front ? "none" : "translateY(-18px) scale(.96)") : `translateY(${-34 * depth}px) translateZ(${-110 * depth}px) rotate(${front ? 0 : (i % 2 ? 1.7 : -1.7)}deg)`,
            opacity: depth > 2 ? 0.001 : 1 - depth * 0.16,
            filter: `blur(${depth * 0.6}px)`,
            transition: reduced ? "none" : `transform .7s ${PLX_TD_EASE}, opacity .55s linear, filter .7s ${PLX_TD_EASE}, border-color .4s`,
            cursor: front && n > 1 ? "grab" : "default",
            touchAction: "pan-y",
            userSelect: "none",
          };
          return (
            <figure key={i} ref={front ? frontRef : null} style={{ ...style, margin: 0 }}
              onPointerDown={front ? down : undefined} onPointerMove={front ? moveP : undefined} onPointerUp={front ? up : undefined} onPointerCancel={front ? up : undefined}>
              {front && !reduced && (
                <div key={active} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(105deg, transparent 34%, rgba(255,255,255,0.06) 50%, transparent 66%)", backgroundSize: "240% 100%", animation: `${cls}-sheen 1.1s ${PLX_TD_EASE} .15s both` }} />
              )}
              <div key={`q${front ? active : i}`} aria-hidden="true" style={{
                fontFamily: "'Instrument Serif', Georgia, serif", fontStyle: "italic", fontSize: 58, lineHeight: 0.7, marginBottom: 18,
                color: `color-mix(in oklab, ${accentColor} 55%, transparent)`,
                animation: front && !reduced ? `${cls}-qin .9s ${PLX_TD_EASE} .1s both` : "none",
              }}>&ldquo;</div>
              {plxIsSlot(t.quote) ? (
                <span style={{ alignSelf: "flex-start", fontFamily: "'DM Mono', ui-monospace, monospace", fontSize: 13, letterSpacing: "0.06em", color: mutedColor, border: "1px dashed rgba(255,255,255,0.2)", borderRadius: 8, padding: "10px 14px" }}>{t.quote}</span>
              ) : (
                <blockquote style={{ margin: 0, fontSize: 18.5, lineHeight: 1.65, color: textColor }}>{t.quote}</blockquote>
              )}
              <figcaption style={{ marginTop: "auto", paddingTop: 20, display: "flex", alignItems: "baseline", gap: 12, borderTop: `1px solid rgba(255,255,255,0.08)` }}>
                {plxIsSlot(t.name)
                  ? <span style={{ fontFamily: "'DM Mono', ui-monospace, monospace", fontSize: 11, color: mutedColor, border: "1px dashed rgba(255,255,255,0.2)", borderRadius: 6, padding: "3px 8px" }}>{t.name}</span>
                  : <span style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</span>}
                {plxIsSlot(t.role)
                  ? <span style={{ fontFamily: "'DM Mono', ui-monospace, monospace", fontSize: 11, color: mutedColor, border: "1px dashed rgba(255,255,255,0.14)", borderRadius: 6, padding: "3px 8px" }}>{t.role}</span>
                  : <span style={{ fontSize: 13, color: mutedColor }}>{t.role}</span>}
              </figcaption>
            </figure>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 26 }}>
        {testimonials.map((_, i) => (
          <button key={i} className={`${cls}-dot`} aria-label={`Testimonial ${i + 1}`} onClick={() => setActive(i)}
            style={{ width: i === active ? 22 : 6, background: i === active ? accentColor : "rgba(255,255,255,0.22)", boxShadow: i === active ? `0 0 10px color-mix(in oklab, ${accentColor} 40%, transparent)` : "none" }} />
        ))}
      </div>
    </div>
  );
}

export { TestimonialDeckMotion };
export default TestimonialDeckMotion;
