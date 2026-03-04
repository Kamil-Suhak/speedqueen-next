"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Star, Quote, X } from "lucide-react";
import type { GoogleReview } from "@/actions/getReviews";
import Image from "next/image";
import { sectionBackgroundStyle } from "@/lib/background-manager";

interface ReviewsWrapper {
  title: string;
  view_all: string;
  read_more: string;
}

export default function Reviews({
  reviewWrapper,
  reviews,
  bgImage,
}: {
  reviewWrapper: ReviewsWrapper;
  reviews: GoogleReview[];
  bgImage?: string;
}) {
  const [selectedReview, setSelectedReview] = useState<GoogleReview | null>(
    null,
  );
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const prevFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // If modal is closed, do nothing
    if (!selectedReview) return;

    // Lock Body & Add Listener
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedReview(null);
      if (e.key === "Tab") e.preventDefault();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Unlock Body & Remove Listener
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedReview]);

  // Focus Management
  useEffect(() => {
    if (selectedReview) {
      // Save the element that was focused before opening
      prevFocused.current = document.activeElement as HTMLElement | null;
      // Move focus to close button
      setTimeout(() => closeButtonRef.current?.focus(), 0);
    } else {
      // Restore focus when closing
      prevFocused.current?.focus?.();
      prevFocused.current = null;
    }
  }, [selectedReview]);

  const view_all_url = `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID}`;

  const scale = (fromRange: number[], toRange: number[]) => {
    const d = (toRange[1] - toRange[0]) / (fromRange[1] - fromRange[0]);
    return (from: number) => (from - fromRange[0]) * d + toRange[0];
  };

  const max = 130;
  const weightScale = scale([0, max], [0, 0.99]);
  const sortedReviews = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    return [...reviews]
      .sort((a, b) => {
        const scoreA = a.rating + weightScale(Math.min(max, a.text.length));
        const scoreB = b.rating + weightScale(Math.min(max, b.text.length));

        return scoreB - scoreA;
      })
      .slice(0, 3);
  }, [reviews, weightScale]);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section id="reviews" className="scroll-mt-20 pt-20 pb-10" style={sectionBackgroundStyle(bgImage)}>
      <div className="mx-auto max-w-7xl flex-col justify-between px-4">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tight">
            {reviewWrapper.title}
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 bg-brand-red rounded-full" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sortedReviews.map((review, i) => (
            <div
              key={review.time ?? `${review.author_name}-${i}`}
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
                {review.text.length > max
                  ? review.text.substring(0, max) + "..."
                  : review.text}
                &quot;
                {review.text.length > max && (
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
                    src={review.profile_photo_url}
                    alt="" // decorative
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
             className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-xl shadow-lg hover:bg-brand-red transition-all transform hover:-translate-y-1 uppercase tracking-tight"
           >
             {reviewWrapper.view_all}
           </a>
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedReview(null)}
        >
          <div
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
                  src={selectedReview.profile_photo_url}
                  alt="" // decorative
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
          </div>
        </div>
      )}
    </section>
  );
}
