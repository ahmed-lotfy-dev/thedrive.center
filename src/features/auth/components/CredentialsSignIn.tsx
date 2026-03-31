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
import { toast } from "sonner";

const signInSchema = z.object({
  email: z.string({ message: "البريد الإلكتروني مطلوب" }).min(1, "البريد الإلكتروني مطلوب").email("البريد الإلكتروني غير صحيح"),
  password: z.string({ message: "كلمة المرور مطلوبة" }).min(1, "كلمة المرور مطلوبة"),
});

export function CredentialsSignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setIsLoading(true);
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: async () => {
          try {
            const sessionResponse = await fetch("/api/auth/get-session", {
              method: "GET",
              credentials: "include",
            });

            if (sessionResponse.ok) {
              const sessionData = (await sessionResponse.json()) as {
                user?: { role?: string };
              };

              const role = sessionData?.user?.role;
              if (role === "admin" || role === "owner") {
                window.location.href = "/admin";
                return;
              }
            }
          } catch {
            // Fallback to home if session check fails.
          }

          window.location.href = "/";
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-black text-foreground/80">البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input 
                  placeholder="example@mail.com" 
                  {...field} 
                  disabled={isLoading}
                  className="h-12 rounded-2xl bg-white/50 dark:bg-black/30 border-border/40 focus:ring-emerald-500/20 shadow-sm" 
                />
              </FormControl>
              <FormMessage className="text-[11px] font-bold" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-black text-foreground/80">كلمة المرور</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  disabled={isLoading}
                  className="h-12 rounded-2xl bg-white/50 dark:bg-black/30 border-border/40 focus:ring-emerald-500/20 shadow-sm" 
                />
              </FormControl>
              <FormMessage className="text-[11px] font-bold" />
            </FormItem>
          )}
        />
        <Button 
          className="w-full h-14 rounded-2xl bg-foreground hover:bg-foreground/90 text-background font-black text-lg shadow-xl shadow-foreground/5 transition-all active:scale-[0.98] mt-2 group cursor-pointer" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin size-5" /> : (
            <span className="flex items-center justify-center gap-2">
              ســجـل الـدخـول
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
