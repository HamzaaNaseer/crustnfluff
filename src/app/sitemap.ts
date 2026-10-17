import type { MetadataRoute } from "next";
import { areas, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    ...areas.map((a) => ({
      url: `${site.url}/cake-delivery/${a.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
