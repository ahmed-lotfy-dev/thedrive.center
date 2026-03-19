CREATE TABLE "notification_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "type" text NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "provider" text DEFAULT 'mock' NOT NULL,
  "phone" text NOT NULL,
  "customer_name" text,
  "message" text NOT NULL,
  "payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
  "scheduled_for" timestamp DEFAULT now() NOT NULL,
  "sent_at" timestamp,
  "error" text,
  "appointment_id" uuid,
  "car_id" uuid,
  "user_id" uuid,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notification_events" ADD CONSTRAINT "notification_events_appointment_id_appointments_id_fk" FOREIGN KEY ("appointment_id") REFERENCES "public"."appointments"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "notification_events" ADD CONSTRAINT "notification_events_car_id_customer_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."customer_cars"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "notification_events" ADD CONSTRAINT "notification_events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "notification_events_status_scheduled_idx" ON "notification_events" USING btree ("status","scheduled_for");
