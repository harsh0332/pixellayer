/** Regression check for the served preview, including its actual CSS bundle.
 * This does not replace a visual browser audit.
 * Usage: node scripts/audit-preview.mjs [http://localhost:3001]
 */
import assert from 'node:assert/strict';
const origin = process.argv[2] ?? 'http://localhost:3001';
async function read(path) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, `${path} must load`);
  return response.text();
}
const html = await read('/');
const sheets = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)]
  .map(([tag]) => tag.match(/href="([^"]+)"/)?.[1])
  .filter(Boolean);
assert.ok(sheets.length, 'The page must link stylesheets');
const css = (await Promise.all(sheets.map(read))).join('\n');
for (const selector of [
  '.eco-hero-layout', '.studio-enhanced', '.portfolio-reel-card',
  '.studio-craft-scene', '.studio-logo-track', '.studio-process-panel',
  '.studio-mega', '.service-scene', '.studio-footer-grid',
  '.pl-atmosphere', '.pl-title', '.process-journey', '.portfolio-chapters',
]) {
  assert.ok(css.includes(selector), `Missing served stylesheet rule: ${selector}`);
}
const homeHero = html.match(/<section\b[^>]*id="hero"[\s\S]*?<\/section>/)?.[0];
assert.ok(homeHero, 'Homepage must have its own hero');
assert.ok(!homeHero.includes('unofficial-studios'), 'Unrelated screenshots must stay out of hero');
assert.ok(!homeHero.includes('form®'), 'Hero must not use unrelated concept branding');
assert.ok(!homeHero.includes('role="tab"'), 'Hero discovery must not require choosing tabs');
assert.match(homeHero, /pl-hero/, 'Hero uses the approved Resolution design');
assert.match(homeHero, /<canvas/, 'Hero includes the live pixel renderer');
assert.match(homeHero, /pl-atmosphere/, 'Hero includes the integrated blue background');
assert.match(homeHero, /href="#contact"/, 'Primary CTA reaches the existing enquiry form');
assert.match(homeHero, /href="#work"/, 'Secondary CTA reaches the single portfolio');
assert.ok(!homeHero.includes('hero-sculpture'), 'Rejected sculpture must not return');
assert.match(html, /id="contact"/, 'The enquiry target exists');
assert.equal((html.match(/<h1\b/g) || []).length, 1, 'Homepage has one headline');
assert.ok(!homeHero.includes('hero-brand-layers'), 'Rejected flat backdrop must not return');
assert.ok(!homeHero.includes('hero-frame-'), 'Rejected raised frame must not return');
assert.ok(!homeHero.includes('hero-contours'), 'Rejected contour animation must not return');
assert.ok(!homeHero.includes('studio-craft-scene'), 'Do not restore the oversized side illustration');
assert.ok(!homeHero.includes('hero-journey'), 'Do not insert a third item into the hero layout');
assert.ok(!homeHero.includes('/work/'), 'Portfolio screenshots must not appear in the hero');
const reel = html.match(/<section\b[^>]*id="work"[\s\S]*?<\/section>/)?.[0];
assert.ok(reel, 'A separate portfolio scroll section must render');
assert.ok(html.indexOf(reel) > html.indexOf(homeHero) + homeHero.length, 'Portfolio must be below the hero');
const projects = [...reel.matchAll(/data-project="([^"]+)"/g)].map(match => match[1]);
assert.equal(projects.length, 15, 'Every portfolio website must join the scroll sequence');
assert.equal(new Set(projects).size, 15, 'Each project appears once');
const liveLinks = [...reel.matchAll(/<a\b[^>]*class="portfolio-live-link"[^>]*>/g)];
assert.equal(liveLinks.length, 15, 'Every screenshot must link to its live website');
for (const [tag] of liveLinks) {
  assert.match(tag, /target="_blank"/, 'Live sites open in a new tab');
  assert.match(tag, /rel="noopener noreferrer"/, 'Live site tabs must isolate their opener');
}
for (const [tag] of reel.matchAll(/<img\b[^>]*>/g)) {
  assert.ok(!tag.includes('position:absolute'), 'Images must stay inside their cards');
  assert.match(tag, /width="1440"/, 'Portfolio images need intrinsic dimensions');
}
assert.ok(!html.includes('id="work-gallery"'), 'Homepage must not duplicate the full portfolio');
assert.match(html, /id="specialty"/, 'Specialty section follows the single portfolio');
assert.ok(!reel.includes('portfolio-reel-path'), 'Circular portfolio paths must not return');
assert.match(html, /process-demo/, 'Process must render stage-specific illustrations');
assert.ok(!html.includes('class="work-inspector"'), 'Do not restore the click-dependent selector');
for (const route of ['/services/websites', '/work/la-vallee-farms', '/contact']) {
  const page = await read(route);
  assert.match(page, /studio-enhanced/, `${route} must use the studio layout`);
  const linkedCss = [...page.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)]
    .map(([tag]) => tag.match(/href="([^"]+)"/)?.[1]).filter(Boolean);
  const content = (await Promise.all(linkedCss.map(read))).join('\n');
  assert.ok(content.includes('.studio-enhanced'), `${route} must load studio styles`);
}
console.log(`PASS: served CSS, hero identity, image containment and key page assets at ${origin}`);
console.log('Visual browser verification is separate.');
