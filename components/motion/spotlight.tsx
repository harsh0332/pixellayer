"use client";

import type { MouseEvent } from "react";

/**
 * Shared mouse-tracking card spotlight. Attach `spotlightMove` to a
 * positioned `.group` element and render `<SpotlightOverlay />` inside it.
 * Keyboard parity: the overlay also shows (centered — the CSS var defaults)
 * on focus-within, so the affordance isn't hover-only.
 */
export function spotlightMove(event: MouseEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty(
    "--mx",
    `${event.clientX - rect.left}px`,
  );
  event.currentTarget.style.setProperty(
    "--my",
    `${event.clientY - rect.top}px`,
  );
}

export function SpotlightOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out-expo group-hover:opacity-100 group-focus-within:opacity-100"
      style={{
        background:
          "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.06), transparent 70%)",
      }}
    />
  );
}
