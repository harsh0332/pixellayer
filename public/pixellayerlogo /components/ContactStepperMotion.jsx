"use client";
/**
 * PixelLayerr Motion — ContactStepperMotion
 * Contact multi-step: heading optical-resolves on scroll, left contact column staggers in,
 * steps slide/crossfade, "STEP X OF 4" bar fills lime, option pills glow + lift on hover and
 * settle into a lime-outlined selected state, Continue is magnetic + tactile, and the panel's
 * ambient lime glow intensifies as the user progresses.
 * Peer deps: react. Pure CSS/rAF — no libs.
 * Next.js: import { ContactStepperMotion } from "@/components/motion/ContactStepperMotion" — direct client
 *          import, SSR-safe. Placeholder steps/contact rows mirror the live layout; pass `steps`/`contact` for real content.
 * Props: steps[{q,options[]|fields}] | contact[[label,value]] | heading | headingAccent | accentColor | surfaceColor | borderColor | textColor | mutedColor
 * Reduced motion → instant transitions; touch → no magnetism (hover:hover gated).
 */
// Preview shim (React is ambient here) — in Next.js DELETE the next line and add:  import React from "react";
if (typeof React === "undefined") { throw new Error("React peer dep missing — add: import React from 'react'"); }

const PLX_CS_EASE = "cubic-bezier(.16,.66,.2,1)";

const PLX_CS_STEPS = [
  { q: "What do you need?", options: ["Website", "Web app", "E-commerce", "Brand + motion", "Not sure yet"] },
  { q: "What's your budget?", options: ["< $2k", "$2–5k", "$5–10k", "$10k+"] },
  { q: "When do you need it?", options: ["ASAP", "2–4 weeks", "1–2 months", "Flexible"] },
  { q: "Where can we reach you?", fields: true },
];
const PLX_CS_CONTACT = [["PHONE", "{{+00 000 000 0000}}"], ["ADDRESS", "{{Street · City}}"], ["WHATSAPP", "{{Chat with us ↗}}"]];

