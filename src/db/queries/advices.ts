import { db } from "@/db";
import { advices } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";

export const adviceQueries = {
  findAll: async () => {
    return db.select().from(advices).orderBy(desc(advices.createdAt));
  },

  findPaginated: async (page: number = 1, limit: number = 12) => {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, limit);
    const offset = (safePage - 1) * safeLimit;

    const [data, totalResult] = await Promise.all([
      db
        .select()
        .from(advices)
        .orderBy(desc(advices.createdAt))
        .limit(safeLimit)
        .offset(offset),
      db.select({ value: count() }).from(advices),
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

  findActive: async () => {
    return db.select().from(advices).where(eq(advices.isActive, true));
  },

  create: async (data: typeof advices.$inferInsert) => {
    const [advice] = await db.insert(advices).values(data).returning();
    return advice;
  },

  update: async (id: string, data: Partial<typeof advices.$inferInsert>) => {
    const [updated] = await db.update(advices).set(data).where(eq(advices.id, id)).returning();
    return updated;
  },

  delete: async (id: string) => {
    const [deleted] = await db.delete(advices).where(eq(advices.id, id)).returning();
    return deleted;
  },
};
