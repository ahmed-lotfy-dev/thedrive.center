"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PortfolioCar } from "@/types/portfolio";

interface CarCardProps {
  car: PortfolioCar;
  index: number;
}

export function CarCard({ car, index }: CarCardProps) {
  const serviceLabel = car.serviceType === 'alignment_balancing' ? 'ضبط زوايا وترصيص' :
    car.serviceType === 'inspection' ? 'فحص شامل' :
      car.serviceType === 'steering_coding' ? 'تكويد طارة' : car.serviceType;

  return (
    <Link href={`/cars/${car.slug}`} className="group block">
      <Card className="overflow-hidden p-0 gap-0 border border-border/50 bg-card/40 backdrop-blur-xl shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-700 rounded-[2.5rem] group-hover:-translate-y-2 group-hover:border-emerald-500/30">
        <div className="relative aspect-16/10 overflow-hidden">
          <Image
            src={car.coverImageUrl}
            alt={car.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index === 0}
          />
          {/* Enhanced Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Service Tag - Premium Badge */}
          <div className="absolute top-5 right-5">
            <Badge className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 font-black h-9 px-4 rounded-2xl shadow-lg flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              {serviceLabel}
            </Badge>
          </div>
        </div>

        <CardContent className="p-8 relative">
          <h2 className="text-2xl font-black text-foreground mb-3 group-hover:text-emerald-500 transition-colors tracking-tight leading-tight">
            {car.title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
            {car.description}
          </p>
        </CardContent>

        <CardFooter className="px-8 pb-8 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground/60 font-bold text-xs uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(car.createdAt!).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-emerald-500 font-black text-sm group-hover:gap-3 transition-all">
            <span>عرض التفاصيل</span>
            <div className="size-8 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-zinc-950 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
