"use client";

import { MapPin, Clock, CheckCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AnnouncementBarProps {
  locations: { address: string; hours: string }[];
}

export default function AnnouncementBar({ locations }: AnnouncementBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(40); // Default fallback

  // --- ADJUST SPEED HERE ---
  // Lower = slower, Higher = faster (pixels per second)
  const pixelsPerSecond = 40; 

  useEffect(() => {
    if (containerRef.current) {
      // The marquee distance is exactly half of the total content width 
      // because we translate from 0 to -50%.
      const totalWidth = containerRef.current.scrollWidth;
      const distance = totalWidth / 2;
      const calculatedDuration = distance / pixelsPerSecond;
      setDuration(calculatedDuration);
    }
  }, [locations, pixelsPerSecond]);

  const renderItem = (loc: { address: string; hours: string }, idx: number, isCopy = false) => {
    const is247 = loc.hours.includes("24/7");
    const Icon = is247 ? CheckCircle : Clock;
    
    return (
      <div key={`${isCopy ? 'copy-' : ''}${idx}`} className="flex items-center gap-6 pr-8">
        <div className="flex items-center gap-2 text-white">
          <MapPin size={14} className="shrink-0" />
          <span className="whitespace-nowrap font-bold">{loc.address}</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/90 font-medium">
          <Icon size={14} className="shrink-0" />
          <span className="whitespace-nowrap text-xs">({loc.hours})</span>
        </div>
        <div className="h-4 w-0.5 bg-white ml-2 opacity-50" aria-hidden="true" />
      </div>
    );
  };

  return (
    <div className="absolute top-0 left-0 w-full h-[20px] z-60 bg-brand-red text-white flex items-center overflow-hidden hover:brightness-110 transition-all duration-300 cursor-default">
      <div 
        ref={containerRef}
        className="flex animate-marquee whitespace-nowrap py-1 items-center hover:[animation-play-state:paused]"
        style={{ animationDuration: `${duration}s` }}
      >
        {/* We use two copies for a perfect continuous loop with transform: -50% */}
        <div className="flex items-center">
          {locations.map((loc, idx) => renderItem(loc, idx))}
        </div>
        <div className="flex items-center">
          {locations.map((loc, idx) => renderItem(loc, idx, true))}
        </div>
      </div>
    </div>
  );
}
