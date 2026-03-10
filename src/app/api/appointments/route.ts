import { db } from "@/db";
import { appointments } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import * as z from "zod";

const appointmentSchema = z.object({
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().min(10),
  serviceType: z.enum(["repair", "installation", "maintenance"]),
  machineType: z.enum(["washing_machine", "water_filter", "refrigerator"]),
  date: z.string().transform((str) => new Date(str)),
  address: z.string().min(5),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const body = await req.json();
    const validatedData = appointmentSchema.parse(body);

    if (!session?.user && !validatedData.guestName) {
      return new NextResponse("guestName is required for unauthenticated bookings", {
        status: 400,
      });
    }

    await db.insert(appointments).values({
      userId: session?.user?.id || null,
      guestName: validatedData.guestName || session?.user?.name || null,
      guestEmail: validatedData.guestEmail || session?.user?.email || null,
      guestPhone: validatedData.guestPhone,
      serviceType: validatedData.serviceType,
      machineType: validatedData.machineType,
      date: validatedData.date,
      address: validatedData.address,
      notes: validatedData.notes,
      status: "pending",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid payload", { status: 400 });
    }
    console.error("Error creating appointment:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
