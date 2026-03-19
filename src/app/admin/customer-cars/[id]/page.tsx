import { db } from "@/db";
import { customerCars } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AuthorizationError, requireAdmin } from "@/lib/server-auth";
import { notFound, redirect } from "next/navigation";
import { CarDetailView } from "@/features/maintenance/components/admin/CarDetailView";

interface CarPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCarDetailPage({ params }: CarPageProps) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      redirect("/sign-in");
    }
    throw error;
  }

  const { id } = await params;

  const car = await db.query.customerCars.findFirst({
    where: eq(customerCars.id, id),
    with: {
      user: true,
      serviceRecords: {
        orderBy: (records, { desc }) => [desc(records.serviceDate)],
      },
    },
  });

  if (!car) {
    notFound();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <CarDetailView car={car} />
    </div>
  );
}
