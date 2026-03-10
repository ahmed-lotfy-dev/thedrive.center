"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteHeroSlide } from "@/server/actions/hero-slides";

export function DeleteHeroSlideButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذه الشريحة؟")) return;

    setLoading(true);
    const result = await deleteHeroSlide(id);
    setLoading(false);

    if (!result.success) {
      alert("تعذر حذف الشريحة");
      return;
    }

    router.refresh();
  }

  return (
    <Button variant="destructive" size="icon" onClick={handleDelete} disabled={loading} aria-label="حذف الشريحة">
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
