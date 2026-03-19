"use server";

import { db } from "@/db";
import { appointments, customerCars } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { normalizePlateNumber } from "@/lib/utils";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { appointmentQueries } from "@/db/queries/appointments";
import {
  getAppointmentStatusLabel,
  getServiceTypeLabel,
  isKnownAppointmentStatus,
  isKnownCarMaker,
  isKnownServiceType,
  isKnownVehicleType,
  type AppointmentStatusValue,
} from "@/lib/constants";
import { notificationService } from "@/lib/notifications/notification.service";
import { processNotificationEvent, queueNotificationEvent } from "@/lib/notifications/outbox";

const appointmentSchema = z.object({
  guestName: z.string().min(1, "Name is required").optional(),
  guestEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  guestPhone: z.string().min(10, "Phone is required"),
  serviceType: z.string()
    .min(1, "Service type is required")
    .refine(isKnownServiceType, "نوع الخدمة غير مدعوم"),
  vehicleType: z.string()
    .min(1, "Vehicle type is required")
    .refine(isKnownVehicleType, "نوع العربية غير مدعوم"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  plateNumber: z.string().min(1, "Plate number is required"),
  make: z.string()
    .min(1, "Make is required")
    .refine(isKnownCarMaker, "ماركة السيارة غير مدعومة"),
});

const appointmentStatusSchema = z.string().refine(isKnownAppointmentStatus, "حالة الحجز غير مدعومة");

const UNKNOWN_CAR_MODEL = "غير محدد";

function getStartOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function isAdminRole(role?: string) {
  return role === "admin" || role === "owner";
}

export async function createAppointment(data: z.infer<typeof appointmentSchema>) {
  try {
    const validated = appointmentSchema.parse(data);
    const parsedDate = new Date(validated.date);

    if (Number.isNaN(parsedDate.getTime())) {
      return {
        success: false,
        error: "تاريخ الحجز غير صالح",
      };
    }

    if (parsedDate < getStartOfToday()) {
      return {
        success: false,
        error: "لا يمكن اختيار تاريخ حجز في الماضي",
      };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user && !validated.guestName) {
      return {
        success: false,
        error: "Name is required for guest bookings",
      };
    }

    const appointmentData: typeof appointments.$inferInsert = {
      userId: session?.user?.id || null,
      guestName: session?.user?.name || validated.guestName || null,
      guestEmail: validated.guestEmail || session?.user?.email || null,
      guestPhone: validated.guestPhone,
      serviceType: validated.serviceType,
      vehicleType: validated.vehicleType,
      date: parsedDate,
      notes: validated.notes || null,
    };

    const cleanPlateNumber = normalizePlateNumber(validated.plateNumber);
    
    const { appointment, notificationEventId } = await db.transaction(async (tx) => {
      let car = await tx.query.customerCars.findFirst({
        where: eq(customerCars.plateNumber, cleanPlateNumber),
      });

      if (!car) {
        const [newCar] = await tx.insert(customerCars).values({
          plateNumber: cleanPlateNumber,
          make: validated.make,
          model: UNKNOWN_CAR_MODEL,
          userId: session?.user?.id || null,
          status: "active",
        }).returning();
        car = newCar;
      } else {
        if (car.status === "archived") {
          const [updatedCar] = await tx.update(customerCars)
            .set({ status: "active" })
            .where(eq(customerCars.id, car.id))
            .returning();
          car = updatedCar ?? { ...car, status: "active" };
        }

        if (!car.userId && session?.user?.id) {
          const [updatedCar] = await tx.update(customerCars)
            .set({ userId: session.user.id })
            .where(eq(customerCars.id, car.id))
            .returning();
          car = updatedCar ?? { ...car, userId: session.user.id };
        }
      }

      appointmentData.carId = car.id;

      const [createdAppointment] = await tx.insert(appointments).values(appointmentData).returning();
      const notificationEvent = await queueNotificationEvent({
        type: "appointment_request_received",
        phone: validated.guestPhone,
        customerName: appointmentData.guestName,
        message: notificationService.buildAppointmentRequestReceivedMessage(
          appointmentData.guestName ?? "عميلنا",
          parsedDate.toLocaleDateString("ar-EG"),
          getServiceTypeLabel(validated.serviceType),
        ),
        appointmentId: createdAppointment.id,
        carId: car.id,
        userId: appointmentData.userId,
        payload: {
          serviceType: validated.serviceType,
          vehicleType: validated.vehicleType,
          date: parsedDate.toISOString(),
        },
      }, tx);

      return { appointment: createdAppointment, notificationEventId: notificationEvent.id };
    });

    await processNotificationEvent(notificationEventId);

    revalidatePath("/admin/appointments");
    revalidatePath("/book");

    return {
      success: true,
      data: appointment,
      message: "تم حجز الموعد بنجاح",
    };
  } catch (error) {
    console.error("Error creating appointment:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0].message,
      };
    }
    return {
      success: false,
      error: "فشل حجز الموعد، يرجى المحاولة مرة أخرى",
    };
  }
}

export async function getAppointments() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userRole = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || !isAdminRole(userRole)) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const allAppointments = await appointmentQueries.findAll();

    return {
      success: true,
      data: allAppointments,
    };
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return {
      success: false,
      error: "Failed to fetch appointments",
    };
  }
}

export async function updateAppointmentStatus(id: string, status: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userRole = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || !isAdminRole(userRole)) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const validatedStatus = appointmentStatusSchema.parse(status) as AppointmentStatusValue;
    const { updated, notificationEventId } = await db.transaction(async (tx) => {
      const [appointment] = await tx
        .update(appointments)
        .set({ status: validatedStatus })
        .where(eq(appointments.id, id))
        .returning();

      let eventId: string | null = null;
      if (appointment?.guestPhone) {
        const event = await queueNotificationEvent({
          type:
            validatedStatus === "confirmed"
              ? "appointment_confirmed"
              : validatedStatus === "completed"
                ? "appointment_completed"
                : "appointment_cancelled",
          phone: appointment.guestPhone,
          customerName: appointment.guestName,
          message: notificationService.buildAppointmentStatusMessage(
            appointment.guestName ?? "عميلنا",
            getAppointmentStatusLabel(validatedStatus),
            new Date(appointment.date).toLocaleDateString("ar-EG"),
            getServiceTypeLabel(appointment.serviceType),
          ),
          appointmentId: appointment.id,
          carId: appointment.carId,
          userId: appointment.userId,
          payload: {
            status: validatedStatus,
            date: appointment.date instanceof Date ? appointment.date.toISOString() : String(appointment.date),
            serviceType: appointment.serviceType,
          },
        }, tx);
        eventId = event.id;
      }

      return { updated: appointment, notificationEventId: eventId };
    });

    if (notificationEventId) {
      await processNotificationEvent(notificationEventId);
    }

    revalidatePath("/admin/appointments");

    return {
      success: true,
      data: updated,
      message: "Appointment status updated",
    };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return {
      success: false,
      error: "Failed to update appointment",
    };
  }
}

export async function deleteAppointmentAction(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userRole = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || !isAdminRole(userRole)) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    await appointmentQueries.delete(id);
    revalidatePath("/admin/appointments");

    return {
      success: true,
      message: "Appointment deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return {
      success: false,
      error: "Failed to delete appointment",
    };
  }
}
