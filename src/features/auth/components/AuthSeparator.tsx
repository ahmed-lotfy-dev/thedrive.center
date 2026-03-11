"use client";

export function AuthSeparator() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border/40" />
      </div>
      <div className="relative flex justify-center uppercase">
        <span className="bg-white/40 dark:bg-black/40 backdrop-blur-xl px-4 text-xs font-black text-muted-foreground tracking-widest">
          أو
        </span>
      </div>
    </div>
  );
}
