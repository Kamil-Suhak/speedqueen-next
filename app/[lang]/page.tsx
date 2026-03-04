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
import { getSectionBackground } from "@/lib/background-manager";

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
      <Hero content={hero} bgImage={getSectionBackground(0)} />
      <ServicesGrid head={services.head} items={services.items} bgImage={getSectionBackground(1)} />
      <Gallery content={gallery} lang={lang} bgImage={getSectionBackground(2)} />
      <PricingTabs 
        {...(pricing as PricingProps)} 
        bgImage={getSectionBackground(3)} 
        showToggle={false}
      />
      <Reviews reviewWrapper={reviewsContent} reviews={googleReviews} bgImage={getSectionBackground(4)} />
      <Faq content={faq} bgImage={getSectionBackground(5)} />
      <Contact content={contact} brandInfo={GlobalConfig.brand} bgImage={getSectionBackground(6)} />
    </>
  );
}
