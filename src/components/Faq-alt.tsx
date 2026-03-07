"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { FormattedText } from "@/components/FormattedText";
import SectionBackground from "@/components/SectionBackground";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqProps {
  content: {
    title: string;
    description: string;
    items: FaqItem[];
  };
  bgImage?: string;
}

const FaqAlt = ({ content, bgImage }: FaqProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section 
      className="relative py-32 scroll-mt-20 bg-white overflow-hidden" 
      id="faq" 
      aria-label="Frequently Asked Questions"
    >
      <SectionBackground imagePath={bgImage} />
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-red/5 -skew-x-12 transform translate-x-20 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 border-[60px] border-zinc-100 rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Header Section - Sticky on Desktop */}
          <div className="lg:w-1/3 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-1 bg-brand-red text-white font-black uppercase tracking-widest text-xs mb-6 rotate-[-2deg]">
                Quick Help
              </div>
              <h2 className="text-6xl md:text-7xl font-black text-zinc-900 uppercase tracking-tighter leading-[0.85] mb-8">
                {content.description}
              </h2>
              <div className="w-24 h-4 bg-brand-red mb-8" />
              <p className="text-xl text-zinc-500 font-medium leading-tight max-w-sm">
                Everything you need to know about our professional self-service laundry.
              </p>
              
              <div className="mt-12 hidden lg:flex items-center gap-4 text-zinc-400">
                <HelpCircle size={40} className="animate-bounce" />
                <span className="font-bold uppercase tracking-widest text-sm">Scroll for more</span>
              </div>
            </motion.div>
          </div>

          {/* FAQ Items Section */}
          <div className="lg:w-2/3 w-full space-y-6">
            {content.items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative group transition-all duration-500 ${
                  openIndex === idx ? "z-20" : "z-10"
                }`}
              >
                {/* Asymmetric Shadow Backdrop */}
                <div className={`absolute inset-0 bg-zinc-900 transition-transform duration-500 rounded-3xl ${
                  openIndex === idx ? "translate-x-3 translate-y-3" : "translate-x-0 translate-y-0 group-hover:translate-x-2 group-hover:translate-y-2"
                }`} />
                
                <div className={`relative border-4 border-zinc-900 bg-white rounded-3xl overflow-hidden transition-all duration-500 ${
                  openIndex === idx ? "-translate-x-1 -translate-y-1" : ""
                }`}>
                  <button
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 md:p-10 text-left outline-none"
                    aria-expanded={openIndex === idx}
                  >
                    <div className="flex gap-6 md:gap-8 items-center">
                      <span className={`text-3xl font-black tabular-nums transition-colors duration-300 ${
                        openIndex === idx ? "text-brand-red" : "text-zinc-200"
                      }`}>
                        {(idx + 1).toString().padStart(2, '0')}
                      </span>
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-zinc-900 leading-tight">
                        {item.question}
                      </h3>
                    </div>
                    
                    <div className={`shrink-0 ml-4 w-14 h-14 rounded-2xl border-4 border-zinc-900 flex items-center justify-center transition-all duration-500 ${
                      openIndex === idx ? "bg-brand-red text-white -rotate-12" : "bg-zinc-50 text-zinc-900 rotate-0"
                    }`}>
                      {openIndex === idx ? <Minus size={28} strokeWidth={3} /> : <Plus size={28} strokeWidth={3} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {openIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                      >
                        <div className="px-8 md:px-10 pb-10 border-t-4 border-zinc-900 pt-8 bg-zinc-50/50">
                          <div className="text-zinc-700 leading-snug font-bold text-lg md:text-xl max-w-2xl">
                            <FormattedText text={item.answer} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqAlt;
