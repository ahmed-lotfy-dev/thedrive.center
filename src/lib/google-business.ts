export const GOOGLE_BUSINESS_NAME =
  process.env.NEXT_PUBLIC_GOOGLE_BUSINESS_NAME || "مركز لضبط الزوايا والترصيص The Drive";

export const GOOGLE_PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || "";
export const GOOGLE_PLACE_URL = process.env.NEXT_PUBLIC_GOOGLE_PLACE_URL || "";

export const GOOGLE_MAPS_COORDS =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_COORDS || "30.9472165,31.155854";

export const BUSINESS_ADDRESS =
  process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || "منشية البكري ٨ شارع طلعت النجار";

export const BUSINESS_CITY = process.env.NEXT_PUBLIC_BUSINESS_CITY || "المحلة الكبرى";
export const BUSINESS_REGION = process.env.NEXT_PUBLIC_BUSINESS_REGION || "المحلة الكبرى";

export const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/";
export const TIKTOK_URL = process.env.NEXT_PUBLIC_TIKTOK_URL || "https://www.tiktok.com/";
export const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/";

export function getDirectionsUrl() {
  if (GOOGLE_PLACE_ID) {
    return `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(GOOGLE_PLACE_ID)}`;
  }

  if (GOOGLE_PLACE_URL) {
    return GOOGLE_PLACE_URL;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(GOOGLE_BUSINESS_NAME)}`;
}

export function getReviewsUrl() {
  if (GOOGLE_PLACE_ID) {
    return `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(GOOGLE_PLACE_ID)}`;
  }

  if (GOOGLE_PLACE_URL) {
    return GOOGLE_PLACE_URL;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(GOOGLE_BUSINESS_NAME)}`;
}

export function getWriteReviewUrl() {
  if (GOOGLE_PLACE_ID) {
    return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(GOOGLE_PLACE_ID)}`;
  }

  return getReviewsUrl();
}

export function getMapEmbedUrl() {
  const query = `${GOOGLE_MAPS_COORDS} (${GOOGLE_BUSINESS_NAME})`;
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=ar&z=17&ie=UTF8&iwloc=&output=embed`;
}
