import type { Metadata } from "next";

import { AmbientGlow } from "@/components/motion/AmbientGlow";
import { NoiseOverlay } from "@/components/motion/NoiseOverlay";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { blendWhite, contrast } from "./contrast";
import { MotionDemo } from "./MotionDemo";

export const metadata: Metadata = {
  title: "Design System",
  description:
    "Internal design-system reference for the PixelLayerr site — tokens, type scale, and motion.",
  robots: { index: false, follow: false },
};

/* Hex mirror of styles/tokens.css for contrast math — keep in sync. */
const HEX = {
  deep: "#07090E",
  base: "#0B0F16",
  elevated: "#0E121B",
  surfaceOnBase: blendWhite("#0B0F16", 0.04),
  surfaceHoverOnElevated: blendWhite("#0E121B", 0.07),
  text: "#F4F2EB",
  muted: "#969BA5",
  accent: "#C6FF5A",
  accentFill: "#C6FF5A",
  accentText: "#C6FF5A",
  accent2: "#87C2FF",
  success: "#7EE2A8",
  warn: "#E2B457",
  white: "#10130B",
};

function Ratio({ fg, bg, label }: { fg: string; bg: string; label: string }) {
  const r = contrast(fg, bg);
  const pass = r >= 4.5;
  return (
    <span className="inline-flex items-baseline gap-1 font-mono text-micro tabular-nums">
      <span className="text-muted">{label}</span>
      <span className={pass ? "text-success" : "text-warn"}>
        {r.toFixed(2)} {pass ? "AA" : "AA-large"}
      </span>
    </span>
  );
}

function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-10 flex items-baseline gap-4 border-b border-hairline pb-4">
      <span className="font-mono text-micro text-muted">{index}</span>
      <h2 className="font-display text-heading">{title}</h2>
    </div>
  );
}

