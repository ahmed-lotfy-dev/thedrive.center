import { z } from "zod";

export const customerCarSchema = z.object({
  make: z.string().min(1, "ماركة السيارة مطلوبة"),
  model: z.string().min(1, "موديل السيارة مطلوب"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1).optional(),
  plateNumber: z.string().min(1, "رقم اللوحة مطلوب"),
  color: z.string().optional(),
});

export const serviceRecordSchema = z.object({
  carId: z.string().uuid(),
  serviceDate: z.string().or(z.date()),
  serviceType: z.string().min(1, "نوع الخدمة مطلوب"),
  description: z.string().optional(),
  odometer: z.coerce.number().optional(),
  cost: z.coerce.number().optional(),
});

export const maintenanceTrackingSchema = z.object({
  nextServiceDate: z.string().or(z.date()).optional(),
  nextServiceOdometer: z.coerce.number().optional(),
  nextAlignmentDate: z.string().or(z.date()).optional(),
});
