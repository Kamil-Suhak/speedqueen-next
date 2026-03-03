export const pricingPl = {
  content: {
    title: "Cennik",
    subtitle: "Wybierz maszynę i metodę płatności",
    unit: "zł",
    cycleLabel: "cykl",
    locations: [
      "ul. Orlińskiego 1/U17",
      "ul. Pawiej 34/Szlak 77/B8",
      "Al. J. Słowackiego 56",
    ],
    toggle: {
      standard: "Cena",
      loyalty: "Cena z kartą SQ",
      upsellBadge: "Karta SQ",
      upsellMessage: "Zaoszczędź płacąc kartą lojalnościową!",
    },
    categories: [
      {
        id: "washers",
        title: "PRALKI",
        items: [
          {
            name: "PRALKA 7 KG",
            description:
              "Najmniejsza pralka przeznaczona do małej ilości rzeczy.",
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
            description:
              "Średnia pralka przeznaczona do średniej ilości rzeczy.",
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
            description:
              "Duża pralka przeznaczona do dużej ilości rzeczy lub większych sztuk.",
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
            description:
              "Bardzo duża pralka przeznaczona do bardzo dużej ilości rzeczy lub większych sztuk. Dostępna tylko przy ul. Orlińskiego 1/U17.",
            standardPrice: 72.0,
            loyaltyPrice: 65.0,
            isPerCycle: true,
            availableAt: ["ul. Orlińskiego 1/U17"],
          },
          {
            name: "PRALKA 25 KG",
            description:
              "Gigantyczna pralka przeznaczona do ogromnej ilości rzeczy lub bardzo dużych sztuk. Dostępna tylko przy ul. Pawiej 34/Szlak 77/B8.",
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
          title: "Wskazówka dotycząca suszenia",
          description: "Jeden cykl suszenia (15 min) często nie wystarcza na całkowite wysuszenie pełnego prania. Zalecamy wykupienie dwóch cykli dla optymalnych rezultatów."
        },
        items: [
          {
            name: "SUSZARKA 10 KG",
            description:
              "Średnia suszarka przeznaczona do suszenia średniej ilości rzeczy lub średnich sztuk. Niedostępna przy al. J. Słowackiego 56",
            standardPrice: 13.0,
            loyaltyPrice: 12.0,
            isPerCycle: true,
            cycleDuration: "15 min",
            availableAt: ["ul. Orlińskiego 1/U17", "ul. Pawiej 34/Szlak 77/B8"],
          },
          {
            name: "SUSZARKA 15 KG",
            description:
              "Duża suszarka przeznaczona do suszenia dużej ilości rzeczy lub dużych sztuk.",
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
            description:
              "Stół do prasowania. Dostępny tylko przy ul. Pawiej 34/Szlak 77/B8",
            standardPrice: 2.0,
            loyaltyPrice: 2.0,
            isPerCycle: true,
            cycleDuration: "4 min",
            availableAt: ["ul. Pawiej 34/Szlak 77/B8"],
          },
          {
            name: "OZONATOR",
            description:
              "Urządzenie do ozonowania. Dostępne tylko przy Al. J. Słowackiego 56",
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
