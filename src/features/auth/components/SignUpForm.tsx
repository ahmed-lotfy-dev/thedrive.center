"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const signUpSchema = z
  .object({
    name: z.string({ message: "الاسم مطلوب" }).min(2, "الاسم قصير جدا"),
    email: z.string({ message: "البريد الإلكتروني مطلوب" }).min(1, "البريد الإلكتروني مطلوب").email("البريد الإلكتروني غير صحيح"),
    password: z.string({ message: "كلمة المرور مطلوبة" }).min(8, "كلمة المرور لازم تكون 8 أحرف على الأقل"),
    confirmPassword: z.string({ message: "تأكيد كلمة المرور مطلوب" }).min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

interface SignUpFormProps {
  onSwitch: () => void;
}

export function SignUpForm({ onSwitch }: SignUpFormProps) {
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    setIsEmailLoading(true);
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
      },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
        onError: (ctx) => {
          alert(ctx.error.message);
          setIsEmailLoading(false);
        },
      }
    );
  };

  return (
    <>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-4xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-l from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">إنـشـاء حـسـاب</CardTitle>
      </CardHeader>
      
      <CardContent className="px-6 md:px-10 pb-8 space-y-8">
        {/* Social Part */}
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full h-14 rounded-2xl border-cyan-500/30 hover:bg-cyan-500/5 hover:border-cyan-500 transition-all flex items-center justify-center gap-4 text-lg font-bold group bg-white/5 dark:bg-black/20 backdrop-blur-sm shadow-lg shadow-cyan-500/5"
            onClick={async () => {
              setIsSocialLoading(true);
              await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
              });
            }}
            disabled={isSocialLoading || isEmailLoading}
          >
            {isSocialLoading ? <Loader2 className="animate-spin size-6" /> : (
              <svg className="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            متابعة بواسطة جوجل
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
           <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/40" />
           </div>
           <div className="relative flex justify-center uppercase">
              <span className="bg-white/40 dark:bg-black/40 backdrop-blur-xl px-4 text-xs font-black text-muted-foreground tracking-widest">أو</span>
           </div>
        </div>

        {/* Form Part */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-black text-foreground/80">الاسم بالكامل</FormLabel>
                  <FormControl>
                    <Input placeholder="أحمد محمد" {...field} className="h-11 rounded-2xl bg-white/50 dark:bg-black/30 border-border/40 focus:ring-emerald-500/20 shadow-sm" />
                  </FormControl>
                  <FormMessage className="text-[11px] font-bold" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-black text-foreground/80">البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input placeholder="example@mail.com" {...field} className="h-11 rounded-2xl bg-white/50 dark:bg-black/30 border-border/40 focus:ring-emerald-500/20 shadow-sm" />
                  </FormControl>
                  <FormMessage className="text-[11px] font-bold" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-black text-foreground/80">كلمة المرور</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="h-11 rounded-2xl bg-white/50 dark:bg-black/30 border-border/40 focus:ring-emerald-500/20 shadow-sm" />
                    </FormControl>
                    <FormMessage className="text-[11px] font-bold" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-black text-foreground/80">تأكيد الكلمة</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="h-11 rounded-2xl bg-white/50 dark:bg-black/30 border-border/40 focus:ring-emerald-500/20 shadow-sm" />
                    </FormControl>
                    <FormMessage className="text-[11px] font-bold" />
                  </FormItem>
                )}
              />
            </div>
            <Button 
              className="w-full h-14 rounded-2xl bg-foreground hover:bg-foreground/90 text-background font-black text-lg shadow-xl shadow-foreground/5 transition-all active:scale-[0.98] mt-4 group" 
              type="submit" 
              disabled={isSocialLoading || isEmailLoading}
            >
              {isEmailLoading ? <Loader2 className="animate-spin size-5" /> : (
                <span className="flex items-center justify-center gap-2">
                   إنـشـاء الـحسـاب
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex flex-col items-center gap-4 py-6 border-t border-border/40 bg-slate-50/30 dark:bg-slate-900/30">
        <Button variant="link" onClick={onSwitch} className="text-muted-foreground hover:text-cyan-500 transition-colors font-bold text-base">
          عندك حساب بالفعل؟ سجل دخولك من هنا
        </Button>
      </CardFooter>
    </>
  );
}
