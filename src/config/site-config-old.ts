import { Rocket, Shield, BarChart, Lightbulb } from "lucide-react";

export const dictionaries = {
  en: {
    seo: {
      title: "Nexus Digital | Modern Web Solutions for Small Business",
      description:
        "High-performance, SEO-optimized websites designed to convert local visitors into loyal customers.",
      keywords: ["Web Design", "Small Business Marketing", "Next.js Developer"],
    },
    hero: {
      title: "Scale your business with modern web solutions.",
      subtitle:
        "We build high-performance websites for local businesses that want to dominate their local market.",
      primaryCTA: "Get Started",
      secondaryCTA: "Our Work",
    },
    servicesHead: {
      title: "Our Core Services",
      subtitle:
        "Everything you need to scale your business in the digital age.",
    },
    services: [
      {
        title: "Fast Deployment",
        description: "Get your business online in days, not months.",
        icon: Rocket,
      },
      {
        title: "Secure by Design",
        description: "Enterprise-grade security protocols.",
        icon: Shield,
      },
      {
        title: "SEO Optimized",
        description: "Built to rank on Google and drive traffic.",
        icon: BarChart,
      },
      {
        title: "Strategy First",
        description: "We consult on the best path for growth.",
        icon: Lightbulb,
      },
    ],
    pricingHead: {
      title: "Simple, Transparent Pricing",
      subtitle: "No hidden fees. Scale your plan as your business grows.",
    },
    pricing: [
      {
        name: "Starter",
        price: "$49",
        description: "For new local businesses.",
        features: ["3 Pages", "Basic SEO", "Mobile Ready"],
        buttonText: "Get Started",
      },
      {
        name: "Professional",
        price: "$99",
        description: "Most popular choice.",
        features: ["Unlimited Pages", "Advanced SEO", "Analytics"],
        isPopular: true,
        buttonText: "Go Pro",
      },
    ],
    contact: {
      title: "Let's build something great.",
      subtitle: "Ready to take your business to the next level?",
      form: {
        name: "Full Name",
        email: "Email",
        message: "Message",
        button: "Send Message",
      },
    },
    navLinks: [
      { label: "Services", href: "#services" },
      { label: "Pricing", href: "#pricing" },
      { label: "Contact", href: "#contact" },
    ],
  },

  pl: {
    seo: {
      title: "Nexus Digital | Nowoczesne Strony dla Lokalnych Firm",
      description:
        "Szybkie, zoptymalizowane pod SEO strony internetowe, które zamieniają odwiedzających w klientów.",
      keywords: ["Tworzenie stron", "Marketing lokalny", "Next.js Developer"],
    },
    hero: {
      title: "Rozwiń swój biznes dzięki nowoczesnym technologiom.",
      subtitle:
        "Tworzymy wydajne strony dla lokalnych przedsiębiorców, którzy chcą zdominować rynek.",
      primaryCTA: "Zacznij Teraz",
      secondaryCTA: "Nasze Realizacje",
    },
    servicesHead: {
      title: "Nasze Usługi",
      subtitle:
        "Wszystko, czego potrzebujesz, aby rozwinąć firmę w erze cyfrowej.",
    },
    services: [
      {
        title: "Szybkie Wdrożenie",
        description: "Twoja strona będzie gotowa w kilka dni, nie miesięcy.",
        icon: Rocket,
      },
      {
        title: "Bezpieczeństwo",
        description: "Protokoły klasy enterprise dla Twoich danych.",
        icon: Shield,
      },
      {
        title: "Optymalizacja SEO",
        description: "Zbudowane, by rankować w Google i przyciągać ruch.",
        icon: BarChart,
      },
      {
        title: "Strategia Najpierw",
        description: "Konsultujemy najlepszą ścieżkę rozwoju.",
        icon: Lightbulb,
      },
    ],
    pricingHead: {
      title: "Prosty i Przejrzysty Cennik",
      subtitle: "Brak ukrytych opłat. Rozwijaj plan wraz ze wzrostem firmy.",
    },
    pricing: [
      {
        name: "Start",
        price: "199 zł",
        description: "Dla nowych lokalnych firm.",
        features: ["3 Strony", "Podstawowe SEO", "Wersja Mobilna"],
        buttonText: "Zacznij",
      },
      {
        name: "Pro",
        price: "399 zł",
        description: "Najpopularniejszy wybór.",
        features: ["Nielimitowane Strony", "Zaawansowane SEO", "Analityka"],
        isPopular: true,
        buttonText: "Wybierz Pro",
      },
    ],
    contact: {
      title: "Zbudujmy coś wielkiego.",
      subtitle: "Gotowy na wejście na wyższy poziom?",
      form: {
        name: "Imię i Nazwisko",
        email: "Adres Email",
        message: "Wiadomość",
        button: "Wyślij Wiadomość",
      },
    },
    navLinks: [
      { label: "Usługi", href: "#services" },
      { label: "Cennik", href: "#pricing" },
      { label: "Kontakt", href: "#contact" },
    ],
  },
};

// GLOBAL SETTINGS (Things that don't change by language)
export const GlobalConfig = {
  brand: {
    name: "Nexus Digital",
    logo: "/logo.png",
    primaryColor: "#2563eb",
    email: "hello@nexus.com",
    address: "Kraków, Polska",
    phone: "+48 123 456 789",
    url: "https://domain.com",
    tagline: {
      en: "Making the web better.",
      pl: "Tworzymy lepszy internet.",
    },
  },
  socials: [
    { platform: "Twitter", url: "https://twitter.com" },
    { platform: "LinkedIn", url: "https://linkedin.com" },
  ],
};

export type Locale = keyof typeof dictionaries;
