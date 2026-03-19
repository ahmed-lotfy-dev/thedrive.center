"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { SERVICE_TYPES } from "@/lib/constants";
import { ShowcaseCarWithMedia } from "@/types/showcase";

interface BasicInfoCardProps {
  initialData?: ShowcaseCarWithMedia;
}

export function BasicInfoCard({ initialData }: BasicInfoCardProps) {
  return (
    <Card className="rounded-4xl border-zinc-200/60 dark:border-zinc-800/60 shadow-xl shadow-zinc-200/20 dark:shadow-none bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="w-5 h-5 text-emerald-500" />
          البيانات الأساسية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">اسم السيارة / الموديل</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialData?.title}
              placeholder="مثال: BMW X6 M-Power 2024"
              required
              className="h-12 bg-white dark:bg-zinc-900 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serviceType">نوع الخدمة المقدمة</Label>
            <Select name="serviceType" defaultValue={initialData?.serviceType || "alignment_balancing"} required>
              <SelectTrigger className="h-12 bg-white dark:bg-zinc-900 rounded-xl">
                <SelectValue placeholder="اختر نوع الخدمة" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">وصف العمل (تفاصيل الصيانة)</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={initialData?.description || ""}
            placeholder="اشرح ما قمت به في هذه السيارة باختصار ليراه العميل..."
            className="min-h-[120px] bg-white dark:bg-zinc-900 resize-none rounded-xl"
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
