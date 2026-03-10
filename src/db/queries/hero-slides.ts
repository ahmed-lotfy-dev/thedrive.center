import { db } from "@/db";
import { heroSlides } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const heroSlideQueries = {
  /**
   * Find all slides ordered by creation date (newest first)
   * You might want to sort by 'order' field if you have one, but schema shows 'order' field exists
   */
  findAll: async () => {
    return db.select().from(heroSlides).orderBy(desc(heroSlides.order), desc(heroSlides.createdAt));
  },

  /**
   * Find active slides ordered by order field
   */
  findActive: async () => {
    return db
      .select()
      .from(heroSlides)
      .where(eq(heroSlides.isActive, true))
      .orderBy(desc(heroSlides.order), desc(heroSlides.createdAt));
  },

  /**
   * Find a single slide by ID
   */
  findById: async (id: string) => {
    const [slide] = await db
      .select()
      .from(heroSlides)
      .where(eq(heroSlides.id, id))
      .limit(1);
    return slide || null;
  },

  /**
   * Create a new slide
   */
  create: async (data: typeof heroSlides.$inferInsert) => {
    const [slide] = await db.insert(heroSlides).values(data).returning();
    return slide;
  },

  /**
   * Update a slide
   */
  update: async (id: string, data: Partial<typeof heroSlides.$inferInsert>) => {
    const [updated] = await db
      .update(heroSlides)
      .set(data)
      .where(eq(heroSlides.id, id))
      .returning();
    return updated;
  },

  /**
   * Delete a slide
   */
  delete: async (id: string) => {
    const [deleted] = await db
      .delete(heroSlides)
      .where(eq(heroSlides.id, id))
      .returning();
    return deleted;
  },
};
