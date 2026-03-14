import { AdvicesClient } from "./client";
import { adviceQueries } from "@/db/queries/advices";

export const dynamic = "force-dynamic";

export default async function AdvicesAdminPage() {
  const advices = await adviceQueries.findAll();

  // Map null to undefined or maintain null handle in client
  return <AdvicesClient initialAdvices={advices} />;
}
