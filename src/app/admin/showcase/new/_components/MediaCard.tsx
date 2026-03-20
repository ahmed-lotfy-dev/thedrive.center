"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Video, LayoutGrid, X } from "lucide-react";
import { ShowcaseCarWithMedia } from "@/types/showcase";
import Image from "next/image";

interface MediaCardProps {
  coverImageUrl: string;
  galleryUrls: string[];
  isUploading: boolean;
  initialData?: ShowcaseCarWithMedia;
  onCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveCover: () => void;
  onRemoveGalleryItem: (index: number) => void;
}

export function MediaCard({
  coverImageUrl,
  galleryUrls,
  isUploading,
  initialData,
  onCoverUpload,
  onGalleryUpload,
  onRemoveCover,
  onRemoveGalleryItem,
}: MediaCardProps) {
  return (
    <Card className="rounded-4xl border-zinc-200/60 dark:border-zinc-800/60 shadow-xl shadow-zinc-200/20 dark:shadow-none bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ImageIcon className="w-5 h-5 text-emerald-500" />
          الوسائط (الصور والفيديو)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <CoverImageSection
          coverImageUrl={coverImageUrl}
          isUploading={isUploading}
          onUpload={onCoverUpload}
          onRemove={onRemoveCover}
        />

        <GallerySection
          galleryUrls={galleryUrls}
          isUploading={isUploading}
          onUpload={onGalleryUpload}
          onRemove={onRemoveGalleryItem}
        />

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
  );
}

function CoverImageSection({
  coverImageUrl,
  isUploading,
  onUpload,
  onRemove,
}: {
  coverImageUrl: string;
  isUploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="space-y-4">
      <Label>صورة الغلاف (Cover Image)</Label>
      {coverImageUrl ? (
        <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
          <Image
            src={coverImageUrl}
            alt="Cover Preview"
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={onRemove}
            className="absolute top-2 right-2 rounded-xl z-10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <>
          <Input
            id="coverFile"
            type="file"
            accept="image/*"
            onChange={onUpload}
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
        </>
      )}
    </div>
  );
}

function GallerySection({
  galleryUrls,
  isUploading,
  onUpload,
  onRemove,
}: {
  galleryUrls: string[];
  isUploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="space-y-4">
      <Label>معرض الصور (Gallery)</Label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {galleryUrls.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <Image
              src={url}
              alt={`Gallery ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 h-6 w-6 rounded-lg z-10"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <>
          <Input
            id="galleryFiles"
            type="file"
            multiple
            accept="image/*"
            onChange={onUpload}
            disabled={isUploading}
            className="hidden"
          />
          <Label
            htmlFor="galleryFiles"
            className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer"
          >
            <LayoutGrid className="w-6 h-6 text-zinc-400" />
          </Label>
        </>
      </div>
    </div>
  );
}
