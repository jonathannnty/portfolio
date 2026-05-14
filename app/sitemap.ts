import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { posts } from "@/content/blog";

const BASE = "https://www.jonathan-ty.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE}/about`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/projects`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${BASE}/projects/${p.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
