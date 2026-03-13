export const GlobalConfig = {
  brand: {
    name: "Speed Queen",
    logo: "/images/logo.png",
    primaryColor: "#e7272d", // Matching SpeedQueen Red
    secondaryColor: "#1d1d1b",
    accentColor: "#e7272d",
    email: "kontakt@speedqueenkrk.pl",
    address: ["ul. Pawia 34, Kraków", "al. J. Słowackiego 56, Kraków", "ul. Orlińskiego 1/U17, Kraków"],
    phone: "+48 509 996 006",
    url: "https://expressweb-prototype.vercel.app",
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
