const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const root = document.documentElement;
if (!reduced) root.classList.add('motion-enhanced');
const hero = document.querySelector('.hero');
const workspace = document.getElementById('workspace');
const cursorField = document.querySelector('.cursor-glow');

// Shared motion engine. All interaction uses the same critically damped response.
const field = { px: innerWidth / 2, py: innerHeight / 2, x: 0, y: 0, tx: 0, ty: 0, lx: 0, ly: 0, depth: 0, scroll: scrollY, velocity: 0, lastInput: 0, frame: 0, heroVisible: true };
function wake() { if (!reduced && !field.frame && field.heroVisible) field.frame = requestAnimationFrame(render); }
function render(now) {
  field.x += (field.tx - field.x) * .034;
  field.y += (field.ty - field.y) * .034;
  field.lx += (field.px - field.lx) * .055;
  field.ly += (field.py - field.ly) * .055;
  const lightX = 50 - field.x * 2.2;
  const lightY = 48 + field.y * 2;
  root.style.setProperty('--ambient-x', `${lightX}%`);
  root.style.setProperty('--ambient-y', `${lightY}%`);
  root.style.setProperty('--scroll-velocity', Math.min(Math.abs(field.velocity) / 80, 1).toFixed(3));
  root.style.setProperty('--camera-depth', field.depth.toFixed(3));
  if (workspace) {
    workspace.style.transform = `translateZ(${field.depth * 110}px) scale(${1 + field.depth * .018}) rotateX(${field.y}deg) rotateY(${field.x}deg)`;
    workspace.style.setProperty('--light-x', `${lightX}%`);
    workspace.style.setProperty('--light-y', `${lightY}%`);
    workspace.style.setProperty('--spec-x', `${-field.x * 3.4}px`);
    workspace.style.setProperty('--spec-y', `${field.y * 2.6}px`);
    workspace.style.setProperty('--spec-x-slow', `${-field.x}px`);
    workspace.style.setProperty('--spec-y-slow', `${field.y * .8}px`);
  }
  if (cursorField) { cursorField.style.left = `${field.lx}px`; cursorField.style.top = `${field.ly}px`; }
  field.velocity *= .88;
  const settling = Math.abs(field.tx - field.x) + Math.abs(field.ty - field.y) > .008 || Math.abs(field.velocity) > .05;
  if (settling || now - field.lastInput < 680) field.frame = requestAnimationFrame(render); else field.frame = 0;
}
function heroCoordinates(event) {
  if (!hero || !workspace) return false;
  const area = hero.getBoundingClientRect();
  if (event.clientX < area.left || event.clientX > area.right || event.clientY < area.top || event.clientY > area.bottom) return false;
  const box = workspace.getBoundingClientRect();
  field.tx = ((event.clientX - box.left) / box.width - .5) * 3.6;
  field.ty = ((event.clientY - box.top) / box.height - .5) * -3;
  return true;
}
window.addEventListener('pointermove', (event) => {
  field.px = event.clientX; field.py = event.clientY; field.lastInput = performance.now();
  if (cursorField) cursorField.classList.add('active');
  if (!finePointer || !heroCoordinates(event)) { field.tx = 0; field.ty = 0; }
  wake();
}, { passive: true });
document.addEventListener('pointerleave', () => { field.tx = 0; field.ty = 0; if (cursorField) cursorField.classList.remove('active'); wake(); });

let scrollQueued = false;
window.addEventListener('scroll', () => {
  if (scrollQueued || reduced) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    const previous = field.scroll; field.scroll = scrollY; field.velocity = field.scroll - previous;
    if (hero) field.depth = Math.min(Math.max(-hero.getBoundingClientRect().top / hero.offsetHeight, 0), 1);
    root.style.setProperty('--environment-y', `${Math.min(field.scroll * -.015, 0)}px`);
    updatePortfolioTheatre();
    updateProcessProtocol();
    scrollQueued = false; wake();
  });
}, { passive: true });

// Directional navigation indicator: glides between links instead of flashing on hover.
const nav = document.querySelector('.nav nav');
if (nav) {
  const indicator = nav.querySelector('.nav-indicator');
  const positionIndicator = (link) => {
    const navBox = nav.getBoundingClientRect(); const box = link.getBoundingClientRect();
    nav.style.setProperty('--indicator-x', `${box.left - navBox.left}px`);
    nav.style.setProperty('--indicator-w', `${box.width}px`);
    indicator?.classList.add('is-visible');
  };
  nav.querySelectorAll('a').forEach((link, index) => {
    link.addEventListener('pointerenter', () => positionIndicator(link));
    if (index === 0) positionIndicator(link);
  });
  nav.addEventListener('pointerleave', () => { const first = nav.querySelector('a'); if (first) positionIndicator(first); });
}

