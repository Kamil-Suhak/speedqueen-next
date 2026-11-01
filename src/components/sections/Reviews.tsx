"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Star, Quote, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { GoogleReviewItem } from "@/actions/getReviews";
import Image from "next/image";
import SectionBackground from "@/components/ui/SectionBackground";

interface ReviewsWrapper {
  title: string;
  view_more: string;
  hide: string;
  read_more: string;
}

const MAX_CHARS = 130;

const calculateScore = (review: GoogleReviewItem) => {
  const bonus =
    (Math.min(MAX_CHARS, (review.text || "").length) / MAX_CHARS) * 0.99;
  return (review.rating || 0) + bonus;
};

const getTruncatedContent = (text: string | null | undefined) => {
  const str = text || "";
  if (str.length <= MAX_CHARS) return { displayedText: str, hasMore: false };
  const nextSpace = str.indexOf(" ", MAX_CHARS);
  if (nextSpace === -1) return { displayedText: str, hasMore: false };
  return { displayedText: str.substring(0, nextSpace) + "...", hasMore: true };
};

export default function Reviews({
  reviewWrapper,
  reviews = [],
  bgImage,
}: {
  reviewWrapper: ReviewsWrapper;
  reviews?: GoogleReviewItem[];
  bgImage?: string;
}) {
  const [selectedReview, setSelectedReview] = useState<GoogleReviewItem | null>(
    null,
  );
  const [isClosing, setIsClosing] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedReview(null);
      setIsClosing(false);
    }, 200); // Wait for CSS exit animation
  }, []);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const prevFocused = useRef<HTMLElement | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedReview) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedReview, handleClose]);

  useEffect(() => {
    if (selectedReview) {
      prevFocused.current = document.activeElement as HTMLElement | null;
      setTimeout(() => closeButtonRef.current?.focus(), 0);
    } else {
      prevFocused.current?.focus?.();
      prevFocused.current = null;
    }
  }, [selectedReview]);

  const sortedReviews = useMemo(() => {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return [];
    return [...reviews]
      .sort((a, b) => calculateScore(b) - calculateScore(a))
      .slice(0, showAll ? 6 : 3);
  }, [reviews, showAll]);

  const toggleReviews = () => {
    if (showAll) {
      setShowAll(false);
      sectionRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      setShowAll(true);
    }
  };

  if (!reviews || sortedReviews.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="relative scroll-mt-20 pt-20 pb-10 bg-white"
    >
      <SectionBackground imagePath={bgImage} />

      <div className="mx-auto max-w-7xl flex-col justify-between px-4 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tight">
            {reviewWrapper.title}
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 bg-brand-primary rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {sortedReviews.map((review, i) => {
              const { displayedText, hasMore } = getTruncatedContent(
                review.text,
              );
              return (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  key={`${review.author_name}-${review.time}-${i}`}
                  className="flex flex-col justify-between rounded-3xl border border-slate-100 bg-white shadow-md md:bg-white/90 md:backdrop-blur-sm md:shadow-sm p-8 transition-[box-shadow,border-color] duration-200 hover:border-brand-primary/20 hover:shadow-lg md:hover:shadow-md"
                >
                  <div className="flex w-full items-start justify-between">
                    <Quote className="mb-4 text-brand-primary/20" size={48} />

                    <div className="mt-4 flex gap-1 text-brand-primary">
                      {[...Array(Math.max(0, review.rating || 0))].map(
                        (_, j) => (
                          <Star key={j} fill="currentColor" size={20} />
                        ),
                      )}
                    </div>
                  </div>
                  <p className="mb-6 leading-relaxed text-gray-600 italic font-normal flex flex-col">
                    &quot;{displayedText}&quot;
                    {hasMore && (
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="not-italic text-right text-sm font-bold text-zinc-900 hover:text-brand-primary transition-colors focus:outline-none focus:underline uppercase tracking-tight"
                      >
                        {reviewWrapper.read_more}
                      </button>
                    )}
                  </p>

                  <div className="flex items-center gap-4 border-t border-slate-50 pt-6">
                    <div className="relative h-14 w-14">
                      <Image
                        src={
                          review.profile_photo_url ||
                          "/images/avatar-default.svg"
                        }
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
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {reviews.length > 3 && (
          <div className="hidden lg:flex justify-center mt-12">
            <button
              onClick={toggleReviews}
              className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl shadow-md hover:bg-zinc-800 hover:scale-[1.01] active:scale-[0.99] transition-[background-color,transform] duration-200 uppercase tracking-tight outline-none focus:ring-4 focus:ring-zinc-900/20"
            >
              {showAll ? reviewWrapper.hide : reviewWrapper.view_more}
            </button>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {selectedReview && (
        <div
          className={`fixed inset-0 z-100 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm ${isClosing ? "animate-fade-out" : "animate-fade-in"}`}
          style={{ zIndex: 100 }}
          onClick={handleClose}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
            className={`bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl relative border border-slate-100 ${isClosing ? "animate-scale-out-modal" : "animate-scale-in-modal"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 w-11 h-11 flex items-center justify-center rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 z-10 cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} className="sm:hidden" />
              <X size={24} className="hidden sm:block" />
            </button>

            <div className="flex items-start gap-3 sm:gap-4 pr-12 sm:pr-16 mb-5 sm:mb-6">
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 shrink-0 rounded-full overflow-hidden border border-slate-100 bg-slate-50 shadow-xs">
                <Image
                  src={
                    selectedReview.profile_photo_url ||
                    "/images/avatar-default.svg"
                  }
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 48px, 64px"
                />
              </div>

              <div className="flex flex-col min-w-0">
                <h3
                  id="review-modal-title"
                  className="font-extrabold text-base sm:text-xl md:text-2xl text-gray-900 uppercase tracking-tight break-words"
                >
                  {selectedReview.author_name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold uppercase tracking-wider mt-0.5 flex-wrap">
                  <span>{selectedReview.relative_time_description}</span>
                  {selectedReview.branchName && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-600 truncate max-w-[200px] sm:max-w-none">
                        {selectedReview.branchName}
                      </span>
                    </>
                  )}
                </div>

                {/* Rating display - permanently visible on mobile & desktop */}
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className="flex gap-0.5 text-brand-primary"
                    aria-label={`Ocena: ${selectedReview.rating || 5} z 5 gwiazdek`}
                  >
                    {[...Array(5)].map((_, k) => {
                      const isFilled = k < (selectedReview.rating || 5);
                      return (
                        <Star
                          key={k}
                          fill={isFilled ? "currentColor" : "none"}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${isFilled ? "text-brand-primary" : "text-slate-200"}`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-700">
                    {selectedReview.rating ? `${selectedReview.rating}.0` : "5.0"}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 sm:pt-6 md:pt-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base md:text-lg font-normal">
                {selectedReview.text}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
