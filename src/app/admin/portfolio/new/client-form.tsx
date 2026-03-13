"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LayoutGrid, Save, ArrowRight, Image as ImageIcon, Video, Info, Sparkles, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { createPortfolioEntry, updatePortfolioEntry } from "../actions";
import { toast } from "sonner";
import { resizeImage, uploadToR2 } from "@/lib/upload-utils";
import { PortfolioCarWithMedia } from "@/types/portfolio";

interface PortfolioFormProps {
  initialData?: PortfolioCarWithMedia;
}

export function PortfolioForm({ initialData }: PortfolioFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl || "");
  const [galleryUrls, setGalleryUrls] = useState<string[]>(
    initialData?.media?.map(m => m.url) || []
  );
  
  const isEdit = !!initialData;

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, isGallery = false) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const toastId = toast.loading(isGallery ? "جاري رفع الصور..." : "جاري رفع الصورة الغلاف...");

    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const optimizedBlob = await resizeImage(file);
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
    formData.set("coverImageUrl", coverImageUrl);
    formData.set("galleryUrls", galleryUrls.join(","));

    if (!coverImageUrl) {
      toast.error("يرجى رفع صورة الغلاف أولاً");
      return;
    }

    startTransition(async () => {
      let result;
      if (isEdit) {
        result = await updatePortfolioEntry(initialData!.id, formData);
      } else {
        result = await createPortfolioEntry(formData);
      }
      
      if (result?.error) {
        toast.error(typeof result.error === 'string' ? result.error : "حدث خطأ أثناء حفظ البيانات");
      } else {
        toast.success(isEdit ? "تم تحديث البيانات بنجاح" : "تم إضافة العمل بنجاح");
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
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
            {isEdit ? "تعديل بيانات العمل" : "إضافة عمل جديد للسجل"}
          </h1>
          <p className="text-zinc-500 text-sm md:text-base">
            {isEdit ? "قم بتحديث تفاصيل العمل والخدمة المقدمة." : "قم بتوثيق خدمة جديدة لتظهر لعملائك في المعرض العام."}
          </p>
        </div>
      </div>

      <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
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
                  <Input 
                    id="serviceType" 
                    name="serviceType" 
                    defaultValue={initialData?.serviceType}
                    placeholder="مثال: ضبط زوايا وترصيص" 
                    required 
                    className="h-12 bg-white dark:bg-zinc-900 rounded-xl"
                  />
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

          <Card className="rounded-4xl border-zinc-200/60 dark:border-zinc-800/60 shadow-xl shadow-zinc-200/20 dark:shadow-none bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                 <ImageIcon className="w-5 h-5 text-emerald-500" />
                 الوسائط (الصور والفيديو)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>صورة الغلاف (Cover Image)</Label>
                <div className="flex flex-col gap-4">
                  {coverImageUrl ? (
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 group">
                      <img src={coverImageUrl} alt="Cover Preview" className="object-cover w-full h-full" />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        onClick={() => setCoverImageUrl("")}
                        className="absolute top-2 right-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
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
                        className="flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer"
                      >
                        <ImageIcon className="w-8 h-8 text-emerald-500 mb-4" />
                        <span className="font-bold text-zinc-900 dark:text-white">اختر صورة الغلاف</span>
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label>معرض الصور (Gallery)</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                      <LayoutGrid className="w-6 h-6 text-zinc-400" />
                    </Label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                <Label htmlFor="videoUrl" className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-500" />
                  رابط فيديو (TikTok/YouTube/FB)
                </Label>
                <Input 
                  id="videoUrl" 
                  name="videoUrl" 
                  defaultValue={initialData?.videoUrl || ""}
                  placeholder="ضع الرابط هنا..." 
                  className="h-12 bg-white dark:bg-zinc-900 rounded-xl"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-4xl border-zinc-200/60 dark:border-zinc-800/60 shadow-xl shadow-zinc-200/20 dark:shadow-none bg-zinc-900 text-white sticky top-24">
            <CardHeader>
               <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  النشر والمراجعة
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-sm text-zinc-400 leading-relaxed">
                 عند الحفظ، سيتم {isEdit ? "تحديث" : "إضافة"} هذا العمل فوراً وسيتعرف عليه محرك بحث جوجل لضمان وصول العملاء إليك.
               </p>
               
               <Button 
                 type="submit" 
                 disabled={isPending || isUploading}
                 className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-lg transition-all active:scale-95 disabled:opacity-50"
               >
                 {isPending ? (
                   <>
                     <Loader2 className="ml-2 w-5 h-5 animate-spin" />
                     جاري الحفظ...
                   </>
                 ) : (
                   <>
                     <Save className="ml-2 w-5 h-5" />
                     {isEdit ? "حفظ التعديلات" : "حفظ العمل الآن"}
                   </>
                 )}
               </Button>
               
               <Button asChild variant="outline" className="w-full h-12 rounded-2xl border-white/10 hover:bg-white/10 text-white">
                  <Link href="/admin/portfolio">إلغاء</Link>
               </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
