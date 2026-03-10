import type { Metadata } from "next";
import { AppointmentForm } from "@/features/appointments/components/AppointmentForm";

export const metadata: Metadata = {
  title: "احجز موعدك",
  description: "احجز كشف أو خدمة ضبط زوايا وترصيص في مركز The Drive بالمحلة الكبرى.",
  alternates: {
    canonical: "/book",
  },
};

export default function BookPage() {
  return (
    <main className="min-h-screen pt-28 pb-16">
      <section className="container mx-auto px-4" data-animate>
        <div className="surface-soft p-8 md:p-10 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-balance">احجز ميعادك في أقل من دقيقة</h1>
          <p className="mt-4 text-muted-foreground text-lg">
            اختار نوع الخدمة والميعاد المناسب، وفريقنا هيتواصل معاك لتأكيد الحجز.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 mt-10" data-animate>
        <div className="max-w-3xl mx-auto">
          <AppointmentForm />
        </div>
      </section>
    </main>
  );
}
