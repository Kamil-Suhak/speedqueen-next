"use client";

import Image from "next/image";
import { backgroundImages } from "@/lib/background-manager";

interface SectionBackgroundProps {
  imagePath: string | undefined;
}

/**
 * A highly optimized background component using next/image.
 * Handles automatic WebP conversion, lazy loading, and sizing.
 */
export default function SectionBackground({ imagePath }: SectionBackgroundProps) {
  if (!imagePath) return null;

  const isImage1 = imagePath.endsWith('1.jpg');
  const isImage2 = imagePath.endsWith('2.jpg');

  // Map the position logic from the manager to CSS object-position
  const position = isImage2 ? 'left' : (isImage1 ? 'right bottom' : 'right');

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* 
        We use fill and objectFit: contain or cover. 
        Given these are white background images with props, 
        'contain' with specific alignment is often safer to avoid cropping props.
      */}
      <Image
        src={imagePath}
        alt=""
        fill
        sizes="100vw"
        quality={75}
        className="opacity-40" // Built-in transparency instead of linear-gradient overlay
        style={{
          objectFit: 'contain',
          objectPosition: position,
        }}
      />
    </div>
  );
}
