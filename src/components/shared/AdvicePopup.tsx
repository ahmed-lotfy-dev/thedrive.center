"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Lightbulb, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Advice {
  id: string;
  content: string;
}

interface AdvicePopupProps {
  advice: Advice | null;
  delaySeconds?: number;
}

export function AdvicePopup({ advice, delaySeconds = 30 }: AdvicePopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);

  useEffect(() => {
    if (!advice || hasBeenDismissed) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [advice, delaySeconds, hasBeenDismissed]);

  if (!advice || hasBeenDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50, x: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
        >
          <div className="relative group">
            {/* Animated Glow Background */}
            <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 to-teal-500 rounded-4xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative bg-zinc-900/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-white/10 p-6 rounded-4xl shadow-2xl flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="bg-emerald-500/20 p-2.5 rounded-2xl">
                  <Lightbulb className="w-5 h-5 text-emerald-400" />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                  onClick={() => {
                    setIsVisible(false);
                    setHasBeenDismissed(true);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 text-xs font-black uppercase tracking-widest font-cairo">نصيحة اليوم</span>
                  <div className="h-px flex-1 bg-white/10"></div>
                </div>
                <p className="text-white text-lg font-bold leading-relaxed font-cairo text-right" dir="rtl">
                  {advice.content}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <Button 
                  onClick={() => setHasBeenDismissed(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-6 font-bold flex items-center gap-2 group/btn transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-emerald-500/20 cursor-pointer active:scale-95"
                >
                  <span>فهمت</span>
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
