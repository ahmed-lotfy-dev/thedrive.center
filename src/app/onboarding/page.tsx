import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Car } from "lucide-react";
import { OnboardingForm } from "./client-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إكمال البيانات",
  description: "أكمل بيانات سيارتك لتفعيل تجربتك داخل The Drive Center.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.onboarded) {
    redirect("/");
  }

  return (
    <main dir="rtl" className="min-h-screen bg-background relative flex flex-col items-center pt-28 md:pt-40 lg:pt-48 pb-20 px-4">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="bg-card dark:bg-zinc-900/40 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50">
          <div className="bg-linear-to-br from-emerald-500/90 via-emerald-600 to-zinc-900 p-10 text-white text-center relative overflow-hidden">
            {/* Glossy overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md mb-4 shadow-xl">
              <Car className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">أهلاً بك في The Drive</h1>
            <p className="text-emerald-50/90 text-lg">خطوة أخيرة لتخصيص تجربتك. برجاء إضافة بيانات سيارتك.</p>
          </div>

          <OnboardingForm />
        </div>
      </div>
    </main>
  );
}
