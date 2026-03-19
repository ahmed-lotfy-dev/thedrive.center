import { SiteStateScreen } from "@/features/maintenance/components/SiteStateScreen";

export function ComingSoon() {
  return (
    <SiteStateScreen
      badge="قريباً"
      title="The Drive Center"
      eyebrow="إطلاق المنصة قريباً"
      description="نحن نعمل الآن على إطلاق منصتنا الرقمية بشكل يليق بخدمتكم داخل المركز. الهدف هو تجربة أوضح وأسرع للحجز ومتابعة حالة السيارة والتواصل معنا بسهولة."
      secondaryDescription="إلى أن يكتمل الإطلاق، يمكنكم التواصل معنا مباشرة عبر واتساب أو متابعة صفحاتنا لمعرفة آخر التحديثات."
      showCountdown
    />
  );
}
