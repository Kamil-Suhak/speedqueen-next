"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Info, ArrowRight } from "lucide-react";
import SectionBackground from "@/components/SectionBackground";
import LoyaltyCardImg from "@/components/LoyaltyCardImg";

export interface MachineItem {
  name: string;
  description?: string;
  standardPrice: number;
  loyaltyPrice: number;
  isPerCycle?: boolean;
  cycleDuration?: string;
  availableAt: string[];
}

export interface PricingCategory {
  id: string;
  title: string;
  alertBanner?: {
    title: string;
    description: string;
  };
  items: MachineItem[];
}

export interface PricingProps {
  content: {
    title: string;
    subtitle: string;
    unit: string;
    cycleLabel: string;
    locations: string[];
    toggle: {
      upsellBadge: string;
      upsellMessage: string;
    };
    loyaltyCard: {
      title: string;
      description: string;
      priceLabel: string;
      priceValue: string;
      benefitLabel: string;
      benefitValue: string;
      features: string[];
      ironingNote: string;
    };
    categories: PricingCategory[];
  };
  bgImage?: string;
}

const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const PricingTabs = ({ content, bgImage }: PricingProps) => {
  const loyaltyRef = useRef<HTMLDivElement>(null);
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);

  const activeLocation = content.locations[activeLocationIndex] || content.locations[0];

  const scrollToLoyalty = () => {
    loyaltyRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative py-24 scroll-mt-20 overflow-visible bg-white"
      id="pricing"
    >
      <SectionBackground imagePath={bgImage} />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-4 uppercase tracking-tight">
            {content.title}
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-brand-red rounded-full" />
          <p className="mt-6 text-lg text-zinc-600 font-normal">
            {content.subtitle}
          </p>
        </header>

        <div className="mb-12 flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full" role="tablist" aria-label="Laundry locations">
            {content.locations.map((loc, idx) => (
              <button
                key={idx}
                role="tab"
                aria-selected={activeLocationIndex === idx}
                aria-controls={`panel-${idx}`}
                id={`tab-${idx}`}
                onClick={() => setActiveLocationIndex(idx)}
                className={`relative px-3 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-bold cursor-pointer transition-colors duration-200 rounded-xl border shadow-sm uppercase tracking-tight ${
                  activeLocationIndex === idx
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-800"
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-16 min-h-[400px]">
          {content.categories.map((category) => {
            const visibleItems = category.items.filter((item) =>
              item.availableAt.includes(activeLocation),
            );

            if (visibleItems.length === 0) return null;

            return (
              <div 
                key={category.id} 
                role="tabpanel" 
                id={`panel-${activeLocationIndex}`} 
                aria-labelledby={`tab-${activeLocationIndex}`}
              >
                <h3 className="text-2xl font-extrabold text-zinc-900 mb-6 border-b-2 border-zinc-100 pb-2 uppercase tracking-tight">
                  {category.title}
                </h3>

                {category.alertBanner && (
                  <div className="mb-6 flex gap-3 rounded-2xl bg-blue-50/50 p-4 border border-blue-100/50">
                    <Info className="text-blue-500 shrink-0 mt-0.5" size={20} aria-hidden="true" />
                    <div>
                      <h4 className="font-bold text-blue-900 mb-1 uppercase text-xs tracking-wider">
                        {category.alertBanner.title}
                      </h4>
                      <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                        {category.alertBanner.description}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${category.id}-${activeLocationIndex}`}
                      variants={listContainerVariants}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className="flex flex-col gap-4"
                    >
                      {visibleItems.map((item, idx) => (
                        <motion.div
                          variants={listItemVariants}
                          key={`${category.id}-${item.name}-${idx}`}
                          className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:border-brand-red/20 transition-colors gap-4"
                        >
                          <div className="flex flex-col md:pr-4 flex-1">
                            <span className="text-xl font-bold text-zinc-900 uppercase tracking-tight">
                              {item.name}
                            </span>
                            {item.description && (
                              <span className="text-sm text-zinc-500 mt-1 font-normal">
                                {item.description}
                              </span>
                            )}
                            {item.isPerCycle && item.cycleDuration && (
                              <span className="text-xs font-bold text-brand-red mt-2 uppercase tracking-wider">
                                1 {content.cycleLabel} = {item.cycleDuration}
                              </span>
                            )}
                          </div>

                          <div className="shrink-0 flex flex-wrap items-center gap-x-2 gap-y-2 justify-start md:justify-end">
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-extrabold text-zinc-900">
                                {item.standardPrice}
                              </span>
                              <span className="text-xl font-bold text-zinc-900">
                                {content.unit}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <button
                                onClick={scrollToLoyalty}
                                className="group/btn flex items-center gap-2 font-bold text-white bg-brand-red rounded-lg uppercase tracking-widest px-3 py-1.5 text-sm md:text-xs whitespace-nowrap shadow-sm hover:brightness-110 hover:scale-105 transition-all cursor-pointer"
                              >
                                {item.loyaltyPrice} {content.unit}{" "}
                                {content.toggle.upsellBadge}
                                <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                              </button>
                            </div>

                            {item.isPerCycle && (
                              <span className="text-sm font-semibold text-zinc-400 uppercase">
                                / {content.cycleLabel}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        <div ref={loyaltyRef} id="loyalty-info" className="mt-24 pt-12 border-t border-zinc-100 scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h3 className="text-3xl font-extrabold text-zinc-900 mb-4 uppercase tracking-tight">
                {content.loyaltyCard.title}
              </h3>
              <p className="text-lg text-zinc-600 mb-8 max-w-lg font-normal">
                {content.loyaltyCard.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
                <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                    {content.loyaltyCard.priceLabel}
                  </span>
                  <span className="text-2xl font-extrabold text-zinc-900">
                    {content.loyaltyCard.priceValue} {content.unit}
                  </span>
                </div>
                <div className="bg-brand-red/5 p-4 rounded-2xl border border-brand-red/10">
                  <span className="block text-xs font-bold text-brand-red uppercase tracking-wider mb-1">
                    {content.loyaltyCard.benefitLabel}
                  </span>
                  <span className="text-2xl font-extrabold text-brand-red">
                    {content.loyaltyCard.benefitValue} {content.unit}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 text-left w-full max-w-md">
                {content.loyaltyCard.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-700 font-medium">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-red flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-zinc-500 font-normal">
                {content.loyaltyCard.ironingNote}
              </p>
            </div>
            
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="max-w-md w-full">
                <LoyaltyCardImg />
                <p className="mt-6 text-sm text-zinc-500 text-center font-normal italic">
                  {content.toggle.upsellMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingTabs;
