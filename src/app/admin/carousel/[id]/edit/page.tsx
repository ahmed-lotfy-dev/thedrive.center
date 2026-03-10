export const dynamic = "force-dynamic";

import { HeroSlideForm } from "@/features/admin/components/HeroSlideForm";
import { heroSlideQueries } from "@/db/queries/hero-slides";
import { notFound, redirect } from "next/navigation";
import { updateHeroSlide } from "@/server/actions/hero-slides";

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

export default async function EditHeroSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const slide = await heroSlideQueries.findById(id);

  if (!slide) {
    notFound();
  }

  async function handleSubmit(values: HeroSlideFormValues) {
    "use server";
    const normalizedOrder = values.isFeatured ? Math.max(values.order, 100) : values.order % 100;

    await updateHeroSlide(id, {
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
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold font-cairo mb-8">تعديل الشريحة</h1>
      <HeroSlideForm
        initialData={{
          id: slide.id,
          title: slide.title || "",
          description: slide.description || "",
          imageUrl: slide.imageUrl,
          linkUrl: slide.linkUrl || "",
          buttonText: slide.buttonText || "",
          order: slide.order || 0,
          isActive: slide.isActive || false,
          isFeatured: (slide.order || 0) >= 100,
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
