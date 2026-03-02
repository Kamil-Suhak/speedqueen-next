"use server";

export interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url: string;
  time: number;
}

export async function getGoogleReviews(lang: string): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

  if (!apiKey) {
    console.error("Missing GOOGLE_PLACES_API_KEY");
    return [];
  }

  if (!placeId) {
    console.error("Missing GOOGLE_PLACE_ID");
    return [];
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=${lang}&review_sort=newest`;
  try {
    const response = await fetch(url, { next: { revalidate: 86400 } }); // Cache for 24 hours

    if (!response.ok) {
      console.error(`Google Places API returned ${response.status}`);
      return [];
    }

    const data = await response.json();

    const reviews = Array.isArray(data?.result?.reviews)
      ? data.result.reviews
      : [];

    // Normalize shape and only return fields we use
    return reviews.map((r: any) => ({
      author_name: String(r.author_name || "Anonymous"),
      rating: Number(r.rating || 0),
      text: String(r.text || ""),
      relative_time_description: String(r.relative_time_description || ""),
      profile_photo_url: r.profile_photo_url || "",
      time: r.time || undefined,
    }));
  } catch (error) {
    console.error("Error fetching Google Reviews:", error);
    return [];
  }
}
