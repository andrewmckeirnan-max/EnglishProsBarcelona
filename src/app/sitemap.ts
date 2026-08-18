import type { MetadataRoute } from "next";
import { areas, visibleCategories } from "@/lib/data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/partners`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const areaPages: MetadataRoute.Sitemap = areas.map((a) => ({
    url: `${BASE_URL}/${a.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = areas.flatMap((a) =>
    visibleCategories.map((c) => ({
      url: `${BASE_URL}/${a.slug}/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }))
  );

  return [...staticPages, ...areaPages, ...categoryPages];
}
