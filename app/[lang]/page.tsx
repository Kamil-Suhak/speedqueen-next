import { GlobalConfig, Locale } from "@/config/site-config";
import Hero from "@/components/sections/Hero";
import ServicesGrid from "@/components/sections/ServicesGrid";
import Contact from "@/components/sections/Contact";
import PricingTabs, { PricingProps } from "@/components/sections/PricingTabs";
import Reviews from "@/components/sections/Reviews";
import Faq from "@/components/sections/Faq";
import PromoModal from "@/components/modals/PromoModal";

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
    pricing,
    reviewsContent,
    faq,
    contact,
    discount,
    common,
    googleReviews,
  ] = await Promise.all([
    getDictionary(lang, "hero"),
    getDictionary(lang, "services"),
    getDictionary(lang, "pricing"),
    getDictionary(lang, "reviews"),
    getDictionary(lang, "faq"),
    getDictionary(lang, "contact"),
    getDictionary(lang, "discount"),
    getDictionary(lang, "common"),
    getGoogleReviews(lang),
  ]);

  const promoContent = {
    discount,
    common,
  };

  return (
    <>
      <PromoModal content={promoContent} />
      <Hero content={hero} />
      <ServicesGrid head={services.head} items={services.items} bgImage={getSectionBackground(1)} />
      <PricingTabs
        {...(pricing as PricingProps)}
        bgImage={getSectionBackground(2)}
      />
      <Reviews reviewWrapper={reviewsContent} reviews={googleReviews} bgImage={getSectionBackground(4)} />
      <Faq content={faq} bgImage={getSectionBackground(5)} />
      <Contact content={contact} brandInfo={GlobalConfig.brand} bgImage={getSectionBackground(6)} />
    </>
  );
}
