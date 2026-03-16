"use server";

import { db } from "@/db";
import { customerCars, serviceRecords, user } from "@/db/schema";
import { eq, and, desc, ilike, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { normalizePlateNumber } from "@/lib/utils";
import { customerCarSchema, serviceRecordSchema, maintenanceTrackingSchema } from "./schema";

async function isAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const role = (session?.user as { role?: string } | undefined)?.role;
  return role === "admin" || role === "owner";
}


export async function getUserCars() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { data: [], error: "Unauthorized" };

  try {
    const cars = await db.query.customerCars.findMany({
      where: and(
        eq(customerCars.userId, session.user.id),
        eq(customerCars.status, "active")
      ),
      with: {
        serviceRecords: {
          orderBy: [desc(serviceRecords.serviceDate)],
        },
      },
    });
    return { data: cars, error: null };
  } catch (error) {
    console.error("Error fetching user cars:", error);
    return { data: [], error: "Failed to fetch cars" };
  }
}

export async function linkCarByPlate(plateNumber: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { error: "يرجى تسجيل الدخول أولاً" };

  const cleanPlate = normalizePlateNumber(plateNumber);

  try {
    const car = await db.query.customerCars.findFirst({
      where: eq(customerCars.plateNumber, cleanPlate),
    });

    if (!car) {
      return { error: "لم يتم العثور على سيارة بهذا الرقم. يمكنك إضافة سيارة جديدة." };
    }

    if (car.userId) {
      if (car.userId === session.user.id) {
        return { error: "هذه السيارة مسجلة لك بالفعل." };
      }
      return { error: "هذه السيارة مسجلة لمستخدم آخر. يرجى التواصل مع الإدارة." };
    }

    await db.update(customerCars)
      .set({ userId: session.user.id })
      .where(eq(customerCars.id, car.id));

    revalidatePath("/dashboard/garage");
    return { success: true };
  } catch (error) {
    console.error("Error linking car:", error);
    return { error: "حدث خطأ أثناء محاولة ربط السيارة." };
  }
}

export async function addCustomerCarAction(data: any) {
  if (!(await isAdmin())) return { error: "Unauthorized" };

  try {
    const validated = customerCarSchema.parse(data);
    const cleanPlate = normalizePlateNumber(validated.plateNumber);

    const existing = await db.query.customerCars.findFirst({
      where: eq(customerCars.plateNumber, cleanPlate),
    });

    if (existing) {
      return { error: "هذه السيارة مسجلة بالفعل في النظام." };
    }

    const [newCar] = await db.insert(customerCars).values({
      make: validated.make,
      model: validated.model,
      year: validated.year,
      plateNumber: cleanPlate,
      color: validated.color,
    }).returning();

    revalidatePath("/admin/customer-cars");
    return { success: true, data: newCar };
  } catch (error) {
    console.error("Error adding customer car:", error);
    return { error: "فشل في تسجيل السيارة الجديدة." };
  }
}

export async function addServiceRecordAction(data: any) {
  if (!(await isAdmin())) return { error: "غير مصرح لك بالوصول" };

  try {
    const validated = serviceRecordSchema.parse(data);

    await db.insert(serviceRecords).values({
      carId: validated.carId,
      serviceDate: new Date(validated.serviceDate),
      serviceType: validated.serviceType,
      description: validated.description,
      odometer: validated.odometer,
      cost: validated.cost?.toString(),
    });

    revalidatePath("/admin/customer-cars");
    return { success: true };
  } catch (error) {
    console.error("Error adding service record:", error);
    return { error: "فشل في تسجيل الخدمة." };
  }
}

