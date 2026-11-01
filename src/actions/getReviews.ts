"use server";

import reviewsData from "@/data/reviews.json";

export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url: string;
  time: number;
  branchName?: string;
}

export async function getGoogleReviews(lang: string): Promise<GoogleReview[]> {
  try {
    const reviewsByLang = reviewsData?.reviews as
      | Record<string, GoogleReview[]>
      | undefined;

    if (!reviewsByLang) return [];

    const selectedReviews = reviewsByLang[lang] || reviewsByLang.pl || [];
    return selectedReviews;
  } catch (error) {
    console.error("Error reading reviews snapshot:", error);
    return [];
  }
}
