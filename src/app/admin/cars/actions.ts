"use server";

import { db } from "@/db";
import { cars, carMedia } from "@/db/schema";
import { revalidatePath } from "next/cache";
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

  try {
    const [newCar] = await db
      .insert(cars)
      .values({
        title,
        description,
        coverImageUrl,
        serviceType,
        videoUrl: videoUrl || null,
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
