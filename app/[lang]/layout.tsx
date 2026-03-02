import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { dictionaries, GlobalConfig, Locale } from "@/config/site-config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "pl" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale };
  const dict = dictionaries[lang];

  return {
    title: dict.seo.title,
    description: dict.seo.description,
    keywords: dict.seo.keywords,
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
  const dict = dictionaries[lang];

  return (
    <html lang={lang} className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <Navbar
          cta={dict.hero.primaryCTA}
          links={dict.navLinks}
          brandName={GlobalConfig.brand.name}
          lang={lang}
        />
        <main id="main-content">{children}</main>

        <Footer brand={GlobalConfig.brand} socials={GlobalConfig.socials} />
      </body>
    </html>
  );
}