function ContactStepperMotion({ steps = PLX_CS_STEPS, contact = PLX_CS_CONTACT, heading = "Tell us what", headingAccent = "you're building.", accentColor = "#c6ff5a", surfaceColor = "#0e121b", borderColor = "rgba(255,255,255,0.13)", textColor = "#f4f2eb", mutedColor = "#969ba5" }) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `plxcs${uid}`;
  const rootRef = React.useRef(null);
  const busy = React.useRef(false);
  const raf = React.useRef(0);
  const N = steps.length;
  const [step, setStep] = React.useState(0);
  const [displayed, setDisplayed] = React.useState(0);
  const [phase, setPhase] = React.useState("in");
  const [answers, setAnswers] = React.useState({});
  const [done, setDone] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  const [hoverFine, setHoverFine] = React.useState(false);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hm = window.matchMedia("(hover: hover) and (pointer: fine)");
    setReduced(rm.matches); setHoverFine(hm.matches);
    const fr = (e) => setReduced(e.matches), fh = (e) => setHoverFine(e.matches);
    rm.addEventListener("change", fr); hm.addEventListener("change", fh);
    let io;
    if (rootRef.current && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.15 });
      io.observe(rootRef.current);
    } else setShown(true);
    return () => { rm.removeEventListener("change", fr); hm.removeEventListener("change", fh); io && io.disconnect(); cancelAnimationFrame(raf.current); };
  }, []);
  const on = shown || reduced;
  const go = (target, dir) => {
    if (busy.current || target < 0 || target > N - 1) return;
    setStep(target);
    if (reduced) { setDisplayed(target); return; }
    busy.current = true;
    setPhase(dir > 0 ? "out" : "outback");
    setTimeout(() => {
      setDisplayed(target); setPhase(dir > 0 ? "prep" : "prepback");
      requestAnimationFrame(() => requestAnimationFrame(() => { setPhase("in"); busy.current = false; }));
    }, 180);
  };
  const magnetMove = (e) => {
    if (!hoverFine || reduced) return;
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    if (!raf.current) raf.current = requestAnimationFrame(() => { raf.current = 0; el.style.transform = `translate(${(dx * 8).toFixed(1)}px, ${(dy * 6).toFixed(1)}px)`; });
  };
  const magnetLeave = (e) => { e.currentTarget.style.transform = ""; };
  const s = steps[displayed] || steps[0];
  const answered = s.fields ? true : answers[displayed] != null;
  const progress = done ? 1 : (step + 1) / N;
  const outX = phase === "out" ? -14 : phase === "outback" ? 14 : 0;
  const isOut = phase === "out" || phase === "outback";
  const hiddenPrep = phase === "prep" || phase === "prepback";
  const prepX = phase === "prepback" ? -14 : 14;
  const stepStyle = reduced ? {} : isOut
    ? { opacity: 0.001, transform: `translateX(${outX}px)`, filter: "blur(4px)", transition: "opacity .18s linear, transform .18s ease, filter .18s ease" }
    : hiddenPrep
      ? { opacity: 0.001, transform: `translateX(${prepX}px)`, filter: "blur(4px)", transition: "none" }
      : { opacity: 1, transform: "none", filter: "blur(0px)", transition: `opacity .3s linear, transform .55s ${PLX_CS_EASE}, filter .55s ${PLX_CS_EASE}` };
  const revealAt = (i, extra) => reduced ? {} : {
    clipPath: on ? "inset(-6% -4% -6% -4%)" : "inset(12% 2% 2% 2%)",
    transform: on ? "none" : "translateY(12px)",
    filter: on ? "blur(0px)" : "blur(8px)",
    opacity: on ? 1 : 0.001,
    transition: `clip-path .75s ${PLX_CS_EASE} ${i * 90 + (extra || 0)}ms, transform .75s ${PLX_CS_EASE} ${i * 90 + (extra || 0)}ms, filter .75s ${PLX_CS_EASE} ${i * 90 + (extra || 0)}ms, opacity .45s linear ${i * 90 + (extra || 0)}ms`,
  };
  const css = `
.${cls} .${cls}-pill{font-family:'DM Sans',system-ui,sans-serif;font-size:14px;color:${textColor};background:transparent;border:1px solid ${borderColor};border-radius:999px;padding:10px 18px;cursor:pointer;transition:transform .25s ${PLX_CS_EASE},border-color .25s,background .25s,box-shadow .25s,color .25s;scale:1;}
.${cls} .${cls}-pill:active{scale:.96}
.${cls} .${cls}-pill:focus-visible{outline:none;border-color:${accentColor};box-shadow:0 0 0 3px color-mix(in oklab,${accentColor} 25%,transparent)}
.${cls} .${cls}-pill[data-sel="1"]{border-color:${accentColor};color:${accentColor};background:color-mix(in oklab,${accentColor} 9%,transparent);box-shadow:0 0 18px color-mix(in oklab,${accentColor} 14%,transparent)}
@media (hover:hover) and (pointer:fine){
  .${cls} .${cls}-pill:hover{transform:translateY(-2px);border-color:color-mix(in oklab,${accentColor} 45%,${borderColor});box-shadow:0 6px 22px color-mix(in oklab,${accentColor} 12%,transparent)}
}
.${cls} .${cls}-cont{scale:1;transition:transform .35s ${PLX_CS_EASE},opacity .3s,box-shadow .3s;}
.${cls} .${cls}-cont:active{scale:.96}
.${cls} .${cls}-cont:focus-visible{outline:2px solid ${accentColor};outline-offset:3px}
.${cls} .${cls}-input{font-family:'DM Sans',system-ui,sans-serif;font-size:14px;color:${textColor};background:rgba(255,255,255,.03);border:1px solid ${borderColor};border-radius:10px;padding:12px 14px;width:100%;box-sizing:border-box;transition:border-color .25s,box-shadow .25s}
.${cls} .${cls}-input::placeholder{color:${mutedColor};font-family:'DM Mono',ui-monospace,monospace;font-size:12px;letter-spacing:.05em}
.${cls} .${cls}-input:focus{outline:none;border-color:color-mix(in oklab,${accentColor} 60%,transparent);box-shadow:0 0 0 3px color-mix(in oklab,${accentColor} 12%,transparent)}
.${cls} .${cls}-back{background:none;border:none;cursor:pointer;font-family:'DM Mono',ui-monospace,monospace;font-size:11px;letter-spacing:.14em;color:${mutedColor};padding:4px 0;transition:color .25s}
.${cls} .${cls}-back:hover,.${cls} .${cls}-back:focus-visible{color:${textColor};outline:none}
@media (prefers-reduced-motion:reduce){.${cls} *{animation:none!important;transition:none!important}}`;
  return (
    <div ref={rootRef} className={cls} style={{ display: "grid", gridTemplateColumns: "minmax(240px, 1fr) minmax(320px, 1.35fr)", gap: 48, alignItems: "start", fontFamily: "'DM Sans', system-ui, sans-serif", color: textColor }}>
      <style>{css}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <h2 style={{ ...revealAt(0), margin: 0, fontSize: 40, lineHeight: 1.12, fontWeight: 600, letterSpacing: "-0.025em", textWrap: "balance" }}>
          {heading}{" "}
          <em style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontWeight: 400, fontStyle: "italic", letterSpacing: "0", color: textColor }}>{headingAccent}</em>
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {contact.map(([label, value], i) => (
            <div key={i} style={{ ...revealAt(i + 1, 150), display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontFamily: "'DM Mono', ui-monospace, monospace", fontSize: 10, letterSpacing: "0.18em", color: mutedColor }}>{label}</span>
              <span style={{ fontFamily: /^\{\{.*\}\}$/.test(value) ? "'DM Mono', ui-monospace, monospace" : "inherit", fontSize: 14, color: /^\{\{.*\}\}$/.test(value) ? mutedColor : textColor }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...revealAt(1, 100), position: "relative", background: surfaceColor, border: `1px solid ${borderColor}`, borderRadius: 18, padding: "26px 28px 28px", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", width: 460, height: 460, left: "78%", top: "108%", transform: "translate(-50%,-50%)", borderRadius: "50%", filter: "blur(80px)", background: `radial-gradient(circle, ${accentColor} 0%, transparent 66%)`, opacity: done ? 0.16 : 0.05 + step * 0.028, transition: "opacity .9s ease", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 26 }}>
            <span style={{ fontFamily: "'DM Mono', ui-monospace, monospace", fontSize: 11, letterSpacing: "0.16em", color: mutedColor, whiteSpace: "nowrap" }}>
              {done ? "DONE" : `STEP ${step + 1} OF ${N}`}
            </span>
            <div style={{ flex: 1, height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 1, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress * 100}%`, background: accentColor, borderRadius: 1, transition: reduced ? "none" : `width .6s ${PLX_CS_EASE}`, boxShadow: `0 0 10px color-mix(in oklab, ${accentColor} 50%, transparent)` }} />
            </div>
          </div>
          {done ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 190, justifyContent: "center", alignItems: "flex-start" }}>
              <span aria-hidden="true" style={{ width: 10, height: 10, borderRadius: 3, background: accentColor, boxShadow: `0 0 16px color-mix(in oklab, ${accentColor} 60%, transparent)` }} />
              <div style={{ fontSize: 20, fontWeight: 600 }}>Thanks — we&rsquo;ll reply within 24 hours.</div>
              <button className={`${cls}-back`} onClick={() => { setDone(false); setAnswers({}); setStep(0); setDisplayed(0); }}>← START OVER</button>
            </div>
          ) : (
            <div style={{ ...stepStyle, minHeight: 190, display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>{s.q}</div>
              {s.fields ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 380 }}>
                  <input className={`${cls}-input`} type="text" placeholder="{{Your name}}" aria-label="Name" />
                  <input className={`${cls}-input`} type="email" placeholder="{{you@company.com}}" aria-label="Email" />
                </div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {s.options.map((o, k) => (
                    <button key={o} className={`${cls}-pill`} data-sel={answers[displayed] === o ? "1" : "0"} onClick={() => setAnswers((a) => ({ ...a, [displayed]: o }))}
                      style={reduced ? {} : { transitionDelay: hiddenPrep ? "0ms" : undefined }}>
                      {o}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: "auto" }}>
                <button className={`${cls}-cont`} onMouseMove={magnetMove} onMouseLeave={magnetLeave} disabled={!answered}
                  onClick={() => { if (displayed === N - 1) { setDone(true); } else go(step + 1, 1); }}
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: "0.01em", color: "#0a0d07", background: answered ? accentColor : `color-mix(in oklab, ${accentColor} 35%, #3a4030)`, opacity: answered ? 1 : 0.55, border: "none", borderRadius: 999, padding: "12px 26px", cursor: answered ? "pointer" : "default", boxShadow: answered ? `0 6px 24px color-mix(in oklab, ${accentColor} 25%, transparent)` : "none" }}>
                  {displayed === N - 1 ? "Send inquiry →" : "Continue →"}
                </button>
                {step > 0 && <button className={`${cls}-back`} onClick={() => go(step - 1, -1)}>← BACK</button>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

if (typeof module !== "undefined") module.exports = { ContactStepperMotion };
// Next.js: replace the line above with:  export { ContactStepperMotion }; export default ContactStepperMotion;
