"use client";

import { AlertCircle } from "lucide-react";
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

interface DeleteAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAppointmentDialog({ isOpen, onClose, onConfirm }: DeleteAppointmentDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-popover/95 backdrop-blur-xl border-border/50 rounded-[2rem] p-8 shadow-2xl max-w-[400px]">
        <AlertDialogHeader className="gap-2">
          <div className="size-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-2 border border-red-500/20">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <AlertDialogTitle className="text-2xl font-black text-center text-foreground">
            تأكيد المسح
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground font-bold leading-relaxed">
            هل أنت متأكد من مسح هذا الحجز؟ هذا الإجراء لا يمكن التراجع عنه وسوف يتم حذف البيانات نهائياً.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row-reverse gap-3 pt-6 sm:justify-center">
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-500 text-white rounded-xl font-black h-12 px-8 border-none transition-all hover:scale-[1.02] shadow-lg shadow-red-500/20"
          >
            مسح الحجز
          </AlertDialogAction>
          <AlertDialogCancel className="rounded-xl border-border/50 bg-muted hover:bg-muted/80 text-foreground font-bold h-12 px-8 transition-all">
            إلغاء
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
