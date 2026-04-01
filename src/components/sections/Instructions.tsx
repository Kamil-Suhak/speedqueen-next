"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  ChevronRight,
  ChevronLeft,
  CreditCard,
  Ticket,
  Tag,
  Wind,
  Zap,
} from "lucide-react";
import SectionBackground from "@/components/ui/SectionBackground";

interface InstructionConfig {
  title: string;
  service1: {
    title: string;
    steps: string[];
  };
  service2: {
    title: string;
    steps: string[];
  };
  extras: {
    title: string;
    items: { title: string; description: string; icon: string }[];
  };
  navigation: {
    service1: string;
    service2: string;
    extras: string;
  };
}

export default function Instructions({
  content,
  bgImage,
}: {
  content: InstructionConfig;
  bgImage?: string;
}) {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const [slideDir, setSlideDir] = useState<"left" | "right">("right");
  const touchStartX = useRef<number | null>(null);

  const tabs = [
    {
      id: 0 as const,
      title: content.service1.title,
      key: "service1" as const,
      image: "/images/gallery/j.jpg",
    },
    {
      id: 1 as const,
      title: content.service2.title,
      key: "service2" as const,
      image: "/images/gallery/d.jpg",
    },
    {
      id: 2 as const,
      title: content.extras.title,
      key: "extras" as const,
      image: "/images/gallery/m2.jpg",
    },
  ];

  const prevTab = tabs[(activeTab + 2) % 3];
  const nextTab = tabs[(activeTab + 1) % 3];

  const ICONS_MAP: Record<string, React.ElementType> = {
    ticket: Ticket,
    "credit-card": CreditCard,
    tag: Tag,
    iron: Wind,
    zap: Zap,
  };

  const goNext = () => {
    setSlideDir("right");
    setActiveTab(nextTab.id);
  };

  const goPrev = () => {
    setSlideDir("left");
    setActiveTab(prevTab.id);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX.current;

    if (deltaX > 50) {
      goPrev();
    } else if (deltaX < -50) {
      goNext();
    }
    touchStartX.current = null;
  };

  const renderTimelineStep = (step: string, idx: number) => {
    const isStaggered = idx % 2 === 1;

    return (
      <div
        key={idx}
        className="relative flex w-full items-stretch group cursor-default"
      >
        <div className="relative shrink-0 w-32 flex flex-col pb-6">
          <div className="absolute top-0 bottom-0 left-16 -ml-px w-[2px] border-l-2 border-dashed border-slate-200 -z-10" />

          <div className="flex-1 flex flex-col justify-center">
            <div
              className="w-14 h-14 rounded-full bg-brand-primary text-white flex items-center justify-center font-extrabold text-2xl shadow-md z-10 animate-seq-zoom-in transition-all duration-300 pointer-events-none"
              style={{
                animationDelay: `${idx * 80}ms`,
                marginLeft: isStaggered ? "72px" : "0px",
              }}
            >
              {idx + 1}
            </div>
          </div>
        </div>

        <div className="flex-1 pb-6 pr-4 pl-3 md:pl-5">
          <div
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-seq-fade-in-up"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <p className="text-gray-700 leading-relaxed text-left md:text-base text-sm">
              {step}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderExtrasStep = (
    item: { title: string; description: string; icon: string },
    idx: number,
  ) => {
    const isStaggered = idx % 2 === 1;
    const Icon = ICONS_MAP[item.icon] || Tag;

    return (
      <div
        key={idx}
        className="relative flex w-full items-stretch group cursor-default"
      >
        <div className="relative shrink-0 w-32 flex flex-col pb-6">
          <div className="absolute top-0 bottom-0 left-16 -ml-px w-[2px] border-l-2 border-dashed border-slate-200 -z-10" />

          <div className="flex-1 flex flex-col justify-center">
            <div
              className="w-14 h-14 rounded-full bg-brand-primary text-white flex items-center justify-center font-extrabold shadow-md z-10 animate-seq-zoom-in transition-all duration-300 pointer-events-none"
              style={{
                animationDelay: `${idx * 80}ms`,
                marginLeft: isStaggered ? "72px" : "0px",
              }}
            >
              <Icon size={26} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <div className="flex-1 pb-6 pr-4 pl-3 md:pl-5">
          <div
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-seq-fade-in-up"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <h4 className="font-extrabold text-brand-primary uppercase mb-1">
              {item.title}
            </h4>
            <p className="text-gray-700 leading-relaxed text-left md:text-base text-sm">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const swipeClass =
    slideDir === "right"
      ? "animate-seq-fade-in-right"
      : "animate-seq-fade-in-left";

  return (
    <section
      id="instructions"
      className="relative py-24 scroll-mt-20 bg-slate-50 overflow-hidden"
    >
      <SectionBackground imagePath={bgImage} />

      <div className="mx-auto max-w-7xl px-4 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 uppercase tracking-tight">
            {content.title}
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 bg-brand-primary rounded-full" />
        </div>

        <div className="md:grid grid-cols-2 xl:grid-cols-12 md:gap-12 items-stretch relative z-10 mx-auto w-full">
          <div
            className="flex flex-col h-full w-full max-w-lg md:max-w-none mx-auto xl:col-span-7 pb-4 overflow-hidden relative"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Tab Selector Header */}
            <div className="flex items-center justify-between gap-2 md:gap-8 mb-6 md:mb-10 border-b-2 border-brand-primary/10 relative">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 pb-3 md:pb-4 text-center transition-all duration-300 relative group outline-none ${
                      isActive
                        ? "text-brand-primary"
                        : "text-zinc-400 hover:text-brand-primary/60"
                    }`}
                  >
                    <span className="text-[11px] sm:text-sm md:text-xl font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] md:tracking-widest whitespace-nowrap">
                      {tab.title}
                    </span>

                    {/* CSS-only Animated Underline */}
                    <div
                      className={`absolute -bottom-[2px] left-0 right-0 h-[2px] rounded-full transition-all duration-300 transform origin-center ${
                        isActive
                          ? "bg-brand-primary scale-x-100 opacity-100"
                          : "bg-brand-primary scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-30"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div
              className={`relative grid ${swipeClass}`}
              key={`tab-${activeTab}`}
            >
              <div
                className={`col-start-1 row-start-1 relative flex flex-col ${
                  activeTab === 0
                    ? "visible z-10"
                    : "invisible z-0 pointer-events-none"
                }`}
                aria-hidden={activeTab !== 0}
              >
                {content.service1.steps.map((step, idx) =>
                  renderTimelineStep(step, idx),
                )}
              </div>

              <div
                className={`col-start-1 row-start-1 relative flex flex-col ${
                  activeTab === 1
                    ? "visible z-10"
                    : "invisible z-0 pointer-events-none"
                }`}
                aria-hidden={activeTab !== 1}
              >
                {content.service2.steps.map((step, idx) =>
                  renderTimelineStep(step, idx),
                )}
              </div>

              <div
                className={`col-start-1 row-start-1 flex flex-col ${
                  activeTab === 2
                    ? "visible z-10"
                    : "invisible z-0 pointer-events-none"
                }`}
                aria-hidden={activeTab !== 2}
              >
                {content.extras.items.map((item, idx) =>
                  renderExtrasStep(item, idx),
                )}
              </div>
            </div>

            <div className="mt-auto flex justify-between items-center w-full pt-8 border-t border-slate-200/60 transition-opacity duration-300">
              <button
                onClick={goPrev}
                className="flex font-bold text-gray-900 border-slate-200/60 items-center justify-center gap-2 text-[11px] md:text-sm uppercase tracking-widest hover:text-brand-primary transition-colors bg-white border px-4 py-3 md:py-4 rounded-full shadow-sm group w-[48%]"
                aria-label={`Go to ${prevTab.title}`}
              >
                <ChevronLeft
                  size={18}
                  className="group-hover:-translate-x-1 transition-transform text-brand-primary -ml-1"
                />
                <span className="truncate">{prevTab.title}</span>
              </button>
              <button
                onClick={goNext}
                className="flex font-bold text-gray-900 border-slate-200/60 items-center justify-center gap-2 text-[11px] md:text-sm uppercase tracking-widest hover:text-brand-primary transition-colors bg-white border px-4 py-3 md:py-4 rounded-full shadow-sm group w-[48%]"
                aria-label={`Go to ${nextTab.title}`}
              >
                <span className="truncate">{nextTab.title}</span>
                <ChevronRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform text-brand-primary -mr-1"
                />
              </button>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center xl:col-span-5 sticky top-32 mt-8">
            <div className="relative w-full max-w-[440px] aspect-4/5 animate-seq-zoom-in">
              <div className="absolute inset-0 translate-x-4 translate-y-4 border-2 border-brand-primary/30 rounded-2xl -z-10" />

              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg bg-slate-50">
                {tabs.map((tab) => (
                  <Image
                    key={tab.id}
                    src={tab.image}
                    alt={tab.title}
                    fill
                    className={`object-cover transition-opacity duration-700 ease-in-out ${
                      activeTab === tab.id ? "opacity-100" : "opacity-0"
                    }`}
                    sizes="(max-width: 1200px) 50vw, 400px"
                    priority={activeTab === tab.id}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
