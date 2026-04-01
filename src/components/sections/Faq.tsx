"use client";

import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Clock,
  Droplets,
  CreditCard,
  ListChecks,
  Wind,
  LucideIcon,
} from "lucide-react";
import { FormattedText } from "@/components/ui/FormattedText";
import SectionBackground from "@/components/ui/SectionBackground";

export interface FaqItem {
  question: string;
  answer: string;
  icon?: string;
}

const iconMap: Record<string, LucideIcon> = {
  clock: Clock,
  droplets: Droplets,
  "credit-card": CreditCard,
  "list-checks": ListChecks,
  wind: Wind,
};

export interface FaqProps {
  content: {
    title: string;
    description: string;
    items: FaqItem[];
  };
  bgImage?: string;
}

const Faq = ({ content, bgImage }: FaqProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="relative py-24 scroll-mt-20 bg-white"
      id="faq"
      aria-label="Frequently Asked Questions"
    >
      <SectionBackground imagePath={bgImage} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tight">
            {content.description}
          </h2>
          <div
            className="mx-auto mt-4 h-1 w-16 bg-brand-primary rounded-full"
            aria-hidden="true"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          {content.items.map((item, idx) => (
            <FaqCard
              key={idx}
              item={item}
              isOpen={openIndex === idx}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const FaqCard = ({
  item,
  isOpen,
  onClick,
}: {
  item: FaqItem;
  isOpen: boolean;
  onClick: () => void;
}) => {
  const Icon = item.icon ? iconMap[item.icon] : null;

  return (
    <div
      className={`border rounded-2xl transition-[border-color,background-color,box-shadow,border-left-width] duration-300 relative overflow-hidden ${
        isOpen
          ? "border-brand-primary border-l-4 bg-brand-primary/2 shadow-md md:shadow-sm"
          : "border-slate-100 border-l-4 border-l-transparent bg-white shadow-sm md:bg-white/90 md:backdrop-blur-sm md:shadow-none hover:border-slate-200 hover:border-l-brand-primary/30 md:hover:shadow-sm hover:shadow-md"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 px-6 text-left group outline-none focus:ring-4 focus:ring-brand-primary/10"
        aria-expanded={isOpen}
        aria-label={`Toggle answer: ${item.question}`}
      >
        <div className="flex items-center gap-4">
          {Icon && (
            <div
              className={`p-2 rounded-xl transition-colors ${isOpen ? "bg-brand-primary text-white" : "bg-slate-100 text-zinc-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary"}`}
            >
              <Icon size={20} strokeWidth={2.5} />
            </div>
          )}
          <span
            className={`font-bold text-base md:text-lg uppercase tracking-tight transition-colors ${isOpen ? "text-brand-primary" : "text-gray-900 group-hover:text-brand-primary"}`}
          >
            {item.question}
          </span>
        </div>
        <div
          className={`shrink-0 ml-4 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
          aria-hidden="true"
        >
          {isOpen ? (
            <ChevronUp className="text-brand-primary" />
          ) : (
            <ChevronDown className="text-zinc-400" />
          )}
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 text-gray-700 leading-relaxed pt-2 font-normal text-base md:text-lg">
            <FormattedText text={item.answer} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;

