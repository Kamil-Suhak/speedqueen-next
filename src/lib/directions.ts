import { Locations } from "@/config/site-config";

const DEFAULT_LOCATION = Locations[1];

/**
 * Finds the nearest location based on user coordinates and opens
 * Google Maps directions in a new tab. Falls back to the default
 * location if geolocation is unavailable or denied.
 *
 * Pre-opens the window synchronously on user click to prevent
 * iOS Safari and Chromium mobile popup blockers from dropping
 * the navigation after async geolocation.
 */
export function openDirections(e: React.MouseEvent) {
  e.preventDefault();

  if (!("geolocation" in navigator)) {
    window.open(DEFAULT_LOCATION.url, "_blank", "noopener,noreferrer");
    return;
  }

  // Pre-open window synchronously to preserve user-gesture permission across mobile browsers
  const newWindow = window.open("about:blank", "_blank");

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

      if (newWindow) {
        newWindow.location.href = closest.url;
      } else {
        window.location.href = closest.url;
      }
    },
    () => {
      if (newWindow) {
        newWindow.location.href = DEFAULT_LOCATION.url;
      } else {
        window.location.href = DEFAULT_LOCATION.url;
      }
    },
    { timeout: 5000, maximumAge: 60000 }
  );
}
