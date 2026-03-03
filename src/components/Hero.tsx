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

      {/* AMBIENT GLOW - ONLY RED */}
      <div className="absolute -top-24 -right-24 z-0 h-96 w-96 rounded-full bg-brand-red-light opacity-50 blur-3xl" />
      <div className="absolute top-1/2 -left-24 z-0 h-72 w-72 rounded-full bg-brand-red-light opacity-30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="mx-auto mb-6 max-w-4xl text-4xl font-black tracking-tight text-gray-900 md:text-7xl">
          <FormattedText text={content.title} />
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 md:text-xl font-medium">
          {content.subtitle}
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href={`tel:${GlobalConfig.brand.phone}`}
            className="flex transform items-center justify-center gap-2 rounded-xl bg-brand-red px-8 py-4 font-black text-white shadow-lg transition hover:-translate-y-1 hover:brightness-110 uppercase tracking-tighter"
          >
            <Phone size={20} />
            {content.primaryCTA}
          </a>
          <a
            href={`mailto:${GlobalConfig.brand.email}`}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-zinc-200 bg-white px-8 py-4 font-black text-zinc-900 transition hover:bg-zinc-50 uppercase tracking-tighter"
          >
            <Mail size={20} />
            {content.secondaryCTA}
          </a>
        </div>

        {/* TRUST BADGES */}
        <div className="mt-20 grid grid-cols-2 gap-4 border-t border-gray-100 pt-12 md:grid-cols-4 lg:gap-8">
          {content.trustBadges.map((badge, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red-light text-brand-red shadow-sm">
                <badge.icon size={26} />
              </div>
              <span className="text-sm font-black tracking-wide text-gray-700 uppercase">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
