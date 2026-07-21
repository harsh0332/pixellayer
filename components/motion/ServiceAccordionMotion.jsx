"use client";

import React from "react";
/**
 * PixelLayerr Motion — ServiceAccordionMotion ("03 · What we do" services)
 * Numbered expand/collapse accordion: titles (01–06) stacked with hairline
 * dividers; the active service expands — description + DELIVERABLES stagger
 * in with the optical reveal, the number + a lime tick activate — while the
 * others collapse to their numbered title. Height animates via the
 * grid-template-rows 0fr→1fr technique (no measuring, no jumps). Item 01
 * auto-expands when the section scrolls into view; clicking (or Enter/Space
 * on) a title expands it. Hover on a collapsed title: subtle lime highlight.
 * Peer deps: react. Proper disclosure semantics: button[aria-expanded] +
 * labelled region, ArrowUp/ArrowDown move between headers.
 * Props: items[{title,desc,deliverables[]}] | accentColor | borderColor |
 *        textColor | mutedColor
 * `sequential` prop: as the page scrolls, each header crossing the viewport
 * focus band auto-expands its service (01, then 02, …) — the previous one
 * collapses to its numbered title. Clicking still overrides at any time.
 * Reduced motion → all expanded, static, instant.
 */

const PLX_SA_EASE = "cubic-bezier(.16,1,.3,1)";

