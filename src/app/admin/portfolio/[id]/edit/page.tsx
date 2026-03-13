import { db } from "@/db";
import { cars } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PortfolioForm } from "../../new/client-form";

export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const car = await db.query.cars.findFirst({
    where: eq(cars.id, id),
    with: {
      media: true,
    },
  });

  if (!car) notFound();

  return (
    <div className="container mx-auto py-10 px-4">
      <PortfolioForm initialData={car} />
    </div>
  );
}
