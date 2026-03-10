import { HeroSlideForm } from "@/features/admin/components/HeroSlideForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createHeroSlide } from "@/server/actions/hero-slides";
import { redirect } from "next/navigation";

type HeroSlideFormValues = {
  title?: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  buttonText?: string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
};

export default function NewHeroSlidePage() {
  async function handleSubmit(values: HeroSlideFormValues) {
    "use server";
    const normalizedOrder = values.isFeatured ? Math.max(values.order, 100) : values.order % 100;

    await createHeroSlide({
      title: values.title || null,
      description: values.description || null,
      imageUrl: values.imageUrl,
      linkUrl: values.linkUrl || null,
      buttonText: values.buttonText || null,
      order: normalizedOrder,
      isActive: values.isActive,
    });

    redirect("/admin/carousel");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/carousel">
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-cairo text-primary">إضافة شريحة جديدة</h1>
      </div>

      <HeroSlideForm onSubmit={handleSubmit} />
    </div>
  );
}
