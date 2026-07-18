import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "PixelLayerr — Digital products, designed and engineered as one.";

/* Branded OG card on the design tokens: cool-ink canvas, ambient glow,
   wordmark + positioning line. Rendered at build time, no dependency. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: "#0E1014",
          backgroundImage:
            "radial-gradient(800px 500px at 20% -10%, rgba(91,114,242,0.28), transparent 65%), radial-gradient(600px 400px at 75% 0%, rgba(34,211,238,0.12), transparent 65%)",
          color: "#EDEDEF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em" }}>
          PixelLayerr
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
            }}
          >
            <span>Digital products, designed</span>
            <span>and engineered as one.</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 27,
              color: "#8A8F98",
              letterSpacing: "0.01em",
            }}
          >
            Digital Product Engineering Studio
          </div>
        </div>
      </div>
    ),
    size,
  );
}
