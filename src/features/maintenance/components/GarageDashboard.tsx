"use client";

import { useState } from "react";
import { CarCard } from "@/features/maintenance/components/CarCard";
import { LinkCarForm } from "@/features/maintenance/components/LinkCarForm";
import { Plus, Car as CarIcon, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface GarageDashboardProps {
  initialCars: any[];
}

export function GarageDashboard({ initialCars }: GarageDashboardProps) {
  const [cars, setCars] = useState(initialCars);
  const [showLinkForm, setShowLinkForm] = useState(false);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CarIcon className="text-emerald-500" />
          سياراتي
        </h2>
        <div className="flex gap-3">
          <Button 
            asChild
            variant="outline"
            className="rounded-xl font-bold gap-2 border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
          >
            <Link href="/book">
              <Calendar className="size-4" />
              حجز موعد جديد
            </Link>
          </Button>
          <Button 
            onClick={() => setShowLinkForm(!showLinkForm)}
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl font-black gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
          >
            <Plus className="size-4" />
            {showLinkForm ? "إغلاق" : "إضافة سيارة"}
          </Button>
        </div>
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
          <div className="flex flex-wrap gap-4 mt-4">
            <Button 
              variant="link" 
              onClick={() => setShowLinkForm(true)}
              className="text-emerald-500 font-bold"
            >
              سجل سيارتك الآن
            </Button>
            <Button 
              asChild
              className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl font-black px-6 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
            >
              <Link href="/book">
                احجز ميعادك دلوقتي
              </Link>
            </Button>
          </div>
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
