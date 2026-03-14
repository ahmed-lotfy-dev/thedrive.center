"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerCarSchema } from "../../schema";
import { addCustomerCarAction } from "../../actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Car, Hash, Palette, Calendar, Plus } from "lucide-react";
import { LicensePlateInput } from "@/components/shared/LicensePlateInput";

interface AddCarFormProps {
  onSuccess: (newCar: any) => void;
}

export function AddCarForm({ onSuccess }: AddCarFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(customerCarSchema),
    defaultValues: {
      make: "",
      model: "",
      plateNumber: "",
      year: new Date().getFullYear(),
      color: "",
    },
  });

  async function onSubmit(values: any) {
    setIsSubmitting(true);
    const result = await addCustomerCarAction(values);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("تم إضافة السيارة بنجاح");
      form.reset();
      onSuccess(result.data);
    } else {
      toast.error(result.error || "حدث خطأ أثناء إضافة السيارة");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2.5 mb-2.5 px-1">
                    <Car className="size-4 text-emerald-500/80" />
                    <FormLabel className="text-muted-foreground font-black uppercase text-[11px] tracking-[0.15em] font-sans">ماركة السيارة</FormLabel>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="BMW" 
                      {...field} 
                      className="bg-muted/50 border-border/50 rounded-2xl h-14 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all font-bold placeholder:text-muted-foreground/30 text-base cursor-text border-2" 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-400/80 mr-1 mt-1.5" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2.5 mb-2.5 px-1">
                    <Car className="size-4 text-emerald-500/80" />
                    <FormLabel className="text-muted-foreground font-black uppercase text-[11px] tracking-[0.15em] font-sans">موديل السيارة</FormLabel>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="X6 M" 
                      {...field} 
                      className="bg-muted/50 border-border/50 rounded-2xl h-14 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all font-bold placeholder:text-muted-foreground/30 text-base cursor-text border-2" 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-400/80 mr-1 mt-1.5" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="plateNumber"
            render={({ field }) => (
              <FormItem className="relative">
                <div className="flex items-center gap-2.5 mb-2.5 px-1">
                  <Hash className="size-4 text-emerald-500/80" />
                  <FormLabel className="text-muted-foreground font-black uppercase text-[11px] tracking-[0.15em] font-sans">رقم اللوحة</FormLabel>
                </div>
                <FormControl>
                  <LicensePlateInput 
                    value={field.value} 
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-400/80 text-center mt-2.5" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2.5 mb-2.5 px-1">
                    <Calendar className="size-4 text-emerald-500/80" />
                    <FormLabel className="text-muted-foreground font-black uppercase text-[11px] tracking-[0.15em] font-sans">السنة</FormLabel>
                  </div>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      value={field.value as number}
                      className="bg-muted/50 border-border/50 rounded-2xl h-14 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all font-bold text-base cursor-text border-2" 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-400/80 mr-1 mt-1.5" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2.5 mb-2.5 px-1">
                    <Palette className="size-4 text-emerald-500/80" />
                    <FormLabel className="text-muted-foreground font-black uppercase text-[11px] tracking-[0.15em] font-sans">اللون</FormLabel>
                  </div>
                  <FormControl>
                    <Input 
                      placeholder="أسود" 
                      {...field} 
                      className="bg-muted/50 border-border/50 rounded-2xl h-14 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/10 transition-all font-bold placeholder:text-muted-foreground/30 text-base cursor-text border-2" 
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-400/80 mr-1 mt-1.5" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl h-16 gap-3.5 shadow-[0_0_30px_rgba(16,185,129,0.25)] transition-all hover:shadow-[0_0_45px_rgba(16,185,129,0.4)] hover:scale-[1.01] active:scale-[0.98] border border-white/20 uppercase tracking-[0.2em] text-sm cursor-pointer shadow-emerald-500/20"
        >
          {isSubmitting ? (
            <Loader2 className="size-6 animate-spin" />
          ) : (
            <>
              <Plus className="size-6" />
              تسجيل السيارة في النظام
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
