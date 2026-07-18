"use client";
/**
 * PixelLayerr Motion — NavBarMotion (site header)
 * Scroll-aware animated header. On load the logo, links and CTA cascade in (rise + blur→sharp).
 * On scroll the bar condenses: background gains a blurred glass tint, a hairline draws underneath,
 * vertical padding tightens. A lime underline SLIDES between nav links on hover (shared-layout, no
 * per-link fades); the active link keeps a small lime dot. The CTA is magnetic (≤6px pull toward
 * the cursor) with a tactile press and a soft lime glow on hover.
 * Peer deps: react. Next.js: import { NavBarMotion } from "@/components/motion/NavBarMotion" —
 * wrap your existing header content: <NavBarMotion links={[{label:"Work",href:"#work"},…]}
 * ctaLabel="Book a call" ctaHref="…" logo={<YourLogo/>} /> — sticky positioning is up to the page
 * (place inside your <header style={{position:"sticky",top:0,zIndex:50}}>). Auto-detects its scroll
 * container (window or nearest overflow parent).
 * Props: links [{label, href}] | activeIndex | ctaLabel | ctaHref | logo (ReactNode) | accentColor |
 * textColor | mutedColor | backgroundColor | maxWidth
 * Reduced motion → static resolved bar (scroll tint still applies, no motion). Touch → no hover/magnetic.
 */
// Preview shim (React is ambient here) — in Next.js DELETE the next line and add:  import React from "react";
if (typeof React === "undefined") { throw new Error("React peer dep missing — add: import React from 'react'"); }

const PLX_NB_EASE = "cubic-bezier(.16,.66,.2,1)";
const PLX_NB_LINKS = [{ label: "Work", href: "#work" }, { label: "Services", href: "#services" }, { label: "Process", href: "#process" }, { label: "Contact", href: "#contact" }];

