import { GlobalConfig } from "@/config/site-config";
import { Phone, Mail, LucideIcon } from "lucide-react";
import { FormattedText } from "@/components/FormattedText";

interface HeroProps {
  content: {
    title: string;
    subtitle: string;
    primaryCTA: string;
    secondaryCTA: string;
    trustBadges: { label: string; icon: LucideIcon }[];
  };
}

export default function Hero({ content }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden bg-white pt-32 pb-20 lg:pt-48"
      id="hero"
    >
      {/* BACKGROUND PATTERN */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* AMBIENT GLOW */}
      <div className="absolute -top-24 -right-24 z-0 h-96 w-96 rounded-full bg-blue-100 opacity-50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Animated Badge */}
        {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
             Live Status: Active
          </span>
        </div> */}

        <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
          <FormattedText text={content.title} />
          {/* {content.title} */}
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 md:text-xl">
          {content.subtitle}
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href={`tel:${GlobalConfig.brand.phone}`}
            style={{ backgroundColor: GlobalConfig.brand.primaryColor }}
            className="flex transform items-center justify-center gap-2 rounded-xl px-8 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:brightness-110"
          >
            <Phone size={20} />
            {content.primaryCTA}
          </a>
          <a
            href={`mailto:${GlobalConfig.brand.email}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 font-bold text-gray-900 transition hover:bg-gray-50"
          >
            <Mail size={20} />
            {content.secondaryCTA}
          </a>
        </div>

        {/* 3. NEW TRUST BADGES WITH ICONS */}
        <div className="mt-20 grid grid-cols-2 gap-4 border-t border-gray-100 pt-12 md:grid-cols-4 lg:gap-8">
          {content.trustBadges.map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <badge.icon size={22} />
              </div>
              <span className="text-sm font-bold tracking-wide text-gray-700 uppercase">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
