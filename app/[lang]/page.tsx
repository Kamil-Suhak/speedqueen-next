import { GlobalConfig, Locale } from "@/config/site-config";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import Contact from "@/components/Contact";
import PricingTabs, { PricingProps } from "@/components/PricingTabs";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import Faq from "@/components/Faq";

import { getDictionary } from "@/lib/generate-dictionaries";
import { getGoogleReviews } from "@/actions/getReviews";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  const [
    hero,
    services,
    gallery,
    pricing,
    reviewsContent,
    faq,
    contact,
    googleReviews,
  ] = await Promise.all([
    getDictionary(lang, "hero"),
    getDictionary(lang, "services"),
    getDictionary(lang, "gallery"),
    getDictionary(lang, "pricing"),
    getDictionary(lang, "reviews"),
    getDictionary(lang, "faq"),
    getDictionary(lang, "contact"),
    getGoogleReviews(lang),
  ]);

  return (
    <>
      <Hero content={hero} />
      <ServicesGrid head={services.head} items={services.items} />
      <Gallery content={gallery} lang={lang} />
      <PricingTabs {...(pricing as PricingProps)} />
      <Reviews reviewWrapper={reviewsContent} reviews={googleReviews} />
      <Faq content={faq} />
      <Contact content={contact} brandInfo={GlobalConfig.brand} />
    </>
  );
}
