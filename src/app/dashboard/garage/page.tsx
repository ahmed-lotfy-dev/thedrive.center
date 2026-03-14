import { getUserCars } from "@/features/maintenance/actions";
import { GarageDashboard } from "@/features/maintenance/components/GarageDashboard";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function GaragePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const { data: cars, error } = await getUserCars();

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter italic uppercase leading-none">
          كراجي <span className="text-emerald-500 block sm:inline">My Garage</span>
        </h1>
        <p className="text-muted-foreground font-bold text-lg max-w-2xl">
          هنا يمكنك متابعة حالة سياراتك، سجلات الصيانة السابقة، ومعرفة موعد الخدمة القادم بدقة لضمان أفضل أداء لسيارتك.
        </p>
      </div>
      
      <GarageDashboard initialCars={cars || []} />
    </div>
  );
}
