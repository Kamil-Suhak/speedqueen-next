export const GlobalConfig = {
  brand: {
    name: "K.M. Post",
    logo: "/logo-plumber.png",
    primaryColor: "#e7272d", // Matching SpeedQueen Red
    secondaryColor: "#1d1d1b",
    accentColor: "#e7272d",
    email: "biuro@aquafix.pl",
    address: "ul. Hydraulików 12, Kraków",
    phone: "+48 513 493 333",
    url: "https://expressweb-prototype.vercel.app",
    tagline: {
      en: "Professional heavy-duty laundry solutions, available 24/7.",
      pl: "Profesjonalne rozwiązania pralnicze, dostępne 24/7.",
    },
  },
  socials: [
    {
      platform: "Facebook",
      url: "https://www.facebook.com/people/Pogotowie-Hydrauliczne-KM-POST",
    },
    {
      platform: "Google Maps",
      url: "https://maps.app.goo.gl/MJrLUTuqwDAL1i1g9",
    },
  ],
};

export type Locale = "en" | "pl";
