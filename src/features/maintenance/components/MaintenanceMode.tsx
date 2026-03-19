import { SiteStateScreen } from "@/features/maintenance/components/SiteStateScreen";

export function MaintenanceMode() {
  return (
    <SiteStateScreen
      badge="الموقع في وضع الصيانة"
      title="The Drive Center"
      eyebrow="سنعود إليكم بعد قليل"
      description="نقوم حالياً بتنفيذ تحديثات فنية وصيانة ضرورية على الموقع لتحسين الاستقرار والأداء وتجربة الاستخدام."
      secondaryDescription="خلال هذه الفترة قد تتوقف بعض الصفحات والخدمات مؤقتاً. إذا كنتم بحاجة إلى حجز أو استفسار عاجل، يمكنكم التواصل معنا مباشرة عبر واتساب."
    />
  );
}
