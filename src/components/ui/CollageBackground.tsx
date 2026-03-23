"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import OrlinskiegoFront from "../../../public/images/collage-bg/OrlinskiegoFront.jpg";
import OrlinskiegoWnetrze from "../../../public/images/collage-bg/OrlinskiegoWnetrze.jpg";
import PawiaFront from "../../../public/images/collage-bg/PawiaFront.jpg";
import PawiaWnetrze from "../../../public/images/collage-bg/PawiaWnetrze.jpg";
import SlowackiegoFront from "../../../public/images/collage-bg/SlowackiegoFront.jpg";
import SlowackiegoWnetrze from "../../../public/images/collage-bg/SlowackiegoWnetrze.jpg";

const groups = [
  { front: OrlinskiegoFront, wnetrze: OrlinskiegoWnetrze },
  { front: PawiaFront, wnetrze: PawiaWnetrze },
  { front: SlowackiegoFront, wnetrze: SlowackiegoWnetrze },
];

const mobileCols = [
  [groups[0].front, groups[1].front, groups[2].front],
  [groups[0].wnetrze, groups[1].wnetrze, groups[2].wnetrze],
];
const mobileTrackItems = [...mobileCols, ...mobileCols, ...mobileCols, ...mobileCols];

const desktopCols = [
  [groups[0].front, groups[0].wnetrze],
  [groups[1].front, groups[1].wnetrze],
  [groups[2].front, groups[2].wnetrze],
];
const desktopTrackItems = [...desktopCols, ...desktopCols, ...desktopCols, ...desktopCols];

// Hardware acceleration style block to prevent sub-pixel scrolling flicker
const antiAliasingStyles = {
  WebkitTransform: "translateZ(0)",
  transform: "translateZ(0)",
  willChange: "transform",
  WebkitBackfaceVisibility: "hidden",
  backfaceVisibility: "hidden",
} as const;

export default function CollageBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-neutral-50">
      {/* Mobile Track - 2x3 Grid per screen */}
      <motion.div
        className="flex h-full w-[400%] md:hidden"
        style={{ willChange: "transform" }}
        animate={{ x: ["-50%", "0%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {mobileTrackItems.map((col, cIdx) => (
          <div key={`m-${cIdx}`} className="flex h-full w-[12.5%] mr-[-1px] shrink-0 flex-col">
            {col.map((src, iIdx) => (
              <div key={`i-${iIdx}`} className="relative h-1/3 w-full">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  style={antiAliasingStyles}
                  priority
                  placeholder="blur"
                />
              </div>
            ))}
          </div>
        ))}
      </motion.div>

      {/* Desktop Track - 3x2 Grid per screen */}
      <motion.div
        className="hidden h-full w-[400%] md:flex"
        style={{ willChange: "transform" }}
        animate={{ x: ["-50%", "0%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
      >
        {desktopTrackItems.map((col, cIdx) => (
          <div key={`d-${cIdx}`} className="flex h-full w-[8.333333%] mr-[-1px] shrink-0 flex-col">
            {col.map((src, iIdx) => (
              <div key={`j-${iIdx}`} className="relative h-1/2 w-full">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  style={antiAliasingStyles}
                  priority
                  placeholder="blur"
                />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
