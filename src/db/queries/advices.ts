import { db } from "@/db";
import { advices } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const adviceQueries = {
  findAll: async () => {
    return db.select().from(advices).orderBy(desc(advices.createdAt));
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
