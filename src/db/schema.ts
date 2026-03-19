import { pgTable, text, timestamp, uuid, integer, boolean, decimal, jsonb, index, uniqueIndex, check } from "drizzle-orm/pg-core";
import {
  APPOINTMENT_STATUSES,
  CAR_MEDIA_TYPES,
  CUSTOMER_CAR_STATUSES,
  NOTIFICATION_EVENT_STATUSES,
  NOTIFICATION_EVENT_TYPES,
  SERVICE_TYPES,
  VEHICLE_TYPES,
  type AppointmentStatusValue,
  type CarMediaTypeValue,
  type CustomerCarStatusValue,
  type NotificationEventStatusValue,
  type NotificationEventTypeValue,
  type ServiceTypeValue,
  type VehicleTypeValue,
} from "@/lib/constants";
import { sql } from "drizzle-orm";

function sqlStringList(values: readonly string[]) {
  return sql.raw(values.map((value) => `'${value.replace(/'/g, "''")}'`).join(", "));
}

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
}, (table) => ({
  dateIdx: index("appointments_date_idx").on(table.date),
  statusIdx: index("appointments_status_idx").on(table.status),
  createdAtIdx: index("appointments_created_at_idx").on(table.createdAt),
  serviceTypeChk: check(
    "appointments_service_type_chk",
    sql`${table.serviceType} IN (${sqlStringList(SERVICE_TYPES.map((item) => item.value))})`,
  ),
  vehicleTypeChk: check(
    "appointments_vehicle_type_chk",
    sql`${table.vehicleType} IS NULL OR ${table.vehicleType} IN (${sqlStringList(VEHICLE_TYPES.map((item) => item.value))})`,
  ),
  statusChk: check(
    "appointments_status_chk",
    sql`${table.status} IS NULL OR ${table.status} IN (${sqlStringList(APPOINTMENT_STATUSES.map((item) => item.value))})`,
  ),
}));

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
}, (table) => ({
  serviceTypeChk: check(
    "cars_service_type_chk",
    sql`${table.serviceType} IN (${sqlStringList(SERVICE_TYPES.map((item) => item.value))})`,
  ),
}));

export const carMedia = pgTable("car_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  carId: uuid("car_id").references(() => cars.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(), // Cloudflare R2 URL for gallery images
  type: text("type").$type<CarMediaTypeValue>().notNull(), // 'image' or 'video' but the user mostly asked for " صور وفيديو كل عربيه" so we can keep multiple photos here
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  typeChk: check(
    "car_media_type_chk",
    sql`${table.type} IN (${sqlStringList(CAR_MEDIA_TYPES.map((item) => item.value))})`,
  ),
}));
export const advices = pgTable("advices", {
  id: uuid("id").primaryKey().defaultRandom(),
  content: text("content").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notificationEvents = pgTable("notification_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type").$type<NotificationEventTypeValue>().notNull(),
  status: text("status").$type<NotificationEventStatusValue>().default("pending").notNull(),
  provider: text("provider").notNull().default("mock"),
  phone: text("phone").notNull(),
  email: text("email"),
  customerName: text("customer_name"),
  message: text("message").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().default({}).notNull(),
  scheduledFor: timestamp("scheduled_for").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
  error: text("error"),
  appointmentId: uuid("appointment_id").references(() => appointments.id, { onDelete: "set null" }),
  carId: uuid("car_id").references(() => customerCars.id, { onDelete: "set null" }),
  userId: uuid("user_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  typeChk: check(
    "notification_events_type_chk",
    sql`${table.type} IN (${sqlStringList(NOTIFICATION_EVENT_TYPES.map((item) => item.value))})`,
  ),
  statusChk: check(
    "notification_events_status_chk",
    sql`${table.status} IN (${sqlStringList(NOTIFICATION_EVENT_STATUSES.map((item) => item.value))})`,
  ),
}));

export const rateLimitBuckets = pgTable("rate_limit_buckets", {
  id: uuid("id").primaryKey().defaultRandom(),
  action: text("action").notNull(),
  key: text("key").notNull(),
  count: integer("count").default(1).notNull(),
  windowStartedAt: timestamp("window_started_at").defaultNow().notNull(),
  blockedUntil: timestamp("blocked_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  actionKeyUniqueIdx: uniqueIndex("rate_limit_buckets_action_key_idx").on(table.action, table.key),
  actionUpdatedAtIdx: index("rate_limit_buckets_action_updated_at_idx").on(table.action, table.updatedAt),
  blockedUntilIdx: index("rate_limit_buckets_blocked_until_idx").on(table.blockedUntil),
}));

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
}, (table) => ({
  userIdIdx: index("customer_cars_user_id_idx").on(table.userId),
  statusIdx: index("customer_cars_status_idx").on(table.status),
  createdAtIdx: index("customer_cars_created_at_idx").on(table.createdAt),
  statusChk: check(
    "customer_cars_status_chk",
    sql`${table.status} IN (${sqlStringList(CUSTOMER_CAR_STATUSES.map((item) => item.value))})`,
  ),
}));

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
}, (table) => ({
  carIdIdx: index("service_records_car_id_idx").on(table.carId),
  serviceDateIdx: index("service_records_service_date_idx").on(table.serviceDate),
  serviceTypeChk: check(
    "service_records_service_type_chk",
    sql`${table.serviceType} IN (${sqlStringList(SERVICE_TYPES.map((item) => item.value))})`,
  ),
}));

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
