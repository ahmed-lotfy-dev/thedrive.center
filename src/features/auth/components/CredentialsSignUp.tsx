"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

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

export function CredentialsSignUp() {
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
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
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-sm font-black text-foreground/80">الاسم بالكامل</FormLabel>
              <FormControl>
                <Input placeholder="أحمد محمد" {...field} disabled={isLoading} className="h-11 rounded-2xl bg-white/50 dark:bg-black/30 border-border/40 focus:ring-emerald-500/20 shadow-sm" />
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
                <Input placeholder="example@mail.com" {...field} disabled={isLoading} className="h-11 rounded-2xl bg-white/50 dark:bg-black/30 border-border/40 focus:ring-emerald-500/20 shadow-sm" />
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
                  <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} className="h-11 rounded-2xl bg-white/50 dark:bg-black/30 border-border/40 focus:ring-emerald-500/20 shadow-sm" />
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
                  <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} className="h-11 rounded-2xl bg-white/50 dark:bg-black/30 border-border/40 focus:ring-emerald-500/20 shadow-sm" />
                </FormControl>
                <FormMessage className="text-[11px] font-bold" />
              </FormItem>
            )}
          />
        </div>
        <Button 
          className="w-full h-14 rounded-2xl bg-foreground hover:bg-foreground/90 text-background font-black text-lg shadow-xl shadow-foreground/5 transition-all active:scale-[0.98] mt-4 group cursor-pointer" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin size-5" /> : (
            <span className="flex items-center justify-center gap-2">
               إنـشـاء الـحسـاب
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
