"use server";

import { db } from "@/db";
import { cars, carMedia } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { AuthorizationError, requireAdmin } from "@/lib/server-auth";
import { isKnownServiceType, isKnownCarMediaType } from "@/lib/constants";

const carSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "العنوان مطلوب"),
  description: z.string().min(10, "الوصف مطلوب"),
  coverImageUrl: z.string().url("رابط الصورة الغلاف غير صحيح"),
  videoUrl: z.string().optional(),
  serviceType: z.string().min(2, "نوع الخدمة مطلوب").refine(isKnownServiceType, "نوع الخدمة غير مدعوم"),
  galleryUrls: z.string().optional(), // Comma separated URLs
});

export async function createPortfolioEntry(formData: FormData) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { error: "Unauthorized" };
    }
    throw error;
  }

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

  const { galleryUrls, title, description, coverImageUrl, videoUrl, serviceType } = result.data;

  // Generate a URL-friendly slug: spaces and non-word characters to hyphens
  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^\u0621-\u064A\u0660-\u0669a-z0-9]+/g, "-") // Keep Arabic letters, English letters, and numbers
    .replace(/^-+|-+$/g, ""); // Remove trailing/leading hyphens
  
  const uniqueId = randomBytes(3).toString("hex");
  const slug = `${baseSlug ? baseSlug + "-" : "car-"}${uniqueId}`;

  await db.transaction(async (tx) => {
    const [newCar] = await tx.insert(cars).values({
      title,
      description,
      coverImageUrl,
      videoUrl,
      serviceType,
      slug,
      featured: true,
    }).returning();

    if (galleryUrls) {
      const urls = galleryUrls.split(",").map(u => u.trim()).filter(Boolean);
      if (urls.length > 0) {
        const mediaData = urls.map((url, index) => ({
          carId: newCar.id,
          url,
          type: isKnownCarMediaType("image") ? "image" : (() => { throw new Error("Invalid media type"); })(),
          order: index,
        }));
        await tx.insert(carMedia).values(mediaData);
      }
    }
  });

  revalidatePath("/cars");
  revalidatePath("/admin/portfolio");
  revalidatePath("/sitemap.xml");
  
  redirect("/admin/portfolio");
}

export async function deletePortfolioEntry(id: string) {
  try {
    await requireAdmin();
    await db.delete(cars).where(eq(cars.id, id));
    revalidatePath("/cars");
    revalidatePath("/admin/portfolio");
    return { success: true };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { error: "Unauthorized" };
    }
    console.error("Failed to delete portfolio entry:", error);
    return { error: "فشل في حذف العمل" };
  }
}

export async function updatePortfolioEntry(id: string, formData: FormData) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { error: "Unauthorized" };
    }
    throw error;
  }

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

  const { galleryUrls, title, description, coverImageUrl, videoUrl, serviceType } = result.data;

  await db.transaction(async (tx) => {
    await tx.update(cars)
      .set({
        title,
        description,
        coverImageUrl,
        videoUrl,
        serviceType,
        updatedAt: new Date(),
      })
      .where(eq(cars.id, id));

    await tx.delete(carMedia).where(eq(carMedia.carId, id));

    if (galleryUrls) {
      const urls = galleryUrls.split(",").map(u => u.trim()).filter(Boolean);
      if (urls.length > 0) {
        const mediaData = urls.map((url, index) => ({
          carId: id,
          url,
          type: isKnownCarMediaType("image") ? "image" : (() => { throw new Error("Invalid media type"); })(),
          order: index,
        }));
        await tx.insert(carMedia).values(mediaData);
      }
    }
  });

  revalidatePath("/cars");
  revalidatePath(`/cars/${id}`); // Potentially need to find the slug, but revalidatePath is fine with IDs or we can just revalidate all
  revalidatePath("/admin/portfolio");
  
  redirect("/admin/portfolio");
}
