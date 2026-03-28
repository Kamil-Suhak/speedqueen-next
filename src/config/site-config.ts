export const Locations = [
  {
    name: "Orlińskiego",
    lat: 50.0815,
    lng: 20.0055,
    postalCode: "31-878",
    url: "https://www.google.com/maps/dir/?api=1&destination=Bolesława+Orlińskiego+1/U17,+31-878+Kraków",
  },
  {
    name: "Pawia/Szlak",
    lat: 50.0695,
    lng: 19.9445,
    postalCode: "31-153",
    url: "https://www.google.com/maps/dir/?api=1&destination=Pawia+34,+31-154+Kraków",
  },
  {
    name: "Słowackiego",
    lat: 50.0735,
    lng: 19.9295,
    postalCode: "30-003",
    url: "https://www.google.com/maps/dir/?api=1&destination=Aleja+Juliusza+Słowackiego+56,+30-004+Kraków",
  },
];

export const GlobalConfig = {
  brand: {
    name: "Speed Queen",
    logo: "/images/logo.png",
    primaryColor: "#e7272d",
    secondaryColor: "#1d1d1b",
    accentColor: "#e7272d",
    email: "kontakt@speedqueenkrk.pl",
    locations: [
      { address: "ul. Orlińskiego 1/U17, Kraków", hours: "6:00 - 2:00" },
      { address: "ul. Pawia 34, Kraków", hours: "24/7" },
      { address: "al. J. Słowackiego 56, Kraków", hours: "24/7" },
    ],
    phone: "+48 509 996 006",
    url: "https://speedqueenkrk.pl",
    tagline: {
      en: "The highest standard of self-service laundry.",
      pl: "Najwyższy standard prania samoobsługowego.",
    },
  },
  socials: [
    {
      platform: "Facebook",
      url: "https://www.facebook.com/speedqueenkrakow/",
    },
    {
      platform: "Instagram",
      url: "https://www.instagram.com/speedqueenkrakow/",
    },
  ],
};

export type Locale = "en" | "pl";
