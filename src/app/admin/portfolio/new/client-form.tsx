"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LayoutGrid, Save, ArrowRight, Image as ImageIcon, Video, Info, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { createPortfolioEntry } from "../actions";
import { toast } from "sonner";
import { useState } from "react";
import { resizeImage, uploadToR2 } from "@/lib/upload-utils";
import { Loader2 } from "lucide-react";

export function PortfolioForm() {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, isGallery = false) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const toastId = toast.loading(isGallery ? "جاري رفع الصور..." : "جاري رفع الصورة الغلاف...");

    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // 1. Optimize
        const optimizedBlob = await resizeImage(file);
        // 2. Upload
        const url = await uploadToR2(optimizedBlob, file.name.replace(/\.[^/.]+$/, "") + ".webp");
        uploadedUrls.push(url);
      }

      if (isGallery) {
        setGalleryUrls(prev => [...prev, ...uploadedUrls]);
        toast.success("تم رفع الصور بنجاح", { id: toastId });
      } else {
        setCoverImageUrl(uploadedUrls[0]);
        toast.success("تم رفع الصورة الغلاف بنجاح", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("فشل رفع الصور", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleSubmit(formData: FormData) {
    // Inject the uploaded URLs manually since we replaced the inputs
    formData.set("coverImageUrl", coverImageUrl);
    formData.set("galleryUrls", galleryUrls.join(","));

    if (!coverImageUrl) {
      toast.error("يرجى رفع صورة الغلاف أولاً");
      return;
    }

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
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">إضافة عمل جديد للسجل</h1>
          <p className="text-zinc-500">قم بتوثيق خدمة جديدة لتظهر لعملائك في المعرض العام.</p>
        </div>
      </div>

      <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Info Card */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="rounded-4xl border-zinc-200/60 dark:border-zinc-800/60 shadow-xl shadow-zinc-200/20 dark:shadow-none bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <Info className="w-5 h-5 text-emerald-500" />
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
                    className="h-12 bg-white dark:bg-zinc-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceType">نوع الخدمة المقدمة</Label>
                  <Input 
                    id="serviceType" 
                    name="serviceType" 
                    placeholder="مثال: ضبط زوايا وترصيص" 
                    required 
                    className="h-12 bg-white dark:bg-zinc-900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">وصف العمل (تفاصيل الصيانة)</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="اشرح ما قمت به في هذه السيارة باختصار ليراه العميل..." 
                  className="min-h-[120px] bg-white dark:bg-zinc-900 resize-none"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-4xl border-zinc-200/60 dark:border-zinc-800/60 shadow-xl shadow-zinc-200/20 dark:shadow-none bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <ImageIcon className="w-5 h-5 text-emerald-500" />
                 روابط الصور والفيديو (R2 & Social)
              </CardTitle>
              <CardDescription>ضع روابط الصور التي قمت برفعها على Cloudflare R2.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="coverFile">صورة الغلاف (Cover Image)</Label>
                <div className="flex flex-col gap-4">
                   {coverImageUrl ? (
                     <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                        <img src={coverImageUrl} alt="Cover Preview" className="object-cover w-full h-full" />
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => setCoverImageUrl("")}
                          className="absolute top-2 right-2 rounded-full h-8 px-3 text-[10px]"
                        >
                          حذف
                        </Button>
                     </div>
                   ) : (
                     <div className="relative group">
                        <Input 
                          id="coverFile" 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e)}
                          disabled={isUploading}
                          className="hidden"
                        />
                        <Label 
                          htmlFor="coverFile"
                          className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer"
                        >
                          <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                          <span className="font-bold text-zinc-900 dark:text-white">اختر صورة الغلاف</span>
                          <span className="text-xs text-zinc-500 mt-2 text-center leading-relaxed">سيتم تقليل حجم الصورة تلقائياً للحفاظ على سرعة الموقع</span>
                        </Label>
                     </div>
                   )}
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="galleryFiles">صور إضافية (المعرض)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryUrls.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 group">
                       <img src={url} alt={`Gallery ${i}`} className="object-cover w-full h-full" />
                       <Button 
                          type="button" 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => setGalleryUrls(prev => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 h-6 w-6 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                    </div>
                  ))}
                  <div className="relative">
                    <Input 
                      id="galleryFiles" 
                      type="file" 
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <Label 
                      htmlFor="galleryFiles"
                      className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer"
                    >
                      <LayoutGrid className="w-6 h-6 text-zinc-400 mb-2" />
                      <span className="text-[10px] font-bold text-zinc-500">أضف صور</span>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="space-y-2">
                  <Label htmlFor="videoUrl" className="flex items-center gap-2">
                     <Video className="w-4 h-4 text-red-500" />
                     رابط فيديو (تيك توك، فيسبوك، أو يوتيوب)
                  </Label>
                  <Input 
                    id="videoUrl" 
                    name="videoUrl" 
                    placeholder="https://www.tiktok.com/@user/video/..." 
                    className="h-12 bg-white dark:bg-zinc-900"
                  />
                  <p className="text-xs text-zinc-500">سيظهر الفيديو في مشغل احترافي تلقائياً بمجرد وضع الرابط.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-4xl border-zinc-200/60 dark:border-zinc-800/60 shadow-xl shadow-zinc-200/20 dark:shadow-none bg-zinc-900 text-white">
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  النشر والمراجعة
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-sm text-zinc-400">عند الحفظ، سيتم إضافة هذا العمل فوراً إلى "سجل التميز" العام وسيتعرف عليه محرك بحث جوجل خلال دقائق.</p>
               
               <Button 
                 type="submit" 
                 disabled={isPending}
                 className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-lg transition-all active:scale-95 disabled:opacity-50"
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
