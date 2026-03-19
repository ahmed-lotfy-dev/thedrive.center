import { db } from "@/db";
import { appointments } from "@/db/schema";
import { and, eq, desc, count, gte, sql } from "drizzle-orm";
import type { AppointmentStatusValue } from "@/lib/constants";

export const appointmentQueries = {
  findAll: async () => {
    return db.query.appointments.findMany({
      with: {
        user: true,
        car: true,
      },
      orderBy: [desc(appointments.createdAt)],
    });
  },

  findPaginated: async (page: number = 1, limit: number = 12) => {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const offset = (safePage - 1) * safeLimit;

    const [data, totalResult] = await Promise.all([
      db.query.appointments.findMany({
        with: {
          user: true,
          car: true,
        },
        orderBy: [desc(appointments.createdAt)],
        limit: safeLimit,
        offset,
      }),
      db.select({ value: count() }).from(appointments),
    ]);

    const total = totalResult[0]?.value ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));

    return {
      data,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1,
      },
    };
  },

  countAll: async () => {
    const [result] = await db.select({ value: count() }).from(appointments);
    return result?.value ?? 0;
  },

  countByStatus: async (status: AppointmentStatusValue) => {
    const [result] = await db
      .select({ value: count() })
      .from(appointments)
      .where(eq(appointments.status, status));
    return result?.value ?? 0;
  },

  findRecent: async (limit: number = 6) => {
    return db.query.appointments.findMany({
      with: {
        user: true,
        car: true,
      },
      orderBy: [desc(appointments.createdAt)],
      limit,
    });
  },

  countCreatedSince: async (fromDate: Date) => {
    const [result] = await db
      .select({ value: count() })
      .from(appointments)
      .where(gte(appointments.createdAt, fromDate));
    return result?.value ?? 0;
  },

  getDailyCountsSince: async (fromDate: Date) => {
    return db
      .select({
        day: sql<string>`DATE(${appointments.createdAt})`,
        count: count(),
      })
      .from(appointments)
      .where(and(gte(appointments.createdAt, fromDate)))
      .groupBy(sql`DATE(${appointments.createdAt})`)
      .orderBy(sql`DATE(${appointments.createdAt})`);
  },

  findById: async (id: string) => {
    const [appointment] = await db
      .select()
      .from(appointments)
      .where(eq(appointments.id, id))
      .limit(1);
    return appointment || null;
  },

  create: async (data: typeof appointments.$inferInsert) => {
    const [appointment] = await db.insert(appointments).values(data).returning();
    return appointment;
  },

  updateStatus: async (id: string, status: AppointmentStatusValue) => {
    const [updated] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  },

  delete: async (id: string) => {
    const [deleted] = await db
      .delete(appointments)
      .where(eq(appointments.id, id))
      .returning();
    return deleted;
  },
};
