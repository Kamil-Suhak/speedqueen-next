export interface GooglePlacesReportData {
  recentReviewsCount: number;
  featuredReview?: {
    author: string;
    text: string;
    rating: number;
    branchName: string;
    relativeTime: string;
  };
}

const BRANCH_CONFIGS = [
  {
    name: "Kraków — ul. Pawia 34",
    address: "ul. Pawia 34 (Centrum / Dworzec Główny)",
    envKey: "NEXT_PUBLIC_GOOGLE_PLACEID_PAWIA",
    defaultPlaceId: "ChIJ5zIcehhbFkcRg5JAJS7ICZo",
  },
  {
    name: "Kraków — al. J. Słowackiego 56",
    address: "al. J. Słowackiego 56 (Krowodrza)",
    envKey: "NEXT_PUBLIC_GOOGLE_PLACEID_SLOWACKIEGO",
    defaultPlaceId: "ChIJLzFV3tFbFkcRri72hyj1PCI",
  },
  {
    name: "Kraków — ul. Orlińskiego 1",
    address: "ul. Orlińskiego 1/U17 (Czyżyny)",
    envKey: "NEXT_PUBLIC_GOOGLE_PLACEID_ORLINSKIEGO",
    defaultPlaceId: "ChIJXw81dFBbFkcR37QA2sxXPU0",
  },
];

export async function fetchGooglePlacesReputation(
  apiKey?: string,
): Promise<GooglePlacesReportData> {
  const key = apiKey || process.env.GOOGLE_PLACES_API_KEY;

  if (!key) {
    throw new Error(
      "Fatal: Missing GOOGLE_PLACES_API_KEY environment variable. Live Google Places data is strictly required.",
    );
  }

  let recentReviewsCount = 0;
  let featuredReview: GooglePlacesReportData["featuredReview"] | undefined;

  const thirtyDaysAgoSec = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

  for (const branch of BRANCH_CONFIGS) {
    const placeId = process.env[branch.envKey] || branch.defaultPlaceId;
    if (!placeId) {
      throw new Error(
        `Fatal: Missing Google Place ID for branch ${branch.name} (${branch.envKey}).`,
      );
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,reviews&key=${key}&language=pl&review_sort=newest`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });

    if (!response.ok) {
      throw new Error(
        `Fatal: Google Places API request failed for ${branch.name} with HTTP ${response.status}: ${response.statusText}`,
      );
    }

    const data = (await response.json()) as {
      status?: string;
      error_message?: string;
      result?: {
        reviews?: Array<{
          author_name?: string;
          text?: string;
          rating?: number;
          relative_time_description?: string;
          time?: number;
        }>;
      };
    };

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(
        `Fatal: Google Places API returned status "${data.status}" for ${branch.name}: ${data.error_message || "Unknown error"}`,
      );
    }

    const reviews = data.result?.reviews || [];

    // Filter reviews strictly within the last 30 days
    for (const r of reviews) {
      if (r.time && r.time >= thirtyDaysAgoSec) {
        recentReviewsCount++;

        // Spotlight 5-star review strictly from the last 30 days
        if (
          !featuredReview &&
          r.rating === 5 &&
          r.text &&
          r.text.trim().length > 20 &&
          r.text.trim().length < 280
        ) {
          featuredReview = {
            author: r.author_name || "Klient Google",
            text: r.text.trim(),
            rating: 5,
            branchName: branch.name,
            relativeTime: r.relative_time_description || "w ubiegłym miesiącu",
          };
        }
      }
    }
  }

  return {
    recentReviewsCount,
    featuredReview,
  };
}
