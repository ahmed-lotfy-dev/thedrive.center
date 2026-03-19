import { db } from "@/db";
import { customerCars, serviceRecords } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { AuthorizationError, requireAdmin } from "@/lib/server-auth";
import { notFound, redirect } from "next/navigation";
import { CarDetailView } from "@/features/maintenance/components/admin/CarDetailView";

interface CarPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminCarDetailPage({ params, searchParams }: CarPageProps) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      redirect("/sign-in");
    }
    throw error;
  }

  const { id } = await params;
  const query = await searchParams;
  const page = Number(query.page) || 1;
  const limit = 8;
  const offset = (page - 1) * limit;

  const [car, serviceHistory, totalResult] = await Promise.all([
    db.query.customerCars.findFirst({
      where: eq(customerCars.id, id),
      with: {
        user: true,
      },
    }),
    db.query.serviceRecords.findMany({
      where: eq(serviceRecords.carId, id),
      orderBy: (records, { desc }) => [desc(records.serviceDate)],
      limit,
      offset,
    }),
    db.select({ value: count() }).from(serviceRecords).where(eq(serviceRecords.carId, id)),
  ]);

  if (!car) {
    notFound();
  }

  const total = totalResult[0]?.value ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <CarDetailView
        car={{
          ...car,
          serviceRecords: serviceHistory,
        }}
        serviceHistoryMeta={{
          currentPage: page,
          totalPages,
        }}
      />
    </div>
  );
}
