"use client";

import Image from "next/image";

interface SectionBackgroundProps {
  imagePath: string | undefined;
}

export default function SectionBackground({ imagePath }: SectionBackgroundProps) {
  if (!imagePath) return null;

  const isImage1 = imagePath.endsWith('1.jpg');
  const isImage2 = imagePath.endsWith('2.jpg');

  const position = isImage2 ? 'left' : (isImage1 ? 'right bottom' : 'right');

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Image
        src={imagePath}
        alt=""
        fill
        sizes="100vw"
        quality={75}
        className="opacity-40" 
        style={{
          objectFit: 'contain',
          objectPosition: position,
        }}
      />
    </div>
  );
}
