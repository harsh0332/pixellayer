import type { MetadataRoute } from "next";

import { SITE_ORIGIN } from "@/lib/studio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/design-system" },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
