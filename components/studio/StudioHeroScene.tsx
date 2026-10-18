"use client";

import { useSequence } from "./StudioMotion";

const BEATS = [
  { label: "A thoughtful foundation", detail: "The story, the structure, the reason to stay." },
  { label: "A distinctive experience", detail: "Type, interaction and a visual language of your own." },
  { label: "Everything, connected", detail: "From the first impression to the next conversation." },
];

/** A self-playing design-to-development illustration, never client portfolio content. */
export function StudioHeroScene() {
  const { active, playing, ref } = useSequence(3, 4600, 1);
  return (
    <div className="studio-craft-scene studio-loop" ref={ref} data-beat={active} data-playing={playing}>
      <div className="craft-eyebrow"><span><i /> DESIGNED WITH INTENT</span><span>BUILT LAYER BY LAYER</span></div>
      <div className="craft-stage" aria-hidden="true">
        <div className="craft-aura" /><div className="craft-stage-title">Ideas into<br /><em>experiences.</em></div>
        <div className="craft-grid"><i /><i /><i /><span>01 — THE FOUNDATION</span></div>
        <svg className="craft-connections" viewBox="0 0 600 460" fill="none"><path d="M60 100H150Q170 100 170 120V330Q170 350 190 350H460Q490 350 490 380V410" /><path className="craft-signal" d="M60 100H150Q170 100 170 120V330Q170 350 190 350H460Q490 350 490 380V410" /></svg>
        <div className="craft-browser">
          <div className="craft-browser-bar"><span>● ● ●</span><span>AN IDEA, BROUGHT TO LIFE</span><span>↗</span></div>
          <div className="craft-canvas">
            <div className="craft-site-nav"><b>your next.</b><span>Discover &nbsp; Our story &nbsp; Let’s talk ↗</span></div>
            <div className="craft-site-main"><div><small>THINK BIG. MAKE IT REAL.</small><p>A little<br />different.<br /><em>A lot more you.</em></p><span className="craft-demo-cta">Explore the possibilities ↗</span></div><div className="craft-ribbon"><svg viewBox="0 0 180 240" fill="none">{Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${12 + i * 4} 230C${-25 + i * 6} 115 ${185 - i * 4} 200 ${152 - i * 3} 80C${140 - i * 4} 20 ${25 + i * 5} 75 ${35 + i * 6} 5`} />)}</svg><span>MAKE YOUR MARK.</span></div></div>
            <div className="craft-site-foot"><span>STRATEGY ↗</span><span>DESIGN ↗</span><span>DEVELOPMENT ↗</span></div>
            <div className="craft-wireframe"><i /><i /><i /></div>
          </div>
        </div>
        <div className="craft-type"><small>VISUAL LANGUAGE</small><span>Aa<em>↗</em></span><div><i /><i /><i /></div></div>
        <div className="craft-responsive"><span /><b>your next.</b><p>A little<br /><em>different.</em></p><div className="craft-phone-art" /><small>Explore ↗</small></div>
        <div className="craft-ready"><i>✓</i><span><small>THOUGHTFULLY CONNECTED</small><b>Ready for your next chapter.</b></span></div>
        <span className="craft-cursor">↖ <b>Make it yours.</b></span>
      </div>
      <div className="craft-caption"><span>0{active + 1} / 03</span><div><strong>{BEATS[active].label}</strong><p>{BEATS[active].detail}</p></div><div className="craft-beats" aria-hidden="true">{BEATS.map((beat, i) => <i key={beat.label} data-active={active === i} />)}</div></div>
      <span className="craft-disclaimer">A PIXELLAYERR DESIGN & DEVELOPMENT CONCEPT</span>
    </div>
  );
}
