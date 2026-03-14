export const SERVICE_TYPES = [
  { value: "alignment_balancing", label: "ضبط زوايا وترصيص" },
  { value: "inspection", label: "فحص شامل" },
  { value: "steering_coding", label: "تكويد طارة" },
  { value: "suspension_repair", label: "إصلاح عفشة" },
  { value: "tire_service", label: "خدمة إطارات" },
  { value: "other", label: "أخرى" },
] as const;

export type ServiceTypeValue = (typeof SERVICE_TYPES)[number]["value"];
