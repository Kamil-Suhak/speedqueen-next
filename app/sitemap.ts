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
  ];
}
