"use server";

import { adviceQueries } from "@/db/queries/advices";
import { revalidatePath } from "next/cache";
import { AuthorizationError, requireAdmin } from "@/lib/server-auth";
import { headers } from "next/headers";
import { enforceRateLimit, RateLimitError, rateLimitPolicies } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function createAdvice(content: string) {
  try {
    const session = await requireAdmin();
    await enforceRateLimit(rateLimitPolicies.adminWrite, {
      headers: await headers(),
      userId: session.user.id,
    });
    await adviceQueries.create({ content });
    revalidatePath("/admin/advices");
    revalidatePath("/");
    logger.info("admin.advice.created", {
      contentLength: content.length,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { error: "Unauthorized" };
    }
    if (error instanceof RateLimitError) {
      return { error: error.result.message };
    }
    logger.error("admin.advice.create_failed", {
      error,
    });
    return { error: "فشل إضافة النصيحة" };
  }
}

export async function updateAdviceState(id: string, isActive: boolean) {
  try {
    const session = await requireAdmin();
    await enforceRateLimit(rateLimitPolicies.adminWrite, {
      headers: await headers(),
      userId: session.user.id,
    });

    const updatedAdvice = await adviceQueries.update(id, { isActive });
    if (!updatedAdvice) {
      return { error: "النصيحة غير موجودة" };
    }

    revalidatePath("/admin/advices");
    revalidatePath("/");
    logger.info("admin.advice.updated", {
      adviceId: id,
      isActive,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { error: "Unauthorized" };
    }
    if (error instanceof RateLimitError) {
      return { error: error.result.message };
    }
    logger.error("admin.advice.update_failed", {
      error,
      adviceId: id,
      isActive,
    });
    return { error: "فشل تحديث النصيحة" };
  }
}

export async function deleteAdvice(id: string) {
  try {
    const session = await requireAdmin();
    await enforceRateLimit(rateLimitPolicies.adminWrite, {
      headers: await headers(),
      userId: session.user.id,
    });
    await adviceQueries.delete(id);
    revalidatePath("/admin/advices");
    revalidatePath("/");
    logger.info("admin.advice.deleted", {
      adviceId: id,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return { error: "Unauthorized" };
    }
    if (error instanceof RateLimitError) {
      return { error: error.result.message };
    }
    logger.error("admin.advice.delete_failed", {
      error,
      adviceId: id,
    });
    return { error: "فشل حذف النصيحة" };
  }
}

export async function getRandomAdvice() {
  const all = await adviceQueries.findActive();
  if (all.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * all.length);
  return all[randomIndex];
}
