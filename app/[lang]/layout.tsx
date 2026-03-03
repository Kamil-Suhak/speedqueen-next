import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GlobalConfig, Locale } from "@/config/site-config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/styles/globals.css";
import { getDictionary } from "@/lib/generate-dictionaries";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pl" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale };
  const seo = await getDictionary(lang, "seo");

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    metadataBase: new URL(GlobalConfig.brand.url),
    alternates: {
      canonical: `${GlobalConfig.brand.url}/${lang}`,
      languages: {
        "en-US": `${GlobalConfig.brand.url}/en`,
        "pl-PL": `${GlobalConfig.brand.url}/pl`,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const [navigation, hero] = await Promise.all([
    getDictionary(lang, "navigation"),
    getDictionary(lang, "hero"),
  ]);

  return (
    <html lang={lang} className="scroll-smooth">
      <body className={`${inter.className} antialiased overflow-x-hidden`}>
        <Navbar
          cta={hero.primaryCTA}
          links={navigation.navLinks}
          brandName={GlobalConfig.brand.name}
          lang={lang}
        />
        <main id="main-content" className="w-full overflow-x-hidden">
          {children}
        </main>

        <Footer brand={GlobalConfig.brand} socials={GlobalConfig.socials} />
      </body>
    </html>
  );
}
