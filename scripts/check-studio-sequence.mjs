/** Exercise the production hook with deterministic hook/timer/observer doubles.
 * This is a lifecycle regression check, not a browser or React rendering test.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(
  new URL("../components/studio/StudioMotion.tsx", import.meta.url),
  "utf8",
);
const code = ts.transpileModule(
  source.slice(source.indexOf("export function useSequence")),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  },
).outputText;
const state = [],
  refs = [],
  effects = [],
  timers = new Map(),
  listeners = new Map();
let stateIndex = 0,
  refIndex = 0,
  effectIndex = 0,
  timerId = 0,
  pending = [],
  observer;
const motion = { paused: false, reduced: false };
const doc = {
  hidden: false,
  addEventListener: (name, callback) => listeners.set(name, callback),
  removeEventListener: (name) => listeners.delete(name),
};
const scope = {
  exports: {},
  document: doc,
  useStudioMotion: () => motion,
  useState(initial) {
    const index = stateIndex++;
    if (!(index in state)) state[index] = initial;
    return [
      state[index],
      (value) => {
        state[index] =
          typeof value === "function" ? value(state[index]) : value;
      },
    ];
  },
  useRef() {
    return refs[refIndex++] ?? (refs[refIndex - 1] = { current: {} });
  },
  useEffect(callback, deps) {
    const index = effectIndex++,
      previous = effects[index];
    if (
      !previous ||
      deps.some((value, i) => !Object.is(value, previous.deps[i]))
    ) {
      pending.push(() => {
        previous?.cleanup?.();
        effects[index] = { deps, cleanup: callback() };
      });
    }
  },
  IntersectionObserver: class {
    constructor(callback) {
      this.callback = callback;
      observer = this;
    }
    observe() {}
    disconnect() {
      this.disconnected = true;
    }
  },
  setInterval(callback) {
    timers.set(++timerId, callback);
    return timerId;
  },
  clearInterval: (id) => timers.delete(id),
};
vm.runInNewContext(code, scope);
function render() {
  stateIndex = refIndex = effectIndex = 0;
  pending = [];
  const hook = scope.exports.useSequence(4, 6500);
  pending.forEach((effect) => effect());
  return hook;
}
let hook = render();
assert.equal(hook.playing, false, "Offscreen sequences do not play");
observer.callback([{ isIntersecting: true }]);
hook = render();
assert.equal(timers.size, 1);
timers.values().next().value();
hook = render();
assert.equal(hook.active, 1, "Visible sequence advances");
hook.setHover(true);
hook.setFocused(true);
hook = render();
assert.equal(timers.size, 0);
hook.setHover(false);
hook = render();
assert.equal(
  hook.playing,
  false,
  "Pointer leave must not override retained focus",
);
assert.equal(timers.size, 0);
hook.setHover(true);
hook.setFocused(false);
hook = render();
assert.equal(
  hook.playing,
  false,
  "Focus leave must not override pointer hover",
);
hook.setHover(false);
hook = render();
assert.equal(timers.size, 1);
hook.choose(3);
hook = render();
assert.equal(hook.active, 3);
assert.equal(timers.size, 0, "Manual selection pauses");
hook.resume();
hook = render();
timers.values().next().value();
hook = render();
assert.equal(hook.active, 0, "Sequence wraps around");
motion.paused = true;
hook = render();
assert.equal(timers.size, 0);
motion.paused = false;
motion.reduced = true;
hook = render();
assert.equal(timers.size, 0);
motion.reduced = false;
hook = render();
assert.equal(timers.size, 1);
doc.hidden = true;
listeners.get("visibilitychange")();
hook = render();
assert.equal(timers.size, 0);
doc.hidden = false;
listeners.get("visibilitychange")();
hook = render();
assert.equal(timers.size, 1);
observer.callback([{ isIntersecting: false }]);
hook = render();
assert.equal(timers.size, 0);
effects.forEach((effect) => effect.cleanup?.());
assert.equal(listeners.size, 0);
assert.equal(timers.size, 0);
assert.equal(observer.disconnected, true);
console.log(
  "PASS: sequence focus/hover independence, manual selection, pause, reduced motion, visibility and cleanup (mock lifecycle).",
);
