import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats an Arabic license plate string (e.g., "عمب1396" -> "ع م ب-1396")
 */
export function formatLicensePlate(plate: string | null | undefined) {
  if (!plate) return "";
  
  // 1. Normalize: Remove existing spaces and normalize
  const normalized = plate.replace(/\s+/g, "").toUpperCase();
  
  // 2. Separate Arabic characters and numbers
  // Arabic characters range: \u0600-\u06FF (we also include basic Arabic letters used in plates)
  const letters = normalized.match(/[\u0600-\u06FF]+/g)?.join("") || "";
  const numbers = normalized.match(/\d+/g)?.join("") || "";
  
  if (!letters && !numbers) return normalized;
  
  // 3. Format letters with spaces
  const formattedLetters = letters.split("").join(" ");
  
  // 4. Combine with a hyphen if both exist
  if (formattedLetters && numbers) {
    return `${formattedLetters}-${numbers}`;
  }
  
  return formattedLetters || numbers;
}
