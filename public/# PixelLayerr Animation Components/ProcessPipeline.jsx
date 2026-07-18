"use client";
/*
 * ProcessPipeline — scroll-driven delivery timeline · PixelLayerr motion library
 * A center line draws itself as you scroll; each stage node lights up as the line reaches it
 * and its card springs in from alternating sides with a live micro-visual: radar sweep
 * (discover), wireframe bars drawing in (design), code lines assembling (build), QA checks
 * ticking (polish), ship bar filling to LIVE (deliver). Ends with a delivery chip.
 * peer-deps: react >=18 · zero runtime deps · designed for dark surfaces
 * next.js:   const ProcessPipeline = dynamic(() => import("./ProcessPipeline"), { ssr:false });
 *            normal page flow — animates against window scroll.
 * porting:   add `import React from "react";` and replace the exports footer with `export default ProcessPipeline;`
 * a11y/perf: real text content (readable without JS/motion) · rAF-throttled scroll · transforms +
 *            opacity only · prefers-reduced-motion → everything shown static, line full.
 */

function ProcessPipeline({
  accentColor = "#5B72F2",
  secondaryColor = "#22D3EE",
  liveColor = "#C6FF5A",
  deliveryNote = "AVG. DELIVERY · 4–6 WEEKS",
  reducedMotion,
  style,
  className,
}) {
  const rootRef = React.useRef(null);
  const fillRef = React.useRef(null);
  const headDotRef = React.useRef(null);
  const endRef = React.useRef(null);
  const cardEls = React.useRef([]);
  const nodeEls = React.useRef([]);
  const vis = React.useRef({});
  const flags = React.useRef([]);
  const [sysReduced, setSysReduced] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSysReduced(mq.matches);
    const on = (e) => setSysReduced(e.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, []);
  const isStatic = reducedMotion != null ? reducedMotion : sysReduced;

  const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
  const mono = "'JetBrains Mono', ui-monospace, Menlo, monospace";
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  // registers an element with its active/idle style states; step index encoded in the id ("2:code1")
  const reg = (id, on, off) => (el) => { if (el) vis.current[id] = { el, on, off }; };

  const setStep = React.useCallback((i, act) => {
    const card = cardEls.current[i], node = nodeEls.current[i];
    if (card) {
      card.style.opacity = act ? "1" : "0";
      card.style.transform = act ? "translateX(0px) scale(1)" : "translateX(" + (i % 2 === 0 ? -44 : 44) + "px) scale(0.97)";
    }
    if (node) {
      node.style.background = act ? accentColor : "rgba(10,11,14,1)";
      node.style.borderColor = act ? accentColor : "rgba(255,255,255,0.25)";
      node.style.boxShadow = act ? "0 0 18px 2px color-mix(in srgb, " + accentColor + " 55%, transparent)" : "none";
    }
    for (const id in vis.current) {
      if (id.indexOf(i + ":") !== 0) continue;
      const v = vis.current[id];
      Object.assign(v.el.style, act ? v.on : v.off);
    }
  }, [accentColor]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStatic) {
      for (let i = 0; i < 5; i++) setStep(i, true);
      if (fillRef.current) fillRef.current.style.height = "100%";
      if (headDotRef.current) headDotRef.current.style.opacity = "0";
      if (endRef.current) { endRef.current.style.opacity = "1"; endRef.current.style.borderColor = "color-mix(in srgb, " + accentColor + " 55%, transparent)"; }
      return;
    }
    let ticking = false;
    const update = () => {
      ticking = false;
      const root = rootRef.current;
      if (!root) return;
      const vh = window.innerHeight || 1;
      const r = root.getBoundingClientRect();
      const focus = vh * 0.72;
      const fp = clamp((focus - r.top) / Math.max(r.height, 1), 0, 1);
      if (fillRef.current) fillRef.current.style.height = (fp * 100).toFixed(2) + "%";
      if (headDotRef.current) {
        headDotRef.current.style.top = (fp * 100).toFixed(2) + "%";
        headDotRef.current.style.opacity = fp > 0.005 && fp < 0.995 ? "1" : "0";
      }
      nodeEls.current.forEach((nel, i) => {
        if (!nel) return;
        const nr = nel.getBoundingClientRect();
        const act = nr.top + nr.height / 2 < focus;
        if (act !== flags.current[i]) { flags.current[i] = act; setStep(i, act); }
      });
      if (endRef.current) {
        const done = fp > 0.96;
        endRef.current.style.opacity = done ? "1" : "0.35";
        endRef.current.style.borderColor = done ? "color-mix(in srgb, " + accentColor + " 55%, transparent)" : "rgba(255,255,255,0.1)";
        endRef.current.style.boxShadow = done ? "0 0 26px -6px color-mix(in srgb, " + accentColor + " 45%, transparent)" : "none";
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, [isStatic, setStep, accentColor]);

  const bar = (k, w, d, c) => (
    <div key={k} style={{ height: 7, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
      <div ref={reg(k, { width: w }, { width: "0%" })} style={{
        height: "100%", width: "0%", borderRadius: 99,
        background: c || "rgba(255,255,255,0.28)",
        transition: "width .7s " + EASE + " " + d + "s",
      }} />
    </div>
  );
  const codeLine = (k, segs, d) => (
    <div key={k} ref={reg(k, { opacity: "1", transform: "translateX(0px)" }, { opacity: "0", transform: "translateX(-8px)" })}
      style={{ display: "flex", gap: 6, opacity: 0, transform: "translateX(-8px)", transition: "opacity .45s ease " + d + "s, transform .45s " + EASE + " " + d + "s" }}>
      {segs.map((s, j) => (
        <div key={j} style={{ width: s[0], height: 6, borderRadius: 99, background: s[1], marginLeft: j === 0 ? s[2] || 0 : 0 }} />
      ))}
    </div>
  );
  const check = (k, w, d) => (
    <div key={k} style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div ref={reg(k, { background: accentColor, borderColor: accentColor }, { background: "transparent", borderColor: "rgba(255,255,255,0.2)" })}
        style={{
          width: 14, height: 14, borderRadius: 99, border: "1.5px solid rgba(255,255,255,0.2)",
          boxSizing: "border-box", transition: "all .4s ease " + d + "s", display: "grid", placeItems: "center",
        }}>
        <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4l2 2 3-4" stroke="#0A0B0E" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div style={{ width: w, height: 6, borderRadius: 99, background: "rgba(255,255,255,0.14)" }} />
    </div>
  );

  const dim = (c, pct) => "color-mix(in srgb, " + c + " " + pct + "%, transparent)";
  const STEPS = [
    {
      title: "Discover", desc: "Deep-dive into your product, market and users before a single pixel.",
      visual: (
        <div style={{ position: "relative", width: 64, height: 64 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)" }} />
          <div style={{ position: "absolute", inset: 12, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.09)" }} />
          <div style={{ position: "absolute", inset: 24, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.07)" }} />
          <div ref={reg("0:sweep", { animationPlayState: "running", opacity: "1" }, { animationPlayState: "paused", opacity: "0.25" })}
            style={{
              position: "absolute", inset: 0, borderRadius: "50%", opacity: 0.25,
              background: "conic-gradient(from 0deg, transparent 0 72%, " + dim(accentColor, 40) + ")",
              animation: "plppSpin 3s linear infinite", animationPlayState: "paused",
            }} />
          <div style={{ position: "absolute", left: "50%", top: "50%", width: 5, height: 5, margin: -2.5, borderRadius: 99, background: accentColor }} />
          <div style={{ position: "absolute", left: "72%", top: "24%", width: 4, height: 4, borderRadius: 99, background: secondaryColor }} />
        </div>
      ),
    },
    {
      title: "Design", desc: "Interface systems designed in layers — structure first, then surface.",
      visual: <div style={{ display: "grid", gap: 7, width: 190 }}>{[bar("1:a", "82%", 0.1, dim(accentColor, 80)), bar("1:b", "58%", 0.25), bar("1:c", "70%", 0.4), bar("1:d", "38%", 0.55)]}</div>,
    },
    {
      title: "Build", desc: "Engineered on modern stacks. Sixty frames per second, no exceptions.",
      visual: (
        <div style={{ display: "grid", gap: 7, width: 190 }}>
          {codeLine("2:a", [[34, dim(secondaryColor, 60)], [70, "rgba(255,255,255,0.18)"]], 0.1)}
          {codeLine("2:b", [[52, "rgba(255,255,255,0.18)", 16], [40, dim(accentColor, 70)]], 0.28)}
          {codeLine("2:c", [[28, dim(accentColor, 70), 16], [64, "rgba(255,255,255,0.14)"]], 0.46)}
          {codeLine("2:d", [[40, "rgba(255,255,255,0.18)"]], 0.64)}
        </div>
      ),
    },
    {
      title: "Polish", desc: "Motion, accessibility, QA and performance passes until it feels right.",
      visual: <div style={{ display: "grid", gap: 9 }}>{[check("3:a", 110, 0.1), check("3:b", 86, 0.3), check("3:c", 128, 0.5)]}</div>,
    },
    {
      title: "Ship", desc: "Deployed, handed over, supported. Your team owns everything.",
      visual: (
        <div style={{ display: "grid", gap: 10, width: 200 }}>
          <div style={{ height: 8, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div ref={reg("4:fill", { width: "100%" }, { width: "0%" })} style={{
              height: "100%", width: "0%", borderRadius: 99,
              background: "linear-gradient(90deg, " + accentColor + ", " + secondaryColor + ")",
              transition: "width .9s " + EASE + " .1s",
            }} />
          </div>
          <div ref={reg("4:live", { opacity: "1", boxShadow: "0 0 16px -2px " + dim(liveColor, 50) }, { opacity: "0.3", boxShadow: "none" })}
            style={{
              justifySelf: "start", fontFamily: mono, fontSize: 10, letterSpacing: "0.18em",
              color: liveColor, border: "1px solid " + dim(liveColor, 40), borderRadius: 99,
              padding: "4px 10px", opacity: 0.3, transition: "opacity .5s ease .8s, box-shadow .5s ease .8s",
              display: "flex", alignItems: "center", gap: 6,
            }}>
            <span style={{ width: 5, height: 5, borderRadius: 99, background: liveColor, display: "inline-block" }} />LIVE
          </div>
        </div>
      ),
    },
  ];

  return (
    <div ref={rootRef} className={className} style={Object.assign({ position: "relative", maxWidth: 880, margin: "0 auto" }, style)}>
      <style>{"@keyframes plppSpin{to{transform:rotate(360deg)}}"}</style>
      <div aria-hidden="true" style={{ position: "absolute", left: "50%", top: 0, bottom: 88, width: 2, marginLeft: -1, background: "rgba(255,255,255,0.07)", borderRadius: 99 }}>
        <div ref={fillRef} style={{ width: "100%", height: "0%", borderRadius: 99, background: "linear-gradient(180deg, " + accentColor + ", " + secondaryColor + ")" }} />
        <div ref={headDotRef} style={{
          position: "absolute", left: "50%", top: "0%", width: 10, height: 10, margin: "-5px 0 0 -5px",
          borderRadius: 99, background: secondaryColor, opacity: 0,
          boxShadow: "0 0 16px 3px " + dim(secondaryColor, 55), transition: "opacity .3s",
        }} />
      </div>
      <div style={{ display: "grid", gap: 26, paddingBottom: 34 }}>
        {STEPS.map((st, i) => {
          const left = i % 2 === 0;
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 88px 1fr", alignItems: "center", minHeight: 170 }}>
              <div style={{ gridColumn: left ? "1" : "3", gridRow: 1, display: "grid", justifyItems: left ? "end" : "start" }}>
                <div ref={(el) => { cardEls.current[i] = el; }} style={{
                  width: "min(360px, 100%)", boxSizing: "border-box", padding: "22px 24px",
                  borderRadius: 16, border: "1px solid rgba(255,255,255,0.09)",
                  background: "linear-gradient(160deg, rgba(255,255,255,0.045), rgba(255,255,255,0.014))",
                  display: "grid", gap: 12,
                  opacity: isStatic ? 1 : 0,
                  transform: isStatic ? "none" : "translateX(" + (left ? -44 : 44) + "px) scale(0.97)",
                  transition: "transform .8s " + EASE + ", opacity .6s ease",
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.14em", color: accentColor }}>{"0" + (i + 1)}</span>
                    <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em", color: "#E7E9EE" }}>{st.title}</span>
                  </div>
                  <div style={{ color: "#9BA1AD", fontSize: 13.5, lineHeight: 1.55, textWrap: "pretty" }}>{st.desc}</div>
                  <div style={{ marginTop: 4 }}>{st.visual}</div>
                </div>
              </div>
              <div style={{ gridColumn: "2", gridRow: 1, display: "grid", placeItems: "center" }}>
                <div ref={(el) => { nodeEls.current[i] = el; }} style={{
                  width: 15, height: 15, borderRadius: 99, boxSizing: "border-box",
                  border: "2px solid rgba(255,255,255,0.25)", background: "rgba(10,11,14,1)",
                  transition: "all .5s ease", position: "relative", zIndex: 2,
                }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "grid", justifyItems: "center" }}>
        <div ref={endRef} style={{
          fontFamily: mono, fontSize: 11, letterSpacing: "0.2em", color: "#DDE0E6",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, padding: "11px 22px",
          background: "rgba(255,255,255,0.02)", opacity: 0.35,
          transition: "opacity .6s ease, border-color .6s ease, box-shadow .6s ease",
        }}>{deliveryNote}</div>
      </div>
    </div>
  );
}

if (typeof module !== "undefined" && module.exports) module.exports = { ProcessPipeline, default: ProcessPipeline };
if (typeof window !== "undefined") window.ProcessPipeline = ProcessPipeline;
