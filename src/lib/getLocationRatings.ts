"use server";

export interface LocationRating {
  placeId: string;
  rating: number;
  reviewCount: number;
}

const PLACE_IDS: Record<string, string | undefined> = {
  orlinskiego: process.env.NEXT_PUBLIC_GOOGLE_PLACEID_ORLINSKIEGO,
  pawia: process.env.NEXT_PUBLIC_GOOGLE_PLACEID_PAWIA,
  slowackiego: process.env.NEXT_PUBLIC_GOOGLE_PLACEID_SLOWACKIEGO,
};

async function fetchLocationRating(
  key: string,
  placeId: string | undefined,
  apiKey: string,
): Promise<LocationRating | null> {
  if (!placeId) return null;

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total&key=${apiKey}`;

  try {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) return null;

    const data = await response.json();
    const result = data?.result;

    if (!result?.rating) return null;

    return {
      placeId: key,
      rating: Number(result.rating),
      reviewCount: Number(result.user_ratings_total || 0),
    };
  } catch (error) {
    console.error(`Error fetching rating for ${key}:`, error);
    return null;
  }
}

export async function getLocationRatings(): Promise<LocationRating[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return [];

  try {
    const results = await Promise.all(
      Object.entries(PLACE_IDS).map(([key, id]) =>
        fetchLocationRating(key, id, apiKey),
      ),
    );

    return results.filter((r): r is LocationRating => r !== null);
  } catch (error) {
    console.error("Error in getLocationRatings:", error);
    return [];
  }
}

