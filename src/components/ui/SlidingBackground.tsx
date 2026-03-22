"use client";

import { motion } from "framer-motion";

const images = [
  "/images/collage-bg/OrlinskiegoWnetrze.jpg",
  "/images/collage-bg/PawiaWnetrze.jpg",
  "/images/collage-bg/SlowackiegoWnetrze.jpg",
];

const trackImages = [...images, ...images];

export default function SlidingBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-white">
      <motion.div
        className="flex h-full w-[600%]"
        style={{ willChange: "transform" }}
        animate={{ x: ["-50%", "0%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {trackImages.map((src, i) => (
          <div key={i} className="relative h-full w-[16.666667%] shrink-0">
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              style={{
                WebkitTransform: "translateZ(0)",
                transform: "translateZ(0)",
                willChange: "transform",
                WebkitBackfaceVisibility: "hidden",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
