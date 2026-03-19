"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteShowcaseEntry } from "./actions";
import { toast } from "sonner";
import { useTransition } from "react";

interface DeleteActionProps {
  id: string;
  title: string;
}

export function DeleteAction({ id, title }: DeleteActionProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteShowcaseEntry(id);
      if (result.success) {
        toast.success("تم حذف العمل بنجاح");
      } else {
        toast.error(result.error || "فشل حذف العمل");
      }
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50/50 dark:hover:bg-red-950/20 rounded-xl"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir="rtl" className="rounded-4xl border-zinc-200 dark:border-zinc-800">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-black">هل أنت متأكد من الحذف؟</AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-500 dark:text-zinc-400">
            أنت على وشك حذف عمل &quot;{title}&quot; من سجل التميز. هذا الإجراء لا يمكن التراجع عنه.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel className="rounded-2xl h-12">إلغاء</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-2xl h-12 bg-red-500 hover:bg-red-600 font-bold"
          >
            {isPending ? "جاري الحذف..." : "تأكيد الحذف"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
