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
          className="fixed bottom-3 right-3 z-50 w-[calc(100vw-1.5rem)] max-w-[22rem] sm:bottom-6 sm:right-6 sm:w-full sm:max-w-sm"
        >
          <div className="relative group">
            {/* Animated Glow Background */}
            <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 to-teal-500 rounded-4xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            
            <div className="relative flex flex-col gap-3 rounded-[1.75rem] border border-white/10 bg-zinc-900/90 p-4 shadow-2xl backdrop-blur-xl dark:bg-zinc-950/90 sm:gap-4 sm:rounded-4xl sm:p-6">
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 sm:h-8 sm:w-8">
                  <Lightbulb className="h-3.5 w-3.5 text-emerald-400 sm:h-4 sm:w-4" />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-xl text-white/40 hover:bg-white/10 hover:text-white"
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
                  <span className="font-cairo text-[11px] font-black tracking-[0.18em] text-emerald-400 sm:text-xs">
                    نصيحة اليوم
                  </span>
                  <div className="h-px flex-1 bg-white/10"></div>
                </div>
                <p
                  className="font-cairo text-right text-base font-bold leading-7 text-white sm:text-lg sm:leading-relaxed"
                  dir="rtl"
                >
                  {advice.content}
                </p>
              </div>

              <div className="flex justify-end pt-1 sm:pt-2">
                <Button 
                  onClick={() => setHasBeenDismissed(true)}
                  className="group/btn h-10 rounded-xl bg-emerald-500 px-4 text-sm font-black text-zinc-950 shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 sm:h-11 sm:rounded-2xl sm:px-6 sm:text-base"
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
