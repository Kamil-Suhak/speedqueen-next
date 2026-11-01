"use client";

import React, { useState, useEffect, useRef } from "react";
import BaseModal from "./BaseModal";
import {
  Sparkles,
  ThermometerSun,
  Info,
  Check,
  Package,
} from "lucide-react";

export interface ProgramItem {
  id: string;
  name: string;
  temp: string;
  spin: string;
  duration: string;
  description: string;
  dosing: string;
  isAutoDosing: boolean;
}

export interface DryingItem {
  id: string;
  name: string;
  nameSemantic?: string;
  temp: string;
  duration: string;
  badge: string;
  description: string;
}

export interface ProgramsContent {
  triggerWashing: {
    button: string;
    badge: string;
    subtitle: string;
  };
  triggerDrying: {
    button: string;
    badge: string;
    subtitle: string;
  };
  modal: {
    title: string;
    subtitle: string;
    tabWashing: string;
    tabDrying: string;
    close: string;
  };
  washing: {
    title: string;
    disclaimerDetergent: {
      title: string;
      text: string;
    };
    disclaimerRules: {
      title: string;
      text: string;
    };
    headers: {
      program: string;
      temp: string;
      spin: string;
      time: string;
      detergent: string;
    };
    items: ProgramItem[];
  };
  drying: {
    title: string;
    disclaimerSpin: {
      title: string;
      text: string;
    };
    disclaimerCapacity: {
      title: string;
      text: string;
    };
    headers: {
      program: string;
      temp: string;
      time: string;
      fabrics: string;
    };
    items: DryingItem[];
  };
}

interface ProgramsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "washing" | "drying";
  content?: ProgramsContent;
}

export default function ProgramsModal({
  isOpen,
  onClose,
  initialTab = "washing",
  content,
}: ProgramsModalProps) {
  const [userTab, setUserTab] = useState<"washing" | "drying" | null>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (!isOpen) {
      setUserTab(null);
    }
  }

  const activeTab = userTab ?? initialTab;
  const setActiveTab = (tab: "washing" | "drying") => setUserTab(tab);

  useEffect(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab]);

  if (!content) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      closeLabel={content.modal.close}
      maxWidth="max-w-3xl"
    >
      <div className="flex flex-col max-h-[85vh] bg-white">
        {/* Header */}
        <div className="shrink-0 p-5 md:p-6 pb-4 border-b border-slate-100 bg-slate-50/70">
          <div className="pr-8">
            <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase">
              {content.modal.title}
            </h3>
            <p className="mt-1 text-xs md:text-sm text-gray-500 font-normal">
              {content.modal.subtitle}
            </p>
          </div>

          {/* Tab Selector Inside Modal */}
          <div className="mt-4 flex rounded-xl bg-slate-200/70 p-1 gap-1">
            <button
              onClick={() => setActiveTab("washing")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 ${
                activeTab === "washing"
                  ? "bg-white text-brand-primary shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Sparkles size={16} />
              <span>{content.modal.tabWashing}</span>
              <span className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-brand-primary/10 text-brand-primary">
                {content.washing.items.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("drying")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 ${
                activeTab === "drying"
                  ? "bg-white text-brand-primary shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ThermometerSun size={16} />
              <span>{content.modal.tabDrying}</span>
              <span className="hidden sm:inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-brand-primary/10 text-brand-primary">
                {content.drying.items.length}
              </span>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 text-left"
        >
          {activeTab === "washing" ? (
            <>
              {/* Washing Disclaimers */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-zinc-600 flex items-start gap-2.5">
                <Info size={16} className="text-zinc-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-zinc-800">{content.washing.disclaimerDetergent.title}:</strong>{" "}
                  {content.washing.disclaimerDetergent.text}
                  <span className="mx-1.5 text-zinc-300">•</span>
                  <strong className="text-zinc-800">{content.washing.disclaimerRules.title}:</strong>{" "}
                  {content.washing.disclaimerRules.text}
                </p>
              </div>

              {/* Washing Programs List */}
              <div className="space-y-3">
                {content.washing.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-brand-primary/30 hover:shadow-xs transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-brand-primary text-white font-extrabold text-sm shadow-xs shrink-0">
                          {item.id}
                        </span>
                        <h4 className="text-sm md:text-base font-bold text-gray-900">
                          {item.name}
                        </h4>
                      </div>

                      {/* Spec row */}
                      <div className="flex items-center gap-2 text-xs text-zinc-600 pl-10 sm:pl-0 font-medium">
                        <span className="font-bold text-zinc-900 flex items-center gap-1">
                          <ThermometerSun size={13} className="text-brand-primary" />
                          {item.temp}
                        </span>
                        <span className="text-zinc-300">•</span>
                        <span>{item.spin}</span>
                        <span className="text-zinc-300">•</span>
                        <span>{item.duration}</span>
                      </div>
                    </div>

                    <p className="text-xs md:text-sm text-gray-600 pl-10 sm:pl-10 leading-relaxed mb-2">
                      {item.description}
                    </p>

                    <div className="pl-10 sm:pl-10">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                          item.isAutoDosing
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-amber-50 text-amber-700 border border-amber-200/60"
                        }`}
                      >
                        {item.isAutoDosing ? (
                          <Check size={12} className="text-emerald-600 stroke-[3]" />
                        ) : (
                          <Package size={12} className="text-amber-600" />
                        )}
                        {item.dosing}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Drying Disclaimers */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-zinc-600 flex items-start gap-2.5">
                <Info size={16} className="text-zinc-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-zinc-800">{content.drying.disclaimerSpin.title}:</strong>{" "}
                  {content.drying.disclaimerSpin.text}
                  <span className="mx-1.5 text-zinc-300">•</span>
                  <strong className="text-zinc-800">{content.drying.disclaimerCapacity.title}:</strong>{" "}
                  {content.drying.disclaimerCapacity.text}
                </p>
              </div>

              {/* Drying Semantic Programs List */}
              <div className="space-y-3">
                {content.drying.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-brand-primary/30 hover:shadow-xs transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 font-extrabold text-sm shrink-0">
                          <ThermometerSun size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
                            <span>{item.name}</span>
                            {item.nameSemantic && item.nameSemantic !== item.name && (
                              <span className="text-xs font-semibold text-gray-400">
                                ({item.nameSemantic})
                              </span>
                            )}
                          </h4>
                        </div>
                      </div>

                      {/* Spec row */}
                      <div className="flex items-center gap-2 text-xs text-zinc-600 pl-10 sm:pl-0 font-medium">
                        <span className="font-bold text-zinc-900 flex items-center gap-1">
                          <ThermometerSun size={13} className="text-orange-500" />
                          {item.temp}
                        </span>
                        <span className="text-zinc-300">•</span>
                        <span>{item.duration}</span>
                        <span className="text-zinc-300">•</span>
                        <span className="font-semibold text-brand-primary">{item.badge}</span>
                      </div>
                    </div>

                    <p className="text-xs md:text-sm text-gray-600 pl-10 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-primary transition-colors shadow-xs"
          >
            {content.modal.close}
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
