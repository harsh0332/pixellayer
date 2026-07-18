"use client";

import React from "react";
/**
 * PixelLayerr Motion — IndustrySelectorMotion
 * Industries master-detail: lime indicator bar slides between list items (shared-layout feel),
 * detail panel crossfades + rises with a short stagger, portfolio links draw underlines on hover,
 * and a faint lime/blue ambient glow drifts per selected vertical.
 * Peer deps: react. Pure CSS/rAF — no libs.
 * Next.js: import { IndustrySelectorMotion } from "@/components/motion/IndustrySelectorMotion" — direct client
 *          import, SSR-safe. Placeholder verticals mirror the live layout; pass `industries` for real content.
 * Props: industries[{label,index,title,copy,links[{label,href}]}] | accentColor | surfaceColor | borderColor | textColor | mutedColor
 * Reduced motion → instant switches; keyboard: ↑/↓ move selection.
 */

const PLX_IND_EASE = "cubic-bezier(.16,.66,.2,1)";

const PLX_IND_DEFAULT = [
  { label: "E-commerce", title: "Storefronts built to convert", copy: "Product-first commerce builds with obsessive detail on PDPs, checkout flow and page speed.", links: [{ label: "Baby Steps" }, { label: "Velour Studio" }] },
  { label: "SaaS & Startups", title: "Sites that sell the product", copy: "Marketing sites and launch pages that explain fast, look expensive, and ship on deadline.", links: [{ label: "Northbeam" }, { label: "Relay HQ" }] },
  { label: "Healthcare", title: "Calm, credible, compliant", copy: "Accessible patient-facing experiences that build trust from the first scroll.", links: [{ label: "Clara Health" }] },
  { label: "Real Estate", title: "Listings with presence", copy: "Immersive property showcases with map-driven browsing and fast media delivery.", links: [{ label: "Habitat & Co" }] },
  { label: "Hospitality", title: "Atmosphere, online", copy: "Booking-first sites for hotels and restaurants that carry the in-person mood onto the screen.", links: [{ label: "Hotel Meridian" }, { label: "Osteria Nove" }] },
];

