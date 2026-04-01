import { GlobalConfig, Locations } from "@/config/site-config";
import { LocationRating } from "@/lib/getLocationRatings";

interface JsonLdSeo {
  description: string;
  jsonLd: {
    inLanguage: string;
    locationDescription: string;
    paymentAccepted: string;
  };
}

interface JsonLdBaseProps {
  seo: JsonLdSeo;
  ratings: LocationRating[];
}

// Map location names to their structured address data
const locationDetails: Record<
  string,
  {
    streetAddress: string;
    postalCode: string;
    hours: string;
    placeKey: string;
  }
> = {
  Orlińskiego: {
    streetAddress: "Bolesława Orlińskiego 1/U17",
    postalCode: "31-878",
    hours: "Mo-Su 06:00-02:00",
    placeKey: "orlinskiego",
  },
  "Pawia/Szlak": {
    streetAddress: "Pawia 34",
    postalCode: "31-153",
    hours: "Mo-Su 00:00-23:59",
    placeKey: "pawia",
  },
  Słowackiego: {
    streetAddress: "Aleja Juliusza Słowackiego 56",
    postalCode: "30-003",
    hours: "Mo-Su 00:00-23:59",
    placeKey: "slowackiego",
  },
};

function buildLocalBusinessSchema(
  location: (typeof Locations)[number],
  seo: JsonLdSeo,
  ratings: LocationRating[],
) {
  const details = locationDetails[location.name];
  if (!details) return null;

  const locationRating = ratings.find((r) => r.placeId === details.placeKey);

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    additionalType: "https://schema.org/Laundromat",
    "@id": `${GlobalConfig.brand.url}/#location-${details.placeKey}`,
    name: `Speed Queen Kraków – ${location.name}`,
    description: seo.jsonLd.locationDescription,
    url: GlobalConfig.brand.url,
    telephone: GlobalConfig.brand.phone,
    email: GlobalConfig.brand.email,
    image: `${GlobalConfig.brand.url}/images/logo.png`,
    logo: `${GlobalConfig.brand.url}/images/logo.png`,
    priceRange: "$$",
    currenciesAccepted: "PLN",
    paymentAccepted: seo.jsonLd.paymentAccepted,
    address: {
      "@type": "PostalAddress",
      streetAddress: details.streetAddress,
      addressLocality: "Kraków",
      postalCode: details.postalCode,
      addressRegion: "Małopolskie",
      addressCountry: "PL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: location.lat,
      longitude: location.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: details.hours.includes("06:00") ? "06:00" : "00:00",
      closes: details.hours.includes("02:00") ? "02:00" : "23:59",
    },
    sameAs: GlobalConfig.socials.map((s) => s.url),
  };

  if (locationRating && locationRating.rating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: locationRating.rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: locationRating.reviewCount,
    };
  }

  return schema;
}

function buildWebSiteSchema(seo: JsonLdSeo) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${GlobalConfig.brand.url}/#website`,
    url: GlobalConfig.brand.url,
    name: GlobalConfig.brand.name,
    description: seo.description,
    inLanguage: seo.jsonLd.inLanguage,
    publisher: {
      "@type": "Organization",
      name: GlobalConfig.brand.name,
      url: GlobalConfig.brand.url,
      logo: {
        "@type": "ImageObject",
        url: `${GlobalConfig.brand.url}/images/logo.png`,
      },
      sameAs: GlobalConfig.socials.map((s) => s.url),
    },
  };
}

export default function JsonLdBase({ seo, ratings }: JsonLdBaseProps) {
  const localBusinessSchemas = Locations.map((loc) =>
    buildLocalBusinessSchema(loc, seo, ratings),
  ).filter(Boolean);

  const webSiteSchema = buildWebSiteSchema(seo);

  return (
    <>
      {localBusinessSchemas.map((schema, i) => (
        <script
          key={`local-business-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
    </>
  );
}

