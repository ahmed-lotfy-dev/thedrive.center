ALTER TABLE "appointments"
  ADD CONSTRAINT "appointments_service_type_chk"
  CHECK ("service_type" IN ('alignment_balancing', 'inspection', 'steering_coding', 'suspension_repair', 'tire_service', 'other')) NOT VALID;
--> statement-breakpoint
ALTER TABLE "appointments"
  ADD CONSTRAINT "appointments_vehicle_type_chk"
  CHECK ("vehicle_type" IS NULL OR "vehicle_type" IN ('sedan', 'suv', 'truck', 'other')) NOT VALID;
--> statement-breakpoint
ALTER TABLE "appointments"
  ADD CONSTRAINT "appointments_status_chk"
  CHECK ("status" IS NULL OR "status" IN ('pending', 'confirmed', 'completed', 'cancelled')) NOT VALID;
--> statement-breakpoint
ALTER TABLE "cars"
  ADD CONSTRAINT "cars_service_type_chk"
  CHECK ("service_type" IN ('alignment_balancing', 'inspection', 'steering_coding', 'suspension_repair', 'tire_service', 'other')) NOT VALID;
--> statement-breakpoint
ALTER TABLE "car_media"
  ADD CONSTRAINT "car_media_type_chk"
  CHECK ("type" IN ('image', 'video')) NOT VALID;
--> statement-breakpoint
ALTER TABLE "notification_events"
  ADD CONSTRAINT "notification_events_type_chk"
  CHECK ("type" IN ('appointment_request_received', 'appointment_confirmed', 'appointment_completed', 'appointment_cancelled', 'service_record_added', 'maintenance_service_reminder', 'maintenance_alignment_reminder')) NOT VALID;
--> statement-breakpoint
ALTER TABLE "notification_events"
  ADD CONSTRAINT "notification_events_status_chk"
  CHECK ("status" IN ('pending', 'sent', 'failed', 'skipped')) NOT VALID;
--> statement-breakpoint
ALTER TABLE "customer_cars"
  ADD CONSTRAINT "customer_cars_status_chk"
  CHECK ("status" IN ('active', 'archived')) NOT VALID;
--> statement-breakpoint
ALTER TABLE "service_records"
  ADD CONSTRAINT "service_records_service_type_chk"
  CHECK ("service_type" IN ('alignment_balancing', 'inspection', 'steering_coding', 'suspension_repair', 'tire_service', 'other')) NOT VALID;
