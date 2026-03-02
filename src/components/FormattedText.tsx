import { Fragment } from "react";
import {
  markerStyles,
  markers,
  markersContent,
} from "@/config/config-formatter";
import { markerRegex } from "@/lib/generate-regex";

export const FormattedText = ({ text }: { text: string }) => {
  // Split the text based on the generated regex
  const parts = text.split(markerRegex);

  return (
    <>
      {parts.map((part, index) => {
        // 1. ELIMINATE EMPTY SPANS
        // Split often leaves empty strings at boundaries; ignore them.
        if (!part) return null;

        // 2. CHECK FOR SPECIAL TAGS (like "&" -> <br>)
        if (markersContent[part]) {
          const CustomTag = markersContent[part].tag;
          return <CustomTag key={index} />;
        }

        // 3. CHECK FOR STYLED MARKERS (e.g. [[text]])
        const openingMarker = Object.keys(markerStyles).find((m) =>
          part.startsWith(m),
        );

        if (openingMarker) {
          const closingMarker = markers[openingMarker];

          // Ensure it is a complete pair
          if (part.endsWith(closingMarker)) {
            const content = part.slice(
              openingMarker.length,
              -closingMarker.length,
            );

            return (
              <span key={index} className={markerStyles[openingMarker]}>
                {content}
              </span>
            );
          }
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
};
