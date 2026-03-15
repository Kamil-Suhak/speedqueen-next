"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

const Faq = ({ content, bgImage }: FaqProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const totalPages = Math.ceil(content.items.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const mobileItems = content.items.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <section className="relative py-24 scroll-mt-20 bg-white" id="faq" aria-label="Frequently Asked Questions">
      <SectionBackground imagePath={bgImage} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tight">
            {content.description}
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 bg-brand-red rounded-full" aria-hidden="true" />
        </div>

        <div className="hidden md:grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          {content.items.slice(0, 7).map((item, idx) => (
            <FaqCard
              key={idx}
              item={item}
              isOpen={openIndex === idx}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </div>

        <div className="md:hidden space-y-4 max-w-xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
              aria-live="polite"
            >
              {mobileItems.map((item, idx) => (
                <FaqCard
                  key={startIndex + idx}
                  item={item}
                  isOpen={openIndex === startIndex + idx}
                  onClick={() =>
                    setOpenIndex(
                      openIndex === startIndex + idx ? null : startIndex + idx,
                    )
                  }
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="p-3 rounded-2xl border-2 border-slate-100 disabled:opacity-30 hover:bg-slate-50 transition-colors text-zinc-900 focus:ring-4 focus:ring-brand-red/10 outline-none"
                aria-label="Previous"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <span className="font-bold text-zinc-900 uppercase tracking-widest text-sm" aria-current="true">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
                }
                disabled={currentPage === totalPages - 1}
                className="p-3 rounded-2xl border-2 border-slate-100 disabled:opacity-30 hover:bg-slate-50 transition-colors text-zinc-900 focus:ring-4 focus:ring-brand-red/10 outline-none"
                aria-label="Next"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          )}
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
}) => (
  <div
    className={`border rounded-2xl transition-all duration-300 ${isOpen ? "border-brand-red bg-brand-red/5" : "border-slate-100 bg-white/90 backdrop-blur-sm hover:border-slate-200"}`}
  >
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-8 text-left group outline-none focus:ring-4 focus:ring-brand-red/10 rounded-2xl"
      aria-expanded={isOpen}
      aria-label={`Toggle answer: ${item.question}`}
    >
      <span className={`font-bold text-lg uppercase tracking-tight transition-colors ${isOpen ? "text-brand-red" : "text-gray-900 group-hover:text-brand-red"}`}>
        {item.question}
      </span>
      <div
        className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
        aria-hidden="true"
      >
        {isOpen ? (
          <ChevronUp className="text-brand-red" />
        ) : (
          <ChevronDown className="text-zinc-400" />
        )}
      </div>
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="px-8 pb-8 text-gray-700 leading-relaxed border-t border-slate-50 pt-6 font-normal text-lg">
            <FormattedText text={item.answer} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default Faq;
