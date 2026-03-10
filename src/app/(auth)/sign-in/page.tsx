"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SignInForm } from "@/features/auth/components/SignInForm";
import { SignUpForm } from "@/features/auth/components/SignUpForm";
import { CheckCircle2, ShieldCheck, Wrench } from "lucide-react";

export default function AuthPage() {
  const [view, setView] = useState<"signin" | "signup">("signin");

  return (
    <main className="hero-minimal mesh-fade min-h-screen pt-28 pb-14 px-4">
      <div className="container mx-auto">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] items-stretch">
          <section className="surface-soft p-8 md:p-10 hidden lg:flex flex-col justify-between">
            <div>
              <p className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground">
                The Drive Center
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-balance">
                دخول سريع لمتابعة حجوزاتك وخدمات عربيتك
              </h1>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                نفس جودة تصميم الموقع الرئيسي، مع تجربة دخول واضحة وسهلة على الموبايل والديسكتوب.
              </p>
            </div>

            <div className="mt-8 grid gap-3 text-sm">
              <p className="surface p-3 inline-flex items-center gap-2">
                <Wrench className="size-4 text-accent" />
                متابعة مواعيد الحجز والحالة
              </p>
              <p className="surface p-3 inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-accent" />
                حساب آمن وصلاحيات واضحة
              </p>
              <p className="surface p-3 inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-accent" />
                جاهز لربط الحساب بالعربيات قريبًا
              </p>
            </div>
          </section>

          <section className="flex items-center justify-center">
            <Card className="w-full max-w-md surface shadow-sm">
              {view === "signin" ? (
                <SignInForm onSwitch={() => setView("signup")} />
              ) : (
                <SignUpForm onSwitch={() => setView("signin")} />
              )}
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
