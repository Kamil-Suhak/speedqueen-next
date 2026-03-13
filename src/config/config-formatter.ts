import { ElementType } from "react";

export const markerStyles: Record<string, string> = {
  "[[": "text-brand-red",
  "{{": "text-brand-red font-bold",
  "((": "text-brand-red hover:underline transition-all cursor-pointer",
  "!!": "font-black uppercase tracking-tighter",
};

export const markers: Record<string, string> = {
  "[[": "]]",
  "{{": "}}",
  "((": "))",
  "!!": "!!",
};

export const markersContent: Record<string, { tag: ElementType }> = {
  "&": { tag: "br" },
};
