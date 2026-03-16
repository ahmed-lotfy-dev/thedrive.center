"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { customerCars, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { normalizePlateNumber } from "@/lib/utils";

const onboardingSchema = z.object({
  make: z.string().min(1, "ماركة السيارة مطلوبة"),
  model: z.string().min(1, "موديل السيارة مطلوب"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  plateNumber: z.string().min(1, "رقم اللوحة مطلوب"),
  color: z.string().optional(),
});

export async function submitOnboarding(prevState: any, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: "غير مصرح لك بالوصول. يرجى تسجيل الدخول أولاً." };
  }

  const rawData = {
    make: formData.get("make"),
    model: formData.get("model"),
    year: formData.get("year"),
    plateNumber: formData.get("plateNumber"),
    color: formData.get("color"),
  };

  const validated = onboardingSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { make, model, year, plateNumber, color } = validated.data;
  const userId = session.user.id;
  const cleanPlateNumber = normalizePlateNumber(plateNumber);

  try {
    // Check if car already exists in the system (e.g. added by admin)
    const existingCar = await db.query.customerCars.findFirst({
      where: eq(customerCars.plateNumber, cleanPlateNumber),
    });

    if (existingCar) {
      if (existingCar.userId && existingCar.userId !== userId) {
        return { error: "رقم اللوحة هذا مسجل لمستخدم آخر. يرجى التواصل مع الإدارة." };
      }
      
      // Link the existing car to this user and ensure it's active
      await db.update(customerCars)
        .set({ 
          userId, 
          make, 
          model, 
          year, 
          color, 
          status: "active",
          updatedAt: new Date() 
        })
        .where(eq(customerCars.id, existingCar.id));
    } else {
      // Insert new car record
      await db.insert(customerCars).values({
        userId,
        make,
        model,
        year,
        plateNumber: cleanPlateNumber,
        color,
      });
    }

    // Mark user as onboarded
    await db.update(user)
      .set({ onboarded: true })
      .where(eq(user.id, userId));

  } catch (error: any) {
    console.error("Onboarding error:", error);
    return { error: "حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى." };
  }

  redirect("/");
}
