"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTheme } from "next-themes";

interface VideoEmbedProps {
  url: string;
  title?: string;
}

type Platform = "tiktok" | "facebook" | "youtube" | "unknown";

function parsePlatform(url: string): { platform: Platform; embedUrl?: string; videoId?: string } {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("tiktok.com")) {
      const match = url.match(/video\/(\d+)/);
      return { platform: "tiktok", videoId: match?.[1] };
    }

    if (parsed.hostname.includes("facebook.com") || parsed.hostname.includes("fb.watch")) {
      return {
        platform: "facebook",
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=100%`,
      };
    }

    if (parsed.hostname.includes("youtube.com") || parsed.hostname.includes("youtu.be")) {
      const id = parsed.hostname.includes("youtu.be")
        ? parsed.pathname.replace("/", "")
        : parsed.searchParams.get("v") || "";
      return { platform: "youtube", embedUrl: `https://www.youtube.com/embed/${id}` };
    }
  } catch {
  }
  return { platform: "unknown" };
}

function TikTokEmbed({ url, videoId }: { url: string; videoId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = containerRef.current;
    if (!el) return;

    // Remove existing script to force re-render with new theme if needed
    const scriptId = "tiktok-embed-script";
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const s = document.getElementById(scriptId);
      if (s) s.remove();
    };
  }, [videoId, theme, mounted]);

  // Use a stable theme for SSR to avoid hydration mismatch
  // Since the app forces dark theme, we'll use "dark" as the stable default
  const resolvedTheme = mounted ? (theme === "dark" ? "dark" : "light") : "dark";

  return (
    <div 
      ref={containerRef} 
      className="w-full flex justify-center min-h-[580px] bg-zinc-950/40 backdrop-blur-xl rounded-2xl border border-white/5 p-1 md:p-3 transition-all duration-500 overflow-hidden shadow-inner"
    >
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={videoId}
        data-theme={resolvedTheme}
        style={{ maxWidth: "605px", minWidth: "325px", width: "100%", margin: "0 auto", backgroundColor: 'transparent' }}
      >
        <section>
          <a target="_blank" href={url} rel="noopener noreferrer">
            مشاهدة على TikTok
          </a>
        </section>
      </blockquote>
    </div>
  );
}

function IframeEmbed({ embedUrl, title }: { embedUrl: string; title?: string }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-zinc-950/40 backdrop-blur-xl shadow-2xl border border-white/5 aspect-video">
      {isLoading && <Skeleton className="absolute inset-0 z-10 w-full h-full" />}
      <iframe
        src={embedUrl}
        title={title || "Video"}
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}

export function VideoEmbed({ url, title }: VideoEmbedProps) {
  if (!url) return null;

  const { platform, embedUrl, videoId } = parsePlatform(url);

  if (platform === "unknown") {
    return (
      <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>رابط فيديو غير مدعوم</AlertTitle>
        <AlertDescription>يدعم الموقع حالياً روابط تيك توك، فيسبوك، ويوتيوب فقط.</AlertDescription>
      </Alert>
    );
  }

  if (platform === "tiktok" && videoId) {
    return <TikTokEmbed url={url} videoId={videoId} />;
  }

  if (embedUrl) {
    return <IframeEmbed embedUrl={embedUrl} title={title} />;
  }

  return null;
}
