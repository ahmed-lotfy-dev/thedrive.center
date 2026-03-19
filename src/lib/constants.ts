export const SERVICE_TYPES = [
  { value: "alignment_balancing", label: "ضبط زوايا وترصيص" },
  { value: "inspection", label: "فحص شامل" },
  { value: "steering_coding", label: "تكويد طارة" },
  { value: "suspension_repair", label: "إصلاح عفشة" },
  { value: "tire_service", label: "خدمة إطارات" },
  { value: "other", label: "أخرى" },
] as const;

export type ServiceTypeValue = (typeof SERVICE_TYPES)[number]["value"];

const serviceTypeMap = new Map(SERVICE_TYPES.map((service) => [service.value, service.label]));

export function isKnownServiceType(value: string) {
  return serviceTypeMap.has(value.trim().toLowerCase());
}

export function getServiceTypeLabel(value: string) {
  return serviceTypeMap.get(value.trim().toLowerCase()) ?? value;
}

export const CAR_MAKERS = [
  { value: "toyota", label: "تويوتا (Toyota)" },
  { value: "hyundai", label: "هيونداي (Hyundai)" },
  { value: "kia", label: "كيا (Kia)" },
  { value: "nissan", label: "نيسان (Nissan)" },
  { value: "mitsubishi", label: "ميتسوبيشي (Mitsubishi)" },
  { value: "mercedes", label: "مرسيدس (Mercedes)" },
  { value: "bmw", label: "بي إم دبليو (BMW)" },
  { value: "chevrolet", label: "شيفروليه (Chevrolet)" },
  { value: "renault", label: "رينو (Renault)" },
  { value: "fiat", label: "فيات (Fiat)" },
  { value: "skoda", label: "سكودا (Skoda)" },
  { value: "volkswagen", label: "فولكس فاجن (Volkswagen)" },
  { value: "opel", label: "أوبل (Opel)" },
  { value: "jeep", label: "جيب (Jeep)" },
  { value: "mg", label: "إم جي (MG)" },
  { value: "chery", label: "شيري (Chery)" },
  { value: "suzuki", label: "سوزوكي (Suzuki)" },
  { value: "other", label: "أخرى / Other" },
] as const;

export type CarMakerValue = (typeof CAR_MAKERS)[number]["value"];

const carMakerMap = new Map(CAR_MAKERS.map((maker) => [maker.value, maker.label]));

export function isKnownCarMaker(value: string) {
  return carMakerMap.has(value.trim().toLowerCase());
}

export function getCarMakerLabel(value: string) {
  return carMakerMap.get(value.trim().toLowerCase()) ?? value;
}

export const VEHICLE_TYPES = [
  { value: "sedan", label: "ملاكي (Sedan/Hatchback)" },
  { value: "suv", label: "4x4 / SUV" },
  { value: "truck", label: "نقل / فان (Truck/Van)" },
  { value: "other", label: "أخرى / Other" },
] as const;

export type VehicleTypeValue = (typeof VEHICLE_TYPES)[number]["value"];

const vehicleTypeMap = new Map(VEHICLE_TYPES.map((type) => [type.value, type.label]));

export function isKnownVehicleType(value: string) {
  return vehicleTypeMap.has(value.trim().toLowerCase());
}

export function getVehicleTypeLabel(value: string) {
  return vehicleTypeMap.get(value.trim().toLowerCase()) ?? value;
}

export const APPOINTMENT_STATUSES = [
  { value: "pending", label: "قيد المراجعة" },
  { value: "confirmed", label: "مؤكد" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
] as const;

export type AppointmentStatusValue = (typeof APPOINTMENT_STATUSES)[number]["value"];

const appointmentStatusMap = new Map(APPOINTMENT_STATUSES.map((status) => [status.value, status.label]));

export function isKnownAppointmentStatus(value: string) {
  return appointmentStatusMap.has(value.trim().toLowerCase());
}

export function getAppointmentStatusLabel(value: string) {
  return appointmentStatusMap.get(value.trim().toLowerCase()) ?? value;
}

export const CUSTOMER_CAR_STATUSES = [
  { value: "active", label: "نشطة" },
  { value: "archived", label: "مؤرشفة" },
] as const;

export type CustomerCarStatusValue = (typeof CUSTOMER_CAR_STATUSES)[number]["value"];

const customerCarStatusMap = new Map(CUSTOMER_CAR_STATUSES.map((status) => [status.value, status.label]));

export function isKnownCustomerCarStatus(value: string) {
  return customerCarStatusMap.has(value.trim().toLowerCase());
}

export const CAR_MEDIA_TYPES = [
  { value: "image", label: "صورة" },
  { value: "video", label: "فيديو" },
] as const;

export type CarMediaTypeValue = (typeof CAR_MEDIA_TYPES)[number]["value"];

const carMediaTypeMap = new Map(CAR_MEDIA_TYPES.map((type) => [type.value, type.label]));

export function isKnownCarMediaType(value: string) {
  return carMediaTypeMap.has(value.trim().toLowerCase());
}
