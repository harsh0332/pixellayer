"use client";

import React from "react";
/**
 * PixelLayerr Motion — ServiceCardMotion
 * Services cards: staggered optical rise on scroll (clip-path + blur→sharp), stroke-draw icons,
 * list ticks that draw in, hover spotlight + ≤5° tilt + one-pass border shine + content parallax.
 * Peer deps: react. Pure CSS/rAF — no libs.
 * Next.js: import { ServiceCardMotion } from "@/components/motion/ServiceCardMotion" — direct client import,
 *          SSR-safe. Placeholder cards mirror the live Services layout; pass `cards` to lift onto real content.
 * Props: cards[{icon,title,desc,items[],cta,href,featured}] | accentColor | surfaceColor | borderColor | textColor | mutedColor
 * Reduced motion → static; touch → no tilt/spotlight (hover:hover gated).
 */

const PLX_SVC_EASE = "cubic-bezier(.16,.66,.2,1)";

const PLX_SVC_ICONS = {
  frame: ["M5 5 h18 v18 h-18 Z", "M5 17 L23 9"],
  layers: ["M14 4 L24 9.5 L14 15 L4 9.5 Z", "M4 15.5 L14 21 L24 15.5", "M4 20.5 L14 26 L24 20.5"],
  motion: ["M14 4 a10 10 0 1 1 -0.01 0", "M11.5 10 L19 14 L11.5 18 Z"],
};

const PLX_SVC_DEFAULT = [
  { icon: "frame", title: "Web Design & Build", desc: "Considered, conversion-first marketing sites shipped end to end.", items: ["Next.js + React builds", "CMS & commerce", "SEO-ready architecture"], cta: "Discuss your build" },
  { icon: "layers", title: "Web Apps & Platforms", desc: "Product-grade interfaces for dashboards, portals and tools.", items: ["Product UX & UI", "Dashboards & portals", "API integrations"], cta: "Discuss your build", featured: true },
  { icon: "motion", title: "Motion & Interaction", desc: "Restrained, premium motion systems that make interfaces feel alive.", items: ["Interaction design", "Micro-animation systems", "Design systems"], cta: "Discuss your build" },
];

