"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface GlassSkeletonProps {
  className?: string;
}

export const GlassSkeleton = ({ className }: GlassSkeletonProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm",
        className
      )}
    >
      {/* Shimmer animation */}
      <motion.div
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 z-10 bg-linear-to-r from-transparent via-white/10 to-transparent w-full"
      />
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-50" />
    </div>
  );
};

export const GlassSkeletonCollection = ({ 
  count = 3, 
  className 
}: { 
  count?: number; 
  className?: string;
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4">
          <GlassSkeleton className="aspect-16/10 rounded-4xl" />
          <div className="space-y-2 px-6">
            <GlassSkeleton className="h-6 w-3/4" />
            <GlassSkeleton className="h-4 w-1/2" />
          </div>
          <div className="px-6 pt-0 pb-6 flex justify-between items-center">
             <GlassSkeleton className="h-4 w-20" />
             <GlassSkeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};
