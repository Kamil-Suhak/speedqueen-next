export const pricingEn = {
  content: {
    title: "Pricing",
    subtitle: "Choose your machine and payment method",
    unit: "zł",
    cycleLabel: "cycle",
    locations: [
      "ul. Orlińskiego 1/U17",
      "ul. Pawiej 34/Szlak 77/B8",
      "Al. J. Słowackiego 56",
    ],
    toggle: {
      standard: "Standard Price",
      loyalty: "SQ Card Price",
      upsellBadge: "SQ Card",
      upsellMessage: "Save money by paying with a loyalty card!",
    },
    categories: [
      {
        id: "washers",
        title: "WASHERS",
        items: [
          {
            name: "WASHER 7 KG",
            description:
              "The smallest washer designed for a small amount of laundry.",
            standardPrice: 32.0,
            loyaltyPrice: 29.0,
            isPerCycle: true,
            availableAt: [
              "ul. Orlińskiego 1/U17",
              "ul. Pawiej 34/Szlak 77/B8",
              "Al. J. Słowackiego 56",
            ],
          },
          {
            name: "WASHER 9 KG",
            description:
              "Medium washer designed for a medium amount of laundry.",
            standardPrice: 38.0,
            loyaltyPrice: 34.0,
            isPerCycle: true,
            availableAt: [
              "ul. Orlińskiego 1/U17",
              "ul. Pawiej 34/Szlak 77/B8",
              "Al. J. Słowackiego 56",
            ],
          },
          {
            name: "WASHER 15 KG",
            description:
              "Large washer designed for a large amount of laundry or larger items.",
            standardPrice: 56.0,
            loyaltyPrice: 50.0,
            isPerCycle: true,
            availableAt: [
              "ul. Orlińskiego 1/U17",
              "ul. Pawiej 34/Szlak 77/B8",
              "Al. J. Słowackiego 56",
            ],
          },
          {
            name: "WASHER 20 KG",
            description:
              "Very large washer designed for a very large amount of laundry or larger items. Available only at ul. Orlińskiego 1/U17.",
            standardPrice: 72.0,
            loyaltyPrice: 65.0,
            isPerCycle: true,
            availableAt: ["ul. Orlińskiego 1/U17"],
          },
          {
            name: "WASHER 25 KG",
            description:
              "Giant washer designed for a huge amount of laundry or very large items. Available only at ul. Pawiej 34/Szlak 77/B8.",
            standardPrice: 86.0,
            loyaltyPrice: 78.0,
            isPerCycle: true,
            availableAt: ["ul. Pawiej 34/Szlak 77/B8"],
          },
        ],
      },
      {
        id: "dryers-and-others",
        title: "DRYERS & OTHERS",
        alertBanner: {
          title: "Drying Tip",
          description: "One drying cycle (15 min) is often not enough to completely dry a full load of laundry. We recommend purchasing two cycles for optimal results."
        },
        items: [
          {
            name: "DRYER 10 KG",
            description:
              "Medium dryer designed for drying a medium amount of laundry or medium items. Unavailable at al. J. Słowackiego 56.",
            standardPrice: 13.0,
            loyaltyPrice: 12.0,
            isPerCycle: true,
            cycleDuration: "15 min",
            availableAt: ["ul. Orlińskiego 1/U17", "ul. Pawiej 34/Szlak 77/B8"],
          },
          {
            name: "DRYER 15 KG",
            description:
              "Large dryer designed for drying a large amount of laundry or large items.",
            standardPrice: 16.0,
            loyaltyPrice: 15.0,
            isPerCycle: true,
            cycleDuration: "15 min",
            availableAt: [
              "ul. Orlińskiego 1/U17",
              "ul. Pawiej 34/Szlak 77/B8",
              "Al. J. Słowackiego 56",
            ],
          },
          {
            name: "IRONING BOARD",
            description:
              "Ironing board. Available only at ul. Pawiej 34/Szlak 77/B8.",
            standardPrice: 2.0,
            loyaltyPrice: 2.0,
            isPerCycle: true,
            cycleDuration: "4 min",
            availableAt: ["ul. Pawiej 34/Szlak 77/B8"],
          },
          {
            name: "OZONATOR",
            description:
              "Ozonating device. Available only at Al. J. Słowackiego 56.",
            standardPrice: 50.0,
            loyaltyPrice: 45.0,
            isPerCycle: true,
            cycleDuration: "15 min",
            availableAt: ["Al. J. Słowackiego 56"],
          },
        ],
      },
    ],
  },
};

export default pricingEn;
