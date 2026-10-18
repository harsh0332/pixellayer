# PixelLayerr × Pixelcliq Media

Implemented October 18, 2026 in the existing Next.js checkout. The enhancement preserves the accepted homepage's section layout and expands its motion, project exploration, service detail and enquiry flow.

## Brand and research

The live Pixelcliq reference was inspected in the earlier redesign, including its hero, services, creative collections, process, FAQ and footer. Computed styles confirmed navy `#082f57` and lime `#d6f06e`. PixelLayerr shares that palette, pale surfaces, rounded actions and serif accents, while retaining its existing DM Sans and Instrument Serif fonts. Its new hero uses a pale blueprint surface and a website assembly sequence to express design and engineering.

Research informed these implementation decisions:

- [NN/g homepage guidelines](https://www.nngroup.com/articles/113-design-guidelines-homepage-usability/): explain the offering immediately, provide clear navigation and help visitors reach relevant content. Applied through a direct hero, service directory and early project showcase.
- [NN/g B2B usability](https://www.nngroup.com/articles/b2b-usability/): help prospective buyers assess services and suitability. Each service now explains fit, deliverables, process and common questions, with relevant public work where available.
- [NN/g form design](https://www.nngroup.com/articles/web-form-design/) and [required fields](https://www.nngroup.com/articles/required-fields/): preserve explicit labels, distinguish required and optional fields, and provide actionable validation. Service selection carries into the existing project brief.
- [web.dev transitions](https://web.dev/learn/css/transitions/): use transform/opacity motion and respect reduced motion preferences.
- [W3C pause, stop, hide](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html): provide controls for automatic movement. The hero, process, project ribbon and client wordmarks support pausing; reduced-motion preferences disable automatic motion.

These are design decisions informed by research, not measured conversion improvements.

## Implemented experience

- Distinct website-building hero: Structure → Design → Develop → Launch. Manual selection and keyboard navigation stop automatic progression. The miniature website is labeled as an illustrative studio concept.
- Sliding real-project showcase, animated client wordmarks, shared navigation and service menu, and entry/hover animations. Global and local pause controls, offscreen suspension and reduced-motion alternatives.
- Full portfolio with 15 existing projects, category filtering, search, empty/reset states, project-detail pages, real local screenshots and separate live-site links. No invented performance metrics.
- Ten dedicated services: websites, Shopify/e-commerce, web apps/SaaS, AI automation, AI chatbots, business systems, landing pages, redesign, conversion optimization and website care. Each has distinct copy, a relevant interactive illustration, scope, process and FAQs. Illustrations are not represented as live products or client results.
- Four-stage interactive process with concrete outputs, plus a dedicated approach page and studio/ecosystem page.
- Service finder, service-specific contact preselection, discovery-call links and an audit-request page for existing-site owners.
- Existing four-step contact form, configured webhook behavior and WhatsApp fallback retained. Without a webhook, the form explicitly offers a WhatsApp handoff. The audit form prepares a WhatsApp request for the visitor to send; it does not run a scan or silently submit an enquiry.
- Shared responsive chrome, mobile menu with focus containment, Escape handling and scroll locking. Improved mobile copy sizes and real control tap areas; miniature illustrative interfaces retain scaled typography.
- Per-page titles/descriptions/canonicals, 32-page sitemap, consistent robots origin, service structured data and updated generated social image.

## Engineering

Read the installed Next.js 16.2.10 guides for client components, images, route handlers, ImageResponse, links, async route params, metadata, static parameters, robots and sitemap. Reused installed motion dependencies and optimized local project images. No new application dependency was added.

Source organization: `components/studio/` holds shared chrome, motion, interactive sections and service illustrations; `lib/services.ts` contains service content; `lib/studio.ts` connects project content and metadata; `styles/studio.css` extends the accepted design. Existing legacy components remain available.

## Verification

- Production build and TypeScript compilation passed: 40 generated framework routes, including 10 service and 15 project detail routes. ESLint passed without warnings.
- HTTP/DOM checks passed for all 32 public content routes: HTTP 200, unique titles, matching canonical paths, one H1, unique IDs and image alt attributes.
- Checked 1,306 internal link occurrences and anchor destinations, all ten service enquiry preselection URLs, missing-page behavior, robots/sitemap origin and generated social image.
- Component interaction checks passed using an isolated temporary jsdom harness: portfolio filtering/search/reset; service finder; hero keyboard/manual/pause controls; process selection; all ten service illustrations; mobile navigation/focus restoration; audit URL validation and explicit handoff; contact preselection/validation/WhatsApp fallback; reduced-motion behavior. No test enquiry was submitted.
- `git diff --check` passed. No test dependency was added to this checkout.
- Browser automation is disabled in Work settings. Visual desktop/mobile QA, actual browser hydration behavior and rendered animation quality remain unverified. Component/HTTP checks do not substitute for browser QA.

Local preview runs at http://localhost:3001/ and is intentionally left running. No production deployment was performed. Set the existing public origin/contact environment variables for the intended production deployment.

## Follow-up audit: broken local preview

The user reported an Unofficial Studios screenshot covering the hero and other unstyled content. The audit found that the development server's linked CSS was 111,133 bytes and did not contain any `.studio-ribbon-card`, `.builder-window` or `.service-scene` rules, while the HTML already contained the new components. Browser warnings forwarded to the dev server also reported `fill` images whose parent computed position was `static`, including `unofficial-studios.webp`. This explains how a portfolio image could escape its intended frame. Earlier build/DOM/component checks did not detect the missing development stylesheet; those checks were insufficient for delivery.

Corrections:

- Import the ecosystem and studio CSS explicitly in the root layout after global CSS; remove their nested global imports. Rebuilt the development cache and restarted the preview on port 3001.
- Use intrinsic image dimensions and normal flow for the shared project imagery, so missing positioning rules cannot cause absolute images to cover the page.
- Remove Unofficial Studios from the top showcase; it remains an existing project in the full portfolio. Use explicit slugs for showcase curation.
- Replace fictional `form®` branding in the hero with PixelLayerr and replace the code snippet with understandable deliverables. Preserve the current page and hero structure.
- Add `scripts/audit-preview.mjs` to fetch the actual page-linked CSS and check the new selectors, hero identity, image containment and key page assets. It passes against both the development server and a temporary production server. Lint, production build and interaction checks also pass.

Visual sign-off remains pending: two attempts to inspect the browser returned `Local browser use is disabled in Work settings`. The user has been asked to enable that access. No screenshot-based verification or premium-design sign-off is claimed.

## Live browser audit and refinement

Browser access became available during the next run. Inspected the actual localhost homepage at desktop width and 390px mobile width: hero, sliding work, client wordmarks, portfolio cards, services, ecosystem bridge, process, testimonials, FAQ and contact. The escaped-client-image defect no longer appeared. Sampled desktop console logs contained no warnings or errors.

Verified the mobile menu, services directory → website service → contact journey, portfolio e-commerce filter (one result), Sugar Story project navigation and process-stage selection in the live browser. All ten service routes were loaded at 390px; each reported a 390px document width and a 342px illustration frame, with no document-level horizontal overflow. Visual inspection was sampled; this is not a claim that every component on every page was visually reviewed.

Issues found and fixed:

- The hero initially showed a faint wireframe. It now starts on the finished Design state, with slower 6.2-second progression and a more legible Structure state.
- Hero controls, navigation, showcase captions and footer links were too small. Increased real UI typography while preserving miniature illustration typography.
- The mobile floating pause control could cover the form. On mobile, inner pages now place a labeled pause control in the header instead.
- Contact focus logic mistook React StrictMode's effect replay for a step change and could scroll a newly opened page into the form. Focus now moves only when the step value changes. Re-tested the live service → contact navigation: scroll position remained 0 and focus stayed on BODY; the intended service was still selected.
- The duplicate animated showcase images were still lazy-loaded. They now load eagerly using the same optimized source URLs, ready for the looping strip.

The updated component harness also passes under React StrictMode, including checks that contact does not steal focus on mount and does move focus on a real step change. Final lint, production build, served-CSS checks and diff checks pass.

Browser access became unavailable again before the final desktop menu recheck and screenshot export. No saved final screenshot artifact is available. The broad visual audit above was completed while access was working; the final desktop menu recheck remains unverified. Only the local PixelLayerr checkout was changed; PixelCliq Media was used as a reference and was not modified.

## Hero and portfolio refinement — 18 October 2026

Replaced the repeating four-stage block illustration with a scroll-driven website composition. A miniature branded website, a typographic identity card, a wireframe and an enquiry-path card align as the visitor scrolls. The line sculpture rotates with the same progress. Brand / Experience / Enquiry tabs provide direct selection and keyboard navigation; manual selection suspends scroll control until the visitor selects Follow scroll. Global pause and reduced-motion preferences suspend scroll animation. Offscreen canvases skip updates. The headline and real enquiry CTA stay in normal document flow.

Kept the accepted homepage layout and palette. Rewrote the hero supporting copy around clarity, distinctiveness and the next enquiry. Its work CTA now leads directly to the new large featured-project viewer. Replaced the fast project strip with four named, manually selected projects, a readable screenshot, contextual description, case-study link and previous/next controls. There is no portfolio autoplay or duplicated strip. The complete searchable portfolio remains available below and on /work.

Research informing these decisions:
- W3C WAI, [Carousels tutorial](https://www.w3.org/WAI/tutorials/carousels/): readable content, keyboard controls, meaningful item announcements and visitor control over motion.
- web.dev, [High-performance CSS animations](https://web.dev/articles/animations-guide): transform/opacity-based movement, with no animated layout dimensions. Scroll work is coalesced into requestAnimationFrame and cleaned up on unmount.
These are usability/design decisions, not measured conversion improvements.

Created matching generated social graphics: /brand-image (1200×630, existing Open Graph/Twitter metadata) and /brand-image-square (1080×1080). Exported PNGs to artifacts/social and visually inspected both exports. Social crawlers can use the metadata after the site is deployed to its configured public origin; localhost itself is not publicly shareable.

Verification for this revision: lint, TypeScript/production build, served stylesheet regression check, and StrictMode component interaction suite pass. The suite now covers manual project selectors and previous/next wrapping, hero layer selection/keyboard focus and scroll override. Existing service, gallery, menu, contact and reduced-motion checks pass. Browser inspection of this new revision is blocked: the CUA preview tool again reports local browser use disabled. Earlier screenshots are not a visual sign-off of this revision. The local port-3001 preview remains running; nothing was published.

## Scroll-led portfolio hero — 18 October 2026

The user clarified that the earlier website's scroll choreography was essential, and that the new selector-based hero felt too plain. Inspected the public HTML/JavaScript served by https://pixellayerss.com (HTTP 200, matching original PixelLayerr title and hero) and the retained ScrollFanPortfolio / ScrollStoryPortfolio source. The reference's rendered animation could not be inspected because the browser tool reports local browser use disabled. Do not equate source inspection with watching the live site.

Replaced the concept builder with a bespoke curved portfolio sequence in the existing sky/ink/lime palette. Three real projects move along an elliptical path with depth, tilt and a brief reading hold; the focused project becomes upright. The project name, context and case-study link follow scroll progress. Desktop retains the headline and enquiry CTA alongside the sequence for a bounded 150vh scroll distance. Stacked/mobile layouts scroll the headline normally and hold only the artwork. There are no selector tabs, autoplay timers or mandatory clicks. Forward/backward scrolling controls the same reversible timeline. The former manual featured viewer is removed from the homepage; the ordinary filterable gallery follows it.

Research: [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) documents scroll-linked progression, pinning and reversible scrubbing; [MDN CSS position](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position) explains sticky containment. Used native sticky positioning and a coalesced requestAnimationFrame callback to fit the existing Lenis scroll flow, without another perpetual animation loop. No dependency added. ResizeObserver updates scene geometry. Link focus freezes progression so keyboard users don't get a changing destination. Global pause freezes the current project; reduced motion removes the long sticky track. All work remains reachable using visible skip/browse links and the regular gallery.

New source: components/studio/PortfolioHero.tsx, lib/portfolio-orbit.ts, styles/portfolio-orbit.css. The earlier concept component and CSS remain on disk but no longer render/load on the homepage.

Verification: StrictMode/jsdom checks cover timeline monotonicity and all three projects, reading holds, finite responsive geometry, centered upright focused cards, forward and reverse scroll events, synchronized links, keyboard focus freeze, pause/resume and reduced-motion fallback. Served-CSS/identity checks now enforce the three curated hero images and absence of selector tabs/Unofficial Studios. These checks are not a substitute for rendered animation QA. Browser visual review remains blocked; preview stays local on port 3001. No production website was modified.

## Corrected placement and complete portfolio — 18 October 2026

User clarification: the animated portfolio belongs below the hero and must include every existing website. Replaced PortfolioHero with a dedicated ScrollPortfolio section after the client wordmarks. It consumes all 15 ALL_PROJECTS entries, with scroll-driven transitions, synchronized project details/links, limited visible neighbors and eager loading of the nearby cards. The hero is back in normal page flow and has a separate self-playing StudioHeroScene: wireframe, designed interface, responsive phone and connected enquiry illustration. It contains no client screenshots or selection tabs. The complete 15-project searchable gallery follows the reel, with skip links available throughout. Global pause and reduced motion apply to both experiences.

Validation: production build/TypeScript and served CSS regression check passed. StrictMode interaction checks visit all 15 scroll positions and verify the corresponding project links, reverse scrolling, focus freeze, pause/resume, reduced motion and a portfolio-free hero. All 32 routes and internal links were checked. Browser access became available: inspected the desktop hero, scroll-driven portfolio and 390px mobile hero/portfolio. Corrected desktop card height after spotting a divider overlap. Mobile document width stayed 390px. Found that skip links could update the hash without leaving the scroll sequence; enabled Lenis anchor support using its installed documentation and verified the skip reaches the complete gallery and the final Ivy Estate project is reachable. No production deployment.

## One portfolio and distinct motion — 18 October 2026

Removed the duplicate homepage project gallery. The homepage now has one 15-project scroll showcase; the dedicated /work directory remains available. Replaced the circular/fanned choreography with an upright, stationary frame: the next website reveals upward, with a reading hold and at most two rendered panels during transition. Project details and links follow the scroll, with focus freeze, pause and reduced-motion behavior retained. Skip now leads to the specialty section.

Added a focused La Vallée Farms masterplan specialty section explaining plot exploration, availability and the enquiry journey, linking to the real experience and its case study. A compact Shopify service callout follows it, without duplicating the project gallery or claiming an existing project uses Shopify.

Strengthened the separate hero with a navy stage, lime typographic layer, larger heading and animated glow around the design-to-development composition. No client portfolio appears in the hero. Replaced the process's repeated visual with four distinct diagrams: discovery notes, a design canvas, connected build modules and a launch handover. Motion respects pause and reduced-motion settings, including the glow pseudo-element.

Verification: StrictMode/jsdom component checks passed, including all 15 reveal positions, synchronized links, pause/focus behavior and existing service/contact flows. Lint, served-CSS checks, 32 routes and 1,293 internal links/anchors passed. Desktop hero and the upright portfolio were visually inspected while browser access worked; a final hero spacing refinement followed that inspection. Browser access then became unavailable before specialty/process and final mobile visual QA, so those visual checks remain pending. Existing artifacts/preview screenshots show the earlier design, not this revision. Local preview remains on port 3001; nothing was deployed.

## Motion across the whole hero — 18 October 2026

The latest request was for motion throughout the hero, not just in its right-hand illustration. Added HeroMotion: a full-section composition of translucent diagonal planes, traveling drafting lines and registration marks. Headline lines enter in sequence, followed by supporting copy and the enquiry controls. A restrained underline and a four-part idea-to-launch strip complete the composition. Pointer movement shifts the artwork against the background; native scroll separates the layers without pinning the hero or interrupting reading. The accepted portfolio remains below the hero, in one place.

Motion uses event-coalesced requestAnimationFrame updates, with no continuous JavaScript render loop. Touch does not trigger pointer parallax. Global pause resets pointer/scroll offsets, and offscreen/document visibility suspends ambient animation. Reduced-motion users see the complete static headline and content. No new dependencies.

The process now has a connected progress diagram across all four stages, animated milestone nodes and staggered deliverables. Separated decorative motion permission from automatic step advancement: hovering or selecting a step stops changing the content, while its illustration continues; global pause, reduced motion and offscreen state still stop it. This fixes the previous behavior where simply hovering over the process made the whole illustration static.

Portfolio screenshots now size to the actual scene height using container-relative units, retaining the earlier viewport fallback. Added 15 progress marks and a brief caption transition. There is still only one homepage portfolio with all 15 projects, no circular rotation and no new selector requirement.

Research and rationale:
- Retrieved the public PixelCliq Media page and its referenced page JavaScript. Its source includes pointer-reactive canvas drawing and visibility-controlled animation. This was source inspection, not a rendered visual review. Used this as a reference for an animated overall atmosphere; built a different geometric composition rather than copying the canvas effect.
- [web.dev animation guidance](https://web.dev/articles/animations-guide) recommends transform/opacity animation and avoiding layout changes in animation loops. The hero's moving planes, copy and pointer response use transforms; shadows and gradients remain static.
- [W3C guidance on interaction animation](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) informed the global motion control and reduced-motion behavior.
- [MDN length reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/length) documents container-relative units used to fit portfolio previews to their available frame.

Validation: StrictMode component checks pass for whole-hero mouse/scroll offsets, touch exclusion, pause reset, process manual selection with continued illustration motion, global pause/resume, all 15 portfolio projects and the existing service/contact interactions. Served stylesheet checks include the new choreography rules. Browser inspection remains unavailable: the browser tool returned local browser use disabled, so no new desktop/mobile screenshot or visual sign-off is claimed. Previous screenshot artifacts are stale for this revision.

## Compact landscape hero and clickable screenshots — 18 October 2026

User reported that the hero was oversized and awkward on laptops. Found a concrete placement error: HeroJourney had been inserted inside the two-column hero layout before StudioHeroScene, creating a third grid child and an extra row. Removed both the journey strip and side illustration from the homepage. Replaced the fragmented composition with one full-width contour landscape inspired by the masterplan's spatial language, surrounding centered headline/copy/CTAs. One contour group drifts together and a signal follows its curve; pointer and scroll influence the overall background. The hero has a single content group, a 610px minimum height on short laptop screens, responsive type, and no client screenshot or extra scene below the headline. Removed the superseded hero rules from studio-choreography.css rather than adding another competing layout.

Every one of the 15 portfolio screenshots now links to its actual project URL in a new tab with noopener/noreferrer. The separate Explore project link still opens the local case study. Only the active card is keyboard reachable; inactive cards are inert. Focusing the live screenshot link freezes scroll progression just like the existing case-study link, avoiding destination changes while focused. Added a visible Visit website label and an accessible new-tab announcement.

Validation: production build, TypeScript, lint and diff checks passed. Component checks visit all 15 projects, verify matching external URLs and new-tab targets, active-card accessibility, focus freeze and pause/resume. A served-HTML check confirms exactly one hero layout child, one landscape, no side mockup or journey strip, and separate live/case-study links. Served-CSS checks passed. Browser inspection remains blocked by local browser access, so laptop/mobile visual sign-off is still pending. No production deployment.

## Medium slate palette and connected frame — 18 October 2026

User rejected the pale palette and contour motion. Replaced the hero background with medium slate-blue (#405b6d base; #506b7b central highlight), warm white type and a pale-lime CTA. Removed the contour SVG and its animation rules. The new full-width artwork is a single continuous raised frame: shaded body, fine edge and a traveling light segment. It draws in on entry, then the light follows the connected route; pointer/scroll response remains restrained. The central reading area is clear, and the compact single-content-group hero is preserved.

Mobile uses its own narrower U-shaped route and thinner strokes, rather than cropping the desktop path. Larger mobile supporting copy, eyebrow and footnote improve readability. Pause, offscreen/document visibility and reduced-motion controls apply to the replacement animation. Live portfolio screenshot links and case-study links are unchanged.

Research: reviewed [Codrops connected-grid explorations](https://tympanus.net/codrops/2023/08/30/connected-grid-layout-animation/) for continuity between elements and its [dimensional-ribbon discussion](https://tympanus.net/codrops/2021/11/29/animated-3d-ribbons-with-three-js/) for a coherent sculptural form. These informed the direction, not a copied implementation; the result uses a small SVG with CSS instead of adding WebGL. Retained the performance and motion-control principles from [web.dev](https://web.dev/articles/animations-guide) and [W3C](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). The references were read as documents; no rendered demo review is claimed.

Verification: build/TypeScript, lint, component interaction tests and served stylesheet checks pass. Calculated solid-color contrast against the lightest hero background: main type 5.16:1, body copy 4.72:1, footnote 4.53:1, large accent heading 4.47:1, CTA text 8.97:1. These are token-level checks, not a rendered-page accessibility audit. Browser access is still disabled, so desktop/mobile visual QA and a new screenshot remain unavailable. The local preview remains running on port 3001; no production changes.

## Return to the existing brand palette — 18 October 2026

The user rejected the slate palette and raised frame as disconnected from the rest of the site. Removed both, including their component and CSS animation rules. The hero now uses a richer version of the existing sky-blue palette (#7faee1 / #9cc4eb / #76a6db), the shared navy #082f57 for headline and CTA, and the original lime #d6f06e for the CTA arrow. Warm-white headline styling and metallic grey/green gradients are removed.

Replaced the frame with three broad page-like blue surfaces, derived from the studio's existing layers motif. The surfaces share one entrance and slow depth movement; the entire background responds gently to pointer/scroll. There are no contour lines, outlined pipes, separate side mockups or new content rows. Mobile disables pointer displacement while retaining the shared layer movement; pause/reduced-motion behavior remains intact. The centered compact hero, process and clickable 15-project showcase remain.

Browser access was attempted again and remains disabled. No visual sign-off or fresh screenshot is claimed for this revision. Validation uses the build, lint, served-CSS regression checks and existing component interaction suite.

## Custom sculptural hero — 18 October 2026

User requested a more distinctive, global-studio-quality first impression after rejecting the prior decorative backdrops. Rebuilt the hero composition around the headline “Distinct by design. Built to perform.”, a full-width original three-ribbon sculpture, and a concise supporting statement with enquiry and work CTAs. The existing blue/ink/lime identity and single portfolio section remain. On short laptops the artwork is 190px high and headline size is capped at 68px; mobile stacks copy and actions below a 170px artwork stage. These dimensions are implementation choices pending visual QA, not measured browser outcomes.

Implemented native WebGL geometry and lighting without adding a 3D dependency. Three tapered, twisted ribbons share a mesh and one draw call, with smooth lighting, an accent edge, slow rotation and pointer response across the hero. Device pixel ratio is capped at 1.5 (1.25 on mobile), with 60fps/30fps scheduling ceilings. Offscreen/document-hidden state, global pause and reduced motion stop the loop. Resources are disposed on unmount; context loss restores a static fallback and restoration rebuilds the renderer. These are safeguards, not a benchmark or claim of guaranteed frame rates.

The fallback is generated offline from the same geometry by scripts/generate-hero-sculpture.mjs and served as public/brand/hero-sculpture.webp. Inspected this standalone artwork using image tools. It is not a browser screenshot. The generated fallback is visible without WebGL or before the renderer becomes ready; no portfolio screenshot is used in the hero.

Research: read [Lusion's studio positioning](https://lusion.co/) around design, motion, 3D and interactive experiences, and [MDN WebGL best practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices) for buffer sizing, resource cleanup and context failure. Active Theory exposed only a JavaScript-required response; no rendered inspection of its site is claimed. Original geometry and shaders were written for PixelLayerr. No conversion uplift is claimed.

Validation: geometry checks cover finite vertices and unit normals; mocked renderer tests cover no-WebGL fallback, pause/resume, context loss/restore and cleanup. Existing 15-project links, focus stability, services, process and contact tests pass. Production build/TypeScript and served-CSS checks pass. Browser access remains disabled, so actual GLSL execution, GPU performance, mobile/laptop appearance and final screenshot verification are pending. No production deployment.

## Approved Resolution hero integration — 18 October 2026

Replaced the homepage sculpture with the user's approved `pixellayerr-hero.zip` concept: editorial typography, four blue pixel arcs, lime CTA detail and a pointer-driven resolution lens. The rest of the homepage, single 15-project scroll portfolio and existing navigation remain intact.

The white ground now uses a blue-tinted atmospheric background and a faint drafting grid. The lens crossfades between coarse, 2× and 4× detail with frame-rate-independent easing. Touch devices receive a single short detail pass; the normal cursor remains. The existing site motion control governs the renderer. Reduced motion disables the lens, entrance and scroll effects. A CSS vector fallback remains without canvas/JS. CTA links target the existing contact form and work section. The primary button's stepped fill keeps matching text/background contrast during the transition.

Implementation: `components/studio/ResolutionHero.tsx`, scoped `styles/resolution-hero.css`, and lifecycle-managed `lib/resolution-hero.js`. Reuses the site's fonts and navigation; no prototype global scripts, duplicate header, placeholder sections or new packages. All listeners/observers/RAF callbacks clean up on unmount. Entrance is one-shot, including after pausing/resuming.

Validation: production build/TypeScript, ESLint, served CSS/CTA/portfolio route audit, and deterministic mock-canvas tests for valid geometry, DPR caps, pause/resume, reduced motion, off-screen/hidden suspension, cleanup and no-canvas fallback. Browser automation continues to return “Local browser use is disabled in Work settings”; these checks do not establish visual correctness, real GPU/frame performance or mobile rendering. The integrated site is served at localhost:3001. No production-domain deployment was performed.

### Resolution motion refinement

Kept the approved layout/palette and enhanced the canvas choreography: pixel tiles assemble with bounded depth, a three-second radial resolution wave runs every fourteen seconds, cursor detail gains a soft nine-pixel maximum lift, and the lime marker follows its surface. Touch depth is reduced to 55%. The serif headline accent has a one-time ink sweep synchronized with the entrance. Removed the earlier separate mobile loupe demo and the blinking lime entrance, so there is one coherent sequence.

Validated wave/rest timing, finite draw coordinates, drawing-call budget and the existing pause/reduced-motion/visibility/cleanup cases with the mock renderer. Inspected standalone canvas artwork frames by recording draw calls into SVG and rasterizing; this is artwork inspection, not a screenshot or visual verification of the webpage. Live browser inspection remains unavailable.
