export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { heroSlideQueries } from "@/db/queries/hero-slides";
import { Plus, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteHeroSlideButton } from "@/features/admin/components/DeleteHeroSlideButton";

export default async function CarouselAdminPage() {
  const slides = await heroSlideQueries.findAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-cairo text-primary">إدارة صور الهيرو</h1>
        <Button className="gap-2" asChild>
          <Link href="/admin/carousel/new">
            <Plus className="w-4 h-4" />
            إضافة شريحة
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.length > 0 ? (
          slides.map((slide) => (
            <Card key={slide.id} className="overflow-hidden group relative">
              <div className="relative h-48 w-full bg-muted">
                <Image src={slide.imageUrl} alt={slide.title || "شريحة هيرو"} fill className="object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/admin/carousel/${slide.id}/edit`}>
                      <Edit className="w-4 h-4 ml-2" />
                      تعديل
                    </Link>
                  </Button>
                  <DeleteHeroSlideButton id={slide.id} />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{slide.title || "شريحة بدون عنوان"}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{slide.description || "بدون وصف"}</p>
                <div className="mt-3 flex gap-2">
                  {slide.isActive ? (
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs">مفعلة</span>
                  ) : (
                    <span className="rounded-full bg-zinc-200 text-zinc-700 px-2 py-0.5 text-xs">مخفية</span>
                  )}
                  {(slide.order ?? 0) >= 100 && (
                    <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-xs">مميزة</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed">
            لا توجد شرائح حتى الآن.
          </div>
        )}
      </div>
    </div>
  );
}
