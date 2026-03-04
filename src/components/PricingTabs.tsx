"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Info } from "lucide-react";
import SectionBackground from "@/components/SectionBackground";

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
  bgImage?: string;
  showToggle?: boolean;
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

const PricingTabs = ({ content, bgImage, showToggle = true }: PricingProps) => {
  const [activeLocationIndex, setActiveLocationIndex] = useState(0);
  const activeLocation =
    content.locations[activeLocationIndex] || content.locations[0];
  const [isLoyalty, setIsLoyalty] = useState(false);

  return (
    <section
      className="relative py-24 scroll-mt-20 overflow-hidden bg-white"
      id="pricing"
    >
      <SectionBackground imagePath={bgImage} />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 mb-4 uppercase tracking-tight">
            {content.title}
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 bg-brand-red rounded-full" />
          <p className="mt-6 text-lg text-zinc-600 font-normal">
            {content.subtitle}
          </p>
        </div>

        {/* Controls Layout - Location tabs centered */}
        <div className="flex flex-col items-center gap-8 mb-12">
          {/* Location Tabs */}
          <div className="flex flex-wrap justify-center gap-3 w-full">
            {content.locations.map((loc, idx) => {
              const isActive = activeLocationIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveLocationIndex(idx)}
                  className={`relative px-5 py-2.5 text-sm font-bold cursor-pointer transition-all rounded-xl border-2 shadow-sm uppercase tracking-tight ${
                    isActive
                      ? "bg-zinc-900 text-white border-zinc-900 scale-105"
                      : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-800"
                  }`}
                >
                  {loc}
                </button>
              );
            })}
          </div>

          {/* Pricing Toggle (Optional) */}
          {showToggle && (
            <div className="flex flex-col items-center relative">
              <div className="relative flex items-center bg-zinc-200/80 p-1.5 rounded-2xl border border-zinc-200 shadow-inner">
                <button
                  onClick={() => setIsLoyalty(false)}
                  className={`relative px-6 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer whitespace-nowrap uppercase tracking-tight ${
                    !isLoyalty
                      ? "text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  {!isLoyalty && (
                    <motion.div
                      layoutId="pricingPill"
                      className="absolute inset-0 bg-white rounded-xl shadow-md border border-zinc-100"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">
                    {content.toggle.standard}
                  </span>
                </button>

                <button
                  onClick={() => setIsLoyalty(true)}
                  className={`relative px-6 py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer whitespace-nowrap uppercase tracking-tight ${
                    isLoyalty
                      ? "text-white"
                      : "text-zinc-500 hover:text-zinc-700"
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
            </div>
          )}
        </div>

        {/* Dynamic Pricing List */}
        <div className="space-y-16 min-h-[400px]">
          {content.categories.map((category) => {
            const visibleItems = category.items.filter((item) =>
              item.availableAt.includes(activeLocation),
            );

            if (visibleItems.length === 0) return null;

            return (
              <motion.div layout key={category.id} transition={{ duration: 0.4 }}>
                <h3 className="text-2xl font-extrabold text-zinc-900 mb-6 border-b-2 border-zinc-100 pb-2 uppercase tracking-tight">
                  {category.title}
                </h3>

                {category.alertBanner && (
                  <div className="mb-6 flex gap-3 rounded-2xl bg-amber-50 p-4 border border-amber-100">
                    <Info className="text-amber-600 shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-bold text-amber-800 mb-1 uppercase text-sm">
                        {category.alertBanner.title}
                      </h4>
                      <p className="text-sm text-zinc-700 leading-relaxed font-normal">
                        {category.alertBanner.description}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${category.id}-${activeLocationIndex}-${showToggle}`}
                      variants={listContainerVariants}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                      className="flex flex-col gap-4"
                    >
                      {visibleItems.map((item, idx) => (
                        <motion.div
                          variants={listItemVariants}
                          layout
                          key={`${category.id}-${item.name}-${idx}`}
                          className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-slate-100 shadow-sm hover:border-brand-red/20 transition-colors gap-4"
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
                            {/* Standard Price */}
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-extrabold text-zinc-900">
                                {item.standardPrice}
                              </span>
                              <span className="text-xl font-bold text-zinc-900">
                                {content.unit}
                              </span>
                            </div>

                            {/* Loyalty Banner - Repositioned and resized */}
                            <div className="flex items-center">
                              <span className="font-bold text-white bg-brand-red rounded-lg uppercase tracking-widest px-3 py-1.5 text-sm md:text-xs whitespace-nowrap shadow-sm">
                                {item.loyaltyPrice} {content.unit}{" "}
                                {content.toggle.upsellBadge}
                              </span>
                            </div>

                            {/* Cycle info */}
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingTabs;
