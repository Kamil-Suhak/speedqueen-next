import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import fs from "node:fs";
import path from "node:path";

interface RawGoogleReview {
  author_name?: string;
  rating?: number;
  text?: string;
  relative_time_description?: string;
  profile_photo_url?: string;
  time?: number;
}

interface RawPlaceDetailsResponse {
  status?: string;
  error_message?: string;
  result?: {
    name?: string;
    rating?: number;
    user_ratings_total?: number;
    reviews?: RawGoogleReview[];
  };
}

export interface GoogleReviewItem {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url: string;
  time: number;
  branchName: string;
}

export interface BranchRating {
  rating: number;
  reviewCount: number;
}

export interface ReviewsSnapshot {
  updatedAt: string;
  ratings: {
    orlinskiego: BranchRating;
    pawia: BranchRating;
    slowackiego: BranchRating;
    overall: {
      rating: number;
      totalReviews: number;
    };
  };
  reviews: {
    pl: GoogleReviewItem[];
    en: GoogleReviewItem[];
  };
}

const BRANCHES = [
  {
    key: "pawia" as const,
    name: "Kraków — ul. Pawia 34",
    envKey: "NEXT_PUBLIC_GOOGLE_PLACEID_PAWIA",
    defaultPlaceId: "ChIJ5zIcehhbFkcRg5JAJS7ICZo",
  },
  {
    key: "slowackiego" as const,
    name: "Kraków — al. J. Słowackiego 56",
    envKey: "NEXT_PUBLIC_GOOGLE_PLACEID_SLOWACKIEGO",
    defaultPlaceId: "ChIJLzFV3tFbFkcRri72hyj1PCI",
  },
  {
    key: "orlinskiego" as const,
    name: "Kraków — ul. Orlińskiego 1",
    envKey: "NEXT_PUBLIC_GOOGLE_PLACEID_ORLINSKIEGO",
    defaultPlaceId: "ChIJXw81dFBbFkcR37QA2sxXPU0",
  },
];

const LOCALES = ["pl", "en"] as const;

function sanitizeAvatar(url?: string): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "https:" && parsed.hostname.includes("google")) {
      return url;
    }
  } catch {
    // invalid URL format
  }
  return "";
}

async function fetchPlaceDetails(
  placeId: string,
  apiKey: string,
  lang: string,
): Promise<RawPlaceDetailsResponse> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}&language=${lang}&reviews_sort=newest`;
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText} for placeId: ${placeId}`,
    );
  }

  const data = (await response.json()) as RawPlaceDetailsResponse;
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(
      `Google Places API returned status "${data.status}": ${data.error_message || "Unknown error"}`,
    );
  }

  return data;
}

export async function syncGoogleReviews(): Promise<void> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    console.error("FATAL: Missing GOOGLE_PLACES_API_KEY environment variable.");
    process.exitCode = 1;
    return;
  }

  console.log("Starting Google Reviews & Ratings sync...");

  const ratingsAcc: Record<string, BranchRating> = {};
  const reviewsByLang: Record<(typeof LOCALES)[number], GoogleReviewItem[]> = {
    pl: [],
    en: [],
  };

  try {
    // 1. Fetch ratings & reviews for all branches and languages
    for (const branch of BRANCHES) {
      const placeId = process.env[branch.envKey] || branch.defaultPlaceId;
      if (!placeId) {
        throw new Error(`Missing place ID for branch ${branch.key}`);
      }

      for (const lang of LOCALES) {
        console.log(`Fetching ${branch.name} [locale: ${lang}]...`);
        const data = await fetchPlaceDetails(placeId, apiKey, lang);
        const result = data.result;

        // Store branch ratings (independent of language, can take from first locale)
        if (lang === "pl" && result) {
          ratingsAcc[branch.key] = {
            rating: Number(result.rating || 0),
            reviewCount: Number(result.user_ratings_total || 0),
          };
        }

        const rawReviews = result?.reviews || [];
        for (const r of rawReviews) {
          const rating = Number(r.rating || 0);
          const text = (r.text || "").trim();

          // Quality filter: 4-star and 5-star with substantive text (> 15 chars)
          if (rating >= 4 && text.length > 15) {
            reviewsByLang[lang].push({
              author_name: r.author_name || "Google User",
              rating,
              text,
              relative_time_description: r.relative_time_description || "",
              profile_photo_url: sanitizeAvatar(r.profile_photo_url),
              time: Number(r.time || Math.floor(Date.now() / 1000)),
              branchName: branch.name,
            });
          }
        }
      }
    }

    // 2. Calculate overall aggregate ratings
    let totalReviews = 0;
    let totalWeightedRating = 0;

    for (const b of BRANCHES) {
      const bRating = ratingsAcc[b.key] || { rating: 0, reviewCount: 0 };
      totalReviews += bRating.reviewCount;
      totalWeightedRating += bRating.rating * bRating.reviewCount;
    }

    const overallRating =
      totalReviews > 0
        ? Number((totalWeightedRating / totalReviews).toFixed(1))
        : 0;

    // 3. Deduplicate reviews per locale
    for (const lang of LOCALES) {
      const seen = new Set<string>();
      const deduped: GoogleReviewItem[] = [];

      for (const item of reviewsByLang[lang]) {
        const key = `${item.author_name}-${item.time}`;
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push(item);
        }
      }

      reviewsByLang[lang] = deduped;
    }

    // 4. Construct snapshot structure
    const snapshot: ReviewsSnapshot = {
      updatedAt: new Date().toISOString(),
      ratings: {
        orlinskiego: ratingsAcc.orlinskiego || { rating: 0, reviewCount: 0 },
        pawia: ratingsAcc.pawia || { rating: 0, reviewCount: 0 },
        slowackiego: ratingsAcc.slowackiego || { rating: 0, reviewCount: 0 },
        overall: {
          rating: overallRating,
          totalReviews,
        },
      },
      reviews: {
        pl: reviewsByLang.pl,
        en: reviewsByLang.en,
      },
    };

    // 5. Write to src/data/reviews.json
    const outputDir = path.resolve(process.cwd(), "src", "data");
    const outputPath = path.join(outputDir, "reviews.json");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(snapshot, null, 2), "utf8");

    console.log(`\nSuccessfully synchronized Google Reviews to ${outputPath}:`);
    console.log(`- Total Reviews across branches: ${totalReviews}`);
    console.log(`- Overall Rating: ${overallRating}`);
    console.log(`- Polish reviews saved: ${snapshot.reviews.pl.length}`);
    console.log(`- English reviews saved: ${snapshot.reviews.en.length}`);
  } catch (error) {
    console.error("FATAL: Failed to sync reviews:", error);
    process.exitCode = 1;
  }
}

// Direct execution guard
syncGoogleReviews();
