"use server";

import { db } from "@/db";
import { cars, carMedia } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

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

  const { galleryUrls, ...carData } = result.data;

  // 1. Create the main car entry
  const [newCar] = await db.insert(cars).values({
    ...carData,
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
