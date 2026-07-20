/*
 * Typed boundary for the vendored PixelLayerr Motion v2 .jsx components.
 * TS infers their destructured props as required; we loosen them here (same
 * pattern as animkit/index.ts) rather than editing the vendor files.
 */
import type { ComponentType } from "react";

import AnimatedEyebrowRaw from "./AnimatedEyebrow";
import AnimatedLogoRaw from "./AnimatedLogo";
import IndustrySelectorMotionRaw from "./IndustrySelectorMotion";
import LogoMarqueeMotionRaw from "./LogoMarqueeMotion";
import NavBarMotionRaw from "./NavBarMotion";
import ProcessGridMotionRaw from "./ProcessGridMotion";
import SectionHeadingMotionRaw from "./SectionHeadingMotion";
import ProjectCarouselMotionRaw from "./ProjectCarouselMotion";
import SectionRevealRaw from "./SectionReveal";
import ServiceAccordionMotionRaw from "./ServiceAccordionMotion";
import ServiceCardMotionRaw from "./ServiceCardMotion";
import StatCounterMotionRaw from "./StatCounterMotion";
import TestimonialDeckMotionRaw from "./TestimonialDeckMotion";

export type LooseProps = Record<string, unknown>;
type C = ComponentType<LooseProps>;

export const AnimatedEyebrow = AnimatedEyebrowRaw as unknown as C;
export const AnimatedLogo = AnimatedLogoRaw as unknown as C;
export const IndustrySelectorMotion = IndustrySelectorMotionRaw as unknown as C;
export const LogoMarqueeMotion = LogoMarqueeMotionRaw as unknown as C;
export const NavBarMotion = NavBarMotionRaw as unknown as C;
export const ProcessGridMotion = ProcessGridMotionRaw as unknown as C;
export const SectionHeadingMotion = SectionHeadingMotionRaw as unknown as C;
export const ProjectCarouselMotion = ProjectCarouselMotionRaw as unknown as C;
export const SectionReveal = SectionRevealRaw as unknown as C;
export const ServiceAccordionMotion = ServiceAccordionMotionRaw as unknown as C;
export const ServiceCardMotion = ServiceCardMotionRaw as unknown as C;
export const StatCounterMotion = StatCounterMotionRaw as unknown as C;
export const TestimonialDeckMotion = TestimonialDeckMotionRaw as unknown as C;
