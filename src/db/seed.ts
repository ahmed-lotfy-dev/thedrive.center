import "dotenv/config";
import { db } from "./index.js";
import { appointments, user, advices } from "./schema.js";
import { eq } from "drizzle-orm";
import type { AppointmentStatusValue, ServiceTypeValue, VehicleTypeValue } from "@/lib/constants";

const main = async () => {
  console.log("Seeding service-center MVP database...");

  async function safeDelete(table: unknown, name: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.delete(table as any);
      console.log(`Cleared ${name}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("does not exist") || msg.includes("42P01")) {
        console.warn(`Skipping delete ${name}: table does not exist`);
      } else {
        throw err;
      }
    }
  }

  await safeDelete(appointments, "appointments");

  const appts = [
    {
      guestName: "احمد محمد",
      guestPhone: "01001234567",
      guestEmail: "ahmed@example.com",
      serviceType: "alignment_balancing" as ServiceTypeValue,
      vehicleType: "sedan" as VehicleTypeValue,
      date: new Date(Date.now() + 86400000),
      status: "pending" as AppointmentStatusValue,
    },
    {
      guestName: "سارة علي",
      guestPhone: "01007654321",
      guestEmail: "sara@example.com",
      serviceType: "inspection" as ServiceTypeValue,
      vehicleType: "suv" as VehicleTypeValue,
      date: new Date(Date.now() + 172800000),
      status: "pending" as AppointmentStatusValue,
    },
  ];

  await db.insert(appointments).values(appts);

  // --- Initial Advices ---
  console.log("Seeding common car tips from workshop signage...");
  await db.insert(advices).values([
    { content: "ضبط زوايا: لازم كل ٣ شهور لضمان ثبات العربية وإطالة عمر الكاوتش." },
    { content: "ضبط زوايا: هيوفر لك لحد ١٠٪ من استهلاك البنزين وبيحافظ على العفشة." },
    { content: "ترصيص: لو حسيت برعشة أو هزة في الطارة، لازم تعمل ترصيص فوراً للحفاظ على أجزاء العفشة." },
    { content: "ترصيص: ضروري جداً عند تغيير أو لحام الكاوتش لضمان راحة القيادة وحماية جسم العربية من الشروخ." },
    { content: "تأكد من مراجعة ضغط الإطارات بانتظام، خاصة قبل السفر الطويل." },
    { content: "تغيير زيت الفرامل كل سنتين ضروري جداً للحفاظ على كفاءة الفرامل وسلامتك." },
  ]);

  // --- Ensure Admin User ---
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (!ADMIN_EMAIL) {
    console.warn("ADMIN_EMAIL not set in .env, skipping admin role check.");
  } else {
    console.log(`Checking for admin user: ${ADMIN_EMAIL}`);
    
    const [existingAdmin] = await db
      .select()
      .from(user)
      .where(eq(user.email, ADMIN_EMAIL))
      .limit(1);

    if (existingAdmin) {
      console.log("Admin user found, updating role...");
      await db
        .update(user)
        .set({ role: "admin" })
        .where(eq(user.id, existingAdmin.id));
    } else {
      console.log("Admin user not found in DB. Better Auth will create it on first login.");
    }
  }

  console.log("MVP seed completed.");
  process.exit(0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
