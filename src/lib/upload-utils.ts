export async function resizeImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<Blob> {
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
  // 1. Get signed URL from our API
  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: originalName,
      contentType: file.type || "image/webp",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get upload URL");
  }

  const { uploadUrl, publicUrl } = await response.json();

  // 2. Upload directly to R2 using the signed URL
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "image/webp" },
  });

  if (!uploadResponse.ok) {
    throw new Error("Upload to R2 failed");
  }

  return publicUrl;
}
