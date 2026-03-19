import { db } from "@/db";
import { appointments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
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
