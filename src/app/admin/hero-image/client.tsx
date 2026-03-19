"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { uploadToR2, deleteFromR2, resizeImage } from "@/lib/upload-utils";
import { updateHeroImage } from "./actions";
import { ImagePlus, Trash2, Loader2, Globe, Info } from "lucide-react";
import Image from "next/image";

interface HeroImageClientProps {
  initialImageUrl: string | null;
}

export function HeroImageClient({ initialImageUrl }: HeroImageClientProps) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("جاري رفع الصورة...");

    try {
      const optimizedBlob = await resizeImage(file);
      const url = await uploadToR2(optimizedBlob, `hero-image-${Date.now()}.webp`);
      setImageUrl(url);
      toast.success("تم رفع الصورة بنجاح", { id: toastId });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("فشل رفع الصورة", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemove() {
    if (imageUrl) {
      deleteFromR2(imageUrl);
      setImageUrl("");
    }
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateHeroImage(imageUrl);
      if (result.success) {
        toast.success("تم حفظ التغييرات بنجاح");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-cairo text-zinc-900 dark:text-white">إدارة صورة الهيرو</h1>
          <p className="text-muted-foreground mt-2 font-medium">تحكم في الصورة الرئيسية التي تظهر في واجهة الموقع</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-md shadow-xl rounded-4xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="w-5 h-5 text-emerald-500" />
                الصورة الرئيسية
              </CardTitle>
              <CardDescription>ارفع صورة عالية الجودة لضمان مظهر احترافي</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div 
                className={`relative aspect-video rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden group
                  ${imageUrl ? "border-emerald-500/20" : "border-border/50 hover:border-emerald-500/30 bg-muted/20"}`}
              >
                {imageUrl ? (
                  <>
                    <Image 
                      src={imageUrl} 
                      alt="Hero Preview" 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button variant="destructive" size="icon" className="rounded-2xl" onClick={handleRemove}>
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                    <div className="bg-emerald-500/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <ImagePlus className="w-8 h-8 text-emerald-500" />
                    </div>
                    <span className="font-bold text-zinc-600 dark:text-zinc-400">اضغط لرفع صورة</span>
                    <span className="text-xs text-muted-foreground mt-1">WebP, PNG, JPG (Max 5MB)</span>
                    <Input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      disabled={isUploading}
                    />
                  </label>
                )}
                
                {isUploading && (
                  <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center flex-col gap-3">
                    <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                    <span className="font-black text-emerald-600">جاري الرفع...</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-url">رابط الصورة المباشر</Label>
                <div className="flex gap-2">
                  <Input 
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="سيظهر الرابط هنا بعد الرفع..."
                    dir="ltr"
                    className="bg-muted/30 border-border/50 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-md shadow-lg rounded-4xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-500" />
                النشر والتحكم
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-bold">معلومة سريعة</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  هذه الصورة ستظهر فوراً لكل زوار الموقع بدلاً من الصورة الحالية. تأكد من أن الأبعاد مناسبة (16:9).
                </p>
              </div>

              <Button 
                onClick={handleSave} 
                disabled={isPending || isUploading || !imageUrl}
                className="w-full h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-lg transition-all hover:scale-[1.02] shadow-xl shadow-emerald-500/20 active:scale-95"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "حفظ التغييرات"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
