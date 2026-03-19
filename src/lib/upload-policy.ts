export const MAX_UPLOAD_SIZE_BYTES = 15 * 1024 * 1024;

export const ALLOWED_UPLOAD_TYPES = {
  "image/webp": [".webp"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
} as const;

function normalizeExtension(filename: string) {
  const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
  return ext.startsWith(".") ? ext : "";
}

export function isAllowedUploadType(contentType: string, filename: string) {
  const normalizedType = contentType.trim().toLowerCase();
  const allowedExtensions =
    ALLOWED_UPLOAD_TYPES[normalizedType as keyof typeof ALLOWED_UPLOAD_TYPES];

  if (!allowedExtensions) return false;

  const extension = normalizeExtension(filename);
  return allowedExtensions.includes(extension as never);
}

export function validateUploadRequest(input: {
  filename: string;
  contentType: string;
  size: number;
}) {
  if (!input.filename || !input.contentType) {
    return { valid: false, error: "Filename and contentType are required" };
  }

  if (!Number.isFinite(input.size) || input.size <= 0) {
    return { valid: false, error: "File size is required" };
  }

  if (input.size > MAX_UPLOAD_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the ${Math.round(MAX_UPLOAD_SIZE_BYTES / (1024 * 1024))}MB limit`,
    };
  }

  if (!isAllowedUploadType(input.contentType, input.filename)) {
    return { valid: false, error: "Unsupported file type" };
  }

  return { valid: true as const };
}
