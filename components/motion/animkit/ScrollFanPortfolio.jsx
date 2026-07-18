"use client";

import React from "react";
/*
 * ScrollFanPortfolio — pinned scroll-driven case-study wheel · PixelLayerr motion library
 * The section pins while you scroll: project cards fan out of a stacked deck onto a wheel,
 * and continued scrolling turns the wheel — each card rotates up into focus (lift, glow,
 * accent border) while its title/tag/counter crossfade at the top. Placeholder cards ship
 * with it; pass `items` (or replace the thumb markup) with real case studies later.
 * peer-deps: react >=18 · zero runtime deps · designed for dark surfaces
 * next.js:   const ScrollFanPortfolio = dynamic(() => import("./ScrollFanPortfolio"), { ssr:false });
 *            drop into normal page flow — it creates its own tall scroll region + sticky stage.
 * porting:   add `import React from "react";` and replace the exports footer with `export default ScrollFanPortfolio;`
 * a11y/perf: rAF-throttled scroll math, transforms only · prefers-reduced-motion → static fanned
 *            composition · works with touch scrolling (no cursor dependency).
 */

const _PF_ITEMS = [
  { title: "Nova Bank", tag: "FINTECH · WEB APP" },
  { title: "Atlas", tag: "B2B SAAS PLATFORM" },
  { title: "Mono Studio", tag: "PORTFOLIO · 3D" },
  { title: "Pulse Health", tag: "HEALTH · MOBILE WEB" },
  { title: "Forge", tag: "DEV TOOLS · DOCS" },
  { title: "Orbit", tag: "E-COMMERCE" },
];

