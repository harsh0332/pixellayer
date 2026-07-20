"use client";

import gsap from "gsap";
import Image from "next/image";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "@/components/motion/ReducedMotionProvider";
import { FEATURED, PROJECTS } from "@/lib/work";

/*
 * PixelLayerr OS — cinematic scroll intro. Faithful React port of the
 * reference PixelLayerr OS.dc.html: a 5-sector 3D camera rig (Identity →
 * Capabilities → Work → Process → Handover) over a ~650vh driver, a
 * mass-spring reactive grid canvas, a sector-hued pointer light, HUD chrome,
 * a boot log, and an auto-typing handover terminal.
 *
 * Ported changes from the reference (documented in the session plan):
 *  - Scoped as a page intro: sticky stage inside a 650vh driver (not global
 *    position:fixed), so scrolling always flows and the pin releases cleanly.
 *  - Render loop runs on the site's single gsap.ticker (the same loop that
 *    drives Lenis) — no second rAF; paused offscreen via IntersectionObserver.
 *  - Every fabricated string replaced with real content (clients, projects,
 *    delivery line, CTA → Calendly). No invented metrics.
 *  - Boot sequence compressed to protect the wordmark's LCP.
 */

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL ??
  "https://calendly.com/harshhchouksey/30min";

const MONO = "var(--font-mono-face), ui-monospace, SFMono-Regular, monospace";

/* Camera spans 0 → DMAX across the driver's scroll. */
const DMAX = 4.8;
const SP = 84; // grid lattice spacing
const CMD = "pixellayerr init client-project --layers=all";

const SECTORS = [
  "00 · IDENTITY",
  "01 · CAPABILITIES",
  "02 · WORK",
  "03 · PROCESS",
  "04 · HANDOVER",
];
const HUES = ["#5B72F2", "#5B72F2", "#B45CFF", "#22D3EE", "#C6FF5A"];

/* Real clients pulled from the portfolio — replaces the reference's invented
   "HALIDE LABS / MERIDIAN / …" row. */
const TRUSTED = [
  "LA VALLÉE FARMS",
  "SHOOLIN CHEMICALS",
  "DPM ENTERTAINMENT",
  "AI BUDDIES",
];

/* Real services (reference copy was already real) mapped to the three
   Services categories. */
const SERVICES = [
  {
    code: "SVC/01 · WEB SYSTEMS",
    line: "Marketing sites engineered like products.",
    hue: "#5B72F2",
    bar: "rgba(91,114,242,0.8)",
    readout: "uptime",
  },
  {
    code: "SVC/02 · SAAS PRODUCTS",
    line: "Dashboards, auth, billing — the full build.",
    hue: "#B45CFF",
    bar: "rgba(180,92,255,0.8)",
    readout: "build",
  },
  {
    code: "SVC/03 · MOTION ENGINEERING",
    line: "Interaction designed at the frame level.",
    hue: "#22D3EE",
    bar: "rgba(34,211,238,0.8)",
    readout: "render",
  },
] as const;

/* Real projects for the Work stacks — no metrics, names link to live sites. */
function projectBySlug(slug: string) {
  if (slug === FEATURED.slug)
    return { name: FEATURED.name, url: FEATURED.url, cat: FEATURED.category };
  const p = PROJECTS.find((x) => x.slug === slug);
  return p ? { name: p.name, url: p.url, cat: p.category } : null;
}
const WORK = [
  { ...projectBySlug("la-vallee-farms")!, slug: "la-vallee-farms", hue: "91,114,242" },
  { ...projectBySlug("ai-buddies")!, slug: "ai-buddies", hue: "180,92,255" },
  { ...projectBySlug("baby-steps")!, slug: "baby-steps", hue: "34,211,238" },
];

const PROCESS = [
  { label: "01 discover", pid: "PID 2117" },
  { label: "02 design", pid: "PID 2381" },
  { label: "03 build", pid: "PID 2544" },
  { label: "04 polish", pid: "PID 2790" },
  { label: "05 ship", pid: "PID 3001" },
];

const BOOT_LINES = [
  "mounting render layers .......... ",
  "calibrating grid mass ........... ",
  "lighting: reactive .............. ",
  "compositor: 60fps ............... ",
  "PXL/OS 1.0 ready — entering workspace",
];

const clamp = (v: number, a: number, b: number) =>
  v < a ? a : v > b ? b : v;

