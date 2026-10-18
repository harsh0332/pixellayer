import { ImageResponse } from "next/og";
import { BrandArtwork } from "../brand-image/artwork";
export const dynamic = "force-static";
export function GET() {
  return new ImageResponse(<BrandArtwork square />, { width: 1080, height: 1080 });
}