function NavBarMotion({ links = PLX_NB_LINKS, activeIndex = -1, ctaLabel = "Book a call", ctaHref = "#contact", logo = null, accentColor = "#c6ff5a", textColor = "#f4f2eb", mutedColor = "#969ba5", backgroundColor = "#07090e", maxWidth = 1200, children }) {
  activeIndex = +activeIndex; maxWidth = +maxWidth || 1200;
  const [reduced, setReduced] = React.useState(false);
  const [hoverOk, setHoverOk] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [bar, setBar] = React.useState({ left: 0, width: 0, on: false });
  const [ctaHover, setCtaHover] = React.useState(false);
  const [ctaDown, setCtaDown] = React.useState(false);
  const rootRef = React.useRef(null);
  const rowRef = React.useRef(null);
  const ctaRef = React.useRef(null);
  React.useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hm = window.matchMedia("(hover: hover) and (pointer: fine)");
    const f = () => { setReduced(rm.matches); setHoverOk(hm.matches); };
    f(); rm.addEventListener("change", f); hm.addEventListener("change", f);
    const t = requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
    return () => { rm.removeEventListener("change", f); hm.removeEventListener("change", f); cancelAnimationFrame(t); };
  }, []);
  React.useEffect(() => {
    let node = rootRef.current, scroller = null;
    while (node && node.parentElement) {
      node = node.parentElement;
      const o = getComputedStyle(node).overflowY;
      if (o === "auto" || o === "scroll") { scroller = node; break; }
    }
    const tgt = scroller || window;
    const read = () => setScrolled((scroller ? scroller.scrollTop : window.scrollY) > 10);
    read();
    tgt.addEventListener("scroll", read, { passive: true });
    return () => tgt.removeEventListener("scroll", read);
  }, []);
  const onLinkEnter = (e) => {
    if (!hoverOk) return;
    const row = rowRef.current; if (!row) return;
    const r = e.currentTarget.getBoundingClientRect(), rr = row.getBoundingClientRect();
    setBar({ left: r.left - rr.left + 6, width: r.width - 12, on: true });
  };
  const onCtaMove = (e) => {
    if (!hoverOk || reduced) return;
    const el = ctaRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = ((e.clientX - r.left) / r.width - 0.5) * 12, dy = ((e.clientY - r.top) / r.height - 0.5) * 8;
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${ctaDown ? 0.97 : 1})`;
  };
  const onCtaLeave = () => { const el = ctaRef.current; if (el) el.style.transform = "translate(0,0) scale(1)"; setCtaHover(false); setCtaDown(false); };
  const shown = mounted || reduced;
  const item = (delay, el) => React.cloneElement(el, { style: { ...el.props.style,
    transform: shown ? "translateY(0)" : "translateY(-10px)",
    filter: shown ? "blur(0px)" : "blur(6px)",
    opacity: shown ? 1 : 0.001,
    transition: reduced ? el.props.style.transition : `transform 620ms ${PLX_NB_EASE} ${delay}ms, filter 620ms ${PLX_NB_EASE} ${delay}ms, opacity 380ms linear ${delay}ms${el.props.style.transition ? ", " + el.props.style.transition : ""}` } });
  return (
    <div ref={rootRef} style={{
      background: scrolled ? `color-mix(in srgb, ${backgroundColor} 78%, transparent)` : "transparent",
      backdropFilter: scrolled ? "blur(14px)" : "none", WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
      borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.09)" : "transparent"}`,
      transition: "background .45s, border-color .45s, backdrop-filter .45s",
    }}>
      <div style={{ maxWidth, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
        padding: scrolled ? "12px 24px" : "20px 24px", transition: `padding .45s ${PLX_NB_EASE}` }}>
        {item(0, <div style={{ display: "flex", alignItems: "center", flex: "none" }}>{logo || children || <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 600, fontSize: 20, letterSpacing: "-0.03em", color: textColor }}>PixelLayerr</span>}</div>)}
        <nav ref={rowRef} onMouseLeave={() => setBar((b) => ({ ...b, on: false }))} style={{ position: "relative", display: "flex", alignItems: "center", gap: 4 }}>
          {links.map((l, i) => item(80 + i * 70,
            <a key={i} href={l.href} onMouseEnter={onLinkEnter} onFocus={onLinkEnter} onBlur={() => setBar((b) => ({ ...b, on: false }))}
              style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 13px", textDecoration: "none",
                fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14.5, fontWeight: 500,
                color: i === activeIndex ? textColor : mutedColor, transition: "color .3s", outline: "none" }}
              onMouseOver={(e) => { e.currentTarget.style.color = textColor; }}
              onMouseOut={(e) => { e.currentTarget.style.color = i === activeIndex ? textColor : mutedColor; }}>
              {i === activeIndex && <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: "50%", background: accentColor, boxShadow: `0 0 8px ${accentColor}` }} />}
              {l.label}
            </a>
          ))}
          <span aria-hidden="true" style={{ position: "absolute", bottom: 2, height: 2, borderRadius: 2, background: accentColor,
            left: bar.left, width: bar.width, opacity: bar.on ? 0.9 : 0, transformOrigin: "center",
            transition: reduced ? "opacity .2s" : `left 340ms ${PLX_NB_EASE}, width 340ms ${PLX_NB_EASE}, opacity .25s`, pointerEvents: "none" }} />
        </nav>
        {item(80 + links.length * 70, <div style={{ flex: "none", display: "flex" }}>
          <a ref={ctaRef} href={ctaHref}
            onMouseEnter={() => hoverOk && setCtaHover(true)} onMouseMove={onCtaMove} onMouseLeave={onCtaLeave}
            onMouseDown={() => setCtaDown(true)} onMouseUp={() => setCtaDown(false)}
            style={{ display: "inline-flex", alignItems: "center", padding: "11px 22px", borderRadius: 999, textDecoration: "none",
              fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14.5, fontWeight: 600, color: "#0a0d07",
              background: accentColor,
              boxShadow: ctaHover && !reduced ? `0 0 26px color-mix(in oklab, ${accentColor} 45%, transparent), 0 0 0 1px color-mix(in oklab, ${accentColor} 60%, transparent)` : "0 0 0 rgba(0,0,0,0)",
              transform: ctaDown ? "scale(0.97)" : "scale(1)",
              transition: `box-shadow .35s, transform 200ms ${PLX_NB_EASE}`, willChange: "transform" }}>{ctaLabel}</a>
        </div>)}
      </div>
    </div>
  );
}

if (typeof module !== "undefined") module.exports = { NavBarMotion };
// Next.js: replace the line above with:  export { NavBarMotion }; export default NavBarMotion;
