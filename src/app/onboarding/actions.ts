"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { customerCars, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { normalizePlateNumber } from "@/lib/utils";

export async function submitOnboarding(prevState: any, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return { error: "غير مصرح لك بالوصول. يرجى تسجيل الدخول أولاً." };
  }

  const userId = session.user.id;
  const make = formData.get("make") as string;
  const model = formData.get("model") as string;
  const yearStr = formData.get("year") as string;
  const plateNumber = formData.get("plateNumber") as string;
  const color = formData.get("color") as string;

  const year = yearStr ? parseInt(yearStr, 10) : null;

  if (!make || !model || !plateNumber) {
    return { error: "برجاء إدخال ماركة وموديل السيارة ورقم اللوحة." };
  }

  // Clean the plate number string to ensure consistent formatting
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
