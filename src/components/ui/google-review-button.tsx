"use client";

import React from "react";
import { Star } from "lucide-react";

export function GoogleReviewButton() {
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;

  if (!placeId) {
    return null;
  }

  const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;

  return (
    <a 
      href={reviewUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <Star className="w-5 h-5 fill-yellow-400 stroke-yellow-400" />
      <span>Review us on Google</span>
    </a>
  );
}
