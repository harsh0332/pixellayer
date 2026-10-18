import { ImageResponse } from "next/og";
import { BrandArtwork } from "./artwork";
export const dynamic = "force-static";
export function GET() {
  return new ImageResponse(<BrandArtwork />, { width: 1200, height: 630 });
}
