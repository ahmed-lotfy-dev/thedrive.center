import "dotenv/config";
import { db } from "./index.js";
import { heroSlides, appointments } from "./schema.js";

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
  await safeDelete(heroSlides, "hero_slides");

  const slides = [
    {
      title: "ضبط زوايا وترصيص باحدث الاجهزة",
      description: "تشخيص دقيق وثبات افضل للعربية على الطريق.",
      imageUrl: "/hero-maintenance.png",
      linkUrl: "/book",
      buttonText: "احجز الان",
      order: 3,
      isActive: true,
    },
    {
      title: "فحص شامل قبل البيع والشراء",
      description: "تقرير واضح يساعدك تاخد قرارك بثقة.",
      imageUrl: "/hero-spare-parts.png",
      linkUrl: "/book",
      buttonText: "اطلب فحص",
      order: 2,
      isActive: true,
    },
    {
      title: "خدمة سريعة داخل المحلة الكبرى",
      description: "فريق فني محترف ومواعيد مرنة.",
      imageUrl: "/hero-water-filters.png",
      linkUrl: "/book",
      buttonText: "تواصل معنا",
      order: 1,
      isActive: true,
    },
  ];

  await db.insert(heroSlides).values(slides);

  const appts = [
    {
      guestName: "احمد محمد",
      guestPhone: "01001234567",
      guestEmail: "ahmed@example.com",
      serviceType: "ضبط زوايا",
      machineType: "sedan",
      date: new Date(Date.now() + 86400000),
      address: "المحلة الكبرى",
      status: "pending",
    },
    {
      guestName: "سارة علي",
      guestPhone: "01007654321",
      guestEmail: "sara@example.com",
      serviceType: "فحص شامل",
      machineType: "suv",
      date: new Date(Date.now() + 172800000),
      address: "المحلة الكبرى",
      status: "pending",
    },
  ];

  await db.insert(appointments).values(appts);

  console.log("MVP seed completed.");
  process.exit(0);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
