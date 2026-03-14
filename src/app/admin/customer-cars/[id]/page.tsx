import { db } from "@/db";
import { customerCars } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { CarDetailView } from "@/features/maintenance/components/admin/CarDetailView";

interface CarPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCarDetailPage({ params }: CarPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.role !== "admin") {
    redirect("/");
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
