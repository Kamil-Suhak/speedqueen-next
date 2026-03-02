"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

export interface MachineItem {
  name: string;
  description?: string;
  standardPrice: number;
  loyaltyPrice: number;
  isPerCycle?: boolean;
  cycleDuration?: string; // e.g., "15 min"
  availableAt: string[];  // e.g., ["Pawia 34", "Słowackiego 56"]
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

const PricingTabs = ({ content }: PricingProps) => {
  // States
  const [activeLocation, setActiveLocation] = useState(content.locations[0]);
  const [isLoyalty, setIsLoyalty] = useState(false);

  return (
    <section className="py-24 bg-zinc-50" id="pricing">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-zinc-600">{content.subtitle}</p>
        </div>

        {/* 1. The Loyalty Sliding Toggle */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative flex items-center bg-zinc-200/60 p-1.5 rounded-full border border-zinc-200">
            {/* Standard Button */}
            <button
              onClick={() => setIsLoyalty(false)}
              className={`relative z-10 px-6 py-3 rounded-full font-bold text-sm md:text-base transition-colors ${
                !isLoyalty ? "text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {content.toggle.standard}
            </button>

            {/* Loyalty Button */}
            <button
              onClick={() => setIsLoyalty(true)}
              className={`relative z-10 px-6 py-3 rounded-full font-bold text-sm md:text-base transition-colors ${
                isLoyalty ? "text-white" : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {content.toggle.loyalty}
            </button>

            {/* The Sliding Pill Background */}
            <div
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full shadow-sm transition-all duration-300 ease-out ${
                isLoyalty ? "left-[calc(50%+3px)] bg-primary" : "left-1.5 bg-white"
              }`}
            />
          </div>
          
          {/* Subtle Upsell Message underneath the toggle */}
          <AnimatePresence mode="wait">
            {isLoyalty && content.toggle.upsellMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="text-sm text-zinc-500 font-medium"
                style={{ overflow: "hidden" }}
              >
                {content.toggle.upsellMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. Location Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-zinc-200 pb-4">
          {content.locations.map((loc) => (
            <button
              key={loc}
              onClick={() => setActiveLocation(loc)}
              className={`relative px-4 py-2 font-bold transition-colors ${
                activeLocation === loc ? "text-primary" : "text-zinc-400 hover:text-zinc-700"
              }`}
            >
              {loc}
              {activeLocation === loc && (
                <motion.div
                  layoutId="activeTabLocation"
                  className="absolute left-0 right-0 -bottom-[17px] h-1 bg-primary rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* 3. The Dynamic Pricing List */}
        <div className="space-y-16">
          {content.categories.map((category) => {
            // Filter items that belong to the currently selected location
            const visibleItems = category.items.filter((item) =>
              item.availableAt.includes(activeLocation)
            );

            // If no items in this category for this location, don't render the category
            if (visibleItems.length === 0) return null;

            return (
              <div key={category.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-2xl font-black text-zinc-900 mb-6 border-b-2 border-zinc-100 pb-2">
                  {category.title}
                </h3>

                {/* Optional "Pro Tip" Banner specific to this category */}
                {category.alertBanner && (
                  <div className="mb-6 flex gap-3 rounded-xl bg-primary/10 p-4 border border-primary/20">
                    <Info className="text-primary shrink-0 mt-0.5" size={20} />
                    <div>
                      <h4 className="font-bold text-primary mb-1">
                        {category.alertBanner.title}
                      </h4>
                      <p className="text-sm text-zinc-700 leading-relaxed">
                        {category.alertBanner.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Rows */}
                <div className="flex flex-col gap-4">
                  {visibleItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-100 shadow-sm hover:border-zinc-300 transition-colors"
                    >
                      {/* Item Details */}
                      <div className="flex flex-col pr-4">
                        <span className="text-lg font-bold text-zinc-900">
                          {item.name}
                        </span>
                        {item.description && (
                          <span className="text-sm text-zinc-500 mt-1">
                            {item.description}
                          </span>
                        )}
                        {item.isPerCycle && item.cycleDuration && (
                          <span className="text-sm font-medium text-primary mt-1">
                            1 cykl = {item.cycleDuration}
                          </span>
                        )}
                      </div>

                      {/* Price Matrix */}
                      <div className="text-right shrink-0 flex flex-col items-end">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-zinc-900">
                            {isLoyalty ? item.loyaltyPrice : item.standardPrice} zł
                          </span>
                          {item.isPerCycle && (
                            <span className="text-sm font-medium text-zinc-500">/ cykl</span>
                          )}
                        </div>
                        
                        {/* Subtle upsell reminder if standard pricing is active */}
                        {!isLoyalty && (
                          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md mt-1">
                            {item.loyaltyPrice} zł {content.toggle.upsellBadge}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
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