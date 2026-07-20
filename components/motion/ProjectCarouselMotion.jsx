"use client";

import React from "react";
/**
 * PixelLayerr Motion — ProjectCarouselMotion (Selected Work)
 * A spaced device-mockup carousel: one focal browser-frame card (real project
 * screenshot) with soft shadow + slight 3D depth; neighbors sit clearly BESIDE
 * it (scale/opacity falloff, no overlap with the focal card). Advance by
 * horizontal drag (vertical-intent hands scroll back to the page), 44px arrow
 * buttons, or keyboard arrows. Active card gets the lime accent; the meta row
 * below shows name · category · position (no totals) · live link.
 * Peer deps: react. Pure pointer events + CSS transforms — no libs.
 * Props: items[{title,tag,image,href}] | accentColor | surfaceColor |
 *        borderColor | textColor | mutedColor
 * Reduced motion → static, neatly spaced scrollable row.
 */

const PLX_PC_EASE = "cubic-bezier(.16,1,.3,1)";

function ProjectCarouselMotion({
  items = [],
  accentColor = "#c6ff5a",
  surfaceColor = "#0e121b",
  borderColor = "rgba(255,255,255,0.13)",
  textColor = "#f4f2eb",
  mutedColor = "#969ba5",
}) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `plxpc${uid}`;
  const n = items.length;
  const rootRef = React.useRef(null);
  const drag = React.useRef(null);
  const [active, setActive] = React.useState(0);
  const [dragX, setDragX] = React.useState(0);
  const [reduced, setReduced] = React.useState(false);
  const [shown, setShown] = React.useState(false);
  const [stageW, setStageW] = React.useState(1200);

  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const f = (e) => setReduced(e.matches);
    m.addEventListener("change", f);
    const el = rootRef.current;
    const measure = () => el && setStageW(el.clientWidth || 1200);
    measure();
    window.addEventListener("resize", measure);
    let io;
    if (el && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        },
        { threshold: 0.2 },
      );
      io.observe(el);
    } else setShown(true);
    return () => {
      m.removeEventListener("change", f);
      window.removeEventListener("resize", measure);
      io && io.disconnect();
    };
  }, []);

  const on = shown || reduced;
  const go = React.useCallback(
    (dir) => setActive((a) => (a + dir + n) % n),
    [n],
  );

  /* Shortest circular distance so the ring wraps both ways. */
  const dist = (i, a) => {
    let d = (i - a) % n;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    return d;
  };

  /* Geometry: focal card centered; neighbors fully beside it + a gap. */
  const narrow = stageW < 640;
  const cardW = narrow
    ? Math.max(stageW - 56, 240)
    : Math.min(620, Math.round(stageW * 0.56));
  const gap = narrow ? 16 : 28;
  const step = cardW + gap;
  const frameH = Math.round(cardW * 0.625) + 34;
  const metaH = 92;

  /* Drag: horizontal-intent only — vertical swipes scroll the page. */
  const down = (e) => {
    if (n < 2 || reduced) return;
    drag.current = {
      x0: e.clientX,
      y0: e.clientY,
      dx: 0,
      horiz: false,
      pid: e.pointerId,
      el: e.currentTarget,
    };
  };
  const move = (e) => {
    const dg = drag.current;
    if (!dg) return;
    dg.dx = e.clientX - dg.x0;
    const dy = e.clientY - dg.y0;
    if (!dg.horiz) {
      if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dg.dx)) {
        drag.current = null;
        return;
      }
      if (Math.abs(dg.dx) > 12 && Math.abs(dg.dx) > Math.abs(dy)) {
        dg.horiz = true;
        dg.el.setPointerCapture && dg.el.setPointerCapture(dg.pid);
      } else return;
    }
    setDragX(dg.dx * 0.6);
  };
  const up = () => {
    const dg = drag.current;
    drag.current = null;
    setDragX(0);
    if (!dg || !dg.horiz) return;
    if (Math.abs(dg.dx) > 60) go(dg.dx < 0 ? 1 : -1);
  };

  const onKey = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const mono = "var(--font-mono-face), ui-monospace, Menlo, monospace";
  const sans = "var(--font-sans-face), 'DM Sans', system-ui, sans-serif";
  const it = items[active] || {};

  const css = `
.${cls}-btn{display:inline-grid;place-items:center;width:44px;height:44px;border-radius:99px;border:1px solid ${borderColor};background:${surfaceColor};color:${textColor};cursor:pointer;transition:border-color .25s,color .25s,transform .25s ${PLX_PC_EASE}}
.${cls}-btn:hover{border-color:color-mix(in oklab, ${accentColor} 45%, ${borderColor});color:${accentColor};transform:translateY(-2px)}
.${cls}-btn:focus-visible{outline:2px solid ${accentColor};outline-offset:3px}
.${cls}-live{font-family:${mono};font-size:11px;letter-spacing:.14em;color:${accentColor};text-decoration:none;background-image:linear-gradient(${accentColor},${accentColor});background-size:0% 1px;background-position:0 100%;background-repeat:no-repeat;transition:background-size .3s ${PLX_PC_EASE}}
.${cls}-live:hover,.${cls}-live:focus-visible{background-size:100% 1px;outline:none}
@media (prefers-reduced-motion:reduce){.${cls} *{animation:none!important;transition:none!important}}`;

  /* Reduced motion: a static, neatly spaced scrollable row. */
  if (reduced) {
    return (
      <div ref={rootRef} className={cls} style={{ fontFamily: sans, color: textColor }}>
        <style>{css}</style>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: "4px 4px 12px",
            display: "flex",
            gap: 20,
            overflowX: "auto",
          }}
        >
          {items.map((p, i) => (
            <li key={i} style={{ flex: "0 0 300px" }}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", color: textColor, textDecoration: "none" }}
                aria-label={`Visit live site: ${p.title} (opens in new tab)`}
              >
                <span
                  style={{
                    display: "block",
                    border: `1px solid ${borderColor}`,
                    borderRadius: 14,
                    overflow: "hidden",
                    background: surfaceColor,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt=""
                    loading="lazy"
                    style={{ display: "block", width: "100%", aspectRatio: "16/10", objectFit: "cover", objectPosition: "top" }}
                  />
                </span>
                <span style={{ display: "block", marginTop: 10, fontWeight: 600, fontSize: 15 }}>{p.title}</span>
                <span style={{ display: "block", fontFamily: mono, fontSize: 10, letterSpacing: ".16em", color: mutedColor, marginTop: 3 }}>
                  {p.tag}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={cls}
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected work carousel"
      tabIndex={0}
      onKeyDown={onKey}
      style={{
        fontFamily: sans,
        color: textColor,
        outline: "none",
        opacity: on ? 1 : 0.001,
        transform: on ? "none" : "translateY(24px)",
        filter: on ? "blur(0px)" : "blur(9px)",
        transition: `opacity .5s linear, transform .85s ${PLX_PC_EASE}, filter .85s ${PLX_PC_EASE}`,
      }}
    >
      <style>{css}</style>

      {/* ---- Stage ---- */}
      <div
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        style={{
          position: "relative",
          height: frameH,
          perspective: 1400,
          touchAction: "pan-y",
          cursor: n > 1 ? "grab" : "default",
          userSelect: "none",
        }}
      >
        {items.map((p, i) => {
          const d = dist(i, active);
          const abs = Math.abs(d);
          if (abs > 2) return null;
          const focal = d === 0;
          const x = d * step + dragX;
          const scale = 1 - abs * 0.1;
          const opacity = focal ? 1 : abs === 1 ? 0.55 : 0.22;
          return (
            <div
              key={i}
              aria-hidden={focal ? undefined : true}
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                width: cardW,
                marginLeft: -cardW / 2,
                transform: `translateX(${x}px) translateZ(${-abs * 90}px) rotateY(${d * -3}deg) scale(${scale})`,
                opacity,
                zIndex: 10 - abs,
                pointerEvents: focal ? "auto" : "none",
                transition: drag.current
                  ? "none"
                  : `transform .5s ${PLX_PC_EASE}, opacity .4s linear`,
                willChange: "transform, opacity",
              }}
            >
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={focal ? 0 : -1}
                draggable={false}
                aria-label={`Visit live site: ${p.title} (opens in new tab)`}
                style={{
                  display: "block",
                  borderRadius: 16,
                  overflow: "hidden",
                  border: `1px solid ${focal ? `color-mix(in oklab, ${accentColor} 55%, ${borderColor})` : borderColor}`,
                  background: "linear-gradient(170deg,#12141B,#0C0E13)",
                  boxShadow: focal
                    ? `0 40px 90px -35px rgba(0,0,0,.85), 0 0 44px -18px color-mix(in oklab, ${accentColor} 40%, transparent)`
                    : "0 24px 60px -30px rgba(0,0,0,.7)",
                  transition: "border-color .4s, box-shadow .4s",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "11px 14px",
                    borderBottom: `1px solid rgba(255,255,255,0.06)`,
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: "rgba(255,255,255,0.3)" }} />
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: "rgba(255,255,255,0.18)" }} />
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: "rgba(255,255,255,0.1)" }} />
                  <span
                    style={{
                      marginLeft: "auto",
                      fontFamily: mono,
                      fontSize: 9,
                      letterSpacing: ".18em",
                      color: focal ? accentColor : mutedColor,
                      transition: "color .4s",
                    }}
                  >
                    LIVE
                  </span>
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt=""
                  loading={abs === 0 ? "eager" : "lazy"}
                  draggable={false}
                  style={{
                    display: "block",
                    width: "100%",
                    aspectRatio: "16/10",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
              </a>
            </div>
          );
        })}
      </div>

      {/* ---- Meta + controls ---- */}
      <div
        style={{
          minHeight: metaH,
          marginTop: 26,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <div aria-live="polite" style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
            <span style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>{it.title}</span>
            <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: ".16em", color: mutedColor }}>{it.tag}</span>
            <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: ".16em", color: `color-mix(in oklab, ${accentColor} 70%, ${mutedColor})` }}>
              {String(active + 1).padStart(2, "0")}
            </span>
          </div>
          <a
            className={`${cls}-live`}
            href={it.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", marginTop: 8 }}
          >
            VIEW LIVE ↗
          </a>
        </div>
        <div style={{ display: "flex", gap: 10, flex: "none" }}>
          <button type="button" className={`${cls}-btn`} aria-label="Previous project" onClick={() => go(-1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className={`${cls}-btn`} aria-label="Next project" onClick={() => go(1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export { ProjectCarouselMotion };
export default ProjectCarouselMotion;
