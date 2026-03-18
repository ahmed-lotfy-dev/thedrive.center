"use server";

import { db } from "@/db";
import { customerCars, serviceRecords, user } from "@/db/schema";
import { eq, and, or, desc, ilike, sql } from "drizzle-orm";
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


export async function getUserCars(page: number = 1, limit: number = 6) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return { data: [], meta: { totalPages: 0 }, error: "Unauthorized" };

  try {
    const offset = (page - 1) * limit;

    const [totalCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(customerCars)
      .where(
        and(
          eq(customerCars.userId, session.user.id),
          eq(customerCars.status, "active")
        )
      );

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
      limit,
      offset,
      orderBy: [desc(customerCars.createdAt)],
    });

    const totalPages = Math.ceil(Number(totalCountResult.count) / limit);

    return { 
      data: cars, 
      meta: { totalPages },
      error: null 
    };
  } catch (error) {
    console.error("Error fetching user cars:", error);
    return { data: [], meta: { totalPages: 0 }, error: "Failed to fetch cars" };
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

export async function searchCustomerCars(query: string, page: number = 1, limit: number = 12) {
  if (!(await isAdmin())) return { data: [], meta: { totalPages: 0 }, error: "Unauthorized" };

  try {
    const trimmedQuery = query.trim();
    const offset = (page - 1) * limit;
    const searchTerm = `%${trimmedQuery}%`;
    const normalizedPlateQuery = normalizePlateNumber(trimmedQuery);
    const plateSearchTerm = `%${normalizedPlateQuery}%`;

    // 1. Define base condition
    const searchCondition = (fields: any, { or, ilike, and, eq }: any) => and(
      eq(fields.status, "active"),
      trimmedQuery ? or(
        ilike(fields.plateNumber, searchTerm),
        ilike(fields.plateNumber, plateSearchTerm),
        ilike(sql`REPLACE(${fields.plateNumber}, ' ', '')`, plateSearchTerm),
        ilike(fields.make, searchTerm),
        ilike(fields.model, searchTerm)
      ) : sql`TRUE`
    );

    // 2. Get total count
    const [totalCountResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(customerCars)
      .where(and(
        eq(customerCars.status, "active"),
        trimmedQuery ? or(
          ilike(customerCars.plateNumber, searchTerm),
          ilike(customerCars.plateNumber, plateSearchTerm),
          ilike(sql`REPLACE(${customerCars.plateNumber}, ' ', '')`, plateSearchTerm),
          ilike(customerCars.make, searchTerm),
          ilike(customerCars.model, searchTerm)
        ) : sql`TRUE`
      ));

    // 3. Get paginated results
    const results = await db.query.customerCars.findMany({
      where: searchCondition,
      with: {
        user: true,
      },
      limit,
      offset,
      orderBy: [desc(customerCars.createdAt)],
    });

    const totalPages = Math.ceil(Number(totalCountResult.count) / limit);

    return { 
      data: results, 
      meta: { totalPages },
      error: null 
    };
  } catch (error) {
    console.error("Error searching cars:", error);
    return { data: [], meta: { totalPages: 0 }, error: "Search failed" };
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
