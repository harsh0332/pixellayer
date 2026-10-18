/** Deterministic renderer lifecycle tests using a mock canvas/DOM, not visual QA. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../lib/resolution-hero.js', import.meta.url), 'utf8').replace('export function', 'function');
function setup({width = 1366, height = 688, reduced = false, canvasAvailable = true, fine = true} = {}) {
  const listeners = new Map();
  const queue = new Map();
  const observers = [];
  let now = 0, id = 0, draws = 0, live = false, highlights = 0, operations = 0, maxOperations = 0;
  function target(name) {
    return {
      addEventListener(event, fn) { listeners.set(name + ':' + event, fn); },
      removeEventListener(event, fn) { assert.equal(listeners.get(name + ':' + event), fn); listeners.delete(name + ':' + event); },
    };
  }
  const ctx = Object.fromEntries(['setTransform', 'clearRect', 'fillRect', 'strokeRect', 'beginPath', 'arc', 'stroke', 'fill', 'moveTo', 'lineTo'].map(key => [key, (...args) => {
    assert(args.every(Number.isFinite), `${key} received a non-finite coordinate`);
    if (key === 'clearRect') { draws++; highlights = 0; maxOperations = Math.max(maxOperations, operations); operations = 0; }
    operations++;
    if (key === 'fillRect' && String(ctx.fillStyle).startsWith('rgba(232,240,248,')) highlights++;
  }]));
  const canvas = {getContext: () => canvasAvailable ? ctx : null, getBoundingClientRect: () => ({left: 0, top: 80})};
  const art = {classList: {add() {live = true;}, remove() {live = false;}}};
  const hero = {...target('hero'), dataset: {}, querySelector: q => q === 'canvas' ? canvas : art,
    getBoundingClientRect: () => ({width, height, left: 0, top: 80}),
    querySelectorAll: () => [{getBoundingClientRect: () => ({left: 20, top: 150, width: width < 700 ? width - 40 : 600, height: 260})}]
  };
  class Observer {
    constructor(callback) {this.callback = callback; this.disconnected = false; observers.push(this);}
    observe() {}
    disconnect() {this.disconnected = true;}
  }
  const document = {...target('document'), hidden: false};
  const window = {...target('window'), devicePixelRatio: 3, matchMedia: () => ({matches: fine})};
  const palette = {'--pl-sky': '#7FAEE1', '--pl-blue-bright': '#468BE0', '--pl-blue': '#396FC0', '--pl-ink': '#082F57', '--pl-paper': '#E8F0F8', '--pl-lime': '#D6F06E'};
  const sandbox = {window, document, performance: {now: () => now}, Math,
    getComputedStyle: () => ({getPropertyValue: key => palette[key]}),
    requestAnimationFrame: fn => {queue.set(++id, fn); return id;},
    cancelAnimationFrame: key => queue.delete(key), IntersectionObserver: Observer, ResizeObserver: Observer};
  vm.createContext(sandbox); vm.runInContext(source, sandbox);
  const api = sandbox.mountResolutionHero(hero, {paused: false, reduced});
  function frames(count = 1) {for (let i=0; i<count; i++) {now += 1000/60; const jobs=[...queue.values()]; queue.clear(); jobs.forEach(fn => fn(now));}}
  function pointer() {listeners.get('hero:pointermove')?.({pointerType:'mouse', clientX:width*.8, clientY:height*.75, target:{closest:()=>null}});}
  return {api, frames, pointer, queue, observers, listeners, document, canvas, get highlights() {return highlights;}, get maxOperations() {return maxOperations;}, get draws() {return draws;}, get live() {return live;}};
}
for (const width of [1366, 390, 360]) {
  const s=setup({width, height: width < 700 ? 772 : 688, fine:width>700});
  s.frames(360); assert(s.draws>0); assert(s.live);
  assert.equal(s.canvas.width, Math.round(width * (width<700 ? 1.5 : 2)), 'DPR is capped');
  s.pointer(); s.frames(30);
  s.api.setMotion({paused:true,reduced:false});s.frames(2);
  assert.equal(s.queue.size,0,'Pause settles without a perpetual RAF');
  const frozen=s.draws; s.pointer();s.frames(3);assert.equal(s.draws,frozen,'Pointer respects pause');
  s.api.setMotion({paused:false,reduced:false});s.frames(3);assert(s.queue.size>0,'Resume restarts breathing');
  s.observers[0].callback([{isIntersecting:false}]);assert.equal(s.queue.size,0,'Offscreen cancels rendering');
  s.observers[0].callback([{isIntersecting:true}]);s.frames(3);assert(s.queue.size>0);
  s.document.hidden=true;s.listeners.get('document:visibilitychange')();assert.equal(s.queue.size,0,'Hidden tab cancels rendering');
  s.document.hidden=false;s.listeners.get('document:visibilitychange')();s.frames(2);
  s.api.setMotion({paused:false,reduced:true});s.frames(2);assert.equal(s.queue.size,0,'Reduced motion settles');
  s.api.destroy();assert.equal(s.listeners.size,0);assert(s.observers.every(o=>o.disconnected));assert.equal(s.queue.size,0);assert(!s.live);
}
const wave=setup();
wave.frames(210); assert(wave.highlights > 0, 'The automatic wave is visible without a pointer');
wave.frames(230); assert.equal(wave.highlights, 0, 'The wave returns to a quiet resting surface');
wave.frames(600); assert(wave.highlights > 0, 'The wave repeats after a long resting interval');
assert(wave.maxOperations < 22000, 'Artwork stays within its per-frame drawing budget');
wave.api.setMotion({paused:false,reduced:true});wave.frames(2);assert.equal(wave.highlights,0,'Reduced motion removes travelling surface highlights');
wave.api.destroy();
const reduced=setup({reduced:true});reduced.frames(2);assert.equal(reduced.queue.size,0);const frozen=reduced.draws;reduced.pointer();reduced.frames(10);assert.equal(reduced.draws,frozen);reduced.api.destroy();
const fallback=setup({canvasAvailable:false});assert(!fallback.live);assert.equal(fallback.queue.size,0);fallback.api.destroy();
console.log('PASS: finite canvas coordinates, DPR caps, wave/rest timing, draw budget, pause/resume, reduced motion, visibility, cleanup and no-canvas fallback. Mock DOM/canvas only.');
