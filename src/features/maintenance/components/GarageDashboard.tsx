"use client";

import { useState } from "react";
import { CarCard } from "@/features/maintenance/components/CarCard";
import { LinkCarForm } from "@/features/maintenance/components/LinkCarForm";
import { Plus, Car as CarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface GarageDashboardProps {
  initialCars: any[];
}

export function GarageDashboard({ initialCars }: GarageDashboardProps) {
  const [cars, setCars] = useState(initialCars);
  const [showLinkForm, setShowLinkForm] = useState(false);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CarIcon className="text-emerald-500" />
          سياراتي
        </h2>
        <Button 
          onClick={() => setShowLinkForm(!showLinkForm)}
          className="bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold gap-2"
        >
          <Plus className="size-4" />
          {showLinkForm ? "إغلاق" : "إضافة سيارة"}
        </Button>
      </div>

      <AnimatePresence>
        {showLinkForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-3xl backdrop-blur-xl mb-8">
              <LinkCarForm onSuccess={() => {
                setShowLinkForm(false);
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {cars.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/30 rounded-4xl border border-dashed border-white/10">
          <div className="size-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
            <CarIcon className="size-10 text-zinc-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">لا يوجد سيارات مسجلة</h3>
          <p className="text-muted-foreground max-w-sm">
            قم بإضافة سيارتك باستخدام رقم اللوحة للوصول إلى سجل الصيانة الخاص بك.
          </p>
          <Button 
            variant="link" 
            onClick={() => setShowLinkForm(true)}
            className="mt-4 text-emerald-500 font-bold"
          >
            سجل سيارتك الآن
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
