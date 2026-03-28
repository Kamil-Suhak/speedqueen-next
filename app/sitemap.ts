import type { MetadataRoute } from "next";
import { GlobalConfig } from "@/config/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${GlobalConfig.brand.url}/pl`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${GlobalConfig.brand.url}/en`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${GlobalConfig.brand.url}/pl/gallery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${GlobalConfig.brand.url}/en/gallery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}

