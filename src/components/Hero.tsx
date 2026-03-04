"use client";

import { useState, useEffect } from "react";
import { MapPin, List } from "lucide-react";
import { FormattedText } from "@/components/FormattedText";
import { sectionBackgroundStyle } from "@/lib/background-manager";

interface HeroProps {
  content: {
    title: string;
    subtitle: string;
    primaryCTA: string;
    secondaryCTA: string;
  };
  bgImage?: string;
}

const locations = [
  {
    name: "Orlińskiego",
    lat: 50.0815,
    lng: 20.0055,
    url: "https://www.google.com/maps/dir/?api=1&destination=Bolesława+Orlińskiego+1/U17,+31-878+Kraków",
  },
  {
    name: "Pawia/Szlak",
    lat: 50.0695,
    lng: 19.9445,
    url: "https://www.google.com/maps/dir/?api=1&destination=Pawia+34,+31-154+Kraków",
  },
  {
    name: "Słowackiego",
    lat: 50.0735,
    lng: 19.9295,
    url: "https://www.google.com/maps/dir/?api=1&destination=Aleja+Juliusza+Słowackiego+56,+30-004+Kraków",
  },
];

export default function Hero({ content, bgImage }: HeroProps) {
  const [directionsUrl, setDirectionsUrl] = useState(locations[1].url); // Default to Pawia (central)

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        let closest = locations[0];
        let minDistance = Infinity;

        locations.forEach((loc) => {
          const dist = Math.sqrt(
            Math.pow(loc.lat - userLat, 2) + Math.pow(loc.lng - userLng, 2)
          );
          if (dist < minDistance) {
            minDistance = dist;
            closest = loc;
          }
        });

        setDirectionsUrl(closest.url);
      });
    }
  }, []);

  return (
    <section
      className="relative overflow-hidden pt-32 pb-24 lg:pt-48 lg:pb-32"
      id="hero"
      style={sectionBackgroundStyle(bgImage)}
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 md:text-7xl">
          <FormattedText text={content.title} />
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 md:text-xl font-normal">
          {content.subtitle}
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex transform items-center justify-center gap-2 rounded-xl bg-brand-red px-8 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:brightness-110 uppercase tracking-tight"
          >
            <MapPin size={20} />
            {content.primaryCTA}
          </a>
          <a
            href="#pricing"
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-zinc-200 bg-white px-8 py-4 font-bold text-zinc-900 transition hover:bg-zinc-50 uppercase tracking-tight"
          >
            <List size={20} />
            {content.secondaryCTA}
          </a>
        </div>
      </div>
    </section>
  );
}
