import { GlobalConfig, Locale } from "@/config/site-config";
import Hero from "@/components/sections/Hero";
import Instructions from "@/components/sections/Instructions";
// import ServicesGrid from "@/components/sections/ServicesGrid";
import Contact from "@/components/sections/Contact";
import PricingTabs, { PricingProps } from "@/components/sections/PricingTabs";
import Reviews from "@/components/sections/Reviews";
import Faq from "@/components/sections/Faq";
import PromoModal from "@/components/modals/PromoModal";
import JsonLdHomePage from "@/components/seo/JsonLdHomePage";

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
    instructions,
    services,
    pricing,
    reviewsContent,
    faq,
    contact,
    discount,
    common,
    seo,
    googleReviews,
  ] = await Promise.all([
    getDictionary(lang, "hero"),
    getDictionary(lang, "instructions"),
    getDictionary(lang, "services"),
    getDictionary(lang, "pricing"),
    getDictionary(lang, "reviews"),
    getDictionary(lang, "faq"),
    getDictionary(lang, "contact"),
    getDictionary(lang, "discount"),
    getDictionary(lang, "common"),
    getDictionary(lang, "seo"),
    getGoogleReviews(lang),
  ]);

  const promoContent = {
    discount,
    common,
  };

  return (
    <>
      <JsonLdHomePage
        faqItems={faq.items}
        serviceItems={services.items}
        pricingCategories={pricing.content.categories}
        serviceMatchKeywords={seo.jsonLd.serviceMatchKeywords}
      />
      <PromoModal content={promoContent} />
      <Hero content={hero} />
      <Instructions content={instructions} bgImage={getSectionBackground(1)} />
      {/* <ServicesGrid head={services.head} items={services.items} bgImage={getSectionBackground(1)} /> */}
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