function ScrollFanPortfolio({
  items,
  accentColor = "#5B72F2",
  secondaryColor = "#22D3EE",
  cardWidth = 300,
  cardHeight = 380,
  stepAngle = 15,
  vhPerCard = 70,
  reducedMotion,
  style,
  className,
}) {
  const data = items && items.length ? items : _PF_ITEMS;
  const n = data.length;
  const wrapRef = React.useRef(null);
  const cardEls = React.useRef([]);
  const headRef = React.useRef(null);
  const titleRef = React.useRef(null);
  const tagRef = React.useRef(null);
  const counterRef = React.useRef(null);
  const hintRef = React.useRef(null);
  const progRef = React.useRef(null);
  const [sysReduced, setSysReduced] = React.useState(false);

  React.useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSysReduced(mq.matches);
    const on = (e) => setSysReduced(e.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, []);
  const isStatic = reducedMotion != null ? reducedMotion : sysReduced;

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  const layout = React.useCallback((p) => {
    // adapt wheel geometry to viewport: focused card center sits ~60% down the stage,
    // pivot 0.34*vh below the stage bottom, cards scaled down on short viewports
    const vh = (typeof window !== "undefined" && window.innerHeight) || 800;
    const pivotOff = Math.round(vh * 0.34);
    const rad = Math.max(vh + pivotOff - vh * 0.6, 320);
    const fit = clamp(((vh + pivotOff - rad) - 40) / (cardHeight / 2 + 40), 0.45, 1) * clamp((vh * 0.72) / cardHeight, 0.45, 1);
    const cScale = Math.min(1, Math.max(0.55, fit));
    const fan = 1 - Math.pow(1 - clamp(p / 0.16, 0, 1), 3);
    const wp = clamp((p - 0.16) / 0.8, 0, 1) * (n - 1);
    for (let i = 0; i < n; i++) {
      const el = cardEls.current[i];
      if (!el) continue;
      el.style.top = "calc(100% + " + pivotOff + "px)";
      const d = i - wp;
      const ang = fan * d * stepAngle + (1 - fan) * ((i - (n - 1) / 2) * 2);
      const focus = clamp(1 - Math.abs(d), 0, 1) * fan;
      el.style.transform = "rotate(" + ang.toFixed(2) + "deg) translateY(" + (-(rad + focus * 24 * cScale)).toFixed(1) + "px) scale(" + (cScale * (0.94 + 0.1 * focus)).toFixed(3) + ")";
      el.style.zIndex = String(200 - Math.round(Math.abs(d) * 10));
      el.style.filter = "brightness(" + (0.7 + 0.4 * focus).toFixed(3) + ")";
      el.style.borderColor = "color-mix(in srgb, " + accentColor + " " + Math.round(focus * 70) + "%, rgba(255,255,255,0.1))";
      el.style.boxShadow = focus > 0.4
        ? "0 30px 80px -30px rgba(0,0,0,0.8), 0 0 " + Math.round(focus * 44) + "px -12px color-mix(in srgb, " + accentColor + " 50%, transparent)"
        : "0 30px 80px -30px rgba(0,0,0,0.8)";
    }
    const idx = clamp(Math.round(wp), 0, n - 1);
    if (titleRef.current) titleRef.current.textContent = data[idx].title;
    if (tagRef.current) tagRef.current.textContent = data[idx].tag;
    if (counterRef.current) counterRef.current.textContent = "0" + (idx + 1) + " / 0" + n;
    if (headRef.current) headRef.current.style.opacity =
      (fan * (1 - clamp((Math.abs(wp - idx) - 0.12) * 2.6, 0, 0.75))).toFixed(3);
    if (hintRef.current) hintRef.current.style.opacity = (1 - clamp(p * 6, 0, 1)).toFixed(3);
    if (progRef.current) progRef.current.style.width = (p * 100).toFixed(2) + "%";
  }, [n, data, stepAngle, cardHeight, accentColor]);

  React.useEffect(() => {
        if (isStatic) { layout(0.62); return; }
    let ticking = false;
    const update = () => {
      ticking = false;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const vh = window.innerHeight || 1;
      const r = wrap.getBoundingClientRect();
      const total = Math.max(r.height - vh, 1);
      layout(clamp(-r.top / total, 0, 1));
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [isStatic, layout]);

  const mono = "var(--font-mono-face), ui-monospace, Menlo, monospace";
  return (
    <section ref={wrapRef} className={className} aria-label="Selected work"
      style={Object.assign({ position: "relative", height: (n * vhPerCard + 100) + "vh" }, style)}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: "50%", bottom: "-30%", width: "80%", aspectRatio: "1.4",
          transform: "translateX(-50%)", borderRadius: "50%", filter: "blur(50px)", opacity: 0.5,
          background: "radial-gradient(closest-side, color-mix(in srgb, " + accentColor + " 14%, transparent), transparent 70%)",
        }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 24, textAlign: "center", fontFamily: mono, fontSize: 11, letterSpacing: "0.24em", color: "#9BA1AD", zIndex: 300 }}>SELECTED WORK</div>
        <div ref={headRef} style={{ position: "absolute", left: 0, right: 0, top: 52, display: "grid", gap: 8, justifyItems: "center", opacity: 0, pointerEvents: "none", zIndex: 300, textShadow: "0 2px 24px rgba(10,11,14,0.9)" }}>
          <div ref={titleRef} style={{ fontSize: "clamp(26px, 5vh, 46px)", fontWeight: 600, letterSpacing: "-0.025em", color: "#E7E9EE" }}>&#160;</div>
          <div style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
            <span ref={tagRef} style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", color: accentColor }}>&#160;</span>
            <span ref={counterRef} style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", color: "#565B66" }}>&#160;</span>
          </div>
        </div>
        {data.map((it, i) => (
          <article key={i} ref={(el) => { cardEls.current[i] = el; }} style={{
            position: "absolute", left: "50%", top: "calc(100% + 260px)",
            width: cardWidth, height: cardHeight, marginLeft: -cardWidth / 2, marginTop: -cardHeight / 2,
            transformOrigin: "50% 50%",
            borderRadius: 18, border: "1px solid rgba(255,255,255,0.1)", boxSizing: "border-box",
            background: "linear-gradient(170deg, #12141B, #0C0E13)", overflow: "hidden",
            willChange: "transform, filter",
            transform: "rotate(0deg) translateY(-650px)",
          }}>
            <div style={{
              height: "60%", position: "relative",
              background: "linear-gradient(140deg, color-mix(in srgb, color-mix(in oklch, " + accentColor + " " + (100 - Math.round((i / Math.max(n - 1, 1)) * 55)) + "%, " + secondaryColor + ") 40%, #0B0C10), #0B0C10 80%)",
            }}>
              <div style={{ display: "flex", gap: 5, padding: "12px 14px" }}>
                <div style={{ width: 7, height: 7, borderRadius: 99, background: "rgba(255,255,255,0.3)" }} />
                <div style={{ width: 7, height: 7, borderRadius: 99, background: "rgba(255,255,255,0.18)" }} />
                <div style={{ width: 7, height: 7, borderRadius: 99, background: "rgba(255,255,255,0.1)" }} />
              </div>
              {it.image ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={it.image} alt="" style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                  objectFit: "cover", objectPosition: "top",
                }} />
              ) : (
                <div style={{
                  position: "absolute", inset: 0, display: "grid", placeItems: "center",
                  fontFamily: mono, fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)",
                }}>WEBSITE PREVIEW</div>
              )}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "22px 22px", opacity: 0.35,
                WebkitMaskImage: "radial-gradient(closest-side, #000 30%, transparent)",
                maskImage: "radial-gradient(closest-side, #000 30%, transparent)",
              }} />
            </div>
            <div style={{ padding: "18px 20px", display: "grid", gap: 9 }}>
              <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.18em", color: accentColor }}>{it.tag}</div>
              <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", color: "#E7E9EE" }}>{it.title}</div>
              <div style={{ fontFamily: mono, fontSize: 10.5, letterSpacing: "0.14em", color: "#7A808C", marginTop: 6 }}>{it.href ? "VIEW LIVE ↗" : "VIEW CASE →"}</div>
            </div>
            {it.href && (
              <a href={it.href} target="_blank" rel="noopener noreferrer"
                aria-label={"Visit live site: " + it.title + " (opens in new tab)"}
                style={{ position: "absolute", inset: 0, zIndex: 5 }} />
            )}
          </article>
        ))}
        <div ref={hintRef} style={{
          position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center",
          fontFamily: mono, fontSize: 10, letterSpacing: "0.24em", color: "#565B66",
        }}>SCROLL ↓</div>
        <div style={{ position: "absolute", left: "20%", right: "20%", bottom: 14, height: 2, borderRadius: 99, background: "rgba(255,255,255,0.07)" }}>
          <div ref={progRef} style={{ height: "100%", width: "0%", borderRadius: 99, background: "linear-gradient(90deg, " + accentColor + ", " + secondaryColor + ")" }} />
        </div>
      </div>
    </section>
  );
}

export default ScrollFanPortfolio;
