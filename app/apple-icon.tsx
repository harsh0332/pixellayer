import { ImageResponse } from "next/og";

/* Apple touch icon — the PixelLayerr layers mark, Pixelcliq blue and navy palette.
   Rendered at build time; apple devices ignore SVG favicons so this PNG
   covers home-screen bookmarks. */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const INK = "#082F57";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 11,
        background: "#A9CFF1",
      }}
    >
      <div
        style={{
          width: 101,
          height: 28,
          borderRadius: 8,
          background: INK,
        }}
      />
      <div
        style={{
          width: 101,
          height: 28,
          borderRadius: 8,
          background: INK,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          width: 62,
          height: 28,
          borderRadius: 8,
          background: INK,
          opacity: 0.28,
          alignSelf: "flex-start",
          marginLeft: 39,
        }}
      />
    </div>,
    size,
  );
}
