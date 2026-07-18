"use client";

import React from "react";
/*
 * ExplodedInterfaceHero v2 — narrative flagship hero · PixelLayerr motion library
 * Tells the build story on an endless loop, in 3D:
 *   ASSEMBLE  layers fly in as blueprint wireframes and paint into glass (once, on mount)
 *   LIVE      the exploded site floats; a scripted cursor walks the UI — clicks the CTA
 *             (ripple + press), inspects the media card (it lifts), a stat counts up
 *   SHIP      every layer springs flat into the browser frame — one finished site — glow flash
 *   EXPLODE   an impulse blows the stack back apart into the floating state
 * Real cursor: tilts the whole assembly, per-depth parallax, light-sweep across the glass,
 * and a comet trail. All motion is velocity-based spring physics (real overshoot, no easing curves).
 * peer-deps: react >=18 · zero runtime deps · zero assets (fully procedural)
 * next.js:   const ExplodedInterfaceHero = dynamic(() => import("./ExplodedInterfaceHero"), { ssr:false });
 *            mount inside a position:relative hero — fills it (absolute inset:0, pointer-events:none).
 * porting:   add `import React from "react";` and replace the exports footer with `export default ExplodedInterfaceHero;`
 * a11y/perf: aria-hidden decorative · prefers-reduced-motion → static composition · rAF + transforms
 *            only · pauses offscreen · touch → the narrative runs autonomously, no cursor needed.
 */

function _rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const _SIZES = { frame: [500, 320], hero: [340, 216], media: [172, 128], stat: [196, 66], spec: [198, 92], cursor: [44, 44] };
const _FLOAT = { frame: [280, 188, -150, 0], hero: [258, 184, -40, 0], media: [431, 108, 46, -10], stat: [118, 304, 104, 9], spec: [442, 304, 136, -9], cursor: [339, 240, 178, 0] };
const _DOCK = { frame: [280, 200, 0, 0], hero: [280, 208, 8, 0], media: [442, 132, 16, 0], stat: [146, 296, 16, 0], spec: [426, 296, 16, 0], cursor: [325, 248, 26, 0] };
const _BOB = { frame: [3, 0.30], hero: [4, 0.38], media: [6, 0.46], stat: [7, 0.52], spec: [7, 0.44], cursor: [0, 0] };
const _KEYS = ["frame", "hero", "media", "stat", "spec", "cursor"];

