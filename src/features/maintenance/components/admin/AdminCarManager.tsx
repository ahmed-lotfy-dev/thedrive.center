"use client";

import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { 
  deleteCustomerCarAction, 
  archiveCustomerCarAction, 
  unlinkCustomerCarAction 
} from "@/features/maintenance/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  User as UserIcon, 
  Loader2,
  ChevronLeft,
  Plus,
  MoreVertical,
  Trash2,
  Archive,
  UserMinus,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatLicensePlate } from "@/lib/utils";
import { getCarMakerLabel, getVehicleTypeLabel } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddCarForm } from "./AddCarForm";

import type { searchCustomerCars } from "@/features/maintenance/actions";

type SearchCustomerCarsResult = Awaited<ReturnType<typeof searchCustomerCars>>;
type SearchableCustomerCar = SearchCustomerCarsResult["data"][number];

interface AdminCarManagerProps {
  initialCars: SearchableCustomerCar[];
  initialSearch: string;
}

export function AdminCarManager({ initialCars, initialSearch }: AdminCarManagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [cars, setCars] = useState(initialCars);
  const [search, setSearch] = useState(initialSearch);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  const getCarDisplayName = (car: SearchableCustomerCar) => {
    const make = car.make === "Unknown" ? "سيارة" : getCarMakerLabel(car.make);
    const model = getVehicleTypeLabel(car.model);
    
    return `${make} ${model}`;
  };
  
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    setCars(initialCars);
  }, [initialCars]);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    if (debouncedSearch === initialSearch) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    if (debouncedSearch.trim()) {
      nextParams.set("search", debouncedSearch.trim());
    } else {
      nextParams.delete("search");
    }
    nextParams.set("page", "1");

    startTransition(() => {
      router.replace(`${pathname}?${nextParams.toString()}`, { scroll: false });
    });
  }, [debouncedSearch, initialSearch, pathname, router, searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: "delete" | "archive" | "unlink";
    carId: string;
    carName: string;
  }>({ open: false, type: "delete", carId: "", carName: "" });

  const handleAction = async () => {
    const { type, carId } = confirmDialog;
    let result;

    if (type === "delete") result = await deleteCustomerCarAction(carId);
    else if (type === "archive") result = await archiveCustomerCarAction(carId);
    else if (type === "unlink") result = await unlinkCustomerCarAction(carId);

    if (result?.success) {
      toast.success("تم تنفيذ العملية بنجاح");
      router.refresh();
    } else {
      toast.error(result?.error || "حدث خطأ ما");
    }
    setConfirmDialog(prev => ({ ...prev, open: false }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="max-w-md w-full relative group">
          <Input 
            placeholder="بحث برقم اللوحة، اسم العميل، أو موديل السيارة..."
            value={search}
            onChange={handleInputChange}
            className="rounded-2xl h-12 bg-muted/50 border-border/50 pr-10 focus:border-emerald-500/50 transition-all font-bold placeholder:text-muted-foreground/50"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isPending ? (
              <Loader2 className="size-5 text-emerald-500 animate-spin" />
            ) : (
              <Search className="size-5 text-zinc-500" />
            )}
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl h-12 px-6 font-black gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              <Plus className="size-5" />
              إضافة سيارة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-popover/95 border-border/50 rounded-[2.5rem] sm:max-w-[500px] p-8 md:p-10 backdrop-blur-xl">
            <DialogHeader className="mb-10">
              <DialogTitle className="text-3xl font-black italic uppercase tracking-tight text-center sm:text-right">
                تسجيل <span className="text-emerald-500">سيارة جديدة</span>
              </DialogTitle>
            </DialogHeader>
            <AddCarForm onSuccess={(newCar) => {
              setCars(prev => [{ ...newCar, user: null }, ...prev]);
              setIsDialogOpen(false);
              router.refresh();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars.map((car) => (
          <div key={car.id} className="relative group">
            <Link
              href={`/admin/customer-cars/${car.id}`}
              className="flex w-full text-right p-6 rounded-3xl border bg-card/40 border-border/50 hover:border-emerald-500/40 transition-all duration-300 flex-col gap-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="flex flex-col gap-1">
                  <span className="font-black italic uppercase text-xl group-hover:text-emerald-500 transition-colors">
                    {getCarDisplayName(car)}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-bold">
                    <UserIcon className="size-3" />
                    <span>{car.user?.name || "عميل غير مسجل"}</span>
                  </div>
                </div>
                <span className="bg-muted text-[10px] font-black px-3 py-1 rounded-lg text-muted-foreground border border-border/50 uppercase tracking-widest">
                  {formatLicensePlate(car.plateNumber)}
                </span>
              </div>

              <div className="flex justify-end items-center text-xs font-black text-emerald-500 transition-all relative z-10 pl-12">
                <span>التفاصيل</span>
                <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              </div>
            </Link>

            {/* Management Options */}
            <div className="absolute left-4 bottom-4 z-20">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8 rounded-full bg-muted/80 hover:bg-muted border border-border/50 transition-all shadow-sm text-foreground hover:text-emerald-500">
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 bg-popover border-border/50 rounded-xl">
                  {car.userId && (
                    <DropdownMenuItem
                      onClick={() => setConfirmDialog({ open: true, type: "unlink", carId: car.id, carName: getCarDisplayName(car) })}
                      className="gap-2 font-bold text-zinc-300 cursor-pointer"
                    >
                      <UserMinus className="size-4" /> فك ربط العميل
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => setConfirmDialog({ open: true, type: "archive", carId: car.id, carName: getCarDisplayName(car) })}
                    className="gap-2 font-bold text-zinc-300 cursor-pointer"
                  >
                    <Archive className="size-4" /> أرشفة السيارة
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem 
                    onClick={() => setConfirmDialog({ open: true, type: "delete", carId: car.id, carName: getCarDisplayName(car) })}
                    className="gap-2 font-bold text-red-400 focus:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="size-4" /> مسح نهائي
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
        {cars.length === 0 && (
          <div className="col-span-full py-20 text-center bg-zinc-900/20 border border-dashed border-white/10 rounded-4xl">
            <p className="text-muted-foreground text-sm italic font-bold">لم يتم العثور على سيارات</p>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent className="bg-popover border-border/50 rounded-4xl p-8">
          <AlertDialogHeader className="gap-4">
            <div className="size-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="size-8 text-red-500" />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-center">
              {confirmDialog.type === "delete" ? "تأكيد المسح النهائي" : 
               confirmDialog.type === "archive" ? "تأكيد الأرشفة" : "تأكيد فك الربط"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center font-bold text-muted-foreground leading-relaxed">
              هل أنت متأكد من {confirmDialog.type === "delete" ? "مسح" : confirmDialog.type === "archive" ? "أرشفة" : "فك ربط"} السيارة 
              <span className="text-foreground mx-1 font-black">{confirmDialog.carName}</span>؟
              {confirmDialog.type === "delete" && (
                <span className="block mt-2 text-destructive/80 text-xs">لا يمكن التراجع عن هذه العملية.</span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3 sm:justify-center">
            <AlertDialogCancel className="rounded-xl font-bold bg-muted border-border/50 h-12 px-8">إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAction}
              className={cn(
                "rounded-xl font-black h-12 px-8 transition-all hover:scale-[1.05]",
                confirmDialog.type === "delete" ? "bg-red-600 hover:bg-red-500" : "bg-emerald-600 hover:bg-emerald-500"
              )}
            >
              تأكيد العملية
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