// Tactile controls share slow easing and compression, no bounce or direct cursor following.
document.querySelectorAll('.magnetic').forEach((el) => {
  el.addEventListener('pointermove', (event) => {
    if (reduced || !finePointer) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate3d(${(event.clientX - r.left - r.width / 2) * .045}px,${(event.clientY - r.top - r.height / 2) * .052}px,0)`;
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  el.addEventListener('pointerdown', () => { el.classList.add('is-pressed'); });
  el.addEventListener('pointerup', () => { el.classList.remove('is-pressed'); });
});

// Cards acknowledge proximity before hover and settle from depth once they enter view.
const depthCards = [...document.querySelectorAll('.service-row,.project-card')];
depthCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (reduced || !finePointer) return;
    const r = card.getBoundingClientRect(); const nx = (event.clientX - r.left) / r.width - .5; const ny = (event.clientY - r.top) / r.height - .5;
    card.style.setProperty('--tilt-x', `${ny * -3.4}deg`); card.style.setProperty('--tilt-y', `${nx * 3.4}deg`);
    card.style.setProperty('--card-light-x', `${(nx + .5) * 100}%`); card.style.setProperty('--card-light-y', `${(ny + .5) * 100}%`);
    if (card.classList.contains('project-card')) { card.style.setProperty('--visual-x', `${nx * 5}px`); card.style.setProperty('--visual-y', `${ny * 4}px`); }
  });
  card.addEventListener('pointerleave', () => { card.style.removeProperty('--tilt-x'); card.style.removeProperty('--tilt-y'); });
});
if (!reduced && 'IntersectionObserver' in window) {
  new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-settled'); }
  }), { threshold: .14 }).observe(document.querySelector('.work-section'));
}

// Optical mask reveal: headline lines resolve through focus and clipping, never opacity.
if (!reduced && hero && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    hero.classList.add('is-optically-ready'); observer.disconnect();
  }, { threshold: .32 }).observe(hero);
}

// The process is a scroll-controlled delivery protocol—not a self-playing decoration.
const process = document.querySelector('.process');
const processPulse = process?.querySelector('.pulse');
const processSteps = process ? [...process.querySelectorAll('.step')] : [];
const readout = process?.querySelector('[data-readout]');
const readoutDetail = process?.querySelector('[data-readout-detail]');
const protocol = [
  ['System mapping', 'Inputs being aligned'],
  ['Interface assembly', 'Decisions resolving into a product system'],
  ['Delivery sequence', 'The build is ready to move']
];
function updateProcessProtocol() {
  if (!process || reduced) return;
  const box = process.getBoundingClientRect();
  const progress = Math.min(Math.max((innerHeight * .78 - box.top) / (box.height * .9), 0), 1);
  const active = box.bottom > innerHeight * .18 && box.top < innerHeight * .82;
  process.classList.toggle('is-active', active);
  if (processPulse) processPulse.style.offsetDistance = `${progress * 100}%`;
  const stage = progress < .34 ? 0 : progress < .7 ? 1 : 2;
  processSteps.forEach((step, index) => { step.classList.toggle('is-complete', index < stage); step.classList.toggle('is-current', index === stage); });
  if (readout) readout.textContent = protocol[stage][0];
  if (readoutDetail) readoutDetail.textContent = protocol[stage][1];
}

// Case studies begin as a compressed system, then open as the visitor moves through the work.
const workSection = document.querySelector('.work-section');
const projectCards = [...document.querySelectorAll('.project-card')];
let caseMode = false;
function syncCaseMode() {
  caseMode = innerWidth > 800 && !reduced;
  workSection?.classList.toggle('case-mode', caseMode);
  if (!caseMode) projectCards.forEach((card) => { card.style.removeProperty('--case-x'); card.style.removeProperty('--case-y'); card.style.removeProperty('--case-r'); card.style.removeProperty('--case-z'); });
  updatePortfolioTheatre();
}
function updatePortfolioTheatre() {
  if (!caseMode || !workSection) return;
  const box = workSection.getBoundingClientRect();
  const progress = Math.min(Math.max((-box.top + innerHeight * .22) / Math.max(workSection.offsetHeight - innerHeight * .62, 1), 0), 1);
  const mid = (projectCards.length - 1) / 2;
  projectCards.forEach((card, index) => {
    const local = Math.min(Math.max((progress - index * .075) / .48, 0), 1);
    const eased = 1 - Math.pow(1 - local, 3);
    const distance = (index - mid) * 177 * eased;
    const arc = (Math.abs(index - mid) * 13 - 19) * eased;
    const rotation = (index - mid) * 3.1 * eased;
    card.style.setProperty('--case-x', `${distance}px`);
    card.style.setProperty('--case-y', `${arc}px`);
    card.style.setProperty('--case-r', `${rotation}deg`);
    card.style.setProperty('--case-z', `${Math.round((1 - Math.abs(index - mid) / 4) * 15)}px`);
  });
}
addEventListener('resize', syncCaseMode, { passive: true });
syncCaseMode(); updateProcessProtocol();

const rail = document.getElementById('projectRail');
if (rail) {
  let down = false, startX = 0, startScroll = 0, momentum = 0, railFrame = 0;
  const coast = () => { momentum *= .91; rail.scrollLeft -= momentum; if (Math.abs(momentum) > .25) railFrame = requestAnimationFrame(coast); else railFrame = 0; };
  rail.addEventListener('pointerdown', (event) => { if (caseMode) return; down = true; startX = event.pageX; startScroll = rail.scrollLeft; momentum = 0; rail.setPointerCapture(event.pointerId); });
  rail.addEventListener('pointermove', (event) => { if (!down || caseMode) return; const delta = event.pageX - startX; momentum = delta - (startScroll - rail.scrollLeft); rail.scrollLeft = startScroll - delta; });
  rail.addEventListener('pointerup', () => { down = false; if (!reduced && !railFrame) railFrame = requestAnimationFrame(coast); });
  rail.addEventListener('pointercancel', () => { down = false; });
}

if (hero && 'IntersectionObserver' in window) new IntersectionObserver(([entry]) => { field.heroVisible = entry.isIntersecting; if (!entry.isIntersecting && field.frame) { cancelAnimationFrame(field.frame); field.frame = 0; } }, { threshold: .03 }).observe(hero);