export function PixelLayerrOS() {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;
    // Cinematic rig is desktop-only; small screens render the static flow.
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    const q = <T extends Element>(sel: string) =>
      root.querySelector(sel) as T | null;
    const qq = <T extends Element>(sel: string) =>
      Array.from(root.querySelectorAll(sel)) as T[];

    const grid = q<HTMLCanvasElement>("[data-grid]");
    const light = q<HTMLElement>("[data-light]");
    const world = q<HTMLElement>("[data-world]");
    const boot = q<HTMLElement>("[data-boot]");
    const spark = q<HTMLCanvasElement>("[data-spark]");
    if (!grid || !light || !world || !spark) return;

    const setText = (sel: string, text: string) => {
      const el = q<HTMLElement>(sel);
      if (el) el.textContent = text;
    };

    const planes = qq<HTMLElement>("[data-plane]").map((el) => ({
      el,
      d: parseFloat(el.getAttribute("data-d") || "0"),
    }));
    const stacks = qq<HTMLElement>("[data-stack]").map((el) => ({
      el,
      layers: Array.from(el.querySelectorAll<HTMLElement>("[data-sl]")),
      beam: el.querySelector<HTMLElement>("[data-beam]"),
      prevSep: 1,
    }));
    const svcbars = qq<HTMLElement>("[data-svcbar]");
    const pbars = qq<HTMLElement>("[data-pbar]");
    const psts = qq<HTMLElement>("[data-pst]");

    const cleanup: Array<() => void> = [];
    const t0 = performance.now();

    /* ---- boot (moment 1): time-compressed to protect LCP ---- */
    const bls = qq<HTMLElement>("[data-bl]");
    const atTop = window.scrollY < 60;
    if (boot) {
      if (!atTop) {
        boot.style.display = "none";
        bls.forEach((b) => (b.style.opacity = "1"));
      } else {
        [100, 350, 600, 850, 1100].forEach((t, i) => {
          const id = window.setTimeout(() => {
            if (bls[i]) bls[i].style.opacity = "1";
          }, t);
          cleanup.push(() => window.clearTimeout(id));
        });
        const fade = window.setTimeout(() => {
          boot.style.opacity = "0";
        }, 1350);
        const gone = window.setTimeout(() => {
          boot.style.display = "none";
        }, 1650);
        cleanup.push(() => window.clearTimeout(fade));
        cleanup.push(() => window.clearTimeout(gone));
      }
    }

    /* ---- grid geometry ---- */
    const gtx = grid.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let gw = 0;
    let gh = 0;
    type Pt = {
      ox: number;
      oy: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      c: number;
      r: number;
      cols: number;
      rows: number;
    };
    let pts: Pt[] = [];
    const sizeGrid = () => {
      gw = window.innerWidth;
      gh = window.innerHeight;
      grid.width = gw * dpr;
      grid.height = gh * dpr;
      const cols = Math.ceil(gw / SP) + 2;
      const rows = Math.ceil(gh / SP) + 2;
      pts = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          pts.push({
            ox: c * SP - SP / 2,
            oy: r * SP - SP / 2,
            x: c * SP - SP / 2,
            y: r * SP - SP / 2,
            vx: 0,
            vy: 0,
            c,
            r,
            cols,
            rows,
          });
    };
    sizeGrid();
    window.addEventListener("resize", sizeGrid);
    cleanup.push(() => window.removeEventListener("resize", sizeGrid));

    /* ---- pointer + scroll velocity ---- */
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const ptr = { x: 0, y: 0, tx: 0, ty: 0, px: -999, py: -999 };
    let lastMoveT = -9999;
    const onMove = (e: PointerEvent) => {
      ptr.px = e.clientX;
      ptr.py = e.clientY;
      ptr.tx = (e.clientX / gw - 0.5) * 2;
      ptr.ty = (e.clientY / gh - 0.5) * 2;
      lastMoveT = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    cleanup.push(() => window.removeEventListener("pointermove", onMove));

    let lastScroll = window.scrollY;
    let scrollVel = 0;
    const onScroll = () => {
      scrollVel = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanup.push(() => window.removeEventListener("scroll", onScroll));

    /* ---- clock + uptime (real) ---- */
    const z = (n: number) => (n < 10 ? "0" : "") + n;
    const clock = window.setInterval(() => {
      const d = new Date();
      setText(
        "[data-clock]",
        z(d.getHours()) + ":" + z(d.getMinutes()) + ":" + z(d.getSeconds()),
      );
      const up = Math.floor((performance.now() - t0) / 1000);
      setText(
        "[data-uptime]",
        z(Math.floor(up / 3600)) +
          ":" +
          z(Math.floor(up / 60) % 60) +
          ":" +
          z(up % 60),
      );
    }, 1000);
    cleanup.push(() => window.clearInterval(clock));

    /* ---- render loop (shares the site's single gsap.ticker) ---- */
    const stx = spark.getContext("2d")!;
    const samples: number[] = [];
    let typed = 0;
    let lastFps = performance.now();
    let frames = 0;
    let sectorIdx = -1;

    const tick = () => {
      const now = performance.now();
      const T = (now - t0) / 1000;

      // camera from the section's own scroll progress
      const rect = root.getBoundingClientRect();
      const span = root.offsetHeight - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, span);
      const cam = span > 0 ? (scrolled / span) * DMAX : 0;

      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;
      scrollVel *= 0.9;

      frames++;
      if (now - lastFps > 500) {
        setText(
          "[data-fps]",
          Math.min(Math.round((frames * 1000) / (now - lastFps)), 60) + "FPS",
        );
        frames = 0;
        lastFps = now;
      }

      // Handoff: the stage fades to the dark frame over the final stretch so
      // the pin releases INTO the hero's assemble entrance (one opening).
      const stage = q<HTMLElement>("[data-stage-pin]");
      if (stage)
        stage.style.opacity = clamp(1 - (cam - 4.45) / 0.3, 0, 1).toFixed(3);

      const si =
        cam < 0.6 ? 0 : cam < 1.8 ? 1 : cam < 3.0 ? 2 : cam < 4.2 ? 3 : 4;
      if (si !== sectorIdx) {
        sectorIdx = si;
        setText(
          "[data-sector]",
          cam > 4.55 ? "SESSION COMPLETE" : SECTORS[si],
        );
      }
      setText("[data-depth]", cam.toFixed(2));
      const rail = q<HTMLElement>("[data-rail]");
      if (rail) rail.style.width = clamp((cam / DMAX) * 100, 0, 100) + "%";

      // world tilt + slow breath
      world.style.transform =
        "rotateX(" +
        (-ptr.y * 2.2).toFixed(2) +
        "deg) rotateY(" +
        (ptr.x * 3.2).toFixed(2) +
        "deg) scale(" +
        (1 + Math.sin(T * 0.25) * 0.004).toFixed(4) +
        ")";

      // planes: camera travel
      planes.forEach((p) => {
        const dz = (cam - p.d) * 760;
        let op = 1;
        if (dz < -240) op = clamp(1 - (-dz - 240) / 460, 0, 1);
        if (dz > 40) op = clamp(1 - (dz - 40) / 200, 0, 1);
        p.el.style.filter =
          dz < -300
            ? "blur(" + clamp((-dz - 300) / 160, 0, 5).toFixed(1) + "px)"
            : "none";
        const bob = Math.sin(T * 0.4 + p.d * 2) * 5;
        p.el.style.transform =
          "translate(-50%,-50%) translate3d(0," +
          bob.toFixed(1) +
          "px," +
          dz.toFixed(1) +
          "px)";
        p.el.style.opacity = op.toFixed(3);
        p.el.style.visibility = op < 0.02 ? "hidden" : "visible";
        p.el.style.pointerEvents = op > 0.5 ? "auto" : "none";
      });

      // capability bars ease in
      const sv = clamp((cam - 0.55) * 1.8, 0, 1);
      svcbars.forEach((b, i) => {
        b.style.width =
          (sv * (78 - (i % 2) * 22 - Math.floor(i / 2) * 4)).toFixed(1) + "%";
      });

      // work stacks converge on arrival (moment 2) + lime beam on compile
      stacks.forEach((s) => {
        const dz = (cam - 2.4) * 760;
        const sep = clamp(-dz / 700, 0, 1);
        s.layers.forEach((l, j) => {
          l.style.transform =
            "translateZ(" +
            (j * 26 * sep + j * 2).toFixed(1) +
            "px) translateY(" +
            (-j * 8 * sep).toFixed(1) +
            "px)";
        });
        if (s.prevSep > 0.15 && sep <= 0.15 && s.beam) {
          s.beam.style.animation = "none";
          void s.beam.offsetWidth;
          s.beam.style.animation = "os-beam 0.7s cubic-bezier(0.16,1,0.3,1) 1";
        }
        s.prevSep = sep;
      });

      // process rows (moment 3, part A)
      let activity = 0;
      pbars.forEach((b, i) => {
        const p = clamp((cam - 2.95) * 1.5 - i * 0.2, 0, 1);
        activity += p > 0 && p < 1 ? 1 : 0;
        b.style.width = (p * 100).toFixed(1) + "%";
        const st = psts[i];
        if (st) {
          const label = p <= 0 ? "QUEUED" : p < 1 ? "RUNNING" : "DONE";
          if (st.textContent !== label) {
            st.textContent = label;
            st.style.color = p <= 0 ? "#565B66" : p < 1 ? "#22D3EE" : "#C6FF5A";
          }
        }
      });
      samples.push(
        activity * 8 + Math.abs(scrollVel) * 0.4 + Math.sin(T * 3) * 2 + 6,
      );
      if (samples.length > 80) samples.shift();
      stx.clearRect(0, 0, spark.width, spark.height);
      stx.strokeStyle = "rgba(34,211,238,0.8)";
      stx.lineWidth = 2;
      stx.beginPath();
      samples.forEach((v, i) => {
        const x = (i / 79) * spark.width;
        const y = spark.height - 4 - clamp(v, 0, 36);
        if (i) stx.lineTo(x, y);
        else stx.moveTo(x, y);
      });
      stx.stroke();

      // handover terminal (moment 3, part B)
      if (cam > 4.25 && typed < CMD.length) {
        typed = Math.min(CMD.length, typed + (Math.random() < 0.5 ? 1 : 2));
        setText("[data-cmd]", CMD.slice(0, typed));
        if (typed >= CMD.length) {
          const resp = q<HTMLElement>("[data-resp]");
          const cta = q<HTMLElement>("[data-handover-cta]");
          window.setTimeout(() => {
            if (resp) resp.style.opacity = "1";
            if (cta) {
              cta.style.opacity = "1";
              cta.classList.add("os-cta-glow");
            }
          }, 450);
        }
      }

      // reactive light — hue per sector; follows pointer/touch, drifts idle
      const hue = HUES[si];
      const idle = now - lastMoveT > 1500;
      let lx: number;
      let ly: number;
      if (fine && !idle) {
        lx = ptr.px;
        ly = ptr.py;
      } else {
        lx = gw * (0.5 + 0.16 * Math.sin(T * 0.15));
        ly = gh * (0.4 + 0.1 * Math.cos(T * 0.12));
      }
      light.style.background =
        "radial-gradient(340px circle at " +
        lx +
        "px " +
        ly +
        "px, color-mix(in srgb, " +
        hue +
        " 9%, transparent), transparent 70%), radial-gradient(ellipse 70% 50% at 50% 108%, color-mix(in srgb, " +
        hue +
        " 7%, transparent), transparent 60%)";

      // grid with mass
      const yOff = -((cam * 60) % SP);
      const gridAlpha = si === 4 ? 0.35 : 1;
      gtx.clearRect(0, 0, grid.width, grid.height);
      gtx.save();
      gtx.scale(dpr, dpr);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        let fx = (p.ox - p.x) * 0.06;
        let fy = (p.oy - p.y) * 0.06;
        if (fine) {
          const dx = p.x - ptr.px;
          const dy = p.y + yOff - ptr.py;
          const d = Math.hypot(dx, dy);
          if (d < 170 && d > 0.01) {
            const f = (1 - d / 170) * 2.4;
            fx += (dx / d) * f;
            fy += (dy / d) * f;
          }
        }
        p.vx = (p.vx + fx) * 0.88;
        p.vy = (p.vy + fy + scrollVel * 0.012 * (p.r / p.rows)) * 0.88;
        p.x += p.vx;
        p.y += p.vy;
      }
      gtx.strokeStyle = "rgba(139,155,245," + (0.06 * gridAlpha).toFixed(3) + ")";
      gtx.lineWidth = 1;
      gtx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        if (p.c < p.cols - 1) {
          const nb = pts[i + 1];
          gtx.moveTo(p.x, p.y + yOff);
          gtx.lineTo(nb.x, nb.y + yOff);
        }
        if (p.r < p.rows - 1) {
          const nb = pts[i + p.cols];
          gtx.moveTo(p.x, p.y + yOff);
          gtx.lineTo(nb.x, nb.y + yOff);
        }
      }
      gtx.stroke();
      gtx.fillStyle = "rgba(221,224,230," + (0.1 * gridAlpha).toFixed(3) + ")";
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        gtx.beginPath();
        gtx.arc(p.x, p.y + yOff, 1, 0, 6.283);
        gtx.fill();
      }
      gtx.restore();
    };

    /* Pause the loop offscreen; run on the shared ticker otherwise. */
    let running = false;
    const start = () => {
      if (running) return;
      gsap.ticker.add(tick);
      running = true;
    };
    const stop = () => {
      if (!running) return;
      gsap.ticker.remove(tick);
      running = false;
    };
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
    );
    io.observe(root);
    cleanup.push(() => {
      io.disconnect();
      stop();
    });

    return () => cleanup.forEach((fn) => fn());
  }, [reducedMotion]);

  const skipIntro = () => {
    const root = rootRef.current;
    if (!root) return;
    const target = root.offsetTop + root.offsetHeight - window.innerHeight;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  const cinematic = !reducedMotion;

  /* Plane base transforms. Reduced motion renders them in normal flow; the
     cinematic rig starts them stacked in Z (overwritten each frame). Mobile
     is forced back to flow via max-md classes on each plane. */
  const planeBase = (dz: number): React.CSSProperties =>
    reducedMotion
      ? {
          position: "relative",
          width: "min(1080px, 92vw)",
          margin: "0 auto",
          opacity: 1,
        }
      : {
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "min(1080px, 92vw)",
          transform: `translate(-50%,-50%) translateZ(${dz}px)`,
          opacity: dz === 0 ? 1 : 0,
        };

  return (
    <section
      ref={rootRef}
      id="os-intro"
      aria-label="PixelLayerr OS intro"
      className="os-intro relative hidden bg-deep md:block"
      style={{ height: reducedMotion ? "auto" : "650vh" }}
    >
      <div
        data-stage-pin
        className={
          cinematic
            ? "top-0 flex h-dvh flex-col overflow-hidden max-md:!static max-md:!h-auto max-md:gap-28 max-md:py-28 md:sticky"
            : "relative flex flex-col gap-28 py-28"
        }
        style={{ perspective: cinematic ? "1100px" : undefined }}
      >
        {cinematic && (
          <>
            {/* Reactive grid canvas */}
            <canvas
              data-grid
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full max-md:hidden"
            />
            {/* Reactive light */}
            <div
              data-light
              aria-hidden
              className="pointer-events-none absolute inset-0 max-md:hidden"
            />
          </>
        )}

        {/* World / planes */}
        <div
          className={
            cinematic
              ? "relative flex-1 max-md:flex max-md:flex-col max-md:gap-28"
              : "relative"
          }
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            data-world
            className={cinematic ? "absolute inset-0 max-md:static" : "static"}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* 00 · IDENTITY */}
            <section
              data-plane
              data-d="0"
              className="grid justify-items-center gap-6 text-center max-md:!static max-md:!transform-none max-md:!opacity-100"
              style={planeBase(0)}
            >
              <p
                className="text-[11px] tracking-[0.28em] text-muted"
                style={{ fontFamily: MONO }}
              >
                PXL/OS 1.0 · STUDIO RUNTIME
              </p>
              <div
                className="os-line font-display text-text"
                style={{
                  fontSize: "clamp(56px, 9vw, 120px)",
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                  lineHeight: 0.98,
                  margin: 0,
                }}
              >
                PixelLayerr
              </div>
              <p className="os-rise max-w-[540px] text-body-lg text-muted [text-wrap:balance]">
                We don&rsquo;t decorate websites. We <em>engineer</em>{" "}
                digital systems — and you&rsquo;re standing inside ours.
              </p>
              <div
                className="mt-2 flex flex-wrap items-baseline justify-center gap-x-6 gap-y-2 text-[10px] tracking-[0.18em] text-muted"
                style={{ fontFamily: MONO }}
                aria-hidden
              >
                <span>TRUSTED BY</span>
                {TRUSTED.map((c) => (
                  <span key={c} className="text-[#7A808C]">
                    {c}
                  </span>
                ))}
              </div>
              {cinematic && (
                <button
                  type="button"
                  onClick={skipIntro}
                  className="os-pulse mt-6 rounded-full border border-hairline px-4 py-1.5 text-[10px] tracking-[0.26em] text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus max-md:hidden"
                  style={{ fontFamily: MONO }}
                >
                  SCROLL TO ENTER ↓ · SKIP INTRO
                </button>
              )}
            </section>

            {/* 01 · CAPABILITIES */}
            <section
              data-plane
              data-d="1.2"
              className="grid gap-9 max-md:!static max-md:!transform-none max-md:!opacity-100"
              style={planeBase(-912)}
            >
              <div className="grid justify-items-center gap-2 text-center">
                <p
                  className="text-[11px] tracking-[0.22em] text-[#5B72F2]"
                  style={{ fontFamily: MONO }}
                >
                  SECTOR 01 · CAPABILITIES
                </p>
                <h2 className="font-display text-heading text-text">
                  Three running <em>services</em>.
                </h2>
              </div>
              <div
                className="flex flex-wrap justify-center gap-6"
                style={{ transformStyle: "preserve-3d" }}
              >
                {SERVICES.map((svc, i) => (
                  <div
                    key={svc.code}
                    className="grid w-[300px] max-w-full gap-3.5 rounded-2xl border border-hairline p-6 backdrop-blur-sm"
                    style={{
                      boxSizing: "border-box",
                      background:
                        "linear-gradient(155deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015))",
                      transform:
                        i === 0
                          ? "rotateY(10deg)"
                          : i === 2
                            ? "rotateY(-10deg)"
                            : undefined,
                    }}
                  >
                    <div
                      className="text-[10px] tracking-[0.2em]"
                      style={{ fontFamily: MONO, color: svc.hue }}
                    >
                      {svc.code}
                    </div>
                    <div className="text-[16.5px] font-semibold tracking-[-0.01em] text-text">
                      {svc.line}
                    </div>
                    <div className="mt-1 grid gap-[7px]">
                      <div className="h-1.5 rounded-full bg-white/[0.07]">
                        <div
                          data-svcbar
                          className="h-full w-0 rounded-full"
                          style={{ background: svc.bar }}
                        />
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.07]">
                        <div
                          data-svcbar
                          className="h-full w-0 rounded-full bg-white/20"
                        />
                      </div>
                    </div>
                    <div
                      className="text-[10.5px] tracking-[0.12em] text-[#7A808C]"
                      style={{ fontFamily: MONO }}
                    >
                      {svc.readout === "uptime" && (
                        <>
                          UPTIME{" "}
                          <span data-uptime className="text-[#DDE0E6]">
                            00:00:00
                          </span>
                        </>
                      )}
                      {svc.readout === "build" && (
                        <>
                          BUILD <span className="text-accent">✓ PASSING</span>
                        </>
                      )}
                      {svc.readout === "render" && (
                        <>
                          RENDER{" "}
                          <span data-fps className="text-[#DDE0E6]">
                            60FPS
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 02 · WORK */}
            <section
              data-plane
              data-d="2.4"
              className="grid gap-9 max-md:!static max-md:!transform-none max-md:!opacity-100"
              style={planeBase(-1824)}
            >
              <div className="grid justify-items-center gap-2 text-center">
                <p
                  className="text-[11px] tracking-[0.22em] text-[#B45CFF]"
                  style={{ fontFamily: MONO }}
                >
                  SECTOR 02 · WORK
                </p>
                <h2 className="font-display text-heading text-text">
                  Layered digital <em>surfaces</em>.
                </h2>
                <p className="text-small text-muted">
                  Every build ships in layers — they converge as you arrive.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-8">
                {WORK.map((w) => (
                  <div key={w.name} className="grid justify-items-center gap-3.5">
                    <div
                      data-stack
                      className="relative h-80 w-[290px] max-w-full"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Base layer: the project's REAL screenshot (captured
                          from the live site) under the frame chrome. */}
                      <div
                        data-sl="0"
                        className="absolute inset-0 overflow-hidden rounded-2xl border border-hairline"
                        style={{
                          background: "linear-gradient(170deg,#12141B,#0C0E13)",
                        }}
                      >
                        <div className="relative z-10 flex items-center gap-[5px] border-b border-white/[0.06] bg-[#0e1016]/90 p-3.5">
                          <span className="h-[7px] w-[7px] rounded-full bg-white/30" />
                          <span className="h-[7px] w-[7px] rounded-full bg-white/[0.18]" />
                          <span className="h-[7px] w-[7px] rounded-full bg-white/10" />
                          <span
                            className="ml-auto h-[9px] w-14 rounded-full"
                            style={{ background: `rgba(${w.hue},0.22)` }}
                          />
                        </div>
                        <Image
                          src={`/work/${w.slug}.webp`}
                          alt=""
                          aria-hidden
                          fill
                          sizes="290px"
                          className="object-cover object-top pt-[34px]"
                        />
                      </div>
                      <div
                        data-sl="1"
                        className="absolute inset-0 grid content-start gap-2 rounded-2xl px-[22px] py-11"
                        style={{
                          boxSizing: "border-box",
                          border: `1px dashed rgba(${w.hue},0.55)`,
                          background: `rgba(${w.hue},0.04)`,
                        }}
                      >
                        <div
                          className="h-2 w-3/5 rounded-full"
                          style={{ background: `rgba(${w.hue},0.35)` }}
                        />
                        <div
                          className="h-2 w-2/5 rounded-full"
                          style={{ background: `rgba(${w.hue},0.22)` }}
                        />
                        <div
                          className="h-2 w-[72%] rounded-full"
                          style={{ background: `rgba(${w.hue},0.14)` }}
                        />
                      </div>
                      <div
                        data-sl="2"
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: `radial-gradient(ellipse 70% 50% at 50% 30%, rgba(${w.hue},0.2), transparent 70%)`,
                          filter: "blur(2px)",
                        }}
                      />
                      <div
                        data-beam
                        aria-hidden
                        className="absolute top-[6%] right-[4%] left-[4%] h-0.5 rounded-full opacity-0"
                        style={{
                          background:
                            "linear-gradient(90deg,transparent,#C6FF5A,transparent)",
                        }}
                      />
                    </div>
                    <a
                      href={w.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit live site: ${w.name} (opens in new tab)`}
                      className="flex items-baseline gap-3.5"
                    >
                      <span className="text-[15px] font-semibold text-text">
                        {w.name}
                      </span>
                      <span
                        className="text-[10px] tracking-[0.16em] text-[#7A808C]"
                        style={{ fontFamily: MONO }}
                      >
                        {w.cat.toUpperCase()}
                      </span>
                      <span
                        className="text-[10px] tracking-[0.14em] text-accent"
                        style={{ fontFamily: MONO }}
                        aria-hidden
                      >
                        LIVE ↗
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* 03 · PROCESS */}
            <section
              data-plane
              data-d="3.6"
              className="grid gap-8 max-md:!static max-md:!transform-none max-md:!opacity-100"
              style={{ ...planeBase(-2736), width: "min(760px, 92vw)" }}
            >
              <div className="grid justify-items-center gap-2 text-center">
                <p
                  className="text-[11px] tracking-[0.22em] text-[#22D3EE]"
                  style={{ fontFamily: MONO }}
                >
                  SECTOR 03 · PROCESS
                </p>
                <h2 className="font-display text-heading text-text">
                  The architecture, <em>thinking</em>.
                </h2>
              </div>
              <div
                className="grid gap-[18px] rounded-2xl border border-hairline p-6 backdrop-blur-sm"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.045), rgba(255,255,255,0.014))",
                }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="text-[10px] tracking-[0.2em] text-[#7A808C]"
                    style={{ fontFamily: MONO }}
                  >
                    SYSTEM MONITOR · BUILD PIPELINE
                  </div>
                  <canvas
                    data-spark
                    width={560}
                    height={44}
                    className="h-[26px] w-[200px]"
                    aria-hidden
                  />
                </div>
                <div
                  className="grid gap-3 text-[11.5px]"
                  style={{ fontFamily: MONO }}
                >
                  {PROCESS.map((row) => (
                    <div
                      key={row.label}
                      className="grid items-center gap-4"
                      style={{ gridTemplateColumns: "150px 76px 1fr 84px" }}
                    >
                      <span className="text-[#DDE0E6]">{row.label}</span>
                      <span className="text-[#565B66]">{row.pid}</span>
                      <div className="h-[5px] rounded-full bg-white/[0.07]">
                        <div
                          data-pbar
                          className="h-full w-0 rounded-full"
                          style={{
                            background: "linear-gradient(90deg,#5B72F2,#22D3EE)",
                          }}
                        />
                      </div>
                      <span
                        data-pst
                        className="text-right text-[#565B66]"
                      >
                        QUEUED
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="text-center text-[10px] tracking-[0.2em] text-[#565B66]"
                style={{ fontFamily: MONO }}
              >
                END-TO-END · DESIGN TO DEPLOY · YOU OWN THE CODE
              </div>
            </section>

            {/* 04 · HANDOVER */}
            <section
              data-plane
              data-d="4.8"
              className="grid justify-items-center gap-7 max-md:!static max-md:!transform-none max-md:!opacity-100"
              style={{ ...planeBase(-3648), width: "min(680px, 92vw)" }}
            >
              <p
                className="text-[11px] tracking-[0.22em] text-accent"
                style={{ fontFamily: MONO }}
              >
                SECTOR 04 · HANDOVER
              </p>
              <div
                className="w-full rounded-[14px] border border-hairline p-7 text-[14px] leading-[1.9]"
                style={{
                  boxSizing: "border-box",
                  background: "#0C0E13",
                  fontFamily: MONO,
                  boxShadow: "0 30px 80px -30px rgba(0,0,0,0.8)",
                }}
              >
                <div>
                  <span className="text-accent">$</span>{" "}
                  <span data-cmd className="text-[#DDE0E6]" />
                  <span data-caret className="os-caret text-accent">
                    ▌
                  </span>
                </div>
                <div
                  data-resp
                  className="text-[#7A808C] opacity-0 transition-opacity duration-500"
                >
                  › system ready. we build the rest.
                </div>
              </div>
              <div
                className="text-center text-[10px] tracking-[0.18em] text-[#565B66]"
                style={{ fontFamily: MONO }}
              >
                NO RETAINER LOCK-IN · YOU OWN THE CODE
              </div>
              <a
                data-handover-cta
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border px-[30px] py-3.5 text-[12px] tracking-[0.18em] text-accent opacity-0 transition-[opacity,box-shadow] duration-700 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus max-md:!opacity-100"
                style={{ fontFamily: MONO, borderColor: "rgba(198,255,90,0.45)" }}
              >
                START A BUILD →
              </a>
            </section>
          </div>
        </div>

        {cinematic && (
          <>
        {/* HUD chrome — decorative, aria-hidden */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[5] flex items-center justify-between px-[26px] py-4 text-[10.5px] tracking-[0.16em] text-[#7A808C] max-md:hidden"
          style={{ fontFamily: MONO }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="inline-block h-[7px] w-[7px] rounded-full bg-accent"
              style={{ boxShadow: "0 0 10px 2px rgba(198,255,90,0.4)" }}
            />
            PXL/OS 1.0
          </div>
          <div data-sector className="text-[#DDE0E6]">
            00 · IDENTITY
          </div>
          <div className="flex items-center gap-[22px]">
            <span>
              DEPTH{" "}
              <span data-depth className="text-[#DDE0E6]">
                0.00
              </span>
            </span>
            <span data-clock>00:00:00</span>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
              className="pointer-events-auto rounded-full border px-3.5 py-1.5 text-[10px] tracking-[0.16em] text-accent"
              style={{ borderColor: "rgba(198,255,90,0.4)" }}
            >
              START A BUILD
            </a>
          </div>
        </div>

        {/* Progress rail */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-[5] h-0.5 bg-white/[0.06] max-md:hidden"
        >
          <div
            data-rail
            className="h-full w-0"
            style={{
              background: "linear-gradient(90deg,#5B72F2,#B45CFF,#22D3EE,#C6FF5A)",
            }}
          />
        </div>

        {/* Vignette */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[4] max-md:hidden"
          style={{
            background:
              "radial-gradient(ellipse 90% 75% at 50% 45%, transparent 55%, rgba(6,7,11,0.7))",
          }}
        />

        {/* Boot overlay */}
        <div
          data-boot
          aria-hidden
          className="absolute inset-0 z-[8] grid content-end p-10 text-[12px] leading-[2] text-[#7A808C] transition-opacity duration-500 max-md:hidden"
          style={{ background: "#07090e", fontFamily: MONO }}
        >
          {BOOT_LINES.map((line, i) => (
            <div
              key={line}
              data-bl
              className="os-boot-line"
              style={{
                color: i === BOOT_LINES.length - 1 ? "#DDE0E6" : undefined,
              }}
            >
              {line}
              {i < BOOT_LINES.length - 1 && (
                <span className="text-accent">ok</span>
              )}
            </div>
          ))}
        </div>
          </>
        )}
      </div>
    </section>
  );
}
