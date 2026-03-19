"use server";

import { db } from "@/db";
import { appointments, customerCars, siteSettings } from "@/db/schema";
import { and, eq, gte, inArray, lt } from "drizzle-orm";
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
  type ServiceTypeValue,
  type VehicleTypeValue,
} from "@/lib/constants";
import { notificationService } from "@/lib/notifications/notification.service";
import { processNotificationEvent, queueNotificationEvent } from "@/lib/notifications/outbox";
import { enforceRateLimit, RateLimitError, rateLimitPolicies } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

type PaginatedAppointments = Awaited<ReturnType<typeof appointmentQueries.findPaginated>>;
type GetAppointmentsResult =
  | {
      success: true;
      data: PaginatedAppointments["data"];
      meta: PaginatedAppointments["meta"];
    }
  | {
      success: false;
      error: string;
    };

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
const ADMIN_APPOINTMENTS_PATH = "/admin/appointments";

function getStartOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function getStartOfDay(date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start;
}

function getEndOfDay(date: Date) {
  const end = new Date(date);
  end.setHours(24, 0, 0, 0);
  return end;
}

function isAdminRole(role?: string) {
  return role === "admin" || role === "owner";
}

function getAdminAppointmentsUrl() {
  const baseUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "";
  if (!baseUrl) return ADMIN_APPOINTMENTS_PATH;
  return new URL(ADMIN_APPOINTMENTS_PATH, baseUrl).toString();
}

async function isAdminBookingAlertsEnabled() {
  const setting = await db.query.siteSettings.findFirst({
    where: eq(siteSettings.key, "admin_booking_alerts_enabled"),
  });

  return setting?.value !== "false";
}

export async function createAppointment(data: z.infer<typeof appointmentSchema>) {
  try {
    const validated = appointmentSchema.parse(data);
    const parsedDate = new Date(validated.date);
    const requestHeaders = await headers();

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
      headers: requestHeaders,
    });

    await enforceRateLimit(rateLimitPolicies.publicBooking, {
      headers: requestHeaders,
      userId: session?.user?.id,
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
      serviceType: validated.serviceType as ServiceTypeValue,
      vehicleType: validated.vehicleType as VehicleTypeValue,
      date: parsedDate,
      notes: validated.notes || null,
    };

    const cleanPlateNumber = normalizePlateNumber(validated.plateNumber);
    const bookingDayStart = getStartOfDay(parsedDate);
    const bookingDayEnd = getEndOfDay(parsedDate);
    
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

      const existingSameDayAppointment = await tx.query.appointments.findFirst({
        where: and(
          eq(appointments.carId, car.id),
          gte(appointments.date, bookingDayStart),
          lt(appointments.date, bookingDayEnd),
          inArray(appointments.status, ["pending", "confirmed"]),
        ),
      });

      if (existingSameDayAppointment) {
        logger.warn("appointment.duplicate_same_day_rejected", {
          carId: car.id,
          plateNumber: cleanPlateNumber,
          requestedDate: parsedDate.toISOString(),
          existingAppointmentId: existingSameDayAppointment.id,
        });
        throw new Error("DUPLICATE_SAME_DAY_APPOINTMENT");
      }

      const [createdAppointment] = await tx.insert(appointments).values(appointmentData).returning();
      const notificationEvent = await queueNotificationEvent({
        type: "appointment_request_received",
        phone: validated.guestPhone,
        email: appointmentData.guestEmail ?? null,
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

    if (process.env.ADMIN_EMAIL && await isAdminBookingAlertsEnabled()) {
      const adminAlertResult = await notificationService.sendNewBookingAdminAlertEmail(
        process.env.ADMIN_EMAIL,
        appointmentData.guestName ?? "عميلنا",
        validated.guestPhone,
        appointmentData.guestEmail ?? "غير متوفر",
        getServiceTypeLabel(validated.serviceType),
        parsedDate.toLocaleDateString("ar-EG"),
        cleanPlateNumber,
        getAdminAppointmentsUrl(),
      );

      if (adminAlertResult.success) {
        logger.info("appointment.admin_alert_sent", {
          appointmentId: appointment.id,
          hasAdminRecipient: true,
        });
      } else {
        logger.warn("appointment.admin_alert_failed", {
          appointmentId: appointment.id,
          hasAdminRecipient: true,
          error: adminAlertResult.error ?? "Unknown admin alert email error",
        });
      }
    } else if (process.env.ADMIN_EMAIL) {
      logger.info("appointment.admin_alert_skipped", {
        appointmentId: appointment.id,
        reason: "disabled_by_setting",
      });
    }

    revalidatePath("/admin/appointments");
    revalidatePath("/book");

    logger.info("appointment.created", {
      appointmentId: appointment.id,
      carId: appointment.carId,
      userId: appointment.userId,
      serviceType: appointment.serviceType,
      date: parsedDate.toISOString(),
    });

    return {
      success: true,
      data: appointment,
      message: "تم حجز الموعد بنجاح",
    };
  } catch (error) {
    logger.error("appointment.create_failed", {
      error,
      action: "createAppointment",
    });
    if (error instanceof Error && error.message === "DUPLICATE_SAME_DAY_APPOINTMENT") {
      return {
        success: false,
        error: "يوجد بالفعل حجز مسجل لهذه السيارة في هذا اليوم.",
      };
    }
    if (error instanceof RateLimitError) {
      return {
        success: false,
        error: error.result.message,
      };
    }
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

export async function getAppointments(page: number = 1, limit: number = 12): Promise<GetAppointmentsResult> {
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

    const paginatedAppointments = await appointmentQueries.findPaginated(page, limit);

    return {
      success: true,
      ...paginatedAppointments,
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
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    const userRole = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || !isAdminRole(userRole)) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    await enforceRateLimit(rateLimitPolicies.adminWrite, {
      headers: requestHeaders,
      userId: session.user.id,
    });

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
          email: appointment.guestEmail ?? null,
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

    logger.info("appointment.status_updated", {
      appointmentId: updated?.id ?? id,
      status: validatedStatus,
      notificationEventId,
    });

    return {
      success: true,
      data: updated,
      message: "Appointment status updated",
    };
  } catch (error) {
    logger.error("appointment.status_update_failed", {
      error,
      appointmentId: id,
      status,
    });
    if (error instanceof RateLimitError) {
      return {
        success: false,
        error: error.result.message,
      };
    }
    return {
      success: false,
      error: "Failed to update appointment",
    };
  }
}

export async function deleteAppointmentAction(id: string) {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    const userRole = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || !isAdminRole(userRole)) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    await enforceRateLimit(rateLimitPolicies.adminWrite, {
      headers: requestHeaders,
      userId: session.user.id,
    });

    await appointmentQueries.delete(id);
    revalidatePath("/admin/appointments");

    logger.info("appointment.deleted", {
      appointmentId: id,
    });

    return {
      success: true,
      message: "Appointment deleted successfully",
    };
  } catch (error) {
    logger.error("appointment.delete_failed", {
      error,
      appointmentId: id,
    });
    if (error instanceof RateLimitError) {
      return {
        success: false,
        error: error.result.message,
      };
    }
    return {
      success: false,
      error: "Failed to delete appointment",
    };
  }
}
