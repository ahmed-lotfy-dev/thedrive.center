import { MAX_UPLOAD_SIZE_BYTES, validateUploadRequest } from "@/lib/upload-policy";

export async function resizeImage(file: File, maxWidth = 1920, maxHeight = 1920, quality = 0.9): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas to Blob conversion failed"));
          }
        },
        "image/webp",
        quality
      );
    };
    img.onerror = (err) => reject(err);
  });
}

export async function uploadToR2(file: File | Blob, originalName: string) {
  const validation = validateUploadRequest({
    filename: originalName,
    contentType: file.type || "image/webp",
    size: file.size,
  });

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 1. Get signed URL from our API
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: originalName,
      contentType: file.type || "image/webp",
      size: file.size,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.error || "Failed to get upload URL");
  }

  const { uploadUrl, publicUrl } = await response.json();

  // 2. Upload directly to R2 using the signed URL
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "image/webp" },
  });

  if (!uploadResponse.ok) {
    throw new Error(`Upload to R2 failed. Max allowed size is ${Math.round(MAX_UPLOAD_SIZE_BYTES / (1024 * 1024))}MB.`);
  }

  return publicUrl;
}

export async function deleteFromR2(url: string) {
  try {
    const filename = url.split("/").pop();

    if (!filename) return;

    const response = await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete from R2");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in deleteFromR2:", error);
  }
}
