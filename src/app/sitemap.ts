import type { MetadataRoute } from "next";
import { areas, visibleCategories } from "@/lib/data";
import { getAllBlogPosts } from "@/lib/blog";
import { SITE_URL as BASE_URL } from "@/lib/site";



export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/partners`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
  ];

  const blogPages: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
    lastModified: post.updatedDate || post.publishedDate,
  }));

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

  return [...staticPages, ...blogPages, ...areaPages, ...categoryPages];
}
