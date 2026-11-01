export interface GooglePlacesReportData {
  recentReviewsCount: number;
  totalReviews: number;
  averageRating: number;
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

  // Calculate target month window matching report period
  const now = new Date();
  let targetYear = now.getFullYear();
  let targetMonth = now.getMonth(); // 0-indexed
  if (now.getDate() <= 5) {
    targetMonth -= 1;
    if (targetMonth < 0) {
      targetMonth = 11;
      targetYear -= 1;
    }
  }

  const startOfMonthSec = Math.floor(
    new Date(Date.UTC(targetYear, targetMonth, 1, 0, 0, 0)).getTime() / 1000,
  );
  const endOfMonthSec = Math.floor(
    new Date(Date.UTC(targetYear, targetMonth + 1, 1, 0, 0, 0)).getTime() / 1000,
  );

  let recentReviewsCount = 0;
  let totalReviews = 0;
  let totalRatingWeighted = 0;
  let featuredReview: GooglePlacesReportData["featuredReview"] | undefined;

  for (const branch of BRANCH_CONFIGS) {
    const placeId = process.env[branch.envKey] || branch.defaultPlaceId;
    if (!placeId) {
      throw new Error(
        `Fatal: Missing Google Place ID for branch ${branch.name} (${branch.envKey}).`,
      );
    }

    // Note: Parameter MUST be 'reviews_sort=newest' (plural 'reviews')
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${key}&language=pl&reviews_sort=newest`;
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
        rating?: number;
        user_ratings_total?: number;
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

    const branchReviewsCount = data.result?.user_ratings_total || 0;
    const branchRating = data.result?.rating || 0;
    totalReviews += branchReviewsCount;
    totalRatingWeighted += branchRating * branchReviewsCount;

    const reviews = data.result?.reviews || [];

    // Filter reviews strictly within the target month window
    for (const r of reviews) {
      if (r.time && r.time >= startOfMonthSec && r.time < endOfMonthSec) {
        recentReviewsCount++;

        // Spotlight 5-star review from the target month
        if (
          !featuredReview &&
          r.rating === 5 &&
          r.text &&
          r.text.trim().length > 15 &&
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

  const averageRating =
    totalReviews > 0 ? Number((totalRatingWeighted / totalReviews).toFixed(1)) : 0;

  return {
    recentReviewsCount,
    totalReviews,
    averageRating,
    featuredReview,
  };
}
