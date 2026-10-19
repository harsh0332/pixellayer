"use client";

import { useEffect, useRef } from "react";
import { mountResolutionHero } from "@/lib/resolution-hero";
import { MotionToggle, useStudioMotion } from "./StudioMotion";

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d={down ? "M9 3v12M4 10l5 5 5-5" : "M3 9h11M9.5 4.5 14 9l-4.5 4.5"} />
    </svg>
  );
}

/** The approved hero, isolated from the existing portfolio and page layouts. */
export function ResolutionHero() {
  const root = useRef<HTMLElement>(null);
  const renderer = useRef<ReturnType<typeof mountResolutionHero> | null>(null);
  const { paused, reduced } = useStudioMotion();

  useEffect(() => {
    const hero = root.current;
    if (!hero) return;
    // Read the preference synchronously to avoid one animated frame before context updates.
    renderer.current = mountResolutionHero(hero, {
      paused: false,
      reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    hero.dataset.ready = "true";
    return () => {
      renderer.current?.destroy();
      renderer.current = null;
      delete hero.dataset.ready;
    };
  }, []);

  useEffect(() => {
    renderer.current?.setMotion({ paused, reduced });
  }, [paused, reduced]);

  return (
    <section ref={root} id="hero" className="pl-root pl-hero" data-motion={!paused && !reduced} aria-labelledby="resolution-title">
      <div className="pl-atmosphere" aria-hidden="true" />
      <div className="pl-drafting-grid" aria-hidden="true" />
      <div className="pl-art" aria-hidden="true"><canvas /></div>
      <div className="pl-wrap pl-hero__wrap">
        <div className="pl-hero__content">
          <div data-pl-avoid>
            <a className="pl-eyebrow pl-in" href="https://pixelcliqmedia.com" target="_blank" rel="noopener noreferrer">
              <span className="pl-eyebrow__px" aria-hidden="true" />A PixelCliq Media studio
            </a>
          </div>
          <h1 className="pl-title" id="resolution-title">
            <span className="pl-line" data-pl-avoid><span className="pl-line__in">Distinct by <em>design.</em></span></span>
            <span className="pl-line" data-pl-avoid><span className="pl-line__in">Built to perform<span className="pl-pixel" aria-hidden="true" /><span className="pl-sr">.</span></span></span>
          </h1>
          <div className="pl-lede-box" data-pl-avoid>
            <p className="pl-lede pl-in">Distinctive websites, thoughtful storefronts and useful digital products. Designed around your brand—and your customer’s next step.</p>
          </div>
          <div className="pl-actions" data-pl-avoid>
            <a className="pl-cta" href="#contact">
              <span className="pl-cta__label">Discuss your project<span className="pl-cta-fill" aria-hidden="true">Discuss your project</span></span>
              <span className="pl-cta__px"><Arrow /></span>
            </a>
            <a className="pl-link" href="#work"><span className="pl-link__text">Explore our work</span><Arrow down /></a>
          </div>
          <div className="pl-footer" data-pl-avoid>
            <p className="pl-cap">Strategy, design &amp; development. One studio.</p>
            <span className="pl-location">BASED IN INDIA. BUILT FOR EVERYWHERE.</span>
          </div>
        </div>
      </div>
      <div className="pl-motion-control"><MotionToggle /></div>
    </section>
  );
}
