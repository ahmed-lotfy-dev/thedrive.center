import { ShowcaseForm } from "./client-form";

export const metadata = {
  title: "إضافة عمل جديد | لوحة التحكم",
};

export default function NewShowcasePage() {
  return (
    <div className="container mx-auto py-10">
       <ShowcaseForm />
    </div>
  );
}
