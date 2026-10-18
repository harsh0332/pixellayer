import type { MetadataRoute } from "next";
import { STUDIO_SERVICES } from "@/lib/services";
import { ALL_PROJECTS, SITE_ORIGIN } from "@/lib/studio";
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    "",
    "/services",
    "/work",
    "/approach",
    "/studio",
    "/contact",
    "/website-audit",
    ...STUDIO_SERVICES.map((s) => `/services/${s.slug}`),
    ...ALL_PROJECTS.map((p) => `/work/${p.slug}`),
  ];
  return pages.map((path) => ({
    url: `${SITE_ORIGIN}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path.split("/").length > 2 ? 0.7 : 0.8,
  }));
}