function ServiceAccordionMotion({
  items = [],
  accentColor = "#c6ff5a",
  borderColor = "rgba(255,255,255,0.13)",
  textColor = "#f4f2eb",
  mutedColor = "#969ba5",
  sequential = false,
}) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `plxsa${uid}`;
  const rootRef = React.useRef(null);
  const btnRefs = React.useRef([]);
  const [open, setOpen] = React.useState(-1);
  const [reduced, setReduced] = React.useState(false);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const f = (e) => setReduced(e.matches);
    m.addEventListener("change", f);
    let io;
    if (rootRef.current && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setShown(true);
            setOpen((o) => (o === -1 ? 0 : o));
            io.disconnect();
          }
        },
        { threshold: 0.2 },
      );
      io.observe(rootRef.current);
    } else {
      setShown(true);
      setOpen(0);
    }
    return () => {
      m.removeEventListener("change", f);
      io && io.disconnect();
    };
  }, []);

  /* Sequential mode: a header entering the viewport's focus band opens its
     service — scroll drives the 01 → 06 sequence, no pinning, no trap. */
  React.useEffect(() => {
    if (!sequential || reduced || typeof IntersectionObserver === "undefined")
      return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = btnRefs.current.indexOf(e.target);
          if (i >= 0) setOpen(i);
        }
      },
      { rootMargin: "-32% 0px -52% 0px", threshold: 0 },
    );
    btnRefs.current.forEach((b) => b && io.observe(b));
    return () => io.disconnect();
  }, [sequential, reduced, items.length]);

  const on = shown || reduced;

  const onHeaderKey = (e, i) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const next =
      (i + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length;
    btnRefs.current[next] && btnRefs.current[next].focus();
  };

  const mono = "var(--font-mono-face), ui-monospace, Menlo, monospace";
  const sans = "var(--font-sans-face), 'DM Sans', system-ui, sans-serif";

  const css = `
.${cls}-head{display:flex;align-items:baseline;gap:18px;width:100%;padding:22px 4px;background:none;border:none;cursor:pointer;text-align:left;font-family:${sans};color:${textColor};transition:color .3s}
.${cls}-head:hover .${cls}-num,.${cls}-head:hover .${cls}-title{color:${accentColor}}
.${cls}-head:focus-visible{outline:2px solid ${accentColor};outline-offset:3px;border-radius:6px}
.${cls}-num{font-family:${mono};font-size:12px;letter-spacing:.16em;color:${mutedColor};flex:none;transition:color .35s}
.${cls}-title{font-size:clamp(19px,2.6vw,26px);font-weight:600;letter-spacing:-0.015em;transition:color .35s;min-width:0}
.${cls}-chev{margin-left:auto;flex:none;color:${mutedColor};transition:transform .45s ${PLX_SA_EASE},color .35s}
@media (prefers-reduced-motion:reduce){.${cls} *{animation:none!important;transition:none!important}}`;

  return (
    <div
      ref={rootRef}
      className={cls}
      style={{
        fontFamily: sans,
        color: textColor,
        borderTop: `1px solid ${borderColor}`,
        opacity: on ? 1 : 0.001,
        transform: on ? "none" : "translateY(18px)",
        transition: `opacity .5s linear, transform .8s ${PLX_SA_EASE}`,
      }}
    >
      <style>{css}</style>
      {items.map((it, i) => {
        const expanded = reduced || open === i;
        return (
          <div key={i} style={{ borderBottom: `1px solid ${borderColor}` }}>
            <h3 style={{ margin: 0 }}>
              <button
                type="button"
                ref={(el) => (btnRefs.current[i] = el)}
                className={`${cls}-head`}
                aria-expanded={expanded}
                aria-controls={`${cls}-panel-${i}`}
                id={`${cls}-head-${i}`}
                onClick={() => !reduced && setOpen(expanded ? -1 : i)}
                onKeyDown={(e) => onHeaderKey(e, i)}
              >
                <span
                  className={`${cls}-num`}
                  style={{ color: expanded ? accentColor : undefined }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`${cls}-title`}>{it.title}</span>
                <svg
                  className={`${cls}-chev`}
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  style={{
                    transform: expanded ? "rotate(45deg)" : "none",
                    color: expanded ? accentColor : undefined,
                  }}
                >
                  <path
                    d="M7 1v12M1 7h12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </h3>

            {/* Height animates via 0fr → 1fr — smooth, unmeasured. */}
            <div
              id={`${cls}-panel-${i}`}
              role="region"
              aria-labelledby={`${cls}-head-${i}`}
              style={{
                display: "grid",
                gridTemplateRows: expanded ? "1fr" : "0fr",
                transition: reduced
                  ? "none"
                  : `grid-template-rows .55s ${PLX_SA_EASE}`,
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <div style={{ padding: "2px 4px 26px", paddingLeft: 42 }}>
                  <p
                    style={{
                      margin: 0,
                      maxWidth: 560,
                      fontSize: 15.5,
                      lineHeight: 1.6,
                      color: mutedColor,
                      opacity: expanded ? 1 : 0,
                      transform: expanded ? "none" : "translateY(8px)",
                      filter: expanded ? "blur(0px)" : "blur(5px)",
                      transition: reduced
                        ? "none"
                        : `opacity .4s linear .1s, transform .55s ${PLX_SA_EASE} .1s, filter .55s ${PLX_SA_EASE} .1s`,
                    }}
                  >
                    {it.desc}
                  </p>
                  <p
                    style={{
                      margin: "18px 0 10px",
                      fontFamily: mono,
                      fontSize: 10,
                      letterSpacing: ".18em",
                      color: mutedColor,
                      opacity: expanded ? 1 : 0,
                      transition: reduced ? "none" : "opacity .4s linear .16s",
                    }}
                  >
                    DELIVERABLES
                  </p>
                  <ul
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: 0,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px 26px",
                    }}
                  >
                    {(it.deliverables || []).map((d, k) => (
                      <li
                        key={k}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          fontSize: 14,
                          color: textColor,
                          opacity: expanded ? 1 : 0,
                          transform: expanded ? "none" : "translateY(7px)",
                          transition: reduced
                            ? "none"
                            : `opacity .35s linear ${180 + k * 60}ms, transform .5s ${PLX_SA_EASE} ${180 + k * 60}ms`,
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            width: 11,
                            height: 2,
                            borderRadius: 1,
                            background: accentColor,
                            transformOrigin: "left center",
                            transform: expanded ? "scaleX(1)" : "scaleX(0)",
                            transition: reduced
                              ? "none"
                              : `transform .45s ${PLX_SA_EASE} ${240 + k * 60}ms`,
                          }}
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { ServiceAccordionMotion };
export default ServiceAccordionMotion;
