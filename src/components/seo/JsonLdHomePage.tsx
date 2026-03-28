import { GlobalConfig } from "@/config/site-config";

interface FaqItem {
  question: string;
  answer: string;
}

interface ServiceItem {
  title: string;
  description: string;
}

interface PricingItem {
  name: string;
  description: string;
  standardPrice: number;
  isPerCycle?: boolean;
}

interface PricingCategory {
  id: string;
  items: PricingItem[];
}

interface ServiceMatchKeywords {
  washService: string[];
  dryService: string[];
  washPricing: string;
  dryPricing: string;
}

interface JsonLdHomePageProps {
  faqItems: FaqItem[];
  serviceItems: ServiceItem[];
  pricingCategories: PricingCategory[];
  serviceMatchKeywords: ServiceMatchKeywords;
}

/** Strip custom markdown-like markers used in config strings */
function stripMarkers(text: string): string {
  return text
    .replace(/\[\[|]]/g, "")
    .replace(/!!|!!/g, "")
    .replace(/\(\(|\)\)/g, "");
}

function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: stripMarkers(item.question),
      acceptedAnswer: {
        "@type": "Answer",
        text: stripMarkers(item.answer),
      },
    })),
  };
}

function buildServiceSchemas(
  serviceItems: ServiceItem[],
  pricingCategories: PricingCategory[],
  keywords: ServiceMatchKeywords,
) {
  const allPricingItems = pricingCategories.flatMap((cat) => cat.items);

  return serviceItems.map((service) => {
    const schema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: stripMarkers(service.description),
      provider: {
        "@type": "Organization",
        name: GlobalConfig.brand.name,
        url: GlobalConfig.brand.url,
      },
      areaServed: {
        "@type": "City",
        name: "Kraków",
        "@id": "https://www.wikidata.org/wiki/Q31487",
      },
    };

    const relatedOffers = matchPricingToService(
      service.title,
      allPricingItems,
      keywords,
    );
    if (relatedOffers.length > 0) {
      schema.offers = relatedOffers.map((item) => ({
        "@type": "Offer",
        name: item.name,
        description: stripMarkers(item.description),
        price: item.standardPrice,
        priceCurrency: "PLN",
        availability: "https://schema.org/InStock",
      }));
    }

    return schema;
  });
}

/** Match pricing items to services using configurable keywords */
function matchPricingToService(
  serviceTitle: string,
  pricingItems: PricingItem[],
  keywords: ServiceMatchKeywords,
): PricingItem[] {
  const title = serviceTitle.toLowerCase();

  if (keywords.washService.some((kw) => title.includes(kw))) {
    return pricingItems.filter((p) =>
      p.name.toLowerCase().includes(keywords.washPricing),
    );
  }
  if (keywords.dryService.some((kw) => title.includes(kw))) {
    return pricingItems.filter((p) =>
      p.name.toLowerCase().includes(keywords.dryPricing),
    );
  }
  return [];
}

export default function JsonLdHomePage({
  faqItems,
  serviceItems,
  pricingCategories,
  serviceMatchKeywords,
}: JsonLdHomePageProps) {
  const faqSchema = buildFaqSchema(faqItems);
  const serviceSchemas = buildServiceSchemas(
    serviceItems,
    pricingCategories,
    serviceMatchKeywords,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {serviceSchemas.map((schema, i) => (
        <script
          key={`service-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
