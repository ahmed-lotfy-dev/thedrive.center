"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VideoEmbedProps {
  url: string;
  title?: string;
}

export function VideoEmbed({ url, title }: VideoEmbedProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [platform, setPlatform] = useState<"tiktok" | "facebook" | "youtube" | "unknown">("unknown");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!url) return;

    // Detect platform
    if (url.includes("tiktok.com")) {
      setPlatform("tiktok");
      // Extract video ID from tiktok URL
      const tiktokId = url.split("/video/")[1]?.split("?")[0];
      if (tiktokId) {
        setEmbedUrl(`https://www.tiktok.com/embed/v2/${tiktokId}`);
      }
    } else if (url.includes("facebook.com") || url.includes("fb.watch")) {
      setPlatform("facebook");
      setEmbedUrl(`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`);
    } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
      setPlatform("youtube");
      let ytId = "";
      if (url.includes("youtube.com/watch")) {
        ytId = new URL(url).searchParams.get("v") || "";
      } else if (url.includes("youtu.be")) {
        ytId = url.split("/").pop() || "";
      }
      if (ytId) {
        setEmbedUrl(`https://www.youtube.com/embed/${ytId}`);
      }
    } else {
      setPlatform("unknown");
    }
    setIsLoading(false);
  }, [url]);

  if (!url) return null;

  if (platform === "unknown") {
    return (
      <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>رابط فيديو غير مدعوم</AlertTitle>
        <AlertDescription>
          يدعم الموقع حالياً روابط تيك توك، فيسبوك، ويوتيوب فقط.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800">
      {isLoading && <Skeleton className="absolute inset-0 z-10 w-full h-full" />}
      
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title || "فيديو من ذا درايف"}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center text-slate-500">
          <AlertCircle className="w-10 h-10 mb-2 opacity-20" />
          <p className="text-sm">لم نتمكن من معالجة رابط الفيديو</p>
        </div>
      )}
    </div>
  );
}
