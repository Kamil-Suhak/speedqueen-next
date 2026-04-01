import { Locations } from "@/config/site-config";

const DEFAULT_LOCATION = Locations[1];

/**
 * Finds the nearest location based on user coordinates and opens
 * Google Maps directions in a new tab. Falls back to the default
 * location if geolocation is unavailable or denied.
 */
export function openDirections(e: React.MouseEvent) {
  e.preventDefault();

  if (!("geolocation" in navigator)) {
    window.open(DEFAULT_LOCATION.url, "_blank");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      let closest = Locations[0];
      let minDistance = Infinity;

      for (const loc of Locations) {
        const dist = Math.hypot(loc.lat - latitude, loc.lng - longitude);
        if (dist < minDistance) {
          minDistance = dist;
          closest = loc;
        }
      }

      window.open(closest.url, "_blank");
    },
    () => {
      window.open(DEFAULT_LOCATION.url, "_blank");
    }
  );
}

