"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const signInSchema = z.object({
  email: z.string({ message: "البريد الإلكتروني مطلوب" }).min(1, "البريد الإلكتروني مطلوب").email("البريد الإلكتروني غير صحيح"),
  password: z.string({ message: "كلمة المرور مطلوبة" }).min(1, "كلمة المرور مطلوبة"),
});

interface SignInFormProps {
  onSwitch: () => void;
}

export function SignInForm({ onSwitch }: SignInFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setLoading(true);
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
          alert(ctx.error.message);
          setLoading(false);
        },
      }
    );
  };

  return (
    <>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold font-cairo text-primary">تسجيل الدخول</CardTitle>
        <CardDescription>أهلا بيك، سجل دخولك للمتابعة</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input placeholder="example@mail.com" {...field} className="text-right" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="اكتب كلمة المرور" {...field} className="text-right" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "دخول"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="link" onClick={onSwitch} className="text-muted-foreground">
          ماعندكش حساب؟ اعمل حساب جديد
        </Button>
      </CardFooter>
    </>
  );
}
