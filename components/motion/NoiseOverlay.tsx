/**
 * Soft film-grain overlay across the whole viewport. Pure CSS (tiled SVG
 * feTurbulence data-URI from --noise), zero runtime cost.
 */
export function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="bg-noise pointer-events-none fixed inset-0 z-50 opacity-[0.035]"
    />
  );
}
