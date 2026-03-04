"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Star, Quote, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { GoogleReview } from "@/actions/getReviews";
import Image from "next/image";
import SectionBackground from "@/components/SectionBackground";

interface ReviewsWrapper {
  title: string;
  view_all: string;
  read_more: string;
}

// Logic moved outside component to remain stable and avoid re-renders
const MAX_CHARS = 130;

const calculateScore = (review: GoogleReview) => {
  const bonus = Math.min(MAX_CHARS, (review.text || "").length) / MAX_CHARS * 0.99;
  return (review.rating || 0) + bonus;
};

export default function Reviews({
  reviewWrapper,
  reviews = [],
  bgImage,
}: {
  reviewWrapper: ReviewsWrapper;
  reviews?: GoogleReview[];
  bgImage?: string;
}) {
  const [selectedReview, setSelectedReview] = useState<GoogleReview | null>(
    null,
  );
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const prevFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!selectedReview) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedReview(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedReview]);

  useEffect(() => {
    if (selectedReview) {
      prevFocused.current = document.activeElement as HTMLElement | null;
      setTimeout(() => closeButtonRef.current?.focus(), 0);
    } else {
      prevFocused.current?.focus?.();
      prevFocused.current = null;
    }
  }, [selectedReview]);

  const view_all_url = "https://www.google.com/maps/search/Speed+Queen+Kraków";

  const sortedReviews = useMemo(() => {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return [];
    return [...reviews]
      .sort((a, b) => calculateScore(b) - calculateScore(a))
      .slice(0, 3);
  }, [reviews]);

  if (!reviews || sortedReviews.length === 0) return null;

  return (
    <section id="reviews" className="relative scroll-mt-20 pt-20 pb-10 bg-white">
      <SectionBackground imagePath={bgImage} />
      
      <div className="mx-auto max-w-7xl flex-col justify-between px-4 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tight">
            {reviewWrapper.title}
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 bg-brand-red rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sortedReviews.map((review, i) => (
            <div
              key={`${review.author_name}-${review.time}-${i}`}
              className={`flex flex-col justify-between rounded-3xl border border-slate-100 bg-white/90 backdrop-blur-sm p-8 shadow-sm transition-all hover:border-brand-red/20 hover:shadow-md ${i > 1 ? "hidden md:flex" : "flex"}`}
            >
              <div className="flex w-full items-start justify-between">
                <Quote className="mb-4 text-brand-red/5" size={48} />

                <div className="mt-4 flex gap-1 text-brand-red">
                  {[...Array(Math.max(0, review.rating || 0))].map((_, j) => (
                    <Star key={j} fill="currentColor" size={20} />
                  ))}
                </div>
              </div>
              <p className="mb-6 leading-relaxed text-gray-600 italic font-normal flex flex-col">
                &quot;
                {(review.text || "").length > MAX_CHARS
                  ? review.text.substring(0, MAX_CHARS) + "..."
                  : review.text}
                &quot;
                {(review.text || "").length > MAX_CHARS && (
                  <button
                    onClick={() => setSelectedReview(review)}
                    className="not-italic text-right text-sm font-bold text-zinc-900 hover:text-brand-red transition-colors focus:outline-none focus:underline uppercase tracking-tight"
                  >
                    {reviewWrapper.read_more}
                  </button>
                )}
              </p>

              <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                <div className="relative h-14 w-14">
                  <Image
                    src={review.profile_photo_url || "/images/logo.png"}
                    alt=""
                    fill
                    className="rounded-full bg-slate-50 object-cover border border-slate-100 shadow-sm"
                    sizes="56px"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                    {review.author_name}
                  </h3>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
                    {review.relative_time_description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
           <a 
             href={view_all_url}
             target="_blank"
             rel="noopener noreferrer"
             className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl shadow-lg hover:bg-brand-red transition-all transform hover:-translate-y-1 uppercase tracking-tight"
           >
             {reviewWrapper.view_all}
           </a>
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm transition-opacity"
            style={{ zIndex: 100 }}
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl p-10 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative border border-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeButtonRef}
                onClick={() => setSelectedReview(null)}
                className="absolute top-8 right-8 p-2 flex items-center justify-center rounded-2xl hover:bg-slate-50 transition-all text-zinc-900"
                aria-label="Close modal"
              >
                <X size={32} />
              </button>
              <div className="flex items-center gap-4 mb-8">
                <div className="relative h-16 w-16">
                  <Image
                    src={selectedReview.profile_photo_url || "/images/logo.png"}
                    alt=""
                    fill
                    className="rounded-full bg-slate-50 object-cover border border-slate-100"
                    sizes="64px"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-extrabold text-2xl text-gray-900 uppercase tracking-tight">
                    {selectedReview.author_name}
                  </h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    {selectedReview.relative_time_description}
                  </p>
                </div>

                <div className="hidden md:flex gap-1 text-brand-red ml-6">
                  {[...Array(Math.max(0, selectedReview.rating || 0))].map(
                    (_, k) => (
                      <Star key={k} fill="currentColor" size={28} />
                    ),
                  )}
                </div>
              </div>

              <div className="border-t border-slate-50 pt-8">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-xl font-normal">
                  {selectedReview.text}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
