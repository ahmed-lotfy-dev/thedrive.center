import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AuthorizationError, requireAdmin } from "@/lib/server-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      redirect("/sign-in");
    }
    throw error;
  }

  return (
    <div className="flex bg-muted/20 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 mt-14 lg:mt-0 overflow-y-auto">{children}</main>
    </div>
  );
}
