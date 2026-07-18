"use client";

import React from "react";
/**
 * PixelLayerr Motion — SectionHeadingMotion
 * Word-level optical resolve for the big display headings ("Every *layer* of a digital product.").
 * On scroll into view, words rise + blur→sharp one after another (expo-out). The *starred* word
 * renders in Instrument Serif italic (the site's display accent) and gets a lime underline that
 * draws in after the words settle, staying faint. Use on EVERY section heading for a consistent voice.
 * Peer deps: react. Fonts: DM Sans + Instrument Serif expected from the site.
 * Next.js: import { SectionHeadingMotion } from "@/components/motion/SectionHeadingMotion" — direct
 * client import; replace each <h2> with <SectionHeadingMotion text="Every *layer* of a digital product." />
 * Props: text (*word* → serif italic accent) | accentColor | textColor | fontSize | fontWeight | delay | once | as
 * Reduced motion → static resolved heading. No cursor dependency.
 */

const PLX_SH_EASE = "cubic-bezier(.16,.66,.2,1)";

function usePlxShInView(once) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); if (once) io.disconnect(); }
      else if (!once) setInView(false);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [once]);
  return [ref, inView];
}

function SectionHeadingMotion({ text = "Every *layer* of a digital product.", accentColor = "#c6ff5a", textColor = "#f4f2eb", fontSize = 42, fontWeight = 600, delay = 0, once = true, as = "h2", style }) {
  fontSize = +fontSize || 42; delay = +delay || 0;
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const f = () => setReduced(m.matches);
    f(); m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  const [ref, inView] = usePlxShInView(once !== false && once !== "false");
  const shown = inView || reduced;
  const tokens = [];
  String(text).split(/(\*[^*]+\*)/g).filter(Boolean).forEach((p) => {
    const serif = p.length > 2 && p.startsWith("*") && p.endsWith("*");
    (serif ? p.slice(1, -1) : p).split(/(\s+)/).filter(Boolean).forEach((w) => tokens.push({ w, serif, space: /^\s+$/.test(w) }));
  });
  let wi = -1;
  const total = tokens.filter((t) => !t.space).length;
  return React.createElement(as, { ref, style: { margin: 0, fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight, fontSize, letterSpacing: "-0.025em", lineHeight: 1.12, color: textColor, textWrap: "balance", ...style } },
    tokens.map((t, i) => {
      if (t.space) return " ";
      wi++;
      const d = delay + wi * 75;
      const word = (
        <span key={i} style={{ position: "relative", display: "inline-block", whiteSpace: "pre",
          fontFamily: t.serif ? "'Instrument Serif', Georgia, serif" : undefined,
          fontStyle: t.serif ? "italic" : undefined,
          fontWeight: t.serif ? 400 : undefined,
          fontSize: t.serif ? "1.06em" : undefined,
          transform: shown ? "translateY(0)" : "translateY(0.4em)",
          filter: shown ? "blur(0px)" : "blur(8px)",
          opacity: shown ? 1 : 0.001,
          transition: reduced ? "none" : `transform 640ms ${PLX_SH_EASE} ${d}ms, filter 640ms ${PLX_SH_EASE} ${d}ms, opacity 380ms linear ${d}ms`,
        }}>
          {t.w}
          {t.serif && (
            <span aria-hidden="true" style={{
              position: "absolute", left: "0.02em", right: "0.02em", bottom: "-0.06em", height: 2, borderRadius: 2,
              background: `linear-gradient(90deg, ${accentColor}, color-mix(in oklab, ${accentColor} 30%, transparent))`,
              transformOrigin: "left center",
              transform: shown ? "scaleX(1)" : "scaleX(0)",
              opacity: 0.55,
              transition: reduced ? "none" : `transform 520ms ${PLX_SH_EASE} ${delay + total * 75 + 160}ms`,
            }} />
          )}
        </span>
      );
      return word;
    })
  );
}

export { SectionHeadingMotion };
export default SectionHeadingMotion;
