import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes an Arabic license plate string for consistent storage and comparison.
 * - Removes spaces and hyphens
 * - Normalizes Alef variations (أ، إ، آ) to (ا)
 * - Normalizes Teh Marbuta (ة) to Heh (ه)
 * - Normalizes Alef Maksura (ى) to Yeh (ي)
 * - Converts English letters to uppercase
 */
export function normalizePlateNumber(plate: string | null | undefined): string {
  if (!plate) return "";

  return plate
    .replace(/[-\sـ_]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ي/g, "ى")
    .toUpperCase();
}

/**
 * Formats an Arabic license plate string (e.g., "عمب1396" -> "ع م ب-1396")
 */
export function formatLicensePlate(plate: string | null | undefined) {
  if (!plate) return "";
  
  // 1. Normalize: Remove existing spaces and normalize characters
  const normalized = normalizePlateNumber(plate);
  
  // 2. Separate Arabic characters and numbers
  // Arabic characters range: \u0600-\u06FF
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
