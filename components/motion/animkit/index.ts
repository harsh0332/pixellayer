/*
 * Typed boundary for the vendored .jsx motion-library components: TS infers
 * their destructured props (className, style, …) as required, so we loosen
 * them here instead of editing the vendor files.
 */
import type { ComponentType } from "react";

import StackedCardCarouselRaw from "./StackedCardCarousel";
import TiltSpotlightCardRaw from "./TiltSpotlightCard";

export type LooseProps = Record<string, unknown>;

export const TiltSpotlightCard =
  TiltSpotlightCardRaw as unknown as ComponentType<LooseProps>;
export const StackedCardCarousel =
  StackedCardCarouselRaw as unknown as ComponentType<LooseProps>;
