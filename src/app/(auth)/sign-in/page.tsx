"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { SignInForm } from "@/features/auth/components/SignInForm";
import { SignUpForm } from "@/features/auth/components/SignUpForm";
import { CheckCircle2, ShieldCheck, Sparkles, Wrench } from "lucide-react";

export default function AuthPage() {
  const [view, setView] = useState<"signin" | "signup">("signin");

  return (
    <main dir="rtl" className="relative min-h-screen flex items-start justify-center p-4 overflow-hidden bg-background">
      {/* Advanced Ambient Background - Matched with Landing Hero */}
      <div className="absolute inset-0 bg-background -z-20" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] -z-20" />
      
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-5%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 dark:bg-emerald-500/20 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 dark:bg-emerald-500/20 blur-[130px] rounded-full" />
      </div>

      <div className="w-full max-w-md relative pt-32 md:pt-48 pb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Glow effect behind card */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-500/20 blur-3xl rounded-[3rem] -z-10 opacity-60" />

        <div className="relative">
          <Card className="w-full bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-white/40 dark:border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)] rounded-[2.5rem] overflow-hidden select-none">
            {view === "signin" ? (
              <SignInForm onSwitch={() => setView("signup")} />
            ) : (
              <SignUpForm onSwitch={() => setView("signin")} />
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
