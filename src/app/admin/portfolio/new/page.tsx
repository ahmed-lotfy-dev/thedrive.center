import { PortfolioForm } from "./client-form";

export const metadata = {
  title: "إضافة عمل جديد | لوحة التحكم",
};

export default function NewPortfolioPage() {
  return (
    <div className="container mx-auto py-10">
       <PortfolioForm />
    </div>
  );
}
