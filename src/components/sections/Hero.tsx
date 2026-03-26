"use client";

import { MapPin, List } from "lucide-react";
import { FormattedText } from "@/components/ui/FormattedText";
import CollageBackground from "@/components/ui/CollageBackground";
import Image from "next/image";
import { Locations } from "@/config/site-config";
import { openDirections } from "@/lib/directions";

interface HeroProps {
  content: {
    title: string;
    subtitle: string;
    primaryCTA: string;
    secondaryCTA: string;
  };
  bgImage?: string;
}

export default function Hero({ content, bgImage }: HeroProps) {

  return (
    <section
      className="relative overflow-hidden min-h-screen min-h-[100dvh] flex items-center justify-center pt-24 pb-12 bg-neutral-50"
      id="hero"
    >
      <CollageBackground />

      <div className="relative z-10 mx-auto max-w-4xl w-full px-4 text-center sm:px-6 lg:px-8 -mt-12 md:-mt-16">
        <div
          className="flex justify-center mb-6 animate-fade-in-up"
        >
          <Image
            src="/images/logo-big.png"
            alt="Speed Queen Logo"
            width={300}
            height={100}
            className="object-contain"
            priority
          />
        </div>

        <h1
          className="mx-auto mb-20 max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 md:text-7xl animate-fade-in-up [animation-delay:400ms]"
        >
          <FormattedText text={content.title} />
        </h1>

        <div
          className="flex flex-col justify-center gap-4 sm:flex-row animate-fade-in-up [animation-delay:800ms]"
        >
          <a
            href={Locations[1].url}
            onClick={openDirections}
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
