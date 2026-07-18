"use client";

import React from "react";
/*
 * TiltSpotlightCard — interactive 3D-tilt card wrapper · PixelLayerr motion library
 * peer-deps: react >=18, react-dom >=18 · zero runtime deps · self-contained styles
 * next.js:   import directly ("use client" component) — <TiltSpotlightCard>…children…</TiltSpotlightCard>.
 * porting:   add `import React from "react";` at the top and replace the exports footer with
 *            `export default TiltSpotlightCard;`
 * a11y/perf: rAF-lerped transforms (expo-decay settle, no bounce) · desktop-only tilt/spotlight,
 *            touch → static card with press state · prefers-reduced-motion → gentle static highlight.
 * tip: inner elements with data-depth="0.5–2" parallax-pop on hover (higher = lifts more).
 */

function TiltSpotlightCard({
  accentColor = "#5B72F2",
  maxTilt = 7,
  spotlightIntensity = 0.16,
  parallaxDepth = 14,
  radius = 16,
  borderGlow = true,
  reducedMotion,
  children,
  style,
  className,
}) {
  const cardRef = React.useRef(null);
  const spotRef = React.useRef(null);
  const borderRef = React.useRef(null);
  const contentRef = React.useRef(null);
  const depthEls = React.useRef([]);
  const anim = React.useRef({ rx: 0, ry: 0, trx: 0, tryy: 0, h: 0, th: 0, px: 50, py: 30, tpx: 50, tpy: 30, raf: 0 });
  const [fine, setFine] = React.useState(false);
  const [sysReduced, setSysReduced] = React.useState(false);

  React.useEffect(() => {
        setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSysReduced(mq.matches);
    const on = (e) => setSysReduced(e.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on);
      cancelAnimationFrame(anim.current.raf);
    };
  }, []);

  const isStatic = (reducedMotion != null ? reducedMotion : sysReduced) || !fine;

  const step = React.useCallback(() => {
    const a = anim.current, el = cardRef.current;
    if (!el) { a.raf = 0; return; }
    const k = 0.14;
    a.rx += (a.trx - a.rx) * k;
    a.ry += (a.tryy - a.ry) * k;
    a.h += (a.th - a.h) * k;
    a.px += (a.tpx - a.px) * k;
    a.py += (a.tpy - a.py) * k;
    el.style.transform = "rotateX(" + a.rx.toFixed(3) + "deg) rotateY(" + a.ry.toFixed(3) + "deg)";
    el.style.setProperty("--pl-x", a.px.toFixed(2) + "%");
    el.style.setProperty("--pl-y", a.py.toFixed(2) + "%");
    if (spotRef.current) spotRef.current.style.opacity = a.h.toFixed(3);
    if (borderRef.current) borderRef.current.style.opacity = (a.h * 0.9).toFixed(3);
    if (contentRef.current) contentRef.current.style.transform = "translateZ(" + (a.h * 6).toFixed(2) + "px)";
    for (let i = 0; i < depthEls.current.length; i++) {
      const d = depthEls.current[i];
      d.el.style.transform = "translateZ(" + (d.z * parallaxDepth * a.h).toFixed(2) + "px)";
    }
    const settled = a.th === 0 && a.h < 0.004 && Math.abs(a.rx) < 0.01 && Math.abs(a.ry) < 0.01;
    if (!settled) a.raf = requestAnimationFrame(step);
    else {
      a.raf = 0; a.h = 0; a.rx = 0; a.ry = 0;
      el.style.transform = "rotateX(0deg) rotateY(0deg)";
    }
  }, [parallaxDepth]);

  const ensureLoop = () => { if (!anim.current.raf) anim.current.raf = requestAnimationFrame(step); };

  const onEnter = () => {
    if (isStatic) return;
    anim.current.th = 1;
    depthEls.current = contentRef.current
      ? Array.prototype.map.call(contentRef.current.querySelectorAll("[data-depth]"), (el) => ({
          el, z: parseFloat(el.getAttribute("data-depth")) || 1,
        }))
      : [];
    ensureLoop();
  };
  const onMove = (e) => {
    if (isStatic || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    const a = anim.current;
    a.tryy = nx * maxTilt;
    a.trx = -ny * maxTilt;
    a.tpx = (nx / 2 + 0.5) * 100;
    a.tpy = (ny / 2 + 0.5) * 100;
    ensureLoop();
  };
  const onLeave = () => {
    const a = anim.current;
    a.th = 0; a.trx = 0; a.tryy = 0; a.tpx = 50; a.tpy = 30;
    ensureLoop();
  };
  const onDown = () => { if (!fine && cardRef.current) cardRef.current.style.transform = "scale(0.985)"; };
  const onUp = () => { if (!fine && cardRef.current) cardRef.current.style.transform = "scale(1)"; };

  const grad = (size, strength) =>
    "radial-gradient(" + size + "px circle at var(--pl-x,50%) var(--pl-y,0%), color-mix(in srgb, " +
    accentColor + " " + Math.round(strength * 100) + "%, transparent), transparent 70%)";

  return (
    <div className={className} style={Object.assign({ perspective: 900 }, style)}>
      <div ref={cardRef}
        onPointerEnter={onEnter} onPointerMove={onMove} onPointerLeave={onLeave}
        onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={onUp}
        style={{
          position: "relative", transformStyle: "preserve-3d", borderRadius: radius,
          background: "linear-gradient(160deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))",
          border: "1px solid rgba(255,255,255,0.07)",
          transform: "rotateX(0deg) rotateY(0deg)",
          transition: !fine ? "transform .25s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
          willChange: "transform",
        }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, borderRadius: radius, overflow: "hidden", pointerEvents: "none" }}>
          <div ref={spotRef} style={{ position: "absolute", inset: 0, opacity: isStatic ? 0.3 : 0, background: grad(300, spotlightIntensity) }} />
        </div>
        {borderGlow ? (
          <div ref={borderRef} aria-hidden="true" style={{
            position: "absolute", inset: 0, borderRadius: radius, padding: 1,
            opacity: isStatic ? 0.25 : 0, background: grad(260, 0.6),
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none",
          }} />
        ) : null}
        <div ref={contentRef} style={{ position: "relative", transformStyle: "preserve-3d" }}>{children}</div>
      </div>
    </div>
  );
}

export default TiltSpotlightCard;
