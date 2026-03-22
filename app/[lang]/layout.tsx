import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { GlobalConfig, Locale } from "@/config/site-config";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SocialSidebar from "@/components/layout/SocialSidebar";
import "@/styles/globals.css";
import { getDictionary } from "@/lib/generate-dictionaries";

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
  const [navigation] = await Promise.all([
    getDictionary(lang, "navigation"),
  ]);

  const callNowText = lang === "en" ? "Call Now" : "Zadzwoń Teraz";

  return (
    <html lang={lang} className={`scroll-smooth ${inter.variable} ${montserrat.variable}`} data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
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

        <Footer brand={GlobalConfig.brand} socials={GlobalConfig.socials} links={navigation.footerLinks} lang={lang} />
      </body>
    </html>
  );
}
