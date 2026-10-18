"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useStudioMotion } from "./StudioMotion";

const LAYERS = [
  { name: "Brand", title: "Make the first impression count.", text: "A distinctive visual language, built around your business." },
  { name: "Experience", title: "Turn attention into understanding.", text: "Clear content and purposeful interactions on every screen." },
  { name: "Enquiry", title: "Give interest somewhere to go.", text: "A clear next step, from the first visit to the first conversation." },
];

export function WebsiteBuilder() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const { paused, reduced } = useStudioMotion();
  const id = useId();

  useEffect(() => {
    const element = root.current;
    if (!element || manual || paused || reduced) return;
    let frame = 0;
    let lastProgress = -1;
    const update = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      // Mobile begins when the canvas enters view; desktop begins at page top.
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const start = Math.min(window.innerHeight * 0.62, 260);
      const progress = Math.max(0, Math.min(1, (start - rect.top) / (rect.height * 0.65)));
      if (progress === lastProgress) return;
      lastProgress = progress;
      element.style.setProperty("--assembly", String(progress));
      setActive(progress < 0.32 ? 0 : progress < 0.7 ? 1 : 2);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [manual, paused, reduced]);

  const choose = (index: number) => {
    setManual(true);
    setActive(index);
    root.current?.style.setProperty("--assembly", String(index / 2));
  };

  return (
    <div className="layer-lab" ref={root} data-layer={active} data-static={paused || reduced}>
      <div className="layer-lab-heading"><span><i /> THE ART OF A BETTER WEBSITE</span><span>{paused || reduced ? "EXPLORE THE LAYERS" : "SCROLL TO ASSEMBLE ↓"}</span></div>
      <div className="layer-scene" aria-hidden="true">
        <div className="layer-orbit"><span>EVERY LAYER HAS A PURPOSE</span></div>
        <div className="layer-blueprint"><div /><div /><div /><span>STRATEGY / STRUCTURE / FLOW</span></div>
        <div className="layer-website">
          <div className="layer-chrome"><span>● ● ●</span><span>YOUR NEXT CHAPTER</span><span>↗</span></div>
          <div className="layer-site-nav"><b>your brand<span>®</span></b><span>Discover &nbsp; Our story &nbsp; <b>Let’s talk ↗</b></span></div>
          <div className="layer-site-hero">
            <div className="layer-site-copy"><small>BUILT TO BE REMEMBERED</small><p>Anything<br />but <em>ordinary.</em></p><span className="layer-demo-button">Find your next chapter <b>↗</b></span></div>
            <div className="layer-sculpture"><svg viewBox="0 0 240 260" fill="none"><g stroke="currentColor" strokeWidth="1.2">{Array.from({ length: 18 }, (_, i) => <ellipse key={i} cx="120" cy="130" rx={34 + i * 3.8} ry="105" transform={`rotate(${i * 10} 120 130)`} />)}</g></svg><span>Ideas, with dimension.</span></div>
          </div>
          <div className="layer-site-proof"><span>01 <b>A clear story</b></span><span>02 <b>A considered experience</b></span><span>03 <b>A next step</b></span></div>
          <div className="layer-site-bottom"><strong>A little curiosity.<br />A bigger possibility.</strong><span>Thoughtfully designed.<br />Beautifully connected. ↗</span></div>
        </div>
        <div className="layer-type-card"><small>01 / VISUAL LANGUAGE</small><span>Aa<span>↗</span></span><div><i /><i /><i /><i /></div></div>
        <div className="layer-flow-card"><span className="layer-flow-icon">↗</span><div><small>03 / THE NEXT STEP</small><strong>Visitor → Conversation</strong></div><span className="layer-flow-check">✓</span></div>
        <div className="layer-note"><i /> A website that feels like you.</div>
      </div>
      <div className="layer-tabs" role="tablist" aria-label="Explore the website layers">
        {LAYERS.map((layer, index) => <button key={layer.name} id={`${id}-tab-${index}`} role="tab" aria-selected={active === index} aria-controls={`${id}-panel`} tabIndex={active === index ? 0 : -1} type="button" onClick={() => choose(index)} onKeyDown={(event) => {
          const next = event.key === "ArrowRight" ? (index + 1) % 3 : event.key === "ArrowLeft" ? (index + 2) % 3 : event.key === "Home" ? 0 : event.key === "End" ? 2 : -1;
          if (next < 0) return;
          event.preventDefault(); choose(next); document.getElementById(`${id}-tab-${next}`)?.focus();
        }}><span>0{index + 1}</span>{layer.name}<span aria-hidden="true">↗</span></button>)}
      </div>
      <div className="layer-explanation" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`}><strong>{LAYERS[active].title}</strong><p>{LAYERS[active].text}</p></div>
      <div className="layer-lab-footer"><span>INTERACTIVE STUDIO CONCEPT</span>{manual && !reduced && !paused ? <button type="button" onClick={() => setManual(false)}>Follow scroll ↓</button> : <span>{paused || reduced ? "SELECT A LAYER TO EXPLORE" : "SCROLL OR SELECT A LAYER"}</span>}</div>
    </div>
  );
}
