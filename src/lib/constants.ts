export const SERVICE_TYPES = [
  { value: "alignment_balancing", label: "ضبط زوايا وترصيص" },
  { value: "inspection", label: "فحص شامل" },
  { value: "steering_coding", label: "تكويد طارة" },
  { value: "suspension_repair", label: "إصلاح عفشة" },
  { value: "tire_service", label: "خدمة إطارات" },
  { value: "other", label: "أخرى" },
] as const;

export type ServiceTypeValue = (typeof SERVICE_TYPES)[number]["value"];

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
