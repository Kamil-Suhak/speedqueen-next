import { label } from "framer-motion/client";
import { Wrench, Droplets, Clock, ShieldCheck, MapPin } from "lucide-react";

export const dictionaries = {
  en: {
    seo: {
      title: "AquaFix Pro | Expert Plumbing Services in Krakow",
      description:
        "Emergency plumbing, leak repairs, and heating installations. 24/7 service with a satisfaction guarantee.",
      keywords: [
        "Plumber Krakow",
        "Emergency Plumbing",
        "Leak Repair",
        "Heating Installation",
      ],
    },
    hero: {
      title: "Professional Plumbing Services You Can [[Trust]].",
      subtitle:
        "From leaky faucets to emergency pipe bursts, we provide fast, reliable solutions for your home and business.",
      primaryCTA: "Call Now",
      secondaryCTA: "Book Online",
      trustBadges: [
        { label: "Fully Licensed", icon: ShieldCheck },
        { label: "24/7 Available", icon: Clock },
        { label: "Locally Owned", icon: MapPin },
        { label: "Expert Tools", icon: Wrench },
      ],
    },
    servicesHead: {
      title: "Our Services",
      subtitle:
        "Expert solutions for all your residential and commercial plumbing needs.",
    },
    services: [
      {
        title: "Emergency Repairs",
        description: "Available 24/7 for bursts, leaks, and urgent blockages.",
        icon: Clock,
      },
      {
        title: "Installation",
        description:
          "Professional installation of sinks, toilets, and water heaters.",
        icon: Wrench,
      },
      {
        title: "Leak Detection",
        description:
          "Advanced tools to find and fix hidden leaks before they cause damage.",
        icon: Droplets,
      },
      {
        title: "Insured Work",
        description:
          "All our work is fully insured and comes with a 2-year guarantee.",
        icon: ShieldCheck,
      },
    ],
    pricingHead: {
      title: "Transparent Service Rates",
      subtitle:
        "Quality work doesn't have to have hidden costs. Here is our standard pricing.",
    },
    pricing: [
      {
        name: "Standard Callout",
        price: "$49",
        description: "Diagnosis and minor small repairs.",
        features: [
          "Expert Assessment",
          "Up to 30 mins labor",
          "Free Quote for larger work",
        ],
        buttonText: "Book Visit",
      },
      {
        name: "Installation Package",
        price: "$199",
        description: "Perfect for new fixtures or appliances.",
        features: [
          "Full Installation",
          "Old Unit Removal",
          "Parts Included",
          "Cleanup & Disposal",
        ],
        isPopular: true,
        buttonText: "Get Quote",
      },
    ],
    gallery: {
      title: "Our Work",
      subtitle:
        "See examples of our plumbing work in Krakow and surrounding areas.",
      images: [
        { src: "/images/gallery/plumbing.jpg", alt: "Naprawa rury" },
        { src: "/images/gallery/plumbing.jpg", alt: "Naprawa rury" },
        { src: "/images/gallery/plumbing.jpg", alt: "Naprawa rury" },
        { src: "/images/gallery/plumbing.jpg", alt: "Naprawa rury" },
        { src: "/images/gallery/plumbing.jpg", alt: "Naprawa rury" },
        { src: "/images/gallery/plumbing.jpg", alt: "Naprawa rury" },
      ],
    },
    review: {
      title: "What our customers say:",
      view_all: "View all reviews",
      read_more: "Read more",
    },
    faq: {
      title: "Frequently Asked Questions",
      description: "Common questions about our plumbing services.",
      items: [
        {
          question: "Are you available for emergency calls?",
          answer:
            "Yes, we offer 24/7 emergency plumbing services. Just give us a call anytime.",
        },
        {
          question: "Do you provide free estimates?",
          answer:
            "Absolutely! We provide free quotes for all non-emergency services.",
        },
        {
          question: "What areas do you serve?",
          answer:
            "We primarily serve Krakow and the surrounding areas. Contact us to see if we cover your location.",
        },
        {
          question: "Are your plumbers licensed and insured?",
          answer:
            "Yes, all our plumbers are fully licensed and insured for your peace of mind.",
        },
      ],
    },
    contact: {
      title: "Contact Us Today",
      subtitle:
        "Need a plumber fast? Send us a message or call our emergency line.",
      form: {
        name: "Your Name",
        email: "Email",
        message: "Describe the issue...",
        button: "Request Help",
        successTitle: "Thank You!",
        successMessage:
          "Your message has been sent. We will get back to you shortly.",
        errorTitle: "Error Sending Message",
        errorMessage: "Something went wrong. Please try calling us directly.",
        buttonClose: "Close",
      },
    },
    navLinks: [
      { label: "Services", href: "#services" },
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "#reviews" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
    footerLinks: [
      {
        title: "Services",
        links: [
          { label: "Emergency", href: "#services" },
          { label: "Installations", href: "#services" },
        ],
      },
    ],
  },

  pl: {
    seo: {
      title: "Pogotowe Hydrauliczne K.M. Post",
      description:
        "Pogotowie hydrauliczne, naprawa wycieków i montaż instalacji. Serwis 24/7 z gwarancją satysfakcji.",
      keywords: [
        "Hydraulik Kraków",
        "Pogotowie hydrauliczne",
        "Naprawa rur",
        "Montaż bojlera",
      ],
    },
    hero: {
      title: "Pogotowie Hydrauliczne&[[K.M. Post]]",
      subtitle:
        "Od cieknących kranów po kompleksowe remonty – zapewniamy szybkie i solidne rozwiązania dla Twojego domu i firmy.",
      primaryCTA: "Zadzwoń Teraz",
      secondaryCTA: "Napisz e-maila",
      trustBadges: [
        { label: "Pełne Uprawnienia", icon: ShieldCheck },
        { label: "Dostępni 24/7", icon: Clock },
        { label: "Lokalna Firma", icon: MapPin },
        { label: "Specjalistyczny Sprzęt", icon: Wrench },
      ],
    },
    servicesHead: {
      title: "Nasze Usługi",
      subtitle:
        "Eksperckie rozwiązania dla wszystkich Twoich potrzeb hydraulicznych.",
    },
    services: [
      {
        title: "Pogotowie 24/7",
        description:
          "Dostępni o każdej porze przy awariach, przeciekach i zatorach.",
        icon: Clock,
      },
      {
        title: "Montaż i Instalacje",
        description:
          "Profesjonalny montaż armatury, toalet i podgrzewaczy wody.",
        icon: Wrench,
      },
      {
        title: "Wykrywanie Przecieków",
        description: "Nowoczesne metody lokalizacji ukrytych wycieków.",
        icon: Droplets,
      },
      {
        title: "Gwarancja Jakości",
        description:
          "Pełne ubezpieczenie i 2 lata gwarancji na wykonane prace.",
        icon: ShieldCheck,
      },
    ],
    pricingHead: {
      title: "Przejrzyste Stawki",
      subtitle:
        "Wysoka jakość bez ukrytych kosztów. Poznaj nasze standardowe ceny.",
    },
    pricing: [
      {
        name: "Wizyta Standard",
        price: "150 zł",
        description: "Diagnoza i drobne naprawy na miejscu.",
        features: [
          "Ocena eksperta",
          "Do 30 min pracy",
          "Darmowa wycena większych prac",
        ],
        buttonText: "Umów Wizytę",
      },
      {
        name: "Pakiet Montaż",
        price: "450 zł",
        description: "Idealny przy wymianie armatury lub sprzętu AGD.",
        features: [
          "Pełny montaż",
          "Demontaż starego sprzętu",
          "Utylizacja",
          "Gwarancja szczelności",
        ],
        isPopular: true,
        buttonText: "Wybierz",
      },
    ],
    gallery: {
      title: "Nasze Realizacje",
      subtitle: "Zobacz przykłady naszych prac hydraulicznych w Krakowie.",
      images: [
        { src: "/images/gallery/plumbing.jpg", alt: "Naprawa rury" },
        { src: "/images/gallery/plumbing.jpg", alt: "Naprawa rury" },
        { src: "/images/gallery/plumbing.jpg", alt: "Naprawa rury" },
        { src: "/images/gallery/plumbing.jpg", alt: "Naprawa rury" },
        { src: "/images/gallery/plumbing.jpg", alt: "Naprawa rury" },
        { src: "/images/gallery/plumbing.jpg", alt: "Naprawa rury" },
      ],
    },
    review: {
      title: "Co mówią nasi klienci:",
      view_all: "Zobacz wszystkie opinie",
      read_more: "Czytaj dalej",
    },
    faq: {
      title: "Najczęściej Zadawane Pytania",
      description: "Częste pytania dotyczące naszych usług hydraulicznych.",
      items: [
        {
          question: "Czy oferujecie pogotowie hydrauliczne?",
          answer:
            "Tak, świadczymy usługi hydrauliczne 24/7. Zadzwoń do nas o każdej porze.",
        },
        {
          question: "Czy oferujecie darmowe wyceny?",
          answer:
            "Oczywiście! Oferujemy bezpłatne wyceny dla wszystkich usług niestandardowych.",
        },
        {
          question: "Jakie obszary obsługujecie?",
          answer:
            "Działamy głównie na terenie Krakowa i okolic. Skontaktuj się z nami, aby sprawdzić, czy obsługujemy Twoją lokalizację.",
        },
        {
          question: "Czy Wasi hydraulicy mają uprawnienia i ubezpieczenie?",
          answer:
            "Tak, wszyscy nasi hydraulicy posiadają pełne uprawnienia i są ubezpieczeni dla Twojego spokoju.",
        },
      ],
    },
    contact: {
      title: "Skontaktuj się z nami",
      subtitle:
        "Potrzebujesz hydraulika? Wyślij wiadomość lub zadzwoń na naszą linię alarmową.",
      form: {
        name: "Imię i Nazwisko",
        email: "Adres Email",
        message: "Opisz problem...",
        button: "Wyślij Zapytanie",
        successTitle: "Dziękujemy!",
        successMessage:
          "Twoja wiadomość została wysłana. Wkrótce się z Tobą skontaktujemy.",
        errorTitle: "Błąd wysyłania wiadomości",
        errorMessage:
          "Coś poszło nie tak. Prosimy o zadzwonienie do nas bezpośrednio.",
        buttonClose: "Zamknij",
      },
    },
    navLinks: [
      { label: "Usługi", href: "#services" },
      // { label: "Cennik", href: "#pricing" },
      { label: "Galeria", href: "#gallery" },
      { label: "Opinie", href: "#reviews" },
      { label: "FAQ", href: "#faq" },
      { label: "Kontakt", href: "#contact" },
    ],
    footerLinks: [
      {
        title: "Usługi",
        links: [
          { label: "Pogotowie", href: "#services" },
          { label: "Montaż", href: "#services" },
        ],
      },
    ],
  },
};

export const GlobalConfig = {
  brand: {
    name: "K.M. Post",
    logo: "/logo-plumber.png",
    primaryColor: "#0284c7", // A professional Sky Blue
    accentColor: "#f59e0b", // Amber Orange for CTAs
    email: "biuro@aquafix.pl",
    address: "ul. Hydraulików 12, Kraków",
    phone: "+48 513 493 333",
    url: "https://expressweb-prototype.vercel.app",
    tagline: {
      en: "Your local plumbing experts, available 24/7.",
      pl: "Twoi lokalni eksperci, dostępni 24/7.",
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

export type Locale = keyof typeof dictionaries;
