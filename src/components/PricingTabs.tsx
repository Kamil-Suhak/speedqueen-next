"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Info } from "lucide-react";

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
      standard: string;
      loyalty: string;
      upsellBadge: string;
      upsellMessage: string;
    };
    categories: PricingCategory[];
  };
}

const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const PricingTabs = ({ content }: PricingProps) => {
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);
  const activeLocation = content.locations[activeLocationIndex] || content.locations[0];
  const [isLoyalty, setIsLoyalty] = useState(false);

  return (
    <section className="py-24 bg-zinc-50" id="pricing">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4 uppercase tracking-tighter">
            {content.title}
          </h2>
          <div className="mx-auto mt-2 h-1.5 w-20 bg-brand-red rounded-full" />
          <p className="mt-6 text-lg text-zinc-600 font-medium">{content.subtitle}</p>
        </div>

        {/* Controls Layout */}
        <div className="flex flex-col-reverse md:flex-row justify-between items-center md:items-end gap-8 mb-12">
          
          {/* Location Tabs */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 w-full md:w-auto">
            {content.locations.map((loc, idx) => {
              const isActive = activeLocationIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveLocationIndex(idx)}
                  className={`relative px-5 py-2.5 text-sm font-black cursor-pointer transition-all rounded-xl border-2 shadow-sm uppercase tracking-tight ${
                    isActive
                      ? "bg-zinc-900 text-white border-zinc-900 scale-105"
                      : "bg-white text-zinc-500 border-zinc-200 hover:border-brand-red/30 hover:text-brand-red"
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>

          {/* Pricing Toggle */}
          <div className="flex flex-col items-center md:items-end w-full md:w-auto relative">
            <div className="relative flex items-center bg-zinc-200/80 p-1.5 rounded-2xl border border-zinc-200 shadow-inner">
              
              <button
                onClick={() => setIsLoyalty(false)}
                className={`relative px-6 py-3 rounded-xl font-black text-sm transition-colors cursor-pointer whitespace-nowrap uppercase tracking-tight ${
                  !isLoyalty ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {!isLoyalty && (
                  <motion.div
                    layoutId="pricingPill"
                    className="absolute inset-0 bg-white rounded-xl shadow-md border border-zinc-100"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{content.toggle.standard}</span>
              </button>

              <button
                onClick={() => setIsLoyalty(true)}
                className={`relative px-6 py-3 rounded-xl font-black text-sm transition-colors cursor-pointer whitespace-nowrap uppercase tracking-tight ${
                  isLoyalty ? "text-white" : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                {isLoyalty && (
                  <motion.div
                    layoutId="pricingPill"
                    className="absolute inset-0 bg-brand-red rounded-xl shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{content.toggle.loyalty}</span>
              </button>
            </div>

            <div className="absolute top-full mt-3 w-full text-center md:text-right">
              <AnimatePresence>
                {isLoyalty && content.toggle.upsellMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-brand-red font-black whitespace-nowrap uppercase"
                  >
                    {content.toggle.upsellMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Dynamic Pricing List */}
        <div className="space-y-16 min-h-[400px]">
          {content.categories.map((category) => {
            const visibleItems = category.items.filter((item) =>
              item.availableAt.includes(activeLocation)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={category.id}>
                <h3 className="text-2xl font-black text-zinc-900 mb-6 border-b-4 border-zinc-100 pb-2 uppercase tracking-tight">
                  {category.title}
                </h3>

                {category.alertBanner && (
                  <div className="mb-6 flex gap-3 rounded-2xl bg-brand-red/5 p-4 border-2 border-brand-red/10">
                    <Info className="text-brand-red shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-black text-brand-red mb-1 uppercase text-sm">
                        {category.alertBanner.title}
                      </h4>
                      <p className="text-sm text-zinc-700 leading-relaxed font-medium">
                        {category.alertBanner.description}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeLocationIndex}
                      variants={listContainerVariants}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className="flex flex-col gap-4"
                    >
                      {visibleItems.map((item, idx) => (
                        <motion.div
                          variants={listItemVariants}
                          key={`${category.id}-${idx}`}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[2rem] bg-white border-2 border-transparent shadow-sm hover:border-brand-red transition-all gap-4"
                        >
                          <div className="flex flex-col sm:pr-4">
                            <span className="text-xl font-black text-zinc-900 uppercase tracking-tight">
                              {item.name}
                            </span>
                            {item.description && (
                              <span className="text-sm text-zinc-500 mt-1 font-medium">
                                {item.description}
                              </span>
                            )}
                            {item.isPerCycle && item.cycleDuration && (
                              <span className="text-xs font-black text-brand-red mt-2 uppercase tracking-widest">
                                1 {content.cycleLabel} = {item.cycleDuration}
                              </span>
                            )}
                          </div>

                          <div className="sm:text-right shrink-0 flex flex-col sm:items-end">
                            <div className="flex items-baseline gap-1">
                              <div className="overflow-hidden relative flex items-center justify-end h-10 min-w-[80px]">
                                <AnimatePresence mode="popLayout" initial={false}>
                                  <motion.span
                                    key={isLoyalty ? "loyalty" : "standard"}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-3xl font-black text-zinc-900 inline-block"
                                  >
                                    {isLoyalty ? item.loyaltyPrice : item.standardPrice}
                                  </motion.span>
                                </AnimatePresence>
                              </div>
                              <span className="text-3xl font-black text-zinc-900">{content.unit}</span>
                              {item.isPerCycle && (
                                <span className="text-sm font-black text-zinc-400 ml-1 uppercase">/ {content.cycleLabel}</span>
                              )}
                            </div>
                            
                            <span 
                              className={`text-[10px] font-black text-white bg-brand-red px-2 py-1 rounded-lg mt-2 w-fit uppercase tracking-widest transition-opacity duration-200 ${
                                isLoyalty ? "opacity-0 select-none pointer-events-none" : "opacity-100"
                              }`}
                            >
                              {item.loyaltyPrice} {content.unit} {content.toggle.upsellBadge}
                            </span>
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
      </div>
    </section>
  );
};

export default PricingTabs;