function ServiceCardMotion({ cards = PLX_SVC_DEFAULT, accentColor = "#c6ff5a", surfaceColor = "#0e121b", borderColor = "rgba(255,255,255,0.13)", textColor = "#f4f2eb", mutedColor = "#969ba5" , bento = false }) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const rootRef = React.useRef(null);
  const rafs = React.useRef({});
  const [reduced, setReduced] = React.useState(false);
  const [shown, setShown] = React.useState(false);
  const [hoverFine, setHoverFine] = React.useState(false);
  React.useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hm = window.matchMedia("(hover: hover) and (pointer: fine)");
    setReduced(rm.matches); setHoverFine(hm.matches);
    const fr = (e) => setReduced(e.matches), fh = (e) => setHoverFine(e.matches);
    rm.addEventListener("change", fr); hm.addEventListener("change", fh);
    let io;
    if (rootRef.current && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.15 });
      io.observe(rootRef.current);
    } else setShown(true);
    const r = rafs.current;
    return () => { rm.removeEventListener("change", fr); hm.removeEventListener("change", fh); io && io.disconnect(); Object.values(r).forEach(cancelAnimationFrame); };
  }, []);
  const on = shown || reduced;
  const cls = `plxsvc${uid}`;
  const css = `
@keyframes ${cls}-rot{0%{transform:translate(-50%,-50%) rotate(0);opacity:1}85%{opacity:1}100%{transform:translate(-50%,-50%) rotate(1turn);opacity:0}}
@keyframes ${cls}-redraw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
@keyframes ${cls}-breathe{0%,100%{opacity:.5}50%{opacity:1}}
.${cls} .${cls}-title{transform:translateZ(14px);transition:transform .45s ${PLX_SVC_EASE}}
.${cls} .${cls}-body{transform:translateZ(6px)}
.${cls} .${cls}-arrow{display:inline-block;transition:transform .3s ${PLX_SVC_EASE},color .3s}
.${cls} .${cls}-cta{outline:none}
.${cls} .${cls}-cta:focus-visible{box-shadow:0 0 0 2px color-mix(in oklab,${accentColor} 60%,transparent);border-radius:4px}
@media (hover:hover) and (pointer:fine){
  .${cls} .${cls}-card:hover .${cls}-spot{opacity:1}
  .${cls} .${cls}-card:hover .${cls}-rot{animation:${cls}-rot .95s ${PLX_SVC_EASE} 1}
  .${cls} .${cls}-card:hover .${cls}-title{transform:translateZ(22px) translateY(-2px)}
  .${cls} .${cls}-card:hover .${cls}-draw{animation:${cls}-redraw .9s ${PLX_SVC_EASE} 1}
  .${cls} .${cls}-card:hover .${cls}-icon{color:${accentColor}}
}
.${cls} .${cls}-card:hover .${cls}-arrow,.${cls} .${cls}-card:focus-within .${cls}-arrow{transform:translateX(5px);color:${accentColor}}
.${cls} .${cls}-card:hover,.${cls} .${cls}-card:focus-within{border-color:color-mix(in oklab,${accentColor} 30%,${borderColor})}
@media (prefers-reduced-motion:reduce){.${cls} *{animation:none!important;transition:none!important}}
${bento ? `
.${cls}{grid-template-columns:1fr}
@media (min-width:640px){.${cls}{grid-template-columns:repeat(2,minmax(0,1fr))}.${cls} .${cls}-card-featured{grid-column:span 2}.${cls} .${cls}-card-featured ul.${cls}-body{display:grid!important;grid-template-columns:1fr 1fr;column-gap:20px;row-gap:9px}}
@media (min-width:1024px){.${cls}{grid-template-columns:repeat(3,minmax(0,1fr))}}
` : ""}`;

  const move = (i) => (e) => {
    if (!hoverFine || reduced) return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    if (!rafs.current[i]) rafs.current[i] = requestAnimationFrame(() => {
      rafs.current[i] = 0;
      el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      el.style.transform = `perspective(950px) rotateX(${((0.5 - py) * 5).toFixed(2)}deg) rotateY(${((px - 0.5) * 5).toFixed(2)}deg)`;
    });
  };
  const leave = (e) => { e.currentTarget.style.transform = ""; };
  const reveal = (i) => reduced ? {} : {
    clipPath: on ? "inset(-4% -4% -4% -4%)" : "inset(18% 4% 0% 4%)",
    transform: on ? undefined : "translateY(16px)",
    filter: on ? "blur(0px)" : "blur(10px)",
    opacity: on ? 1 : 0.001,
    transition: `clip-path .8s ${PLX_SVC_EASE} ${i * 120}ms, filter .8s ${PLX_SVC_EASE} ${i * 120}ms, opacity .5s linear ${i * 120}ms, transform .45s ${PLX_SVC_EASE}, border-color .3s`,
  };
  return (
    <div ref={rootRef} className={cls} style={{ display: "grid", ...(bento ? {} : { gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }), gap: 14, fontFamily: "'DM Sans', system-ui, sans-serif", color: textColor }}>
      <style>{css}</style>
      {cards.map((c, i) => (
        <article key={i} className={`${cls}-card${c.featured ? ` ${cls}-card-featured` : ""}`} onMouseMove={move(i)} onMouseLeave={leave}
          style={{ position: "relative", background: surfaceColor, border: `1px solid ${c.featured ? `color-mix(in oklab, ${accentColor} 26%, ${borderColor})` : borderColor}`, borderRadius: 18, padding: "26px 24px 24px", overflow: "hidden", transformStyle: "preserve-3d", transition: `transform .45s ${PLX_SVC_EASE}, border-color .3s`, ...reveal(i) }}>
          {c.featured && (
            <div aria-hidden="true" style={{ position: "absolute", inset: "-30%", background: `radial-gradient(60% 55% at 75% 0%, color-mix(in oklab, ${accentColor} 13%, transparent), transparent 70%)`, pointerEvents: "none", animation: reduced ? "none" : `${cls}-breathe 6.5s ease-in-out infinite` }} />
          )}
          <div className={`${cls}-spot`} aria-hidden="true" style={{ position: "absolute", inset: 0, opacity: 0, transition: "opacity .4s", background: `radial-gradient(240px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, ${accentColor} 9%, transparent), transparent 70%)`, pointerEvents: "none" }} />
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, borderRadius: 18, padding: 1, WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none", overflow: "hidden" }}>
            <div className={`${cls}-rot`} style={{ position: "absolute", left: "50%", top: "50%", width: "280%", aspectRatio: "1 / 1", transform: "translate(-50%,-50%)", opacity: 0, background: `conic-gradient(from -90deg, transparent 0 80%, color-mix(in oklab, ${accentColor} 85%, transparent) 90%, transparent 97%)` }} />
          </div>
          <svg width="30" height="30" viewBox="0 0 28 28" fill="none" aria-hidden="true" className={`${cls}-icon`} style={{ display: "block", marginBottom: 20, color: c.featured ? accentColor : textColor, transition: "color .35s" }}>
            {(PLX_SVC_ICONS[c.icon] || PLX_SVC_ICONS.frame).map((d, k) => (
              <path key={k} className={`${cls}-draw`} d={d} pathLength="1" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"
                style={{ strokeDasharray: 1, strokeDashoffset: on ? 0 : 1, transition: reduced ? "none" : `stroke-dashoffset .9s ${PLX_SVC_EASE} ${260 + i * 120 + k * 130}ms` }} />
            ))}
          </svg>
          <h3 className={`${cls}-title`} style={{ margin: "0 0 8px", fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>{c.title}</h3>
          <p className={`${cls}-body`} style={{ margin: "0 0 18px", fontSize: 14, lineHeight: 1.55, color: mutedColor }}>{c.desc}</p>
          <ul className={`${cls}-body`} style={{ listStyle: "none", margin: "0 0 22px", padding: 0, display: "flex", flexDirection: "column", gap: 9 }}>
            {c.items.map((it, j) => {
              const d = 380 + i * 120 + j * 90;
              const hid = !on && !reduced;
              return (
                <li key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: textColor, transform: hid ? "translateY(7px)" : "none", filter: hid ? "blur(4px)" : "blur(0px)", opacity: hid ? 0.001 : 1, transition: reduced ? "none" : `transform .6s ${PLX_SVC_EASE} ${d}ms, filter .6s ${PLX_SVC_EASE} ${d}ms, opacity .4s linear ${d}ms` }}>
                  <span aria-hidden="true" style={{ width: 11, height: 2, background: accentColor, borderRadius: 1, transformOrigin: "left center", transform: hid ? "scaleX(0)" : "scaleX(1)", transition: reduced ? "none" : `transform .5s ${PLX_SVC_EASE} ${d + 110}ms` }} />
                  {it}
                </li>
              );
            })}
          </ul>
          <a className={`${cls}-cta ${cls}-title`} href={c.href || "#contact"} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500, color: textColor, textDecoration: "none" }}>
            {c.cta || "Discuss your build"} <span className={`${cls}-arrow`} aria-hidden="true">→</span>
          </a>
        </article>
      ))}
    </div>
  );
}

export { ServiceCardMotion };
export default ServiceCardMotion;
