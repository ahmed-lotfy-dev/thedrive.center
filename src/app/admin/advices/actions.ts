"use server";

import { adviceQueries } from "@/db/queries/advices";
import { revalidatePath } from "next/cache";

export async function createAdvice(content: string) {
  try {
    await adviceQueries.create({ content });
    revalidatePath("/admin/advices");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating advice:", error);
    return { error: "فشل إضافة النصيحة" };
  }
}

export async function updateAdvice(id: string, content: string, isActive: boolean) {
  try {
    await adviceQueries.update(id, { content, isActive });
    revalidatePath("/admin/advices");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating advice:", error);
    return { error: "فشل تحديث النصيحة" };
  }
}

export async function deleteAdvice(id: string) {
  try {
    await adviceQueries.delete(id);
    revalidatePath("/admin/advices");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting advice:", error);
    return { error: "فشل حذف النصيحة" };
  }
}

export async function getRandomAdvice() {
  const all = await adviceQueries.findActive();
  if (all.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * all.length);
  return all[randomIndex];
}
