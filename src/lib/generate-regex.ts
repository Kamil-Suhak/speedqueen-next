import { markers, markersContent } from "@/config/config-formatter";

// escape special regex chars
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const pairPatterns = Object.entries(markers).map(
  ([start, end]) => `${escapeRegex(start)}.*?${escapeRegex(end)}`
);

const singlePatterns = Object.keys(markersContent).map((char) =>
  escapeRegex(char)
);

const pattern = [...pairPatterns, ...singlePatterns].join("|");

export const markerRegex = new RegExp(`(${pattern})`, "g");
