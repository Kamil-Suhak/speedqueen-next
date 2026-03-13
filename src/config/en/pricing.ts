export const pricingEn = {
  content: {
    title: "Pricing",
    subtitle: "Discover our extensive range of professional machines, specifically tailored to accommodate laundry loads of any volume.",
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
    loyaltyCard: {
      title: "Loyalty Card",
      description: "Our loyalty card works on a prepaid basis. It's the most convenient and cheapest way to use our laundromats.",
      priceLabel: "Card Price",
      priceValue: "75",
      benefitLabel: "Includes credit",
      benefitValue: "50",
      features: [
        "Lower prices for all services*",
        "One-time card purchase",
        "Easy contactless payments",
        "Rechargeable at any time"
      ],
      ironingNote: "*The price for the ironing board remains the same with and without the card."
    },
    categories: [
      {
        id: "washers",
        title: "WASHERS",
        items: [
          {
            name: "WASHER 7 KG",
            description: "Industrial compact washer, ideal for smaller loads.",
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
            description: "Medium-capacity industrial washer for standard daily loads.",
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
            description: "High-capacity washer suitable for larger loads or bedding.",
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
            description: "Extra-high capacity industrial washer. Exclusively at ul. Orlińskiego.",
            standardPrice: 72.0,
            loyaltyPrice: 65.0,
            isPerCycle: true,
            availableAt: ["ul. Orlińskiego 1/U17"],
          },
          {
            name: "WASHER 25 KG",
            description: "Professional high-capacity washer for bulk items and heavy loads. Exclusively at ul. Pawia.",
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
          title: "Drying efficiency",
          description: "A single 15-minute cycle may not be sufficient for a full load. We recommend two cycles for optimal results."
        },
        items: [
          {
            name: "DRYER 10 KG",
            description: "Industrial dryer for small to medium loads. Unavailable at Al. Słowackiego.",
            standardPrice: 13.0,
            loyaltyPrice: 12.0,
            isPerCycle: true,
            cycleDuration: "15 min",
            availableAt: ["ul. Orlińskiego 1/U17", "ul. Pawiej 34/Szlak 77/B8"],
          },
          {
            name: "DRYER 15 KG",
            description: "Large capacity professional dryer for high-volume loads.",
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
            description: "Professional ironing station. Exclusively at ul. Pawia.",
            standardPrice: 2.0,
            loyaltyPrice: 2.0,
            isPerCycle: true,
            cycleDuration: "4 min",
            availableAt: ["ul. Pawiej 34/Szlak 77/B8"],
          },
          {
            name: "OZONATOR",
            description: "Advanced ozone disinfection device. Exclusively at Al. Słowackiego.",
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
