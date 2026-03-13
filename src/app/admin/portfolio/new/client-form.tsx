"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LayoutGrid, Save, ArrowRight, Image as ImageIcon, Video, Info, Sparkles } from "lucide-react";
import Link from "next/link";
import { createPortfolioEntry } from "../actions";
import { toast } from "sonner";

export function PortfolioForm() {
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createPortfolioEntry(formData);
      if (result?.error) {
        toast.error("حدث خطأ أثناء حفظ البيانات");
      } else {
        toast.success("تم إضافة العمل بنجاح");
      }
    });
  }

  return (
    <div dir="rtl" className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-full">
          <Link href="/admin/portfolio">
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">إضافة عمل جديد للسجل</h1>
          <p className="text-slate-500">قم بتوثيق خدمة جديدة لتظهر لعملائك في المعرض العام.</p>
        </div>
      </div>

      <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Info Card */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="rounded-4xl border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <Info className="w-5 h-5 text-blue-500" />
                 البيانات الأساسية
              </CardTitle>
              <CardDescription>هذه المعلومات ستظهر كعنوان ووصف في الصفحة العامة.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">اسم السيارة / الموديل</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="مثال: BMW X6 M-Power 2024" 
                    required 
                    className="h-12 bg-white dark:bg-slate-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceType">نوع الخدمة المقدمة</Label>
                  <Input 
                    id="serviceType" 
                    name="serviceType" 
                    placeholder="مثال: ضبط زوايا وترصيص" 
                    required 
                    className="h-12 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف العمل (تفاصيل الصيانة)</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="اشرح ما قمت به في هذه السيارة باختصار ليراه العميل..." 
                  className="min-h-[120px] bg-white dark:bg-slate-900 resize-none"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-4xl border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <ImageIcon className="w-5 h-5 text-emerald-500" />
                 روابط الصور والفيديو (R2 & Social)
              </CardTitle>
              <CardDescription>ضع روابط الصور التي قمت برفعها على Cloudflare R2.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="coverImageUrl">رابط الصورة الرئيسية (Cover Image)</Label>
                <Input 
                  id="coverImageUrl" 
                  name="coverImageUrl" 
                  placeholder="https://r2.your-domain.com/car-cover.webp" 
                  required 
                  className="h-12 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="galleryUrls">روابط الصور الإضافية (مفصولة بفاصلة ,)</Label>
                <Textarea 
                  id="galleryUrls" 
                  name="galleryUrls" 
                  placeholder="link1.webp, link2.webp, link3.webp" 
                  className="min-h-[80px] bg-white dark:bg-slate-900 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl" className="flex items-center gap-2">
                     <Video className="w-4 h-4 text-red-500" />
                     رابط فيديو (تيك توك، فيسبوك، أو يوتيوب)
                  </Label>
                  <Input 
                    id="videoUrl" 
                    name="videoUrl" 
                    placeholder="https://www.tiktok.com/@user/video/..." 
                    className="h-12 bg-white dark:bg-slate-900"
                  />
                  <p className="text-xs text-slate-500">سيظهر الفيديو في مشغل احترافي تلقائياً بمجرد وضع الرابط.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-4xl border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/20 dark:shadow-none bg-slate-900 text-white">
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  النشر والمراجعة
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-sm text-slate-400">عند الحفظ، سيتم إضافة هذا العمل فوراً إلى "سجل التميز" العام وسيتعرف عليه محرك بحث جوجل خلال دقائق.</p>
               
               <Button 
                 type="submit" 
                 disabled={isPending}
                 className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg transition-all active:scale-95 disabled:opacity-50"
               >
                 {isPending ? "جاري الحفظ..." : (
                   <>
                     <Save className="ml-2 w-5 h-5" />
                     حفظ العمل الآن
                   </>
                 )}
               </Button>
               
               <Button asChild variant="outline" className="w-full h-12 rounded-2xl border-white/10 hover:bg-white/10 text-white">
                  <Link href="/dashboard/portfolio">إلغاء</Link>
               </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
