import { ElementType } from "react";

export const markerStyles: Record<string, string> = {
  "[[": "text-brand-primary",
  "{{": "text-brand-primary font-bold",
  "((": "text-brand-primary hover:underline transition-all cursor-pointer",
  "!!": "font-black uppercase",
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

