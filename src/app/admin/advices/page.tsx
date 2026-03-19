import { AdvicesClient } from "./client";
import { adviceQueries } from "@/db/queries/advices";
import { PaginationControls } from "@/components/shared/PaginationControls";

export const dynamic = "force-dynamic";

interface AdvicesAdminPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function AdvicesAdminPage({ searchParams }: AdvicesAdminPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const { data: advices, meta } = await adviceQueries.findPaginated(page, 12);

  return (
    <div className="space-y-8">
      <AdvicesClient initialAdvices={advices} />
      <PaginationControls
        currentPage={meta.page}
        totalPages={meta.totalPages}
        baseUrl="/admin/advices"
      />
    </div>
  );
}
