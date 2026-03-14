"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PortfolioCar } from "@/types/portfolio";

interface CarCardProps {
  car: PortfolioCar;
  index: number;
}

export function CarCard({ car, index }: CarCardProps) {
  return (
    <Link href={`/cars/${car.slug}`} className="group block">
      <Card className="overflow-hidden border border-zinc-200 dark:border-zinc-800/60 bg-card shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 rounded-4xl group-hover:-translate-y-2">
        <div className="relative aspect-16/10 overflow-hidden">
          <Image
            src={car.coverImageUrl}
            alt={car.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity dark:from-zinc-950/80" />

          <div className="absolute top-4 right-4">
            <Badge className="bg-white/10 backdrop-blur-md border-white/20 text-white font-bold h-9 px-4 rounded-2xl">
              {car.serviceType === 'alignment_balancing' ? 'ضبط زوايا وترصيص' :
                car.serviceType === 'inspection' ? 'فحص شامل' :
                  car.serviceType === 'steering_coding' ? 'تكويد طارة' : car.serviceType}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">
            {car.title}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed font-medium">
            {car.description}
          </p>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex items-center justify-between text-sm">
          <span className="text-zinc-400 font-bold">
            {new Date(car.createdAt!).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}
          </span>
          <div className="flex items-center gap-1 text-emerald-500 font-black group-hover:gap-2 transition-all">
            <span>عرض التفاصيل</span>
            <ArrowLeft className="w-4 h-4" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
