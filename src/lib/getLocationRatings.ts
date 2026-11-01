import reviewsData from "@/data/reviews.json";

export interface LocationRating {
  placeId: string;
  rating: number;
  reviewCount: number;
}

export async function getLocationRatings(): Promise<LocationRating[]> {
  try {
    const ratings = reviewsData?.ratings;
    if (!ratings) return [];

    return [
      {
        placeId: "orlinskiego",
        rating: ratings.orlinskiego.rating,
        reviewCount: ratings.orlinskiego.reviewCount,
      },
      {
        placeId: "pawia",
        rating: ratings.pawia.rating,
        reviewCount: ratings.pawia.reviewCount,
      },
      {
        placeId: "slowackiego",
        rating: ratings.slowackiego.rating,
        reviewCount: ratings.slowackiego.reviewCount,
      },
    ];
  } catch (error) {
    console.error("Error reading location ratings snapshot:", error);
    return [];
  }
}
