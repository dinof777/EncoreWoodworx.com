import type { MetadataRoute } from "next";
import { getListingSlugs } from "@/lib/etsy";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 3600;

const SITE = "https://www.encorewoodworx.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [slugs, posts] = await Promise.all([getListingSlugs(), getAllPosts()]);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/shop-tips`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/basket`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE}/live-blended`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const listingRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${SITE}/shop/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/shop-tips/${p.slug}`,
    lastModified: new Date(`${p.date}T12:00:00Z`),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...listingRoutes, ...postRoutes];
}
