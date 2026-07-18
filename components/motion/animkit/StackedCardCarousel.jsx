"use client";

import React from "react";
/*
 * StackedCardCarousel — draggable stacked card deck · PixelLayerr motion library
 * peer-deps: react >=18, react-dom >=18 · zero runtime deps · self-contained styles
 * next.js:   import directly ("use client" component). Content-agnostic: pass children
 *            (one element per card) OR items + renderItem(item, i).
 * porting:   add `import React from "react";` at the top and replace the exports footer with
 *            `export default StackedCardCarousel;`
 * a11y/perf: drag/swipe (pointer + touch), arrow keys, prev/next buttons, dots · aria-live on
 *            change · auto-advance optional, pauses on hover/focus + offscreen (IO) ·
 *            prefers-reduced-motion → static stack, no auto-advance, buttons/keys still work.
 */

function StackedCardCarousel({
  items,
  renderItem,
  children,
  autoAdvance = false,
  interval = 5000,
  accentColor = "#5B72F2",
  depthOffset = 16,
  scaleFalloff = 0.05,
  maxVisible = 3,
  reducedMotion,
  ariaLabel = "Card carousel",
  style,
  className,
}) {
  const slides = React.useMemo(() => (
    children != null
      ? React.Children.toArray(children).filter((c) => React.isValidElement(c))
      : (items || []).map((it, i) => (renderItem ? renderItem(it, i) : it))
  ), [children, items, renderItem]);
  const n = slides.length;
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [sysReduced, setSysReduced] = React.useState(false);
  const inView = React.useRef(true);
  const stackRef = React.useRef(null);
  const cardEls = React.useRef([]);
  const drag = React.useRef({ on: false, x0: 0, dx: 0 });

  React.useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSysReduced(mq.matches);
    const on = (e) => setSysReduced(e.matches);
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, []);

  const reduced = reducedMotion != null ? reducedMotion : sysReduced;
  const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
  const trans = () => (reduced ? "none" : "transform .55s " + EASE + ", opacity .45s " + EASE + ", filter .45s " + EASE);
  const next = React.useCallback(() => setIndex((i) => (n ? (i + 1) % n : 0)), [n]);
  const prev = React.useCallback(() => setIndex((i) => (n ? (i - 1 + n) % n : 0)), [n]);

  React.useEffect(() => {
        const io = new IntersectionObserver((entries) => { inView.current = entries[0].isIntersecting; });
    io.observe(stackRef.current);
    return () => io.disconnect();
  }, []);

  React.useEffect(() => {
    if (!autoAdvance || paused || reduced || n < 2) return;
    const id = setInterval(() => { if (inView.current) next(); }, Math.max(1500, Number(interval) || 5000));
    return () => clearInterval(id);
  }, [autoAdvance, paused, reduced, n, interval, next]);

  const slot = (i) => {
    const r = (i - index + n) % n;
    const v = Math.min(r, maxVisible);
    const leaving = n > 2 && r === n - 1; // just-dismissed card drops away behind
    return {
      gridArea: "1 / 1",
      transformOrigin: "50% 0%",
      transform: leaving
        ? "translateY(14px) scale(0.985)"
        : "translateY(" + (-v * depthOffset) + "px) scale(" + (1 - v * scaleFalloff).toFixed(4) + ")",
      zIndex: n - r,
      opacity: r === 0 ? 1 : (leaving || r > maxVisible) ? 0 : Math.max(0, 1 - v * 0.18),
      filter: r === 0 ? "none" : "brightness(" + (1 - v * 0.16).toFixed(3) + ")",
      transition: trans(),
      pointerEvents: r === 0 ? "auto" : "none",
      willChange: "transform, opacity",
    };
  };

  const onPointerDown = (e) => {
    if (n < 2 || reduced) return;
    const el = cardEls.current[index];
    if (!el) return;
    drag.current = { on: true, x0: e.clientX, dx: 0 };
    el.style.transition = "none";
    if (e.currentTarget.setPointerCapture) { try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {} }
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.on) return;
    d.dx = e.clientX - d.x0;
    const el = cardEls.current[index];
    if (el) el.style.transform = "translateX(" + d.dx + "px) rotate(" + (d.dx * 0.02).toFixed(2) + "deg)";
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    const el = cardEls.current[index];
    if (el) {
      el.style.transition = trans();
      el.style.transform = "translateY(0px) scale(1)";
    }
    if (d.dx < -56) next();
    else if (d.dx > 56) prev();
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
  };

  const btnStyle = {
    width: 34, height: 34, borderRadius: 999, display: "grid", placeItems: "center",
    background: "transparent", border: "1px solid rgba(255,255,255,0.14)",
    color: "rgba(255,255,255,0.72)", cursor: "pointer", padding: 0,
    transition: "border-color .3s, color .3s",
  };
  const chevron = (flip) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : null}>
      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className={className} role="region" aria-roledescription="carousel" aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      style={Object.assign({ display: "grid", gap: 22 }, style)}>
      <div ref={stackRef} tabIndex={0} onKeyDown={onKeyDown}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={endDrag} onPointerCancel={endDrag}
        style={{
          display: "grid",
          paddingTop: depthOffset * Math.min(Math.max(n - 1, 0), maxVisible),
          touchAction: "pan-y", outline: "none", userSelect: "none",
          cursor: n > 1 && !reduced ? "grab" : "default",
        }}>
        {slides.map((node, i) => (
          <div key={i} ref={(el) => { cardEls.current[i] = el; }} role="group"
            aria-roledescription="slide" aria-label={(i + 1) + " of " + n}
            aria-hidden={i !== index} style={slot(i)}>
            {node}
          </div>
        ))}
      </div>
      {n > 1 ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <button type="button" aria-label="Previous card" onClick={prev} style={btnStyle}>{chevron(true)}</button>
          <div style={{ display: "flex", gap: 7 }}>
            {slides.map((_, i) => (
              <button key={i} type="button" aria-label={"Go to card " + (i + 1)} onClick={() => setIndex(i)}
                style={{
                  width: i === index ? 20 : 6, height: 6, borderRadius: 999, border: "none",
                  padding: 0, cursor: "pointer",
                  background: i === index ? accentColor : "rgba(255,255,255,0.18)",
                  transition: reduced ? "none" : "width .4s " + EASE + ", background .3s",
                }} />
            ))}
          </div>
          <button type="button" aria-label="Next card" onClick={next} style={btnStyle}>{chevron(false)}</button>
        </div>
      ) : null}
      <div aria-live="polite" style={{
        position: "absolute", width: 1, height: 1, margin: -1, overflow: "hidden",
        clip: "rect(0 0 0 0)", whiteSpace: "nowrap",
      }}>{"Card " + (index + 1) + " of " + n}</div>
    </div>
  );
}

export default StackedCardCarousel;
