"use server";

import { db } from "@/db";
import { cars, carMedia } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
// import { auth } from "@/lib/auth"; // ensure admin protection

export async function createCarAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const coverImageUrl = formData.get("coverImageUrl") as string;
  const serviceType = formData.get("serviceType") as string;
  const videoUrl = formData.get("videoUrl") as string | null;
  const featured = formData.get("featured") === "on";

  const imagesJsonStr = formData.get("imagesJson") as string;
  const images: string[] = imagesJsonStr ? JSON.parse(imagesJsonStr) : [];

  if (!title || !coverImageUrl || !serviceType) {
    throw new Error("Missing required fields");
  }

  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^\u0621-\u064A\u0660-\u0669a-z0-9]+/g, "-") // Keep Arabic letters, English letters, and numbers
    .replace(/^-+|-+$/g, ""); // Remove trailing/leading hyphens

  const uniqueId = randomBytes(4).toString("hex");
  const slug = `${baseSlug ? baseSlug + "-" : "car-"}${uniqueId}`;

  try {
    const [newCar] = await db
      .insert(cars)
      .values({
        title,
        description,
        coverImageUrl,
        serviceType,
        videoUrl: videoUrl || null,
        slug,
        featured,
      })
      .returning();

    if (images.length > 0) {
      const mediaData = images.map((url, i) => ({
        carId: newCar.id,
        url,
        type: "image",
        order: i,
      }));

      await db.insert(carMedia).values(mediaData);
    }

    revalidatePath("/cars");
    revalidatePath("/admin/cars");
    revalidatePath("/");

    return { success: true, carId: newCar.id };
  } catch (error) {
    console.error("Error creating car:", error);
    throw new Error("Failed to save car to database");
  }
}