function Swatch({
  name,
  hex,
  className,
  children,
}: {
  name: string;
  hex: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn("h-24 rounded-md border border-hairline", className)}
        style={{ background: hex }}
      />
      <div className="flex flex-col gap-0.5">
        <span className="text-small text-text">{name}</span>
        <span className="font-mono text-micro uppercase text-muted">
          {hex}
        </span>
        {children}
      </div>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="bg-base">
      <NoiseOverlay />

      {/* ---- Header ---- */}
      <header className="relative overflow-hidden border-b border-hairline">
        <AmbientGlow />
        <div className="container-site section-y-compact relative">
          <p className="mb-4 font-mono text-micro uppercase tracking-[0.08em] text-muted">
            PixelLayerr · Internal
          </p>
          <h1 className="font-display text-display-lg">Design System</h1>
          <p className="mt-4 max-w-xl text-body-lg text-muted">
            Deep blue-black, never pure black. Elevation through surface steps,
            one lime accent, expo-out motion. Every pairing on this page shows its
            measured WCAG contrast.
          </p>
        </div>
      </header>

      <div className="container-site flex flex-col gap-24 py-20">
        {/* ---- 01 Color ---- */}
        <section>
          <SectionHeading index="01" title="Color" />
          <h3 className="mb-4 text-title">Canvas — hue-tinted, never #000</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Swatch name="bg-deep" hex={HEX.deep}>
              <Ratio fg={HEX.text} bg={HEX.deep} label="text" />
              <Ratio fg={HEX.muted} bg={HEX.deep} label="muted" />
            </Swatch>
            <Swatch name="bg-base" hex={HEX.base}>
              <Ratio fg={HEX.text} bg={HEX.base} label="text" />
              <Ratio fg={HEX.muted} bg={HEX.base} label="muted" />
            </Swatch>
            <Swatch name="bg-elevated" hex={HEX.elevated}>
              <Ratio fg={HEX.text} bg={HEX.elevated} label="text" />
              <Ratio fg={HEX.muted} bg={HEX.elevated} label="muted" />
            </Swatch>
          </div>

          <h3 className="mt-12 mb-4 text-title">Accent — one hue, three roles</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Swatch name="accent · the lime signature" hex={HEX.accent} />
            <Swatch name="accent-fill · solid CTAs (ink labels)" hex={HEX.accentFill}>
              <Ratio fg={HEX.white} bg={HEX.accentFill} label="label" />
            </Swatch>
            <Swatch name="accent-text · links/labels (same lime)" hex={HEX.accentText}>
              <Ratio fg={HEX.accentText} bg={HEX.elevated} label="on elevated" />
            </Swatch>
            <Swatch
              name="accent-2 · aurora blue — gradients ONLY"
              hex={HEX.accent2}
            />
          </div>

          <h3 className="mt-12 mb-4 text-title">Text & feedback</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Swatch name="text · warm off-white" hex={HEX.text} />
            <Swatch name="text-muted" hex={HEX.muted} />
            <Swatch name="success" hex={HEX.success}>
              <Ratio fg={HEX.success} bg={HEX.base} label="on base" />
            </Swatch>
            <Swatch name="warn" hex={HEX.warn}>
              <Ratio fg={HEX.warn} bg={HEX.base} label="on base" />
            </Swatch>
          </div>
        </section>

        {/* ---- 02 Typography ---- */}
        <section>
          <SectionHeading index="02" title="Typography" />
          <p className="mb-10 max-w-xl text-body text-muted">
            DM Sans for display and body, DM Mono for labels, Instrument Serif
            for italic accent words. One modular clamp() scale — sizes below
            are live.
          </p>
          <div className="flex flex-col gap-8">
            {[
              {
                cls: "font-display text-display-xl",
                name: "display-xl · clamp(44–80px) · lh 1.02 · ls −0.03em",
                sample: "Engineering, considered.",
              },
              {
                cls: "font-display text-display-lg",
                name: "display-lg · clamp(36–56px) · lh 1.06 · ls −0.025em",
                sample: "Products built with precision",
              },
              {
                cls: "font-display text-heading",
                name: "heading · clamp(28–40px) · lh 1.12 · ls −0.02em",
                sample: "A section heading",
              },
              {
                cls: "text-title",
                name: "title · clamp(20–24px) · lh 1.3 · ls −0.01em",
                sample: "A card or block title",
              },
              {
                cls: "text-body-lg text-muted",
                name: "body-lg · 18px · lh 1.65",
                sample:
                  "Lead paragraph text. Design and engineering as one discipline, from first wireframe to production deploy.",
              },
              {
                cls: "text-body text-muted",
                name: "body · 16px · lh 1.65",
                sample:
                  "Default body text. The quick brown fox jumps over the lazy dog, 0123456789.",
              },
              {
                cls: "text-small text-muted",
                name: "small · 14px · lh 1.55",
                sample: "Supporting text, captions, meta information.",
              },
              {
                cls: "text-micro uppercase tracking-[0.08em] text-muted",
                name: "micro · 12px · lh 1.4 · ls +0.08em",
                sample: "Overline · Label · Eyebrow",
              },
            ].map((step) => (
              <div
                key={step.name}
                className="grid grid-cols-1 gap-2 border-b border-hairline pb-8 lg:grid-cols-[280px_1fr] lg:gap-8"
              >
                <span className="font-mono text-micro text-muted">
                  {step.name}
                </span>
                <p className={step.cls}>{step.sample}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---- 03 Spacing ---- */}
        <section>
          <SectionHeading index="03" title="Spacing & Layout" />
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h3 className="mb-4 text-title">8pt scale</h3>
              <div className="flex flex-col gap-3">
                {[2, 4, 6, 8, 12, 16, 24, 32].map((step) => (
                  <div key={step} className="flex items-center gap-4">
                    <span className="w-24 font-mono text-micro tabular-nums text-muted">
                      {step} · {step * 4}px
                    </span>
                    <div
                      className="h-4 rounded-[2px] bg-accent/60"
                      style={{ width: `${step * 4}px` }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-title">Rhythm</h3>
              <dl className="flex flex-col gap-4">
                {[
                  ["--section-y", "clamp(96px → 160px) section padding"],
                  ["--section-y-compact", "clamp(64px → 96px)"],
                  ["--container-max", "1240px centered container"],
                  ["--container-px", "clamp(24px → 64px) side padding"],
                ].map(([token, desc]) => (
                  <div
                    key={token}
                    className="flex flex-col gap-1 border-b border-hairline pb-4"
                  >
                    <dt className="font-mono text-small text-accent-text">
                      {token}
                    </dt>
                    <dd className="text-small text-muted">{desc}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ---- 04 Elevation ---- */}
        <section>
          <SectionHeading index="04" title="Elevation — surface steps, not shadows" />
          <div className="rounded-lg bg-deep p-6 sm:p-10">
            <span className="font-mono text-micro text-muted">bg-deep</span>
            <div className="mt-4 rounded-lg bg-base p-6 sm:p-10">
              <span className="font-mono text-micro text-muted">bg-base</span>
              <div className="mt-4 rounded-lg bg-elevated p-6 sm:p-10">
                <span className="font-mono text-micro text-muted">
                  bg-elevated
                </span>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-md border border-hairline bg-surface p-5">
                    <p className="text-small">surface + hairline</p>
                    <p className="mt-1 text-small text-muted">
                      Default card treatment.
                    </p>
                  </div>
                  <div className="rounded-md border border-hairline-strong bg-surface-hover p-5 shadow-soft">
                    <p className="text-small">surface-hover + shadow-soft</p>
                    <p className="mt-1 text-small text-muted">
                      Hover / floating state only.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- 05 Buttons ---- */}
        <section>
          <SectionHeading index="05" title="Buttons & States" />
          <div className="flex flex-col gap-8">
            {(["primary", "secondary", "ghost"] as const).map((variant) => (
              <div
                key={variant}
                className="grid grid-cols-1 items-center gap-4 border-b border-hairline pb-8 lg:grid-cols-[280px_1fr]"
              >
                <span className="font-mono text-micro text-muted">
                  {variant}
                </span>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant={variant} size="lg">
                    Start a project
                  </Button>
                  <Button variant={variant}>Start a project</Button>
                  <Button variant={variant} disabled>
                    Disabled
                  </Button>
                </div>
              </div>
            ))}
            <p className="text-small text-muted">
              Hover: ≤8px lift, 200ms expo-out. Active: scale 0.98. Focus: 2px
              ring in <span className="font-mono">--focus</span> (tab to see).
              No bounce anywhere.
            </p>
          </div>
        </section>

        {/* ---- 06 Ambient ---- */}
        <section>
          <SectionHeading index="06" title="Ambient — how color enters the canvas" />
          <div className="relative overflow-hidden rounded-lg border border-hairline bg-deep">
            <AmbientGlow />
            <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.035]" />
            <div className="relative flex min-h-72 flex-col items-start justify-end gap-2 p-6 sm:p-10">
              <p className="font-display text-title">
                AmbientGlow + NoiseOverlay
              </p>
              <p className="max-w-md text-small text-muted">
                Accent → accent-2 radial blobs at low opacity, breathing over
                12s. Grain at 3.5%. Frozen under prefers-reduced-motion. Never
                a flat gradient fill.
              </p>
            </div>
          </div>
        </section>

        {/* ---- 07 Motion ---- */}
        <section>
          <SectionHeading index="07" title="Motion" />
          <p className="mb-8 max-w-xl text-body text-muted">
            One easing — expo-out{" "}
            <span className="font-mono text-small">
              cubic-bezier(0.16, 1, 0.3, 1)
            </span>{" "}
            — at three durations. Transform and opacity only.
          </p>
          <MotionDemo />
        </section>
      </div>

      <footer className="border-t border-hairline">
        <div className="container-site py-10">
          <p className="text-small text-muted">
            PixelLayerr design system · internal reference
          </p>
        </div>
      </footer>
    </main>
  );
}
