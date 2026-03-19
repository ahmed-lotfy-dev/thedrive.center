"use server";

import { adviceQueries } from "@/db/queries/advices";
import { revalidatePath } from "next/cache";
import { AuthorizationError, requireAdmin } from "@/lib/server-auth";

export async function createAdvice(content: string) {
  try {
    await requireAdmin();
    await adviceQueries.create({ content });
    revalidatePath("/admin/advices");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { error: "Unauthorized" };
    }
    console.error("Error creating advice:", error);
    return { error: "فشل إضافة النصيحة" };
  }
}

export async function updateAdviceState(id: string, isActive: boolean) {
  try {
    await requireAdmin();

    const updatedAdvice = await adviceQueries.update(id, { isActive });
    if (!updatedAdvice) {
      return { error: "النصيحة غير موجودة" };
    }

    revalidatePath("/admin/advices");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { error: "Unauthorized" };
    }
    console.error("Error updating advice:", error);
    return { error: "فشل تحديث النصيحة" };
  }
}

export async function deleteAdvice(id: string) {
  try {
    await requireAdmin();
    await adviceQueries.delete(id);
    revalidatePath("/admin/advices");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { error: "Unauthorized" };
    }
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
