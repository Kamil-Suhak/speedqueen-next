import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { GlobalConfig, Locale } from "@/config/site-config";
import Navbar from "@/components/layout/Navbar";
import AnnouncementBar from "@/components/ui/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import SocialSidebar from "@/components/layout/SocialSidebar";
import JsonLdBase from "@/components/seo/JsonLdBase";
import { getDictionary } from "@/lib/generate-dictionaries";
import { getLocationRatings } from "@/lib/getLocationRatings";
import "@/styles/globals.css";

// Configure Inter for body text
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: 'swap',
});

// Configure Montserrat for headings
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800", "900"],
  variable: "--font-montserrat",
  display: 'swap',
});

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

  const ogLocale = lang === "pl" ? "pl_PL" : "en_US";
  const ogLocaleAlt = lang === "pl" ? "en_US" : "pl_PL";

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    metadataBase: new URL(GlobalConfig.brand.url),
    icons: {
      icon: "/images/logo.png",
      apple: "/images/logo.png",
    },
    alternates: {
      canonical: `${GlobalConfig.brand.url}/${lang}`,
      languages: {
        "en-US": `${GlobalConfig.brand.url}/en`,
        "pl-PL": `${GlobalConfig.brand.url}/pl`,
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      alternateLocale: ogLocaleAlt,
      siteName: "Speed Queen Kraków",
      title: seo.title,
      description: seo.description,
      url: `${GlobalConfig.brand.url}/${lang}`,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
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
  const [navigation, ratings, seo] = await Promise.all([
    getDictionary(lang, "navigation"),
    getLocationRatings(),
    getDictionary(lang, "seo"),
  ]);

  const callNowText = lang === "en" ? "Call Now" : "Zadzwoń Teraz";

  return (
    <html lang={lang} className={`scroll-smooth ${inter.variable} ${montserrat.variable}`} data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <JsonLdBase seo={seo} ratings={ratings} />
        <AnnouncementBar locations={GlobalConfig.brand.locations} />
        <Navbar
          ctaText={callNowText}
          links={navigation.navLinks}
          brandName={GlobalConfig.brand.name}
          lang={lang}
        />
        <SocialSidebar />
        <main id="main-content" className="w-full overflow-x-hidden">
          {children}
        </main>

        <Footer
          brand={GlobalConfig.brand}
          socials={GlobalConfig.socials}
          links={navigation.footerLinks}
          lang={lang}
          footerLabels={navigation.footerLabels}
        />
      </body>
    </html>
  );
}

