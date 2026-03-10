"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { appointmentQueries } from "@/db/queries/appointments";

const appointmentSchema = z.object({
  guestName: z.string().min(1, "Name is required").optional(),
  guestEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  guestPhone: z.string().min(10, "Phone is required"),
  serviceType: z.string().min(1, "Service type is required"),
  machineType: z.string().min(1, "Vehicle type is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  address: z.string().min(1, "Address is required"),
});

function isAdminRole(role?: string) {
  return role === "admin" || role === "owner";
}

export async function createAppointment(data: z.infer<typeof appointmentSchema>) {
  try {
    const validated = appointmentSchema.parse(data);

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user && !validated.guestName) {
      return {
        success: false,
        error: "Name is required for guest bookings",
      };
    }

    const appointmentData = {
      userId: session?.user?.id || null,
      guestName: session?.user?.name || validated.guestName || null,
      guestEmail: validated.guestEmail || session?.user?.email || null,
      guestPhone: validated.guestPhone,
      serviceType: validated.serviceType,
      machineType: validated.machineType,
      date: new Date(validated.date),
      notes: validated.notes || null,
      address: validated.address,
    };

    const appointment = await appointmentQueries.create(appointmentData);

    revalidatePath("/admin/appointments");
    revalidatePath("/book");

    return {
      success: true,
      data: appointment,
      message: "Appointment booked successfully",
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
      error: "Failed to book appointment",
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

    const updated = await appointmentQueries.updateStatus(id, status);

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
