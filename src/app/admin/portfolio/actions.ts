"use server";

import { db } from "@/db";
import { cars, carMedia } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import crypto from "crypto";

const carSchema = z.object({
  title: z.string().min(3, "العنوان مطلوب"),
  description: z.string().min(10, "الوصف مطلوب"),
  coverImageUrl: z.string().url("رابط الصورة الغلاف غير صحيح"),
  videoUrl: z.string().optional(),
  serviceType: z.string().min(2, "نوع الخدمة مطلوب"),
  galleryUrls: z.string().optional(), // Comma separated URLs
});

export async function createPortfolioEntry(formData: FormData) {
  const result = carSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    coverImageUrl: formData.get("coverImageUrl"),
    videoUrl: formData.get("videoUrl"),
    serviceType: formData.get("serviceType"),
    galleryUrls: formData.get("galleryUrls"),
  });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { galleryUrls, title, ...carData } = result.data;

  // Generate a URL-friendly slug: spaces and non-word characters to hyphens
  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^\u0621-\u064A\u0660-\u0669a-z0-9]+/g, "-") // Keep Arabic letters, English letters, and numbers
    .replace(/^-+|-+$/g, ""); // Remove trailing/leading hyphens
  
  const uniqueId = crypto.randomBytes(3).toString("hex");
  const slug = `${baseSlug ? baseSlug + "-" : "car-"}${uniqueId}`;

  // 1. Create the main car entry
  const [newCar] = await db.insert(cars).values({
    ...carData,
    title,
    slug,
    featured: true,
  }).returning();

  // 2. Add gallery images if any
  if (galleryUrls) {
    const urls = galleryUrls.split(",").map(u => u.trim()).filter(Boolean);
    if (urls.length > 0) {
      const mediaData = urls.map((url, index) => ({
        carId: newCar.id,
        url,
        type: "image",
        order: index,
      }));
      await db.insert(carMedia).values(mediaData);
    }
  }

  revalidatePath("/cars");
  revalidatePath("/admin/portfolio");
  revalidatePath("/sitemap.xml");
  
  redirect("/admin/portfolio");
}
