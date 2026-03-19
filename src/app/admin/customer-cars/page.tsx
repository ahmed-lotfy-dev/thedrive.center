import { searchCustomerCars } from "@/features/maintenance/actions";
import { AdminCarManager } from "@/features/maintenance/components/admin/AdminCarManager";
import { PaginationControls } from "@/components/shared/PaginationControls";
import { AuthorizationError, requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

interface AdminCustomerCarsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function AdminCustomerCarsPage({ searchParams }: AdminCustomerCarsPageProps) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      redirect("/sign-in");
    }
    throw error;
  }

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const { data: cars, meta } = await searchCustomerCars(search, page, 12);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-8">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-foreground">إدارة سيارات العملاء</h1>
          <p className="text-muted-foreground/60 font-bold mt-1 text-sm tracking-wide">البحث عن سيارات العملاء، إضافة سجلات الخدمة، وتحديث مواعيد الصيانة القادمة</p>
        </div>
      </div>
      <AdminCarManager initialCars={cars || []} initialSearch={search} />
      <PaginationControls
        currentPage={page}
        totalPages={meta.totalPages || 1}
        baseUrl="/admin/customer-cars"
        queryParams={{ search: search || undefined }}
      />
    </div>
  );
}