export async function searchCustomerCars(query: string) {
  if (!(await isAdmin())) return { data: [], error: "Unauthorized" };

  try {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      // If empty, return all (or a default set)
      const all = await db.query.customerCars.findMany({
        where: eq(customerCars.status, "active"),
        with: { user: true },
        orderBy: [desc(customerCars.createdAt)],
        limit: 20,
      });
      return { data: all, error: null };
    }

    const searchTerm = `%${trimmedQuery}%`;
    const normalizedPlateQuery = normalizePlateNumber(trimmedQuery);
    const plateSearchTerm = `%${normalizedPlateQuery}%`;
    
    // 1. Primary Search (Plate, Make, Model)
    const carResults = await db.query.customerCars.findMany({
      where: (fields, { or, ilike, and, eq }) => and(
        eq(fields.status, "active"),
        or(
          ilike(fields.plateNumber, searchTerm),
          ilike(fields.plateNumber, plateSearchTerm),
          ilike(sql`REPLACE(${fields.plateNumber}, ' ', '')`, plateSearchTerm),
          ilike(fields.make, searchTerm),
          ilike(fields.model, searchTerm)
        )
      ),
      with: {
        user: true,
      },
      limit: 20,
    });

    // 2. Secondary Search (Owner Name) - only if primary results are few
    // and ONLY if the query doesn't look like a license plate (e.g. contains numbers)
    // but users might search for "Ahmed 123", so let's just search and merge carefully
    let allResults = [...carResults];
    
    if (carResults.length < 10) {
      const userMatches = await db.query.user.findMany({
        where: ilike(user.name, searchTerm),
        with: {
          cars: {
            with: { user: true }
          }
        }
      });
      
      const userCars = userMatches.flatMap(u => u.cars);
      
      // Merge unique cars
      userCars.forEach(uc => {
        if (!allResults.find(r => r.id === uc.id)) {
          allResults.push(uc as any);
        }
      });
    }

    return { data: allResults.slice(0, 20), error: null };
  } catch (error) {
    console.error("Error searching cars:", error);
    return { data: [], error: "Search failed" };
  }
}

export async function updateMaintenanceTrackingAction(carId: string, data: any) {
  if (!(await isAdmin())) return { error: "Unauthorized" };

  try {
    const validated = maintenanceTrackingSchema.parse(data);

    await db.update(customerCars)
      .set({
        nextServiceDate: validated.nextServiceDate ? new Date(validated.nextServiceDate) : null,
        nextServiceOdometer: validated.nextServiceOdometer,
        nextAlignmentDate: validated.nextAlignmentDate ? new Date(validated.nextAlignmentDate) : null,
        updatedAt: new Date(),
      })
      .where(eq(customerCars.id, carId));

    revalidatePath("/admin/customer-cars");
    return { success: true };
  } catch (error) {
    console.error("Error updating tracking info:", error);
    return { error: "Update failed" };
  }
}

export async function deleteCustomerCarAction(carId: string) {
  if (!(await isAdmin())) return { error: "Unauthorized" };

  try {
    // Check for service records
    const records = await db.query.serviceRecords.findMany({
      where: eq(serviceRecords.carId, carId),
      limit: 1,
    });

    // Check for appointments
    const appts = await db.query.appointments.findMany({
      where: (fields, { eq }) => eq(fields.carId, carId),
      limit: 1,
    });

    if (records.length > 0 || appts.length > 0) {
      return { error: "لا يمكن مسح هذه السيارة نهائياً لوجود سجلات صيانة أو مواجهات حجز مرتبطة بها. يمكنك أرشفتها بدلاً من ذلك." };
    }

    await db.delete(customerCars).where(eq(customerCars.id, carId));
    revalidatePath("/admin/customer-cars");
    return { success: true };
  } catch (error) {
    console.error("Error deleting car:", error);
    return { error: "فشل مسح السيارة." };
  }
}

export async function archiveCustomerCarAction(carId: string) {
  if (!(await isAdmin())) return { error: "Unauthorized" };

  try {
    await db.update(customerCars)
      .set({ status: "archived" })
      .where(eq(customerCars.id, carId));

    revalidatePath("/admin/customer-cars");
    return { success: true };
  } catch (error) {
    console.error("Error archiving car:", error);
    return { error: "فشل أرشفة السيارة." };
  }
}

export async function unlinkCustomerCarAction(carId: string) {
  if (!(await isAdmin())) return { error: "Unauthorized" };

  try {
    await db.update(customerCars)
      .set({ userId: null })
      .where(eq(customerCars.id, carId));

    revalidatePath("/admin/customer-cars");
    return { success: true };
  } catch (error) {
    console.error("Error unlinking car:", error);
    return { error: "فشل فك ربط السيارة بالمستخدم." };
  }
}