function ExplodedInterfaceHero({
  accentColor = "#5B72F2",
  secondaryColor = "#22D3EE",
  tertiaryColor = "#B45CFF",
  signalColor = "#C6FF5A",
  backgroundColor = "#0A0B0E",
  explodeDepth = 1,
  driftSpeed = 1,
  tiltStrength = 1,
  reducedMotion,
  style,
  className,
}) {
  const rootRef = React.useRef(null);
  const sceneRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const beamRef = React.useRef(null);
  const glowRef = React.useRef(null);
  const sweepRef = React.useRef(null);
  const btnRef = React.useRef(null);
  const rippleRef = React.useRef(null);
  const statNumRef = React.useRef(null);
  const els = React.useRef({});
  const setEl = (k) => (el) => { els.current[k] = el; };
  const [sysReduced, setSysReduced] = React.useState(false);

  React.useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSysReduced(mq.matches);
    const on = (e) => setSysReduced(e.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, []);
  const isStatic = reducedMotion != null ? reducedMotion : sysReduced;

  const particles = React.useMemo(() => {
    const r = _rng(7), arr = [];
    for (let i = 0; i < 18; i++) arr.push({
      x: 4 + r() * 92, y: 6 + r() * 88, z: -170 + r() * 340,
      s: 1.5 + r() * 2.5, a: 0.12 + r() * 0.3, tint: r() < 0.3,
      amp: 6 + r() * 12, sp: 0.15 + r() * 0.3, ph: r() * 6.28,
    });
    return arr;
  }, []);

  React.useEffect(() => {
    if (isStatic || typeof window === "undefined") return;
    const root = rootRef.current;
    if (!root) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let raf = 0, visible = true;
    const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const pxy = { x: -100, y: -100 };
    const trail = [];
    for (let i = 0; i < 6; i++) trail.push({ x: -100, y: -100 });
    const onMove = (e) => {
      const r = root.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pxy.x = e.clientX - r.left; pxy.y = e.clientY - r.top;
      ptr.tx = Math.max(-1, Math.min(1, ((pxy.x / r.width) - 0.5) * 2));
      ptr.ty = Math.max(-1, Math.min(1, ((pxy.y / r.height) - 0.5) * 2));
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    const io = new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { rootMargin: "80px" });
    io.observe(root);

    // constellation network canvas (fills the empty space, repelled + linked by the cursor)
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d") : null;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cw = 0, ch = 0;
    const sizeCanvas = () => {
      const r = root.getBoundingClientRect();
      cw = r.width; ch = r.height;
      if (canvas) { canvas.width = cw * dpr; canvas.height = ch * dpr; }
    };
    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);
    const rn = _rng(99);
    const nodes = [];
    for (let i = 0; i < 46; i++) nodes.push({
      bx: rn(), by: rn(), ph: rn() * 6.28, sp: 0.1 + rn() * 0.25,
      ax: 10 + rn() * 26, ay: 8 + rn() * 20,
      tint: rn() < 0.12 ? 1 : (rn() < 0.28 ? 2 : 0),
    });

    // spring state: scattered blueprint start
    const rr = _rng(23);
    const S = {};
    _KEYS.forEach((k) => {
      const F = _FLOAT[k];
      S[k] = {
        x: F[0] + (rr() - 0.5) * 480, y: F[1] + (rr() - 0.5) * 340, z: F[2] - 320 - rr() * 240, r: (rr() - 0.5) * 50,
        vx: 0, vy: 0, vz: 0, vr: 0,
      };
    });
    const flags = { loop: -1, clicked: false, lifted: false, boomed: false, count: -1 };
    const LOOP = 11;
    const t0 = performance.now();

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const T = ((now - t0) / 1000) * driftSpeed;
      ptr.x += (ptr.tx - ptr.x) * 0.05;
      ptr.y += (ptr.ty - ptr.y) * 0.05;
      const assembling = T < 2.4;
      const lt = assembling ? -1 : (T - 2.4) % LOOP;         // loop time
      const loopIdx = assembling ? -1 : Math.floor((T - 2.4) / LOOP);
      if (loopIdx !== flags.loop) { flags.loop = loopIdx; flags.clicked = false; flags.lifted = false; flags.boomed = false; }
      const docked = lt >= 6 && lt < 8.6;
      const dockMix = docked ? clamp((lt - 6) / 0.5) : 0;

      // scene tilt (locks tighter while docked)
      const tiltS = tiltStrength * (docked ? 0.35 : 1);
      if (sceneRef.current) sceneRef.current.style.transform =
        "rotateX(" + (-ptr.y * 7 * tiltS + Math.cos(T * 0.13) * 2.5 + 8).toFixed(2) + "deg) rotateY(" + (ptr.x * 11 * tiltS + Math.sin(T * 0.16) * 5).toFixed(2) + "deg)";

      const breathe = explodeDepth * (1 + Math.sin(T * 0.42) * 0.12);
      // explode impulse
      if (lt >= 8.6 && !flags.boomed) {
        flags.boomed = true;
        _KEYS.forEach((k) => {
          const F = _FLOAT[k], D = _DOCK[k], s = S[k];
          s.vx += (F[0] - D[0]) * 0.10; s.vy += (F[1] - D[1]) * 0.10; s.vz += (F[2] * explodeDepth - D[2]) * 0.09; s.vr += (F[3] - D[3]) * 0.10;
        });
      }

      _KEYS.forEach((k, i) => {
        const s = S[k], F = _FLOAT[k], D = _DOCK[k], B = _BOB[k];
        const near = (F[2] + 170) / 340;
        let tx, ty, tz, tr;
        if (docked) {
          const wob = Math.sin(T * 0.7) * 1.5;
          tx = D[0]; ty = D[1] + wob; tz = D[2]; tr = D[3];
        } else {
          tx = F[0] + Math.sin(T * B[1] + F[2]) * B[0] + ptr.x * near * 16 * tiltStrength;
          ty = F[1] + Math.cos(T * B[1] * 0.85 + F[2] * 1.3) * B[0] * 0.8 + ptr.y * near * 11 * tiltStrength;
          tz = F[2] * breathe; tr = F[3];
        }
        // scripted demo cursor overrides its own target during LIVE
        if (k === "cursor" && !assembling && !docked && lt < 6) {
          if (lt < 0.4) { tx = 420; ty = 320; }
          else if (lt < 2.2) { tx = 178; ty = 260; }
          else if (lt < 3.4) { tx = 431; ty = 100; }
          else if (lt < 4.8) { tx = 431; ty = 100; }
          else { tx = 420; ty = 320; }
          tz = 178;
        }
        if (k === "media" && lt >= 3.4 && lt < 4.8) { tz += 54; ty -= 10; }
        const K = assembling ? 0.028 : 0.055, DAMP = assembling ? 0.92 : 0.84;
        s.vx += (tx - s.x) * K; s.vy += (ty - s.y) * K; s.vz += (tz - s.z) * K; s.vr += (tr - s.r) * K;
        s.vx *= DAMP; s.vy *= DAMP; s.vz *= DAMP; s.vr *= DAMP;
        s.x += s.vx; s.y += s.vy; s.z += s.vz; s.r += s.vr;
        const el = els.current[k];
        if (el) {
          const sz = _SIZES[k];
          el.style.transform = "translate3d(" + (s.x - sz[0] / 2).toFixed(2) + "px," + (s.y - sz[1] / 2).toFixed(2) + "px," + s.z.toFixed(1) + "px) rotateY(" + s.r.toFixed(2) + "deg)";
          el.style.opacity = clamp((T - i * 0.16) / 0.5).toFixed(3);
        }
        const wire = els.current["w" + k], body = els.current["b" + k];
        if (wire && body) {
          const bo = clamp((T - 1.3 - i * 0.14) / 0.8);
          wire.style.opacity = (clamp(T / 0.5) * (1 - bo)).toFixed(3);
          body.style.opacity = bo.toFixed(3);
        }
      });

      // scripted click on the CTA
      if (!assembling && lt >= 2.0 && lt < 6 && !flags.clicked) {
        flags.clicked = true;
        if (btnRef.current) {
          btnRef.current.style.transform = "scale(0.88)";
          setTimeout(() => { if (btnRef.current) btnRef.current.style.transform = "scale(1)"; }, 200);
        }
        if (rippleRef.current) {
          rippleRef.current.style.animation = "none";
          void rippleRef.current.offsetWidth;
          rippleRef.current.style.animation = "plheroRipple 0.9s cubic-bezier(0.16,1,0.3,1) 1";
        }
      }
      // stat counter
      if (!assembling && lt < 6) {
        const n = Math.round(64 * clamp(lt / 1.4));
        if (n !== flags.count && statNumRef.current) { flags.count = n; statNumRef.current.textContent = "+" + n + "%"; }
      }
      // particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i], el = els.current["p" + i];
        if (!el) continue;
        const near = (p.z + 170) / 340;
        el.style.transform = "translate3d(" +
          (Math.sin(T * p.sp + p.ph) * p.amp + ptr.x * near * 20).toFixed(2) + "px," +
          (Math.cos(T * p.sp * 0.7 + p.ph) * p.amp + ptr.y * near * 14).toFixed(2) + "px," + (p.z * breathe * (1 - dockMix * 0.9)).toFixed(1) + "px)";
        el.style.opacity = (p.a * (1 - dockMix * 0.8)).toFixed(3);
      }
      // beam: forced sweep on dock, ambient otherwise
      const cyc = docked ? clamp((lt - 6.2) / 1.1) * 1.0 : (T * 0.22) % 2.2;
      if (beamRef.current) {
        beamRef.current.style.top = (Math.min(cyc, 1) * 100).toFixed(2) + "%";
        beamRef.current.style.opacity = cyc < 1 ? (Math.sin(cyc * Math.PI) * (docked ? 0.95 : 0.6)).toFixed(3) : "0";
      }
      // glow + ship flash
      const flash = lt >= 7.0 ? Math.exp(-(lt - 7.0) * 2.4) : 0;
      if (glowRef.current) glowRef.current.style.opacity = (0.5 + Math.sin(T * 0.5) * 0.12 + flash * 0.45).toFixed(3);
      const fb = els.current.bframe;
      if (fb) fb.style.boxShadow = flash > 0.03
        ? "0 0 " + (60 * flash).toFixed(0) + "px -8px color-mix(in srgb, " + accentColor + " " + Math.round(flash * 60) + "%, transparent)"
        : "none";
      // pointer light sweep + comet trail
      if (sweepRef.current) sweepRef.current.style.background = "radial-gradient(240px circle at " +
        ((ptr.x / 2 + 0.5) * 100).toFixed(1) + "% " + ((ptr.y / 2 + 0.5) * 100).toFixed(1) +
        "%, color-mix(in srgb, " + accentColor + " 14%, transparent), transparent 70%)";
      if (fine) {
        let px2 = pxy.x, py2 = pxy.y;
        for (let i = 0; i < trail.length; i++) {
          const tr2 = trail[i];
          tr2.x += (px2 - tr2.x) * 0.32; tr2.y += (py2 - tr2.y) * 0.32;
          px2 = tr2.x; py2 = tr2.y;
          const el = els.current["t" + i];
          if (el) el.style.transform = "translate3d(" + tr2.x.toFixed(1) + "px," + tr2.y.toFixed(1) + "px,0)";
        }
      }
      if (ctx && cw) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save(); ctx.scale(dpr, dpr);
        const pts = [];
        for (let i = 0; i < nodes.length; i++) {
          const nd = nodes[i];
          let x = nd.bx * cw + Math.sin(T * nd.sp + nd.ph) * nd.ax + ptr.x * 12;
          let y = nd.by * ch + Math.cos(T * nd.sp * 0.8 + nd.ph) * nd.ay + ptr.y * 9;
          const ddx = x - pxy.x, ddy = y - pxy.y, dist = Math.hypot(ddx, ddy);
          if (fine && dist < 140 && dist > 0.01) { const f = (1 - dist / 140) * 26; x += (ddx / dist) * f; y += (ddy / dist) * f; }
          pts.push([x, y, nd.tint]);
        }
        ctx.lineWidth = 1;
        for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
          const dx2 = pts[i][0] - pts[j][0], dy2 = pts[i][1] - pts[j][1], d2 = dx2 * dx2 + dy2 * dy2;
          if (d2 < 16900) {
            ctx.strokeStyle = "rgba(139,155,245," + (0.12 * (1 - Math.sqrt(d2) / 130)).toFixed(3) + ")";
            ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pts[j][0], pts[j][1]); ctx.stroke();
          }
        }
        if (fine) for (let i = 0; i < pts.length; i++) {
          const d = Math.hypot(pts[i][0] - pxy.x, pts[i][1] - pxy.y);
          if (d < 160) {
            ctx.strokeStyle = "rgba(198,255,90," + (0.2 * (1 - d / 160)).toFixed(3) + ")";
            ctx.beginPath(); ctx.moveTo(pts[i][0], pts[i][1]); ctx.lineTo(pxy.x, pxy.y); ctx.stroke();
          }
        }
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          ctx.globalAlpha = p[2] ? 0.85 : 0.5;
          ctx.fillStyle = p[2] === 1 ? signalColor : p[2] === 2 ? tertiaryColor : "rgba(255,255,255,0.6)";
          ctx.beginPath(); ctx.arc(p[0], p[1], p[2] ? 1.8 : 1.2, 0, 6.283); ctx.fill();
        }
        ctx.globalAlpha = 1; ctx.restore();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("resize", sizeCanvas); if (fine) window.removeEventListener("pointermove", onMove); };
  }, [isStatic, particles, explodeDepth, driftSpeed, tiltStrength, accentColor, tertiaryColor, signalColor]);

  const glass = {
    borderRadius: 14,
    background: "linear-gradient(155deg, rgba(255,255,255,0.065), rgba(255,255,255,0.018) 65%)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 24px 60px -20px rgba(0,0,0,0.6)",
    backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
    boxSizing: "border-box",
  };
  const bar = (w, o, h, c) => (
    <div style={{ width: w, height: h || 7, borderRadius: 99, background: c || ("rgba(255,255,255," + o + ")") }} />
  );
  // outer shell = spring transform target; wire = blueprint pass; body = painted pass
  const shell = (k) => {
    const F = _FLOAT[k], sz = _SIZES[k];
    return {
      position: "absolute", left: 0, top: 0, width: sz[0], height: sz[1], willChange: "transform, opacity",
      transform: "translate3d(" + (F[0] - sz[0] / 2) + "px," + (F[1] - sz[1] / 2) + "px," + F[2] * explodeDepth + "px) rotateY(" + F[3] + "deg)",
      opacity: 1, transformStyle: "preserve-3d",
    };
  };
  const wireStyle = (r) => ({
    position: "absolute", inset: 0, borderRadius: r, opacity: isStatic ? 0 : 1,
    border: "1px dashed color-mix(in srgb, " + accentColor + " 55%, transparent)",
    background: "color-mix(in srgb, " + accentColor + " 4%, transparent)",
  });
  const panel = (k, radius, bodyStyle, children) => (
    <div ref={setEl(k)} style={shell(k)}>
      <div ref={setEl("w" + k)} style={wireStyle(radius)} />
      <div ref={setEl("b" + k)} style={Object.assign({ position: "absolute", inset: 0, opacity: isStatic ? 1 : 0 }, bodyStyle)}>{children}</div>
    </div>
  );

  return (
    <div ref={rootRef} aria-hidden="true" className={className}
      style={Object.assign({
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
        background: backgroundColor, perspective: 1100, perspectiveOrigin: "50% 40%",
        contain: "layout paint", zIndex: 0,
      }, style)}>
      <style>{"@keyframes plheroRipple{0%{transform:scale(.35);opacity:.9}100%{transform:scale(1.9);opacity:0}}@keyframes plheroBlink{0%,55%{opacity:1}56%,100%{opacity:0}}@keyframes plheroOrbit{to{transform:rotate(360deg)}}@keyframes plheroStreak{0%{transform:translate3d(0,0,0) rotate(-28deg);opacity:0}8%{opacity:.9}38%,100%{transform:translate3d(560px,-300px,0) rotate(-28deg);opacity:0}}"}</style>
      <div ref={glowRef} style={{
        position: "absolute", left: "50%", top: "52%", width: "62%", aspectRatio: "1.2",
        transform: "translate(-50%,-50%)", borderRadius: "50%", opacity: 0.55, filter: "blur(44px)",
        background: "radial-gradient(closest-side, color-mix(in srgb, " + accentColor + " 17%, transparent), color-mix(in srgb, " + secondaryColor + " 5%, transparent) 50%, transparent 74%)",
      }} />
      <div style={{
        position: "absolute", left: "14%", top: "12%", width: "34%", aspectRatio: "1",
        borderRadius: "50%", filter: "blur(64px)", opacity: 0.26,
        background: "radial-gradient(closest-side, color-mix(in srgb, " + tertiaryColor + " 16%, transparent), transparent 72%)",
      }} />
      <div style={{
        position: "absolute", right: "9%", bottom: "7%", width: "30%", aspectRatio: "1",
        borderRadius: "50%", filter: "blur(64px)", opacity: 0.22,
        background: "radial-gradient(closest-side, color-mix(in srgb, " + secondaryColor + " 13%, transparent), transparent 72%)",
      }} />
      <div style={{
        position: "absolute", left: "50%", bottom: "-16%", width: 1300, height: 700, marginLeft: -650,
        transform: "rotateX(76deg)", transformOrigin: "50% 100%",
        background: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "46px 46px",
        WebkitMaskImage: "radial-gradient(ellipse 55% 65% at 50% 100%, #000 30%, transparent)",
        maskImage: "radial-gradient(ellipse 55% 65% at 50% 100%, #000 30%, transparent)",
      }} />
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.8 }} />
      <div ref={sceneRef} style={{
        position: "absolute", left: "50%", top: "50%", width: 560, height: 400,
        marginLeft: -280, marginTop: -200, transformStyle: "preserve-3d", willChange: "transform",
        transform: "rotateX(8deg) rotateY(0deg)",
      }}>
        <div aria-hidden="true" style={{
          position: "absolute", left: "50%", top: "50%", width: 620, height: 620, margin: -310,
          borderRadius: "50%", border: "1px dashed rgba(255,255,255,0.08)",
          transform: "translateZ(-60px) rotateX(74deg)",
        }}>
          <div style={{ position: "absolute", inset: -1, borderRadius: "50%", animation: isStatic ? "none" : "plheroOrbit 16s linear infinite" }}>
            <div style={{ position: "absolute", left: "50%", top: -4, width: 8, height: 8, marginLeft: -4, borderRadius: 99, background: tertiaryColor, boxShadow: "0 0 14px 3px color-mix(in srgb, " + tertiaryColor + " 55%, transparent)" }} />
          </div>
        </div>
        <div aria-hidden="true" style={{
          position: "absolute", left: "50%", top: "50%", width: 780, height: 780, margin: -390,
          borderRadius: "50%", border: "1px solid rgba(255,255,255,0.05)",
          transform: "translateZ(-150px) rotateX(74deg)",
        }}>
          <div style={{ position: "absolute", inset: -1, borderRadius: "50%", animation: isStatic ? "none" : "plheroOrbit 26s linear infinite reverse" }}>
            <div style={{ position: "absolute", left: "50%", top: -3, width: 6, height: 6, marginLeft: -3, borderRadius: 99, background: secondaryColor, boxShadow: "0 0 12px 2px color-mix(in srgb, " + secondaryColor + " 55%, transparent)" }} />
          </div>
        </div>
        {panel("frame", 18, {
          borderRadius: 18, border: "1px solid rgba(255,255,255,0.14)",
          background: "linear-gradient(170deg, rgba(255,255,255,0.03), rgba(255,255,255,0.006))",
          overflow: "hidden",
        }, (
          <React.Fragment>
            <div style={{ display: "flex", gap: 6, padding: "13px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: 99, background: "rgba(255,255,255,0.22)" }} />
              <div style={{ width: 8, height: 8, borderRadius: 99, background: "rgba(255,255,255,0.14)" }} />
              <div style={{ width: 8, height: 8, borderRadius: 99, background: "rgba(255,255,255,0.09)" }} />
              <div style={{ marginLeft: 12, height: 12, flex: "0 0 200px", borderRadius: 99, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }} />
            </div>
            <div ref={beamRef} style={{
              position: "absolute", left: 0, right: 0, top: "0%", height: 90, opacity: 0,
              background: "linear-gradient(180deg, transparent, color-mix(in srgb, " + accentColor + " 12%, transparent) 55%, color-mix(in srgb, " + secondaryColor + " 18%, transparent) 100%)",
              borderBottom: "1px solid color-mix(in srgb, " + secondaryColor + " 55%, transparent)",
            }} />
            {[0, 1, 2, 3].map((c) => (
              <div key={c} style={{
                position: "absolute", width: 10, height: 10,
                left: c % 2 === 0 ? 10 : "auto", right: c % 2 === 1 ? 10 : "auto",
                top: c < 2 ? 46 : "auto", bottom: c >= 2 ? 10 : "auto",
                borderLeft: c % 2 === 0 ? "1px solid rgba(255,255,255,0.2)" : "none",
                borderRight: c % 2 === 1 ? "1px solid rgba(255,255,255,0.2)" : "none",
                borderTop: c < 2 ? "1px solid rgba(255,255,255,0.2)" : "none",
                borderBottom: c >= 2 ? "1px solid rgba(255,255,255,0.2)" : "none",
              }} />
            ))}
          </React.Fragment>
        ))}
        {panel("hero", 14, Object.assign({}, glass, { padding: 24, overflow: "hidden" }), (
          <React.Fragment>
            <div ref={sweepRef} style={{ position: "absolute", inset: 0, borderRadius: 14 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 16, height: 16, borderRadius: 5, background: accentColor }} />
              <div style={{ flex: 1 }} />
              {bar(26, 0.22, 5)}{bar(26, 0.22, 5)}{bar(26, 0.22, 5)}
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {bar(220, 0.5, 14)}
              <div style={{ display: "flex", gap: 8 }}>{bar(96, 0, 14, accentColor)}{bar(72, 0.5, 14)}</div>
              <div style={{ display: "grid", gap: 6, marginTop: 8 }}>{bar(230, 0.14, 6)}{bar(180, 0.14, 6)}</div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 22, alignItems: "center" }}>
              <div ref={btnRef} style={{ width: 84, height: 27, borderRadius: 99, background: accentColor, boxShadow: "0 6px 22px -4px color-mix(in srgb, " + accentColor + " 60%, transparent)", transition: "transform .18s cubic-bezier(0.16,1,0.3,1)" }} />
              <div style={{ width: 68, height: 27, borderRadius: 99, border: "1px solid rgba(255,255,255,0.18)" }} />
            </div>
          </React.Fragment>
        ))}
        {panel("media", 14, Object.assign({}, glass, { padding: 10 }), (
          <React.Fragment>
            <div style={{
              height: 72, borderRadius: 8,
              background: "linear-gradient(130deg, color-mix(in srgb, " + accentColor + " 55%, #0A0B0E), color-mix(in srgb, " + tertiaryColor + " 45%, #0A0B0E) 55%, color-mix(in srgb, " + secondaryColor + " 40%, #0A0B0E) 95%)",
            }} />
            <div style={{ display: "grid", gap: 6, padding: "10px 4px 0" }}>{bar(90, 0.4, 6)}{bar(60, 0.16, 6)}</div>
          </React.Fragment>
        ))}
        {panel("stat", 14, Object.assign({}, glass, { display: "flex", alignItems: "center", gap: 12, padding: "0 16px" }), (
          <React.Fragment>
            <div style={{ width: 32, height: 32, borderRadius: 99, background: "linear-gradient(135deg, #2A2F3E, #171A22)", border: "1px solid rgba(255,255,255,0.14)", flexShrink: 0 }} />
            <div style={{ display: "grid", gap: 6 }}>{bar(66, 0.4, 6)}{bar(44, 0.15, 6)}</div>
            <div ref={statNumRef} style={{ marginLeft: "auto", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, fontWeight: 600, color: signalColor }}>+64%</div>
          </React.Fragment>
        ))}
        {panel("spec", 14, Object.assign({}, glass, {
          padding: "13px 16px", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 10.5, lineHeight: 1.75,
          color: "rgba(255,255,255,0.55)", whiteSpace: "pre",
        }), (
          <React.Fragment>
            <span>{"{ \"motion\": \"spring\",\n  \"render\": \""}</span>
            <span style={{ color: secondaryColor }}>60fps</span>
            <span>{"\",\n  \"feel\": \""}</span>
            <span style={{ color: tertiaryColor }}>premium</span>
            <span>{"\" }"}</span>
            <span style={{ animation: "plheroBlink 1.1s step-end infinite", color: accentColor }}>▌</span>
          </React.Fragment>
        ))}
        <div ref={setEl("cursor")} style={shell("cursor")}>
          <div ref={rippleRef} style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "1.5px solid color-mix(in srgb, " + accentColor + " 75%, transparent)",
            opacity: 0, transform: "scale(0.35)",
          }} />
          <svg width="22" height="22" viewBox="0 0 22 22" style={{ position: "absolute", left: 13, top: 13, filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.6))" }}>
            <path d="M4 2l14 6.5-6 1.8-2.6 5.7L4 2z" fill="#fff" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8" />
          </svg>
        </div>
        {particles.map((p, i) => (
          <div key={i} ref={setEl("p" + i)} style={{
            position: "absolute", left: p.x + "%", top: p.y + "%", width: p.s, height: p.s,
            borderRadius: 99, opacity: p.a, willChange: "transform, opacity",
            background: p.tint ? accentColor : "#fff",
            transform: "translate3d(0,0," + p.z * explodeDepth + "px)",
          }} />
        ))}
      </div>
      {!isStatic ? [0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} ref={setEl("t" + i)} style={{
          position: "absolute", left: -3, top: -3, width: 7 - i, height: 7 - i, borderRadius: 99,
          background: accentColor, opacity: 0.4 - i * 0.06, filter: "blur(" + (i * 0.5) + "px)",
          transform: "translate3d(-100px,-100px,0)", willChange: "transform", mixBlendMode: "screen",
        }} />
      )) : null}
      {!isStatic ? (
        <React.Fragment>
          <div style={{ position: "absolute", left: "10%", top: "62%", width: 150, height: 1.5, borderRadius: 99, opacity: 0, background: "linear-gradient(90deg, transparent, color-mix(in srgb, " + tertiaryColor + " 80%, transparent), transparent)", animation: "plheroStreak 7.5s linear infinite", animationDelay: "1.4s" }} />
          <div style={{ position: "absolute", left: "26%", top: "82%", width: 110, height: 1, borderRadius: 99, opacity: 0, background: "linear-gradient(90deg, transparent, color-mix(in srgb, " + secondaryColor + " 75%, transparent), transparent)", animation: "plheroStreak 9.5s linear infinite", animationDelay: "4.8s" }} />
        </React.Fragment>
      ) : null}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 85% 70% at 50% 44%, transparent 52%, color-mix(in srgb, " + backgroundColor + " 78%, transparent))",
      }} />
    </div>
  );
}

export default ExplodedInterfaceHero;
