"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCarAction } from "../actions";
import { Plus, UploadCloud, X, Film, ImageIcon, Loader2 } from "lucide-react";

export default function NewCarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverImage, setCoverImage] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'video' | 'gallery') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploading(true);
    setErrorMsg("");

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 1. Get presigned URL
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });
        
        if (!res.ok) throw new Error("Failed to get upload URL");
        const { uploadUrl, publicUrl } = await res.json();

        // 2. Upload to Cloudflare R2
        const uploadRes = await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload to R2");

        // 3. Update state with public URL
        if (type === 'cover') {
          setCoverImage(publicUrl);
        } else if (type === 'video') {
          setVideoUrl(publicUrl);
        } else {
          setImages(prev => [...prev, publicUrl]);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    formData.set("coverImageUrl", coverImage);
    if (videoUrl) formData.set("videoUrl", videoUrl);
    formData.set("imagesJson", JSON.stringify(images));

    try {
      await createCarAction(formData);
      router.push("/admin/cars");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">إضافة سيارة جديدة</h1>
        <p className="mt-2 text-muted-foreground">
          ارفع صور وفيديو السيارة وتفاصيل الشغل اللي اتعمل فيها.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border bg-white p-6 shadow-sm">
        {errorMsg && (
          <div className="rounded border border-red-200 bg-red-50 p-4 font-semibold text-red-600">
            {errorMsg}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Title */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">اسم/نوع السيارة</label>
            <input
              name="title"
              required
              placeholder="مثال: BMW X6 M-Power"
              className="w-full rounded-md border p-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Service Type - Crucial for filtering */}
          <div className="space-y-2">
            <label className="text-sm font-medium">نوع الخدمة (للفلترة)</label>
            <select
              name="serviceType"
              required
              className="w-full rounded-md border p-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="inspection">فحص شامل</option>
              <option value="alignment">ترصيص وزوايا</option>
              <option value="steering">تكويد باور ستيرنج</option>
              <option value="all">شاملة</option>
            </select>
          </div>

          <div className="space-y-2 flex items-center pt-8">
             <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" className="size-5 accent-emerald-500" />
              <span className="font-medium">تمييز في الصفحة الرئيسية</span>
            </label>
          </div>

          {/* Description */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">تفاصيل الشغل (اختياري)</label>
            <textarea
              name="description"
              rows={4}
              placeholder="اكتب تفاصيل الشغل اللي تم على العربية..."
              className="w-full rounded-md border p-3 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Media Uploads */}
        <div className="space-y-6 rounded-lg bg-zinc-50 p-6 border">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ImageIcon className="size-5 text-emerald-500"/>
            الصور والفيديوهات
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Cover Image */}
            <div className="space-y-3">
              <label className="text-sm font-medium block">الصورة الرئيسية (الغلاف) *</label>
              {coverImage ? (
                <div className="relative aspect-video overflow-hidden rounded-lg border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImage} alt="Cover" className="object-cover w-full h-full" />
                  <button type="button" onClick={() => setCoverImage("")} className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600">
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-colors">
                  <UploadCloud className="size-8 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-600">رفع صورة</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'cover')} disabled={uploading} />
                </label>
              )}
            </div>

            {/* Video Upload */}
            <div className="space-y-3">
              <label className="text-sm font-medium block">فيديو العربية (اختياري)</label>
              {videoUrl ? (
                <div className="relative aspect-video overflow-hidden rounded-lg border bg-black flex items-center justify-center">
                  <Film className="size-8 text-white/50 absolute z-0" />
                  <video src={videoUrl} className="object-contain w-full h-full relative z-10" controls />
                  <button type="button" onClick={() => setVideoUrl("")} className="absolute right-2 top-2 z-20 rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600">
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-white hover:bg-zinc-50 transition-colors">
                  <Film className="size-8 text-zinc-400" />
                  <span className="text-sm font-medium text-zinc-600">رفع فيديو MP4</span>
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} disabled={uploading} />
                </label>
              )}
            </div>
            
            {/* Gallery Uploads */}
            <div className="space-y-3 md:col-span-2 pt-2 border-t">
              <label className="text-sm font-medium block">صور إضافية (معرض)</label>
              <div className="flex flex-wrap gap-4">
                {images.map((img, i) => (
                   <div key={i} className="relative size-24 overflow-hidden rounded-lg border">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={img} alt={`Gallery ${i}`} className="object-cover w-full h-full" />
                   <button type="button" onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 rounded-full bg-red-500/80 p-1 text-white hover:bg-red-600 backdrop-blur">
                     <X className="size-3" />
                   </button>
                 </div>
                ))}
                
                <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-zinc-300 bg-white hover:bg-zinc-50 transition-colors">
                  <Plus className="size-6 text-zinc-400" />
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFileUpload(e, 'gallery')} disabled={uploading} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
           <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md px-6 py-2.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
          >
            إلغاء
          </button>
          
          <button
            type="submit"
            disabled={loading || uploading || !coverImage}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-2.5 text-sm font-black text-zinc-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : "حفظ التجربة"}
          </button>
        </div>
      </form>
    </div>
  );
}
