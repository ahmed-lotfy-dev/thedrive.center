import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

function isAdminRole(role?: string, email?: string) {
  const isAdmin = role === "admin" || role === "owner";
  const isHardcodedAdmin = process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL;
  return isAdmin || isHardcodedAdmin;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const user = session.user as { role?: string; email: string };
  if (!isAdminRole(user.role, user.email)) {
    redirect("/");
  }

  return (
    <div className="flex bg-muted/20 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 mt-14 lg:mt-0 overflow-y-auto">{children}</main>
    </div>
  );
}
