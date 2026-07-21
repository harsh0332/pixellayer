"use client";

import React from "react";
/**
 * PixelLayerr Motion — ScrollStoryPortfolio (Selected Work reel)
 * A clean, SCROLL-DRIVEN one-card-at-a-time reel — the antidote to the old
 * radial fan. Exactly one project sits upright and centered, fully readable;
 * as the user scrolls, it eases out and the next eases into focus. At most one
 * neighbour peeks softly at each edge (dimmed, scaled-down, behind) — never
 * overlapping the focal card, never a fan/pile. The project name stays above
 * the cards at all times. Progress is driven by the section's position in a
 * tall scroll region with a sticky stage — plain window scroll + one rAF
 * throttle (works with the site's Lenis loop; no second rAF).
 *
 * Peer deps: react. Next.js: dynamic import ssr:false (reads window on scroll).
 * Props: items[{title,tag,image,href}] | accentColor | reducedMotion | vhPerCard
 * Reduced motion → a clean static vertical list of cards, no animation.
 */

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

function ScrollStoryPortfolio({
  items = [],
  accentColor = "#c6ff5a",
  reducedMotion,
  vhPerCard = 46,
}) {
  const data = items && items.length ? items : [];
  const n = data.length;
  const wrapRef = React.useRef(null);
  const cardEls = React.useRef([]);
  const nameRef = React.useRef(null);
  const tagRef = React.useRef(null);
  const posRef = React.useRef(null);
  const linkRef = React.useRef(null);
  const progRef = React.useRef(null);
  const [sysReduced, setSysReduced] = React.useState(false);
  const [dims, setDims] = React.useState({ w: 1200, narrow: false });

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSysReduced(mq.matches);
    const on = (e) => setSysReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  const isStatic = reducedMotion != null ? reducedMotion : sysReduced;

  React.useEffect(() => {
    const measure = () =>
      setDims({ w: window.innerWidth || 1200, narrow: (window.innerWidth || 1200) < 640 });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* Geometry: one focal card; the step is wide enough that a neighbour's near
     edge clears the focal card (gap, never overlap) while its far edge runs
     off-stage — so it reads as a soft edge-peek. */
  const stageW = Math.min(dims.w, 1240);
  const cardW = dims.narrow
    ? Math.min(dims.w - 44, 330)
    : Math.min(600, Math.round(stageW * 0.5));
  const cardImgH = Math.round(cardW * 0.6);
  const cardH = cardImgH + 34;
  const step = Math.round(cardW * (dims.narrow ? 1.06 : 1.0));

  const layout = React.useCallback(
    (p) => {
      const pos = p * Math.max(n - 1, 1);
      for (let i = 0; i < n; i++) {
        const el = cardEls.current[i];
        if (!el) continue;
        const d = i - pos;
        const ad = Math.abs(d);
        if (ad > 1.85) {
          el.style.opacity = "0";
          el.style.visibility = "hidden";
          el.style.pointerEvents = "none";
          continue;
        }
        el.style.visibility = "visible";
        const focus = clamp(1 - ad, 0, 1);
        el.style.transform =
          "translate(-50%,-50%) translateX(" +
          (d * step).toFixed(1) +
          "px) scale(" +
          (1 - Math.min(ad, 1) * 0.18).toFixed(3) +
          ")";
        el.style.opacity = clamp(1 - ad * 0.62, 0, 1).toFixed(3);
        el.style.zIndex = String(100 - Math.round(ad * 12));
        el.style.pointerEvents = ad < 0.5 ? "auto" : "none";
        el.style.filter = "brightness(" + (0.5 + 0.5 * focus).toFixed(3) + ")";
        el.style.borderColor =
          focus > 0.6
            ? "color-mix(in oklab, " + accentColor + " 55%, rgba(255,255,255,0.12))"
            : "rgba(255,255,255,0.12)";
        el.style.boxShadow =
          focus > 0.5
            ? "0 40px 90px -40px rgba(0,0,0,.85), 0 0 42px -16px color-mix(in oklab, " +
              accentColor +
              " 42%, transparent)"
            : "0 24px 60px -34px rgba(0,0,0,.7)";
      }
      const idx = clamp(Math.round(pos), 0, n - 1);
      const it = data[idx] || {};
      if (nameRef.current) nameRef.current.textContent = it.title || "";
      if (tagRef.current) tagRef.current.textContent = it.tag || "";
      if (posRef.current) posRef.current.textContent = String(idx + 1).padStart(2, "0");
      if (linkRef.current) {
        linkRef.current.href = it.href || "#";
        linkRef.current.setAttribute(
          "aria-label",
          "Visit live site: " + (it.title || "") + " (opens in new tab)",
        );
      }
      if (progRef.current) progRef.current.style.transform = "scaleX(" + p.toFixed(4) + ")";
    },
    [n, step, data, accentColor],
  );

  React.useEffect(() => {
    if (isStatic) return;
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
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isStatic, layout]);

  const mono = "var(--font-mono-face), ui-monospace, Menlo, monospace";
  const sans = "var(--font-sans-face), 'DM Sans', system-ui, sans-serif";

  /* Reduced motion → clean static vertical list, title visible, no animation. */
  if (isStatic) {
    return (
      <div
        className="container-site"
        style={{ fontFamily: sans, display: "grid", gap: 18, maxWidth: 560, marginInline: "auto" }}
      >
        {data.map((p, i) => (
          <a
            key={i}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={"Visit live site: " + p.title + " (opens in new tab)"}
            style={{
              display: "block",
              color: "#f4f2eb",
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14,
              overflow: "hidden",
              background: "#0e121b",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.image}
              alt=""
              loading="lazy"
              style={{ display: "block", width: "100%", aspectRatio: "16/10", objectFit: "cover", objectPosition: "top" }}
            />
            <div style={{ padding: "14px 16px" }}>
              <div style={{ fontWeight: 600 }}>{p.title}</div>
              <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.16em", color: "#969ba5", marginTop: 4 }}>
                {p.tag} · VIEW LIVE ↗
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  }

  return (
    <section
      ref={wrapRef}
      aria-label="Selected work reel"
      style={{ position: "relative", height: n * vhPerCard + 60 + "vh" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(22px, 5vh, 52px)",
        }}
      >
        {/* Header — always above the cards (own flow row + higher z). */}
        <div
          style={{
            position: "relative",
            zIndex: 200,
            display: "grid",
            gap: 10,
            justifyItems: "center",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.24em", color: "#9BA1AD" }}>
            SELECTED WORK
          </span>
          <h3
            ref={nameRef}
            style={{
              margin: 0,
              fontFamily: sans,
              fontWeight: 600,
              fontSize: "clamp(24px, 4.5vw, 42px)",
              letterSpacing: "-0.02em",
              color: "#E7E9EE",
            }}
          >
            &#160;
          </h3>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <span ref={tagRef} style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", color: accentColor }}>
              &#160;
            </span>
            <span ref={posRef} style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.16em", color: "#8A909C" }}>
              &#160;
            </span>
            <a
              ref={linkRef}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.14em", color: accentColor, textDecoration: "none" }}
            >
              VIEW LIVE ↗
            </a>
          </div>
        </div>

        {/* Card stage. */}
        <div style={{ position: "relative", width: "100%", height: cardH, flex: "none" }}>
          {data.map((it, i) => (
            <article
              key={i}
              ref={(el) => {
                cardEls.current[i] = el;
              }}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: cardW,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "linear-gradient(170deg,#12141B,#0C0E13)",
                overflow: "hidden",
                transform: "translate(-50%,-50%)",
                willChange: "transform, opacity",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "11px 14px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: 99, background: "rgba(255,255,255,0.3)" }} />
                <span style={{ width: 7, height: 7, borderRadius: 99, background: "rgba(255,255,255,0.18)" }} />
                <span style={{ width: 7, height: 7, borderRadius: 99, background: "rgba(255,255,255,0.1)" }} />
                <span style={{ marginLeft: "auto", fontFamily: mono, fontSize: 9, letterSpacing: "0.18em", color: accentColor }}>
                  LIVE
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.image}
                alt=""
                draggable={false}
                loading={i < 2 ? "eager" : "lazy"}
                style={{ display: "block", width: "100%", aspectRatio: "16/10", objectFit: "cover", objectPosition: "top" }}
              />
              <a
                href={it.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={"Visit live site: " + it.title + " (opens in new tab)"}
                style={{ position: "absolute", inset: 0, zIndex: 5 }}
              />
            </article>
          ))}
        </div>

        {/* Progress. */}
        <div
          style={{
            position: "relative",
            zIndex: 200,
            width: "min(220px, 50vw)",
            height: 2,
            borderRadius: 99,
            overflow: "hidden",
            background: "rgba(255,255,255,0.08)",
          }}
        >
          <div
            ref={progRef}
            style={{ height: "100%", width: "100%", background: accentColor, transformOrigin: "left center", transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}

export { ScrollStoryPortfolio };
export default ScrollStoryPortfolio;
