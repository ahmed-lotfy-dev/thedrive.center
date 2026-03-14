"use client";

import { useState } from "react";
import { 
  updateAppointmentStatus, 
  deleteAppointmentAction 
} from "@/server/actions/appointments";
import { toast } from "sonner";
import { AppointmentCard } from "./components/AppointmentCard";
import { EmptyAppointments } from "./components/EmptyAppointments";
import { DeleteAppointmentDialog } from "./components/DeleteAppointmentDialog";

type Appointment = {
  id: string;
  guestName: string | null;
  guestPhone: string | null;
  guestEmail: string | null;
  machineType: string | null;
  serviceType: string;
  date: Date | string;
  notes: string | null;
  status: string | null;
  car?: {
    plateNumber: string;
  } | null;
};

interface AdminAppointmentListProps {
  initialAppointments: Appointment[];
}

const statusColors = {
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  confirmed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  completed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
} as const;

const statusLabels = {
  pending: "قيد المراجعة",
  confirmed: "مؤكد",
  completed: "مكتمل",
  cancelled: "ملغي",
} as const;

const machineTypeLabels: Record<string, string> = {
  sedan: "ملاكي (Sedan)",
  suv: "SUV",
  van: "فان (Van)",
  truck: "نقل (Truck)",
  washing_machine: "ملاكي",
  refrigerator: "SUV",
  water_filter: "نقل",
  other: "أخرى",
};

const serviceTypeLabels: Record<string, string> = {
  repair: "ضبط زوايا",
  installation: "ترصيص واتزان",
  maintenance: "فحص شامل قبل البيع والشراء",
  "ضبط زوايا": "ضبط زوايا",
  "ترصيص": "ترصيص واتزان",
  "ترصيص واتزان": "ترصيص واتزان",
  "فحص شامل": "فحص شامل",
};

export function AdminAppointmentList({ initialAppointments }: AdminAppointmentListProps) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setLoadingId(id);
    const result = await updateAppointmentStatus(id, newStatus);
    setLoadingId(null);
    
    if (result.success) {
      toast.success("تم تحديث الحالة بنجاح");
      setAppointments(prev => 
        prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
      );
    } else {
      toast.error(result.error || "فشل تحديث الحالة");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    setLoadingId(deleteId);
    const result = await deleteAppointmentAction(deleteId);
    setLoadingId(null);
    
    if (result.success) {
      toast.success("تم مسح الحجز بنجاح");
      setAppointments(prev => prev.filter(app => app.id !== deleteId));
      setDeleteId(null);
    } else {
      toast.error(result.error || "فشل مسح الحجز");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <AppointmentCard 
            key={appointment.id}
            appointment={appointment}
            statusColors={statusColors}
            statusLabels={statusLabels}
            machineTypeLabels={machineTypeLabels}
            serviceTypeLabels={serviceTypeLabels}
            loadingId={loadingId}
            onStatusUpdate={handleStatusUpdate}
            onDeleteRequest={(id) => setDeleteId(id)}
          />
        ))
      ) : (
        <EmptyAppointments />
      )}

      <DeleteAppointmentDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
