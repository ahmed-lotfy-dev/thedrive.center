import { pgTable, text, timestamp, uuid, integer, boolean, decimal } from "drizzle-orm/pg-core";
import type {
  AppointmentStatusValue,
  CarMediaTypeValue,
  CustomerCarStatusValue,
  ServiceTypeValue,
  VehicleTypeValue,
} from "@/lib/constants";

// --- Better Auth Core Tables ---

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  role: text("role").default("user"),
  onboarded: boolean("onboarded").default(false),
  phone: text("phone"),
});

export const session = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
});

export const account = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// --- Application Tables (Service Center MVP) ---

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").unique().notNull(),
  value: text("value"),
  type: text("type").default("text"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => user.id),
  carId: uuid("car_id").references(() => customerCars.id),
  guestName: text("guest_name"),
  guestEmail: text("guest_email"),
  guestPhone: text("guest_phone"),
  serviceType: text("service_type").$type<ServiceTypeValue>().notNull(),
  vehicleType: text("vehicle_type").$type<VehicleTypeValue>().default("sedan"),
  date: timestamp("date").notNull(),
  status: text("status").$type<AppointmentStatusValue>().default("pending"),
  notes: text("notes"),
  technicianId: uuid("technician_id").references(() => user.id),
  estimatedPrice: decimal("estimated_price", { precision: 10, scale: 2 }),
  actualPrice: decimal("actual_price", { precision: 10, scale: 2 }),
  completedAt: timestamp("completed_at"),
  cancelledAt: timestamp("cancelled_at"),
  cancellationReason: text("cancellation_reason"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cars = pgTable("cars", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(), // e.g. "BMW X6 M-Power"
  slug: text("slug").notNull().unique(), // URL-friendly slug
  description: text("description"), // Detailed description of the work done
  coverImageUrl: text("cover_image_url").notNull(), // Cloudflare R2 URL for the main image
  videoUrl: text("video_url"), // Cloudflare R2 URL for the single video as requested
  serviceType: text("service_type").$type<ServiceTypeValue>().notNull(), // E.g., 'alignment_balancing', 'inspection', 'steering_coding'
  featured: boolean("featured").default(false), // To show on the homepage if needed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const carMedia = pgTable("car_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  carId: uuid("car_id").references(() => cars.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(), // Cloudflare R2 URL for gallery images
  type: text("type").$type<CarMediaTypeValue>().notNull(), // 'image' or 'video' but the user mostly asked for " صور وفيديو كل عربيه" so we can keep multiple photos here
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
export const advices = pgTable("advices", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customerCars = pgTable("customer_cars", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }), // Nullable to allow admin entry
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year"),
  plateNumber: text("plate_number").notNull().unique(),
  color: text("color"),
  nextServiceDate: timestamp("next_service_date"),
  nextServiceOdometer: integer("next_service_odometer"),
  nextAlignmentDate: timestamp("next_alignment_date"),
  status: text("status").$type<CustomerCarStatusValue>().default("active").notNull(), // 'active', 'archived'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceRecords = pgTable("service_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  carId: uuid("car_id")
    .notNull()
    .references(() => customerCars.id, { onDelete: "cascade" }),
  serviceDate: timestamp("service_date").notNull().defaultNow(),
  serviceType: text("service_type").$type<ServiceTypeValue>().notNull(), // e.g. 'Oil Change', 'Alignment'
  description: text("description"),
  odometer: integer("odometer"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

import { relations } from "drizzle-orm";

export const carsRelations = relations(cars, ({ many }) => ({
  media: many(carMedia),
}));

export const carMediaRelations = relations(carMedia, ({ one }) => ({
  car: one(cars, {
    fields: [carMedia.carId],
    references: [cars.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(user, {
    fields: [appointments.userId],
    references: [user.id],
  }),
  car: one(customerCars, {
    fields: [appointments.carId],
    references: [customerCars.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  appointments: many(appointments),
  cars: many(customerCars),
}));

export const customerCarsRelations = relations(customerCars, ({ many, one }) => ({
  serviceRecords: many(serviceRecords),
  user: one(user, {
    fields: [customerCars.userId],
    references: [user.id],
  }),
  appointments: many(appointments),
}));

export const serviceRecordsRelations = relations(serviceRecords, ({ one }) => ({
  car: one(customerCars, {
    fields: [serviceRecords.carId],
    references: [customerCars.id],
  }),
}));
