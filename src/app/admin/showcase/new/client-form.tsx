"use client";

import { useTransition, useState } from "react";
import { toast } from "sonner";
import { resizeImage, uploadToR2, deleteFromR2 } from "@/lib/upload-utils";
import { createShowcaseEntry, updateShowcaseEntry } from "../actions";
import { ShowcaseCarWithMedia } from "@/types/showcase";
import { FormHeader } from "./_components/FormHeader";
import { BasicInfoCard } from "./_components/BasicInfoCard";
import { MediaCard } from "./_components/MediaCard";
import { PublishCard } from "./_components/PublishCard";

interface ShowcaseFormProps {
  initialData?: ShowcaseCarWithMedia;
}

export function ShowcaseForm({ initialData }: ShowcaseFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl || "");
  const [galleryUrls, setGalleryUrls] = useState<string[]>(
    initialData?.media?.map((m) => m.url) || []
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
        setGalleryUrls((prev) => [...prev, ...uploadedUrls]);
        toast.success("تم رفع الصور بنجاح", { id: toastId });
      } else {
        setCoverImageUrl(uploadedUrls[0]);
        toast.success("تم رفع الصورة الغلاف بنجاح", { id: toastId });
      }
    } catch {
      toast.error("فشل رفع الصور", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemoveCover() {
    deleteFromR2(coverImageUrl);
    setCoverImageUrl("");
  }

  function handleRemoveGalleryItem(index: number) {
    deleteFromR2(galleryUrls[index]);
    setGalleryUrls((prev) => prev.filter((_, idx) => idx !== index));
  }

  async function handleSubmit(formData: FormData) {
    formData.set("coverImageUrl", coverImageUrl);
    formData.set("galleryUrls", galleryUrls.join(","));

    if (!coverImageUrl) {
      toast.error("يرجى رفع صورة الغلاف أولاً");
      return;
    }

    startTransition(async () => {
      const result = isEdit
        ? await updateShowcaseEntry(initialData!.id, formData)
        : await createShowcaseEntry(formData);

      if (result?.error) {
        toast.error(typeof result.error === "string" ? result.error : "حدث خطأ أثناء حفظ البيانات");
      } else {
        toast.success(isEdit ? "تم تحديث البيانات بنجاح" : "تم إضافة العمل بنجاح");
      }
    });
  }

  return (
    <div dir="rtl" className="max-w-4xl mx-auto space-y-8">
      <FormHeader isEdit={isEdit} />

      <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <BasicInfoCard initialData={initialData} />

          <MediaCard
            coverImageUrl={coverImageUrl}
            galleryUrls={galleryUrls}
            isUploading={isUploading}
            initialData={initialData}
            onCoverUpload={(e) => handleFileUpload(e)}
            onGalleryUpload={(e) => handleFileUpload(e, true)}
            onRemoveCover={handleRemoveCover}
            onRemoveGalleryItem={handleRemoveGalleryItem}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <PublishCard isEdit={isEdit} isPending={isPending} isUploading={isUploading} />
        </div>
      </form>
    </div>
  );
}
