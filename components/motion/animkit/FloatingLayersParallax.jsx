"use client";

import React from "react";
/*
 * FloatingLayersParallax — decorative layered-depth background · PixelLayerr motion library
 * peer-deps: react >=18, react-dom >=18 · zero runtime deps · zero assets (fully procedural)
 * next.js:   const FloatingLayersParallax = dynamic(() => import("./FloatingLayersParallax"), { ssr: false });
 *            mount inside a position:relative parent — it fills it (absolute inset:0, pointer-events:none).
 * porting:   add `import React from "react";` at the top and replace the exports footer with
 *            `export default FloatingLayersParallax;`
 * a11y/perf: aria-hidden decorative · prefers-reduced-motion → static composition · rAF + transforms
 *            only · pauses offscreen (IntersectionObserver) · touch → autonomous drift, no cursor dep.
 */

function _mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function FloatingLayersParallax({
  accentColor = "#5B72F2",
  secondaryColor = "#22D3EE",
  backgroundColor = "#0A0B0E",
  layerCount = 9,
  depth = 460,
  driftSpeed = 1,
  parallaxStrength = 1,
  blurDepth = 5,
  reducedMotion,
  disabled = false,
  seed = 11,
  style,
  className,
}) {
  const rootRef = React.useRef(null);
  const layerRefs = React.useRef([]);
  const glowRef = React.useRef(null);
  const [sysReduced, setSysReduced] = React.useState(false);

  React.useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSysReduced(mq.matches);
    const on = (e) => setSysReduced(e.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, []);

  const isStatic = disabled || (reducedMotion != null ? reducedMotion : sysReduced);

  const layers = React.useMemo(() => {
    const rnd = _mulberry32(seed);
    const accentIdx = Math.floor(rnd() * layerCount);
    const arr = [];
    for (let i = 0; i < layerCount; i++) {
      const z = layerCount > 1 ? i / (layerCount - 1) : 0; // 0 near … 1 far
      const roll = rnd();
      const type = roll < 0.2 ? "grid" : roll < 0.55 ? "shard" : "panel";
      arr.push({
        z, type,
        tint: i === accentIdx,
        x: 8 + rnd() * 84, y: 12 + rnd() * 76,
        w: type === "shard" ? 100 + rnd() * 160 : type === "grid" ? 200 + rnd() * 200 : 140 + rnd() * 210,
        h: type === "shard" ? 2 + rnd() * 3 : type === "grid" ? 150 + rnd() * 140 : 90 + rnd() * 150,
        rot: (rnd() - 0.5) * (type === "shard" ? 24 : 9),
        phase: rnd() * Math.PI * 2,
        speed: 0.22 + rnd() * 0.45,
        ampX: 4 + rnd() * 8,
        ampY: 3 + rnd() * 7,
      });
    }
    return arr.sort((a, b) => b.z - a.z); // paint far → near
  }, [layerCount, seed]);

  React.useEffect(() => {
    if (isStatic || typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let raf = 0, visible = true;
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      const r = root.getBoundingClientRect();
      if (!r.width || !r.height) return;
      ptr.tx = Math.max(-1, Math.min(1, (((e.clientX - r.left) / r.width) - 0.5) * 2));
      ptr.ty = Math.max(-1, Math.min(1, (((e.clientY - r.top) / r.height) - 0.5) * 2));
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { rootMargin: "100px" });
    io.observe(root);
    const t0 = performance.now();
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = ((now - t0) / 1000) * driftSpeed;
      ptr.x += (ptr.tx - ptr.x) * 0.045;
      ptr.y += (ptr.ty - ptr.y) * 0.045;
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const scroll = Math.max(-1, Math.min(1, ((r.top + r.height / 2) - vh / 2) / vh));
      for (let i = 0; i < layers.length; i++) {
        const L = layers[i], el = layerRefs.current[i];
        if (!el) continue;
        const near = 1 - L.z;
        const dx = Math.sin(t * L.speed + L.phase) * L.ampX;
        const dy = Math.cos(t * L.speed * 0.8 + L.phase * 1.7) * L.ampY;
        const px = ptr.x * (5 + near * 22) * parallaxStrength;
        const py = ptr.y * (4 + near * 15) * parallaxStrength - scroll * (8 + near * 30) * parallaxStrength;
        el.style.transform = "translate3d(" + (dx + px).toFixed(2) + "px," + (dy + py).toFixed(2) + "px," + (-L.z * depth).toFixed(1) + "px) rotate(" + L.rot.toFixed(2) + "deg)";
      }
      if (glowRef.current) glowRef.current.style.opacity = (0.5 + Math.sin(t * 0.45) * 0.16).toFixed(3);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      if (fine) window.removeEventListener("pointermove", onMove);
    };
  }, [isStatic, layers, depth, driftSpeed, parallaxStrength]);

  const layerVisual = (L) => {
    if (L.type === "grid") return {
      background: "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
      backgroundSize: "26px 26px",
      WebkitMaskImage: "radial-gradient(closest-side, #000 25%, transparent)",
      maskImage: "radial-gradient(closest-side, #000 25%, transparent)",
    };
    if (L.type === "shard") return {
      borderRadius: 999,
      background: L.tint
        ? "linear-gradient(90deg, transparent, color-mix(in srgb, " + accentColor + " 50%, transparent), transparent)"
        : "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
    };
    return {
      borderRadius: 12,
      background: "linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.012) 60%)",
      border: "1px solid " + (L.tint
        ? "color-mix(in srgb, " + accentColor + " 32%, transparent)"
        : "rgba(255,255,255," + (0.1 - L.z * 0.05).toFixed(3) + ")"),
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
    };
  };

  return (
    <div ref={rootRef} aria-hidden="true" className={className}
      style={Object.assign({
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
        background: backgroundColor, perspective: 1000, perspectiveOrigin: "50% 42%",
        contain: "layout paint", zIndex: 0,
      }, style)}>
      {!disabled && (
        <React.Fragment>
          <div ref={glowRef} style={{
            position: "absolute", left: "50%", top: "58%", width: "56%", aspectRatio: "1",
            transform: "translate(-50%,-50%)", borderRadius: "50%", opacity: 0.55,
            background: "radial-gradient(closest-side, color-mix(in srgb, " + accentColor + " 15%, transparent), color-mix(in srgb, " + secondaryColor + " 5%, transparent) 48%, transparent 72%)",
            filter: "blur(36px)",
          }} />
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
            {layers.map((L, i) => (
              <div key={i} ref={(el) => { layerRefs.current[i] = el; }}
                style={Object.assign({
                  position: "absolute", left: L.x + "%", top: L.y + "%",
                  width: L.w, height: L.h, marginLeft: -L.w / 2, marginTop: -L.h / 2,
                  opacity: 0.85 - L.z * 0.5,
                  filter: L.z > 0.05 && blurDepth > 0 ? "blur(" + (L.z * blurDepth).toFixed(1) + "px)" : "none",
                  transform: "translate3d(0px,0px," + (-L.z * depth).toFixed(1) + "px) rotate(" + L.rot.toFixed(2) + "deg)",
                  willChange: "transform",
                }, layerVisual(L))} />
            ))}
          </div>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 55%, color-mix(in srgb, " + backgroundColor + " 65%, transparent))",
          }} />
        </React.Fragment>
      )}
    </div>
  );
}

export default FloatingLayersParallax;
