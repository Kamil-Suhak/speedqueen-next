export const pricingPl = {
  content: {
    title: "Cennik",
    subtitle: "Zapoznaj się z szeroką gamą naszych profesjonalnych urządzeń, dostosowanych do prania wsadów o dowolnej objętości.",
    unit: "zł",
    cycleLabel: "cykl",
    locations: [
      "ul. Orlińskiego 1/U17",
      "ul. Pawiej 34/Szlak 77/B8",
      "Al. J. Słowackiego 56",
    ],
    toggle: {
      standard: "Cena Standard",
      loyalty: "Cena z Kartą SQ",
      upsellBadge: "Karta SQ",
      upsellMessage: "Zaoszczędź korzystając z karty lojalnościowej!",
    },
    categories: [
      {
        id: "washers",
        title: "PRALNICE",
        items: [
          {
            name: "PRALKA 7 KG",
            description: "Kompaktowa pralka przemysłowa, idealna do mniejszych wsadów.",
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
            name: "PRALKA 9 KG",
            description: "Pralnica o średniej pojemności do standardowego prania codziennego.",
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
            name: "PRALKA 15 KG",
            description: "Wysokowydajna pralnica do dużych wsadów lub pościeli.",
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
            name: "PRALKA 20 KG",
            description: "Pralnica przemysłowa o dużej pojemności. Dostępna wyłącznie przy ul. Orlińskiego.",
            standardPrice: 72.0,
            loyaltyPrice: 65.0,
            isPerCycle: true,
            availableAt: ["ul. Orlińskiego 1/U17"],
          },
          {
            name: "PRALKA 25 KG",
            description: "Pralnica o bardzo wysokiej pojemności, zaprojektowana do prania wielkogabarytowego. Wyłącznie przy ul. Pawiej.",
            standardPrice: 86.0,
            loyaltyPrice: 78.0,
            isPerCycle: true,
            availableAt: ["ul. Pawiej 34/Szlak 77/B8"],
          },
        ],
      },
      {
        id: "dryers-and-others",
        title: "SUSZARKI I INNE",
        alertBanner: {
          title: "Efektywność suszenia",
          description: "Pojedynczy cykl (15 min) może być niewystarczający dla pełnego wsadu. Zalecamy dwa cykle dla optymalnych rezultatów."
        },
        items: [
          {
            name: "SUSZARKA 10 KG",
            description: "Suszarka przemysłowa do mniejszych i średnich wsadów. Niedostępna przy Al. Słowackiego.",
            standardPrice: 13.0,
            loyaltyPrice: 12.0,
            isPerCycle: true,
            cycleDuration: "15 min",
            availableAt: ["ul. Orlińskiego 1/U17", "ul. Pawiej 34/Szlak 77/B8"],
          },
          {
            name: "SUSZARKA 15 KG",
            description: "Profesjonalna suszarka o dużej pojemności dla wymagających wsadów.",
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
            name: "STÓŁ DO PRASOWANIA",
            description: "Profesjonalne stanowisko do prasowania. Dostępne wyłącznie przy ul. Pawiej.",
            standardPrice: 2.0,
            loyaltyPrice: 2.0,
            isPerCycle: true,
            cycleDuration: "4 min",
            availableAt: ["ul. Pawiej 34/Szlak 77/B8"],
          },
          {
            name: "OZONATOR",
            description: "Zaawansowane urządzenie do dezynfekcji ozonem. Dostępne wyłącznie przy Al. Słowackiego.",
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

export default pricingPl;
