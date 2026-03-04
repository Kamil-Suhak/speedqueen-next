import type { MetadataRoute } from "next";
import { GlobalConfig } from "./config/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: `${GlobalConfig.brand.url}/sitemap.xml`,
  };
}