function IndustrySelectorMotion({ industries = PLX_IND_DEFAULT, accentColor = "#c6ff5a", surfaceColor = "#0e121b", borderColor = "rgba(255,255,255,0.13)", textColor = "#f4f2eb", mutedColor = "#969ba5" }) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `plxind${uid}`;
  const rootRef = React.useRef(null);
  const itemRefs = React.useRef([]);
  const busy = React.useRef(false);
  const [active, setActive] = React.useState(0);
  const [displayed, setDisplayed] = React.useState(0);
  const [phase, setPhase] = React.useState("in");
  const [bar, setBar] = React.useState({ top: 0, h: 0 });
  const [reduced, setReduced] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const f = (e) => setReduced(e.matches);
    m.addEventListener("change", f);
    let io;
    if (rootRef.current && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.15 });
      io.observe(rootRef.current);
    } else setInView(true);
    return () => { m.removeEventListener("change", f); io && io.disconnect(); };
  }, []);
  React.useEffect(() => {
    const measure = () => {
      const el = itemRefs.current[active];
      if (el) setBar({ top: el.offsetTop, h: el.offsetHeight });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active, industries.length]);
  const select = (i) => {
    if (i === active || busy.current) return;
    setActive(i);
    if (reduced) { setDisplayed(i); return; }
    busy.current = true;
    setPhase("out");
    setTimeout(() => {
      setDisplayed(i); setPhase("prep");
      requestAnimationFrame(() => requestAnimationFrame(() => { setPhase("in"); busy.current = false; }));
    }, 170);
  };
  const onKey = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const n = industries.length, next = (active + (e.key === "ArrowDown" ? 1 : n - 1)) % n;
      select(next); itemRefs.current[next] && itemRefs.current[next].focus();
    }
  };
  const shown = (inView || reduced) && phase === "in";
  const item = (idx) => {
    const hid = !shown && !reduced;
    return {
      transform: hid ? "translateY(10px)" : "none",
      filter: hid ? "blur(6px)" : "blur(0px)",
      opacity: hid ? 0.001 : 1,
      transition: reduced ? "none" : `transform .6s ${PLX_IND_EASE} ${idx * 70}ms, filter .6s ${PLX_IND_EASE} ${idx * 70}ms, opacity .4s linear ${idx * 70}ms`,
    };
  };
  const d = industries[displayed] || industries[0];
  const css = `
@keyframes ${cls}-breathe{0%,100%{opacity:.75}50%{opacity:1.0}}
.${cls} .${cls}-item{transition:color .3s}
.${cls} .${cls}-item:hover{color:${textColor}}
.${cls} .${cls}-item:focus-visible{outline:none;box-shadow:inset 2px 0 0 ${accentColor}}
.${cls} .${cls}-link{color:${textColor};text-decoration:none;background-image:linear-gradient(${accentColor},${accentColor});background-size:0% 1px;background-position:0 100%;background-repeat:no-repeat;transition:background-size .35s ${PLX_IND_EASE}}
.${cls} .${cls}-link:hover,.${cls} .${cls}-link:focus-visible{background-size:100% 1px;outline:none}
.${cls} .${cls}-link .${cls}-arr{display:inline-block;transition:transform .3s ${PLX_IND_EASE};color:${mutedColor}}
.${cls} .${cls}-link:hover .${cls}-arr,.${cls} .${cls}-link:focus-visible .${cls}-arr{transform:translate(2px,-2px);color:${accentColor}}
@media (prefers-reduced-motion:reduce){.${cls} *{animation:none!important;transition:none!important}}`;
  return (
    <div ref={rootRef} className={cls} onKeyDown={onKey} style={{ display: "grid", gridTemplateColumns: "minmax(180px, 240px) 1fr", gap: 40, fontFamily: "'DM Sans', system-ui, sans-serif", color: textColor }}>
      <style>{css}</style>
      <div role="tablist" aria-label="Industries" style={{ position: "relative", alignSelf: "start" }}>
        <span aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, width: 2, height: bar.h, background: accentColor, borderRadius: 1, transform: `translateY(${bar.top}px)`, transition: reduced ? "none" : `transform .5s ${PLX_IND_EASE}, height .5s ${PLX_IND_EASE}`, boxShadow: `0 0 10px color-mix(in oklab, ${accentColor} 45%, transparent)` }} />
        {industries.map((ind, i) => (
          <button key={i} ref={(el) => (itemRefs.current[i] = el)} role="tab" aria-selected={i === active} onClick={() => select(i)}
            className={`${cls}-item`}
            style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", borderBottom: `1px solid ${borderColor}`, padding: "14px 4px 14px 18px", cursor: "pointer", fontFamily: "inherit", fontSize: 15, letterSpacing: "0.01em", color: i === active ? textColor : mutedColor, fontWeight: i === active ? 500 : 400 }}>
            {ind.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" style={{ position: "relative", background: surfaceColor, border: `1px solid ${borderColor}`, borderRadius: 18, padding: "30px 32px", minHeight: 250, overflow: "hidden", opacity: phase === "out" ? 0.001 : 1, transform: phase === "out" ? "translateY(-6px)" : "none", filter: phase === "out" ? "blur(4px)" : "blur(0px)", transition: reduced ? "none" : phase === "out" ? "opacity .17s linear, transform .17s ease, filter .17s ease" : "none" }}>
        <div aria-hidden="true" style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", filter: "blur(70px)", background: `radial-gradient(circle, ${accentColor} 0%, transparent 66%)`, opacity: 0.07, left: `${12 + displayed * 16}%`, top: `${70 - displayed * 8}%`, transform: "translate(-50%,-50%)", transition: "left 1.1s ease, top 1.1s ease", animation: reduced ? "none" : `${cls}-breathe 9s ease-in-out infinite`, pointerEvents: "none" }} />
        <div aria-hidden="true" style={{ position: "absolute", width: 320, height: 320, borderRadius: "50%", filter: "blur(70px)", background: "radial-gradient(circle, #5a8dff 0%, transparent 66%)", opacity: 0.055, left: `${88 - displayed * 14}%`, top: `${20 + displayed * 10}%`, transform: "translate(-50%,-50%)", transition: "left 1.1s ease, top 1.1s ease", animation: reduced ? "none" : `${cls}-breathe 12s ease-in-out -4s infinite`, pointerEvents: "none" }} />
        <div key={displayed} style={{ position: "relative", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ ...item(0), display: "flex", alignItems: "center", gap: 10, fontFamily: "'DM Mono', ui-monospace, monospace", fontSize: 11, letterSpacing: "0.16em", color: mutedColor, textTransform: "uppercase" }}>
            <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 2, border: `1px solid ${accentColor}`, background: `color-mix(in oklab, ${accentColor} 20%, transparent)` }} />
            {d.index || String(displayed + 1).padStart(2, "0")} · {d.label}
          </div>
          <h3 style={{ ...item(1), margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: "-0.015em" }}>{d.title}</h3>
          <p style={{ ...item(2), margin: 0, fontSize: 15, lineHeight: 1.6, color: mutedColor, maxWidth: 520 }}>{d.copy}</p>
          <div style={{ ...item(3), marginTop: 10 }}>
            <div style={{ fontFamily: "'DM Mono', ui-monospace, monospace", fontSize: 10, letterSpacing: "0.18em", color: mutedColor, marginBottom: 10 }}>FROM THE PORTFOLIO</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 22 }}>
              {(d.links || []).map((l, k) => (
                <a key={k} className={`${cls}-link`} href={l.href || "#work"} style={{ fontSize: 15, paddingBottom: 3 }}>
                  {l.label} <span className={`${cls}-arr`} aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { IndustrySelectorMotion };
export default IndustrySelectorMotion;
