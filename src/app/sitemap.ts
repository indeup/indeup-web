import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { guideArticles } from "@/lib/guideArticles";

export const dynamic = "force-static";

const siteUrl = "https://indeup.com";
const lastModified = "2026-07-21";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/brand/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/products/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      images: [`${siteUrl}/indeup_series.jpg`],
    },
    {
      url: `${siteUrl}/custom-fit/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/support/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/guide/`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.6,
    },
    ...guideArticles.map((a) => ({
      url: `${siteUrl}/guide/${a.slug}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5,
      ...(a.images && a.images.length > 0 && { images: a.images.map((img) => `${siteUrl}${img.src}`) }),
    })),
    ...products.map((p) => ({
      url: `${siteUrl}/products/${p.slug}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: [`${siteUrl}${p.image}`],
    })),
    {
      url: `${siteUrl}/privacy/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
