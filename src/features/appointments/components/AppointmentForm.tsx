"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Loader2, 
  CalendarIcon, 
  Wrench,
  User as UserIcon,
  Phone,
  Hash,
  Car
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createAppointment } from "@/server/actions/appointments";
import { authClient } from "@/lib/auth-client";
import { LicensePlateInput } from "@/components/shared/LicensePlateInput";
import { ServiceSelect } from "@/components/shared/ServiceSelect";
import { CAR_MAKERS, VEHICLE_TYPES } from "@/lib/constants";

const formSchema = z.object({
  guestName: z.string().min(1, "الاسم مطلوب"),
  guestEmail: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  guestPhone: z.string().min(10, "رقم الموبايل مطلوب"),
  plateNumber: z.string().min(1, "رقم اللوحة مطلوب"),
  serviceType: z.string().min(1, "نوع الخدمة مطلوب"),
  make: z.string().min(1, "ماركة السيارة مطلوبة"),
  machineType: z.string().min(1, "نوع العربية مطلوب"),
  date: z.date(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AppointmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = authClient.useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guestName: session?.user?.name || "",
      guestEmail: session?.user?.email || "",
      guestPhone: (session?.user as any)?.phone || "",
      plateNumber: searchParams.get("plate") || "",
      serviceType: searchParams.get("service") || "",
      make: searchParams.get("make") || "",
      machineType: searchParams.get("type") || "",
      notes: "",
    },
  });

  // Update form if session loads or params change
  useEffect(() => {
    if (session?.user) {
      form.setValue("guestName", session.user.name || "");
      form.setValue("guestEmail", session.user.email || "");
      if ((session.user as any).phone) {
        form.setValue("guestPhone", (session.user as any).phone);
      }
    }
  }, [session, form]);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const result = await createAppointment({
        ...values,
        date: values.date.toISOString(),
      });

      if (result.success) {
        toast.success(result.message || "تم إرسال الحجز");
        form.reset();
        router.refresh();
      } else {
        toast.error(result.error || "حصل خطأ أثناء إرسال الحجز");
      }
    } catch {
      toast.error("تعذر إرسال الطلب");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card p-8 rounded-2xl border shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Wrench className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-cairo">بيانات الحجز</h2>
              <p className="text-muted-foreground">املأ البيانات وسنتواصل معك لتأكيد الموعد</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="guestName"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon className="size-4 text-primary/80" />
                  <FormLabel className="font-bold text-xs uppercase tracking-wider">الاسم *</FormLabel>
                </div>
                <FormControl>
                  <Input 
                    placeholder="مثال: أحمد محمد" 
                    {...field} 
                    className="bg-muted/30 border-border/50 rounded-xl h-12 focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guestPhone"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="size-4 text-primary/80" />
                  <FormLabel className="font-bold text-xs uppercase tracking-wider">رقم الموبايل *</FormLabel>
                </div>
                <FormControl>
                  <Input 
                    placeholder="01012345678" 
                    dir="ltr" 
                    {...field} 
                    className="bg-muted/30 border-border/50 rounded-xl h-12 focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plateNumber"
            render={({ field }) => (
              <FormItem className="relative flex flex-col items-center sm:items-start md:col-span-2">
                <div className="flex items-center gap-2 mb-4 self-start">
                  <Hash className="size-4 text-primary/80" />
                  <FormLabel className="font-bold text-xs uppercase tracking-wider">رقم اللوحة *</FormLabel>
                </div>
                <FormControl>
                  <LicensePlateInput 
                    value={field.value} 
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription className="mt-2 text-center sm:text-right w-full text-[10px] uppercase tracking-widest text-zinc-500">رقم اللوحة يساعدنا في الوصول لسجل سيارتك</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="guestEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني (اختياري)</FormLabel>
              <FormControl>
                <Input placeholder="example@mail.com" type="email" dir="ltr" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2 mb-2">
                  <Car className="size-4 text-primary/80" />
                  <FormLabel className="font-bold text-xs uppercase tracking-wider">ماركة السيارة *</FormLabel>
                </div>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-muted/30 border-border/50 rounded-xl h-12">
                      <SelectValue placeholder="اختر ماركة السيارة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CAR_MAKERS.map((maker) => (
                      <SelectItem key={maker.value} value={maker.value}>
                        {maker.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="machineType"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="size-4 text-primary/80" />
                  <FormLabel className="font-bold text-xs uppercase tracking-wider">نوع العربية *</FormLabel>
                </div>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-muted/30 border-border/50 rounded-xl h-12">
                      <SelectValue placeholder="اختر نوع العربية" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {VEHICLE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-xs uppercase tracking-wider mb-2">نوع الخدمة *</FormLabel>
                <FormControl>
                  <ServiceSelect 
                    value={field.value} 
                    onValueChange={field.onChange}
                    className="h-12 bg-muted/30 border-border/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>تاريخ الموعد المطلوب *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn("w-full pl-3 text-right font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP", { locale: ar }) : <span>اختر التاريخ</span>}
                      <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    locale={ar}
                    dir="rtl"
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>المواعيد المتاحة تبدأ من تاريخ اليوم فقط.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ملاحظات إضافية (اختياري)</FormLabel>
              <FormControl>
                <Textarea placeholder="أي تفاصيل مهمة عن الحالة..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-start pt-4">
          <Button type="submit" disabled={isSubmitting} size="lg" className="gap-2">
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            تأكيد الحجز
          </Button>
        </div>
      </form>
    </Form>
  );
}
