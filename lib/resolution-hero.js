/* ==========================================================================
   PixelLayerr — hero artwork + interactions  ("Resolution")

   Idea: a precise vector form (four concentric arcs — the design) is
   rasterised live into a pixel grid (the build). The pixels are the layers.
   - Entrance: vector arcs draw, then pixel faces lift into place from the core.
   - Idle:     a slow resolution wave crosses the assembled layers, then rests.
   - Pointer:  a softly damped lens lifts the surface and reveals 2× / 4× detail.
   - Edge:     the bottom rows step down in size, dissolving into the next
               section; scrolling extends the dissolve upward.
   No runtime dependencies. Text stays real HTML.
   ========================================================================== */
/**
 * Canvas artwork adapted from the user-approved Resolution prototype.
 * Scoped to one mounted hero; all observers/listeners are disposed on unmount.
 * @param {HTMLElement} hero
 * @param {{paused: boolean, reduced: boolean}} initialMotion
 */
export function mountResolutionHero(hero, initialMotion) {

  /* ---------------------------------------------------------------------
     CONFIG — every motion and composition lever lives here.
     --------------------------------------------------------------------- */
  var CONFIG = {
    // Pixel size (CSS px) by viewport width.
    cell: [{ minWidth: 1100, size: 24 }, { minWidth: 700, size: 20 }, { minWidth: 0, size: 16 }],
    // Arc centre as a fraction of the hero's width/height (may sit off-canvas).
    center: [{ minWidth: 1100, x: 0.965, y: 1.1 }, { minWidth: 700, x: 0.95, y: 1.07 }, { minWidth: 0, x: 0.74, y: 1.02 }],
    // Band radii as fractions of the outer radius (outer → inner) and their colour tokens.
    bands: [1, 0.8, 0.6, 0.4],
    bandTokens: ['--pl-sky', '--pl-blue-bright', '--pl-blue', '--pl-ink'],
    groundToken: '--pl-paper',
    clearance: 30,        // min px between any headline/copy/CTA box and the outer arc
    topMargin: 0.06,      // the arc never rises above this fraction of hero height
    gap: 1,               // seam between pixels (px)
    grout: 0.13,          // seam colour = pixel colour darkened by this amount
    arcs: { outer: 'rgba(8,47,87,.42)', inner: 'rgba(250,251,247,.42)', width: 1 },
    anchor: { angle: 1.315, handle: 54 },            // bezier anchor on the outer arc (× π rad)
    lime: { angle: 1.4, radius: 0.5 },               // the single lime pixel (× π rad, × R)
    breath: { amplitude: 0.011, period: 9000, fps: 30 },
    lens: { radius: 160, follow: 0.15, fade: 0.1, grout: 0.1 },
    wave: { delay: 1850, duration: 3000, period: 14000, width: .13, lift: 6 },
    depth: { entrance: 22, pointer: 9 },
    dissolve: { rows: 3, scrollRows: 8 }, // bottom edge: rows that step down in size at rest, + rows gained across one hero of scroll
    entrance: {           // ms from page start
      arcStart: 60, arcDur: 950,
      tileStart: 320, tileSpread: 920, tileDur: 440, jitter: 55,
      anchorAt: 820, limeAt: 1480
    }
  };

  var PI = Math.PI;

  var root = hero;
  var reduce = initialMotion.reduced;
  var art = hero.querySelector('.pl-art');
  var canvas = hero.querySelector('canvas');
  var ctx = canvas && canvas.getContext('2d');
  if (!ctx) return { setMotion() {}, destroy() {} };
  var disposed = false;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var entered = false;

  /* ---------------------------------------------------------------------
     State
     --------------------------------------------------------------------- */
  var L = null;                         // layout
  var PAL = null;                       // palette (rgb arrays)
  var cache = {};                       // blended colour cache
  var R2 = [0, 0, 0, 0];
  var cellLift = 0, cellLight = 0;
  var start = reduce || initialMotion.paused ? -1e9 : performance.now();
  var entranceEnd = CONFIG.entrance.tileStart + CONFIG.entrance.tileSpread + CONFIG.entrance.tileDur + CONFIG.entrance.jitter + 400;
  var breathT = 0, lastBreath = 0, lastNow = 0;
  var paused = initialMotion.paused, visible = true, raf = 0;
  var lens = { x: 0, y: 0, tx: 0, ty: 0, amt: 0, target: 0 };
  var scrollP = 0;

  /* ---------------------------------------------------------------------
     Helpers
     --------------------------------------------------------------------- */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function hash(i, j) { var h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return h - Math.floor(h); }
  function pick(list, w) { for (var k = 0; k < list.length; k++) if (w >= list[k].minWidth) return list[k]; return list[list.length - 1]; }
  function rgb(hex) {
    hex = String(hex).trim().replace('#', '');
    if (hex.length === 3) hex = hex.replace(/./g, '$&$&');
    var n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function readPalette() {
    var cs = getComputedStyle(root);
    PAL = {
      bands: CONFIG.bandTokens.map(function (t) { return rgb(cs.getPropertyValue(t)); }),
      ground: rgb(cs.getPropertyValue(CONFIG.groundToken)),
      lime: cs.getPropertyValue('--pl-lime').trim(),
      paper: cs.getPropertyValue('--pl-paper').trim(),
      ink: cs.getPropertyValue('--pl-ink').trim()
    };
    cache = {};
  }

  // Colour of a pixel from 4 coverage samples (band index 0..3, 4 = ground).
  // Edge pixels blend — the antialiasing is part of the picture.
  function colour(a, b, c, d, fine) {
    var key = a * 125 + b * 25 + c * 5 + d + (fine ? 1000 : 0);
    var v = cache[key];
    if (v) return v;
    var r = 0, g = 0, bl = 0, s = [a, b, c, d];
    for (var k = 0; k < 4; k++) {
      var col = s[k] === 4 ? PAL.ground : PAL.bands[s[k]];
      r += col[0]; g += col[1]; bl += col[2];
    }
    r /= 4; g /= 4; bl /= 4;
    var m = 1 - (fine ? CONFIG.lens.grout : CONFIG.grout);
    v = cache[key] = {
      fill: 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (bl | 0) + ')',
      grout: 'rgb(' + ((r * m) | 0) + ',' + ((g * m) | 0) + ',' + ((bl * m) | 0) + ')'
    };
    return v;
  }

  function band(x, y) {
    var dx = x - L.cx, dy = y - L.cy, d2 = dx * dx + dy * dy;
    if (d2 > R2[0]) return 4;
    if (d2 > R2[1]) return 0;
    if (d2 > R2[2]) return 1;
    if (d2 > R2[3]) return 2;
    return 3;
  }

  /* ---------------------------------------------------------------------
     Layout — the arc is sized from the real text boxes, so it never
     collides with the headline, copy or CTAs at any viewport.
     --------------------------------------------------------------------- */
  function layout() {
    var hr = hero.getBoundingClientRect();
    var W = Math.max(1, Math.round(hr.width)), H = Math.max(1, Math.round(hr.height));
    var dpr = Math.min(window.devicePixelRatio || 1, W < 700 ? 1.5 : 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    var c = pick(CONFIG.center, W);
    var cx = W * c.x, cy = H * c.y;
    var R = Infinity;
    var avoid = hero.querySelectorAll('[data-pl-avoid]');
    for (var k = 0; k < avoid.length; k++) {
      var r = avoid[k].getBoundingClientRect();
      if (!r.width || !r.height) continue;
      var x0 = r.left - hr.left, y0 = r.top - hr.top, x1 = x0 + r.width, y1 = y0 + r.height;
      var nx = clamp(cx, x0, x1), ny = clamp(cy, y0, y1);
      R = Math.min(R, Math.hypot(cx - nx, cy - ny));
    }
    R = (R - CONFIG.clearance - CONFIG.depth.entrance) / (1 + CONFIG.breath.amplitude);
    R = Math.min(R, cy - H * CONFIG.topMargin);
    R = Math.max(R, Math.min(W, H) * 0.28);

    var s = pick(CONFIG.cell, W).size;
    var cols = Math.ceil(W / s), rows = Math.ceil(H / s);
    L = { W: W, H: H, dpr: dpr, cx: cx, cy: cy, R: R, s: s, cols: cols, rows: rows, ox: W - cols * s, oy: H - rows * s };
  }

  /* ---------------------------------------------------------------------
     Drawing
     --------------------------------------------------------------------- */
  // k = scale (0..1): used by the entrance and by the bottom-edge dissolve
  function drawPixel(x, y, size, col, k) {
    if (k < 1) {
      var sz = size * k;
      x += (size - sz) / 2; y += (size - sz) / 2; size = sz;
      if (size < 0.5) return;
    }
    var g = size > 4 ? CONFIG.gap : 0;
    if (cellLift > .2) {
      // A solid side face gives physical depth without expensive blurred shadows.
      ctx.fillStyle = col.grout;
      ctx.fillRect(x + cellLift * .18, y - cellLift + size * .5, size, size * .5 + cellLift);
      x += cellLift * .18;
      y -= cellLift;
    }
    ctx.fillStyle = col.grout; ctx.fillRect(x, y, size, size);
    ctx.fillStyle = col.fill;  ctx.fillRect(x, y, size - g, size - g);
    if (cellLight > .005) {
      ctx.fillStyle = 'rgba(232,240,248,' + cellLight.toFixed(3) + ')';
      ctx.fillRect(x, y, size - g, size - g);
      ctx.fillStyle = 'rgba(232,240,248,.32)';
      ctx.fillRect(x, y, size - g, Math.min(1, size * .1));
    }
  }

  function rasterCell(x, y, size, e, fine) {
    var q = size * 0.25, h = size * 0.75;
    var a = band(x + q, y + q), b = band(x + h, y + q), c = band(x + q, y + h), d = band(x + h, y + h);
    if (a === 4 && b === 4 && c === 4 && d === 4) return;
    drawPixel(x, y, size, colour(a, b, c, d, fine), e);
  }

  function draw(now) {
    var W = L.W, H = L.H, s = L.s, cx = L.cx, cy = L.cy, R = L.R;
    var et = now - start;
    var E = CONFIG.entrance;

    // Breathing radii (each band slightly out of phase)
    var amp = reduce ? 0 : CONFIG.breath.amplitude;
    var radii = CONFIG.bands.map(function (f, k) {
      return R * f * (1 + amp * Math.sin((breathT / CONFIG.breath.period) * 2 * PI + k * 1.15));
    });
    for (var k = 0; k < 4; k++) R2[k] = radii[k] * radii[k];

    ctx.setTransform(L.dpr, 0, 0, L.dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // A three-second outward wave, followed by eleven seconds of stillness.
    // It uses visible animation time, so background tabs do not skip the experience.
    var waveAge = breathT - CONFIG.wave.delay;
    var wavePhase = waveAge >= 0 ? waveAge % CONFIG.wave.period : -1;
    var waveActive = !reduce && wavePhase >= 0 && wavePhase < CONFIG.wave.duration;
    var waveProgress = waveActive ? wavePhase / CONFIG.wave.duration : 0;
    var waveRadius = .18 + waveProgress * .98;
    var waveEnvelope = waveActive ? Math.pow(Math.sin(waveProgress * PI), .7) : 0;
    var mobileScale = W < 700 ? .55 : 1;
    // Loupe
    var lr = Math.min(CONFIG.lens.radius, W * .3) * lens.amt;

    // Bottom-edge dissolve: the last rows step down in size (more rows as you scroll)
    var nD = CONFIG.dissolve.rows + (reduce ? 0 : scrollP * CONFIG.dissolve.scrollRows);

    var Rmax = radii[0] + s * 1.5;
    var i0 = Math.max(0, Math.floor((cx - Rmax - L.ox) / s));
    var j0 = Math.max(0, Math.floor((cy - Rmax - L.oy) / s));
    var diag = s * 0.7072;

    for (var j = j0; j < L.rows; j++) {
      var y = L.oy + j * s, yc = y + s / 2;
      var fromBottom = L.rows - 1 - j;
      var rowScale = fromBottom < nD ? (fromBottom + 1) / (nD + 1) : 1;
      for (var i = i0; i < L.cols; i++) {
        var x = L.ox + i * s, xc = x + s / 2;
        var dx = xc - cx, dy = yc - cy, d = Math.sqrt(dx * dx + dy * dy);
        if (d - diag > radii[0]) continue;

        // Entrance: render outward from the core
        var e = 1;
        if (et < entranceEnd) {
          var at = E.tileStart + (d / R) * E.tileSpread + hash(i, j) * E.jitter;
          e = clamp((et - at) / E.tileDur, 0, 1);
          if (e <= 0) continue;
          e = easeOut(e);
        }
        var waveDistance = Math.abs(d / R - waveRadius) / CONFIG.wave.width;
        var wave = waveEnvelope * easeInOut(clamp(1 - waveDistance, 0, 1));
        var pointerDistance = lr > 1 ? Math.hypot(xc - lens.x, yc - lens.y) / lr : 2;
        var pointerLift = easeInOut(clamp(1 - pointerDistance, 0, 1));
        cellLift = reduce ? 0 : (
          (1 - e) * CONFIG.depth.entrance +
          wave * CONFIG.wave.lift + pointerLift * CONFIG.depth.pointer
        ) * mobileScale * rowScale;
        cellLight = wave * .14 + pointerLift * .08;
        e *= rowScale;

        // Coarse → fine detail crossfades across both the wave and cursor field.
        rasterCell(x, y, s, e);
        var middle = Math.max(wave * .75, easeInOut(clamp((1 - pointerDistance) / .4, 0, 1)));
        var inner = easeInOut(clamp((.55 - pointerDistance) / .3, 0, 1));
        if (middle > .01) {
          for (var level = 0; level < 2; level++) {
            var n = level === 0 ? 2 : 4;
            var blend = level === 0 ? middle : inner;
            if (blend < .01) continue;
            ctx.globalAlpha = blend;
            var ss = s / n;
            for (var b = 0; b < n; b++) for (var a = 0; a < n; a++) {
              rasterCell(x + a * ss, y + b * ss, ss, e, true);
            }
          }
          ctx.globalAlpha = 1;
        }
      }
    }

    // The single lime pixel — snapped to the coarse grid, inside the core-blue band
    var lt = et - E.limeAt;
    if (lt > 0) {
      var la = CONFIG.lime.angle * PI, lrd = R * CONFIG.lime.radius;
      var li = Math.floor((cx + lrd * Math.cos(la) - L.ox) / s), lj = Math.floor((cy + lrd * Math.sin(la) - L.oy) / s);
      if (lj < L.rows) {
        ctx.globalAlpha = easeOut(clamp(lt / 320, 0, 1));
        var limeX = L.ox + li * s, limeY = L.oy + lj * s;
        var limeDistance = Math.hypot(limeX + s / 2 - cx, limeY + s / 2 - cy) / R;
        var limeWave = waveEnvelope * easeInOut(clamp(1 - Math.abs(limeDistance - waveRadius) / CONFIG.wave.width, 0, 1));
        var limePointer = lr > 1 ? easeInOut(clamp(1 - Math.hypot(limeX + s / 2 - lens.x, limeY + s / 2 - lens.y) / lr, 0, 1)) : 0;
        var limeLift = reduce ? 0 : (limeWave * CONFIG.wave.lift + limePointer * CONFIG.depth.pointer) * mobileScale;
        ctx.fillStyle = PAL.lime;
        ctx.fillRect(limeX + limeLift * .18, limeY - limeLift, s - CONFIG.gap, s - CONFIG.gap);
        ctx.globalAlpha = 1;
      }
    }

    // Vector arcs — the design intent, drawn over its own rendering
    var ap = easeInOut(clamp((et - E.arcStart) / E.arcDur, 0, 1));
    if (ap > 0) {
      ctx.lineWidth = CONFIG.arcs.width;
      for (k = 0; k < 4; k++) {
        var r = radii[k];
        var sa = PI + Math.asin(clamp((cy - H) / r, -1, 1));
        var ea = 2 * PI - Math.asin(clamp((cy - H) / r, -1, 1));
        ctx.strokeStyle = k === 0 ? CONFIG.arcs.outer : CONFIG.arcs.inner;
        ctx.beginPath();
        ctx.arc(cx, cy, r, sa, sa + (ea - sa) * ap);
        ctx.stroke();
      }
    }

    // Bezier anchor + handles on the outer arc
    var an = clamp((et - E.anchorAt) / 420, 0, 1);
    if (an > 0) {
      var aa = (CONFIG.anchor.angle + (reduce ? 0 : .008 * Math.sin(breathT / 6000))) * PI, r0 = radii[0];
      var px = cx + r0 * Math.cos(aa), py = cy + r0 * Math.sin(aa);
      var tx = -Math.sin(aa), ty = Math.cos(aa);
      var hl = CONFIG.anchor.handle * easeOut(an);
      ctx.globalAlpha = an;
      ctx.strokeStyle = 'rgba(8,47,87,.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px - tx * hl, py - ty * hl);
      ctx.lineTo(px + tx * hl, py + ty * hl);
      ctx.stroke();
      ctx.fillStyle = PAL.paper;
      [[-1], [1]].forEach(function (sgn) {
        ctx.beginPath();
        ctx.arc(px + tx * hl * sgn[0], py + ty * hl * sgn[0], 3.5, 0, 2 * PI);
        ctx.fill(); ctx.stroke();
      });
      ctx.fillRect(px - 4.5, py - 4.5, 9, 9);
      ctx.strokeRect(px - 4.5, py - 4.5, 9, 9);
      ctx.globalAlpha = 1;
    }
  }

  /* ---------------------------------------------------------------------
     Loop — renders only when something changes; stops when idle,
     off-screen or the tab is hidden.
     --------------------------------------------------------------------- */
  function breathing() { return !reduce && !paused; }

  function frame(now) {
    raf = 0;
    if (disposed || !visible || document.hidden || !L) return;
    var dt = lastNow ? Math.min(now - lastNow, 50) : 16;
    lastNow = now;

    var dirty = false;
    var entering = now - start < entranceEnd;

    if (!entered && !entering) { entered = true; hero.dataset.entered = 'true'; layout(); dirty = true; }
    // Frame-rate independent damping keeps the response consistent at 60/120Hz.
    var f = 1 - Math.pow(1 - CONFIG.lens.follow, dt / 16.67);
    var mx = lens.tx - lens.x, my = lens.ty - lens.y, ma = lens.target - lens.amt;
    var lensMoving = Math.abs(mx) > .3 || Math.abs(my) > .3 || Math.abs(ma) > .004;
    if (lensMoving) {
      lens.x += mx * f; lens.y += my * f;
      lens.amt += ma * (1 - Math.pow(1 - CONFIG.lens.fade, dt / 16.67));
      if (Math.abs(lens.target - lens.amt) < .004) lens.amt = lens.target;
      dirty = true;
    }

    if (breathing()) {
      breathT += dt;
      if (now - lastBreath > 1000 / CONFIG.breath.fps) { lastBreath = now; dirty = true; }
    }
    if (entering || dirty || needsDraw) { draw(now); needsDraw = false; }

    if (entering || lensMoving || breathing()) raf = requestAnimationFrame(frame);
    else lastNow = 0;
  }
  var needsDraw = true;
  function invalidate() {
    needsDraw = true;
    if (!disposed && visible && !document.hidden && !raf) raf = requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------------------
     Events
     --------------------------------------------------------------------- */
  function onPointer(ev) {
    if (ev.pointerType === 'touch' || !finePointer.matches || paused || reduce) return;
    if (ev.target.closest('a, button')) { onLeave(); return; }
    var r = canvas.getBoundingClientRect();
    lens.tx = ev.clientX - r.left; lens.ty = ev.clientY - r.top;
    if (lens.amt < .02) { lens.x = lens.tx; lens.y = lens.ty; }
    lens.target = 1;
    invalidate();
  }
  function onLeave() { lens.target = 0; invalidate(); }
  function onScroll() {
    var r = hero.getBoundingClientRect();
    var p = reduce || paused ? 0 : clamp(-r.top / Math.max(1, r.height), 0, 1);
    if (Math.abs(p - scrollP) < .001) return;
    scrollP = p;
    invalidate();
  }
  function onVisibility() {
    lastNow = 0;
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else invalidate();
  }
  function relayout() {
    if (disposed) return;
    layout(); onScroll(); invalidate();
  }
  hero.addEventListener('pointermove', onPointer, { passive: true });
  hero.addEventListener('pointerleave', onLeave);
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  var intersection = new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    lastNow = 0;
    if (visible) invalidate();
    else { cancelAnimationFrame(raf); raf = 0; }
  });
  intersection.observe(hero);
  var resize = new ResizeObserver(relayout);
  resize.observe(hero);
  if (document.fonts) document.fonts.ready.then(relayout);
  readPalette();
  layout();
  art.classList.add('is-live');
  invalidate();
  return {
    setMotion: function (motion) {
      paused = motion.paused; reduce = motion.reduced;
      if (paused || reduce) {
        start = -1e9;
        hero.dataset.entered = 'true';
        lens.target = lens.amt = 0;
        lens.x = lens.tx; lens.y = lens.ty;
      }
      lastNow = 0;
      onScroll();
      invalidate();
    },
    destroy: function () {
      disposed = true;
      cancelAnimationFrame(raf);
      intersection.disconnect(); resize.disconnect();
      hero.removeEventListener('pointermove', onPointer);
      hero.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
      art.classList.remove('is-live');
      delete hero.dataset.entered;
    }
  };
}
