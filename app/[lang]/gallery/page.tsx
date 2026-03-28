import type { Metadata } from "next";
import { GlobalConfig, Locale } from "@/config/site-config";
import Gallery from "@/components/sections/Gallery";
import JsonLdGallery from "@/components/seo/JsonLdGallery";
import { getDictionary } from "@/lib/generate-dictionaries";
import { getSectionBackground } from "@/lib/background-manager";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const seo = await getDictionary(lang, "seo");

  return {
    title: seo.gallery.title,
    description: seo.gallery.description,
    alternates: {
      canonical: `${GlobalConfig.brand.url}/${lang}/gallery`,
      languages: {
        "en-US": `${GlobalConfig.brand.url}/en/gallery`,
        "pl-PL": `${GlobalConfig.brand.url}/pl/gallery`,
      },
    },
    openGraph: {
      title: seo.gallery.title,
      description: seo.gallery.description,
      url: `${GlobalConfig.brand.url}/${lang}/gallery`,
      locale: lang === "pl" ? "pl_PL" : "en_US",
      alternateLocale: lang === "pl" ? "en_US" : "pl_PL",
      siteName: "Speed Queen Kraków",
    },
  };
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const [gallery, seo] = await Promise.all([
    getDictionary(lang, "gallery"),
    getDictionary(lang, "seo"),
  ]);

  return (
    <div className="pt-20" data-navbar-theme="dark">
      <JsonLdGallery
        images={gallery.images}
        galleryName={seo.jsonLd.galleryName}
        galleryDescription={seo.jsonLd.galleryDescription}
      />
      <Gallery content={gallery} lang={lang} bgImage={getSectionBackground(3)} />
    </div>
  );
}
