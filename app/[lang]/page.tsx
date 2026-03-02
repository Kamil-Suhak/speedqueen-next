import { dictionaries, GlobalConfig, Locale } from "@/config/site-config";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import Contact from "@/components/Contact";
import PricingSingle from "@/components/PricingSingle";
import Pricing from "@/components/Pricing";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import { getGoogleReviews } from "@/actions/getReviews";
import Faq from "@/components/Faq";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = (await params) as { lang: Locale };
  const dict = dictionaries[lang];
  const reviews = await getGoogleReviews(lang);

  return (
    <>
      <Hero content={dict.hero} />
      <ServicesGrid head={dict.servicesHead} items={dict.services} />
      <Gallery content={dict.gallery} lang={lang} />
      {/* <PricingSingle content={dict.pricing[1]} /> */}
      {/* <Pricing plans={dict.pricing} title={dict.pricingHead.title} subtitle={dict.pricingHead.subtitle} /> */}
      <Reviews reviewWrapper={dict.review} reviews={reviews} />
      <Faq content={dict.faq} />
      <Contact content={dict.contact} brandInfo={GlobalConfig.brand} />
    </>
  );
}
