/** WCAG 2.x contrast math for the style-guide swatches. */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
}

function srgbToLin(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
}

export function contrast(fg: string, bg: string): number {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** Composite a white overlay of given alpha onto an opaque base color. */
export function blendWhite(baseHex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(baseHex);
  const f = (c: number) => Math.round(c + (255 - c) * alpha);
  return (
    "#" +
    [f(r), f(g), f(b)].map((c) => c.toString(16).padStart(2, "0")).join("")
  );
}
