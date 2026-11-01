export interface BranchReputation {
  name: string;
  address: string;
  rating: number;
  totalReviews: number;
}

export interface GooglePlacesReportData {
  averageRating: number;
  totalReviews: number;
  branches: BranchReputation[];
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

  const branches: BranchReputation[] = [];
  let featuredReview: GooglePlacesReportData["featuredReview"] | undefined;

  for (const branch of BRANCH_CONFIGS) {
    const placeId = process.env[branch.envKey] || branch.defaultPlaceId;
    if (!placeId) {
      throw new Error(
        `Fatal: Missing Google Place ID for branch ${branch.name} (${branch.envKey}).`,
      );
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${key}&language=pl`;
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
        }>;
      };
    };

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(
        `Fatal: Google Places API returned status "${data.status}" for ${branch.name}: ${data.error_message || "Unknown error"}`,
      );
    }

    const result = data.result || {};
    const rating = Number(result.rating || 0);
    const totalReviews = Number(result.user_ratings_total || 0);

    branches.push({
      name: branch.name,
      address: branch.address,
      rating,
      totalReviews,
    });

    // Check for an actual, authentic 5-star customer review with substantive text
    if (!featuredReview && Array.isArray(result.reviews)) {
      const top5Star = result.reviews.find(
        (r) =>
          r.rating === 5 &&
          r.text &&
          r.text.trim().length > 25 &&
          r.text.trim().length < 280,
      );
      if (top5Star && top5Star.text) {
        featuredReview = {
          author: top5Star.author_name || "Klient Google",
          text: top5Star.text.trim(),
          rating: 5,
          branchName: branch.name,
          relativeTime: top5Star.relative_time_description || "niedawno",
        };
      }
    }
  }

  if (branches.length === 0) {
    throw new Error("Fatal: No branch data could be retrieved from Google Places API.");
  }

  const totalReviews = branches.reduce((sum, b) => sum + b.totalReviews, 0);
  const weightedRatingSum = branches.reduce(
    (sum, b) => sum + b.rating * b.totalReviews,
    0,
  );
  const averageRating =
    totalReviews > 0
      ? Number((weightedRatingSum / totalReviews).toFixed(1))
      : 0;

  return {
    averageRating,
    totalReviews,
    branches,
    featuredReview,
  };
}
