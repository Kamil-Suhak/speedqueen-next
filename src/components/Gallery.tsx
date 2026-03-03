"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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
}: {
  content: GalleryProps;
  lang: string;
}) => {
  return (
    <section key={lang} className="py-24 bg-white" id="gallery">
      <div className="container mx-auto px-4">
        {/* Header Area */}
        <div className="mb-16 text-center lg:text-left">
           <motion.h2
              key={`${lang}-h2`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-gray-900 leading-tight uppercase tracking-tighter"
            >
              {content.subtitle}
            </motion.h2>
            <div className="mt-4 h-1.5 w-24 bg-brand-red rounded-full mx-auto lg:mx-0" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {content.images.map((image, index) => (
            <motion.div
              key={`${lang}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative aspect-4/3 overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-lg cursor-pointer border-4 border-transparent hover:border-brand-red transition-colors"
            >
              {/* Image */}
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-linear-to-t from-zinc-900/90 via-zinc-900/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-end p-8">
                <div className="flex justify-between items-end transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                  <div>
                    {image.category && (
                      <span className="text-brand-red text-xs font-black uppercase tracking-widest mb-2 block">
                        {image.category}
                      </span>
                    )}
                    <h3 className="text-white font-black text-2xl uppercase tracking-tight">
                      {image.alt}
                    </h3>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
