import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://expressweb-prototype.vercel.app/pl",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://expressweb-prototype.vercel.app/en",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  //   example dynamic:
  // const routes = ['', '/about', '/contact', '/services'].map((route) => ({
  //     url: `${siteConfig.url}${route}`,
  //     lastModified: new Date().toISOString(),
  //     changeFrequency: 'monthly' as const,
  //     priority: route === '' ? 1 : 0.8,
  //   }));
}
