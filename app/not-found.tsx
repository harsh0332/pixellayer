import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="content" className="ecosystem eco-missing">
      <div className="eco-container">
        <Link className="eco-logo" href="/" aria-label="PixelLayerr home">
          <span>
            pixellayerr<span className="eco-dot">.</span>
          </span>
        </Link>
        <p className="eco-label">404 / A LITTLE OFF THE MAP</p>
        <h1>
          This layer is missing.
          <br />
          <em>The possibilities aren’t.</em>
        </h1>
        <p>
          The page you’re looking for isn’t here. Come explore what we’re
          building.
        </p>
        <Link className="eco-action" href="/">
          Back to the studio <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </main>
  );
}
