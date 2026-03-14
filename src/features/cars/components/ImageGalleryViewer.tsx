"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface CarMedia {
  id: string;
  url: string;
}

interface ImageGalleryViewerProps {
  images: CarMedia[];
  carTitle: string;
}

export function ImageGalleryViewer({ images, carTitle }: ImageGalleryViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleThumbnailClick = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const handleOpenLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  if (!images.length) return null;

  const activeImage = images[activeIndex];
  const lightboxImage = images[lightboxIndex];

  return (
    <div className="space-y-4">
      {/* Thumbnail Strip — appears first */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => handleThumbnailClick(idx)}
              className={`relative shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer snap-start ${
                idx === activeIndex
                  ? "border-emerald-500 shadow-lg shadow-emerald-500/30 scale-105"
                  : "border-zinc-200/60 dark:border-zinc-700/60 opacity-60 hover:opacity-100 hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
            >
              <Image
                src={img.url}
                alt={`${carTitle} - صورة ${idx + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Active (Large) Image — appears after thumbnails */}
      <div
        className="relative w-full aspect-video rounded-3xl overflow-hidden border border-zinc-200/60 dark:border-zinc-800/60 shadow-xl cursor-zoom-in group"
        onClick={() => handleOpenLightbox(activeIndex)}
      >
        <Image
          key={activeImage.id}
          src={activeImage.url}
          alt={`${carTitle} - صورة رئيسية`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 60vw"
          priority
        />
        <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/20 transition-colors duration-300" />
        <div className="absolute bottom-4 left-4 bg-zinc-950/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ZoomIn className="w-3.5 h-3.5" />
          انقر للتكبير
        </div>
        <div className="absolute top-4 left-4 bg-zinc-950/60 backdrop-blur-md text-white/70 text-xs px-3 py-1 rounded-xl font-bold">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-[95vw] w-full">
          <DialogTitle className="sr-only">{`${carTitle} - صورة ${lightboxIndex + 1}`}</DialogTitle>

          <div className="relative w-full" style={{ height: "85vh" }}>
            <Image
              key={lightboxImage.id}
              src={lightboxImage.url}
              alt={`${carTitle} - صورة ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="95vw"
              priority
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-900/70 hover:bg-zinc-800 backdrop-blur-md text-white rounded-full p-3 transition-all hover:scale-110 cursor-pointer border border-white/10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-zinc-900/70 hover:bg-zinc-800 backdrop-blur-md text-white rounded-full p-3 transition-all hover:scale-110 cursor-pointer border border-white/10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-950/60 backdrop-blur-md text-white/80 text-xs font-bold px-4 py-2 rounded-full">
              {lightboxIndex + 1} / {images.length}
            </div>
          </div>

          {/* Lightbox Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 justify-center mt-3 overflow-x-auto pb-1 px-4">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setLightboxIndex(idx)}
                  className={`relative shrink-0 w-14 h-10 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                    idx === lightboxIndex
                      ? "border-emerald-500 scale-110"
                      : "border-white/20 opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`thumb ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
