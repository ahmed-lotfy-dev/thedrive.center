import { db } from "@/db";
import { user } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";

export const userQueries = {
  /**
   * Find all users ordered by creation date
   */
  findAll: async () => {
    return db.select().from(user).orderBy(desc(user.createdAt));
  },

  countAll: async () => {
    const [result] = await db.select({ value: count() }).from(user);
    return result?.value ?? 0;
  },

  /**
   * Find a single user by ID
   */
  findById: async (id: string) => {
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);
    return foundUser || null;
  },

  /**
   * Find a single user by email
   */
  findByEmail: async (email: string) => {
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);
    return foundUser || null;
  }
};
