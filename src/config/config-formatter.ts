import { ElementType } from "react";

export const markerStyles: Record<string, string> = {
  "[[": "text-blue-500",
  "{{": "text-red-500 font-bold",
  "((": "italic text-gray-600",
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
