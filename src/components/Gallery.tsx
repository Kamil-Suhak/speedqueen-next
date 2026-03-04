"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { sectionBackgroundStyle } from "@/lib/background-manager";

export interface GalleryImage {
  src: string;
  alt: string;
  category?: string;
}

export interface GalleryProps {
  title: string;
  subtitle: string;
  images: GalleryImage[];
}

const Gallery = ({
  content,
  lang,
  bgImage,
}: {
  content: GalleryProps;
  lang: string;
  bgImage?: string;
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [imagesPerPage, setImagesPerPage] = useState(6);

  // Handle responsive images per page
  useEffect(() => {
    const updateCount = () => {
      setImagesPerPage(window.innerWidth < 768 ? 3 : 6);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const totalPages = Math.ceil(content.images.length / imagesPerPage);
  const startIndex = currentPage * imagesPerPage;
  const visibleImages = content.images.slice(
    startIndex,
    startIndex + imagesPerPage
  );

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section 
      key={lang} 
      className="py-24 relative overflow-hidden scroll-mt-20" 
      id="gallery" 
      style={sectionBackgroundStyle(bgImage)}
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Header Area */}
        <div className="mb-16 text-center lg:text-left">
           <motion.h2
              key={`${lang}-h2`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight uppercase tracking-tight"
            >
              {content.subtitle}
            </motion.h2>
            <div className="mt-4 h-1 w-16 bg-brand-red rounded-full mx-auto lg:mx-0" />
        </div>

        {/* Gallery Grid with Animation */}
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentPage}-${imagesPerPage}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {visibleImages.map((image, index) => (
                <motion.div
                  key={`${lang}-${startIndex + index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative aspect-4/3 overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-brand-red/10 hover:border-brand-red/20 transition-all duration-500"
                >
                  {/* Image with subtle zoom on hover */}
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Elegant Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex flex-col justify-end p-8">
                    {/* Text Content */}
                    <div className="relative z-10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                      {image.category && (
                        <span className="inline-block text-[10px] font-bold text-white bg-brand-red px-2 py-0.5 rounded mb-2 uppercase tracking-widest">
                          {image.category}
                        </span>
                      )}
                      <h3 className="text-white font-bold text-lg md:text-xl leading-tight drop-shadow-md">
                        {image.alt}
                      </h3>
                    </div>
                    
                    {/* Bottom gradient for text readability */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Pagination Controls - Reduced top margin from 16 to 8 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={handlePrev}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-brand-red hover:text-brand-red transition-all transform hover:scale-110 text-slate-600"
              aria-label="Previous page"
            >
              <ChevronLeft size={24} />
            </button>
            
            <div className="flex gap-3">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentPage === i 
                      ? "bg-brand-red w-10 shadow-sm shadow-brand-red/30" 
                      : "bg-slate-200 w-2 hover:bg-slate-300"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-brand-red hover:text-brand-red transition-all transform hover:scale-110 text-slate-600"
              aria-label="Next page"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
