"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserMenu } from "../shared/UserMenu";
import { Calendar, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { Magnetic } from "../shared/Magnetic";

const navContainerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const navItemVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = React.useRef<HTMLElement>(null);

  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const canOpenAdmin = userRole === "admin" || userRole === "owner";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/cars", label: "سجل التميز" },
    { href: "/book", label: "احجز موعد" },
  ];

  return (
    <motion.nav
      ref={navRef as any}
      className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-4 lg:px-8 pt-4 md:pt-6"
      variants={navContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <div
        className={cn(
          "mx-auto flex h-16 md:h-20 w-full max-w-[1400px] items-center justify-between rounded-4xl border transition-all duration-500 px-3 md:px-6 relative",
          isScrolled
            ? "bg-background/80 shadow-lg dark:shadow-2xl backdrop-blur-2xl border-border/50"
            : "bg-background/40 backdrop-blur-xl border-border/20"
        )}
      >
        <div className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />

        <motion.div variants={navItemVariants} className="flex-1 flex justify-start relative z-10">
          <Link href="/" className="flex items-center gap-3 md:gap-5 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-emerald-500/20 rounded-2xl blur-md group-hover:bg-emerald-500/40 transition-all duration-500" />
              <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-card border border-border/60 overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shrink-0 shadow-lg">
                <img src="/logo.png" alt="The Drive Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="leading-tight flex flex-col justify-center">
              <h1 className="text-[clamp(1rem,4.5vw,1.875rem)] font-black tracking-tighter text-foreground dark:text-white group-hover:text-emerald-500 transition-colors uppercase italic px-1">The Drive Center</h1>
              <div className="flex items-center gap-2">
                <span className="w-4 sm:w-8 h-px bg-emerald-500/50 shrink-0" />
                <p className="text-[clamp(0.5rem,2vw,0.625rem)] text-muted-foreground font-black tracking-[0.1em] sm:tracking-[0.2em] uppercase whitespace-nowrap">Precision Service</p>
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={navItemVariants} className="hidden md:flex items-center justify-center gap-2 flex-1 relative z-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-5 py-2 text-sm font-bold transition-all duration-300 rounded-full relative group/item",
                pathname === link.href
                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 shadow-inner"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#10b981]" />
              )}
            </Link>
          ))}
        </motion.div>

        <motion.div variants={navItemVariants} className="flex-1 flex justify-end items-center gap-3 sm:gap-6 relative z-10">
          <div className="hidden md:flex items-center gap-4">
            <UserMenu session={session} />
            {!canOpenAdmin && (
              <Button
                asChild
                className="relative h-11 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black shadow-lg shadow-emerald-500/20 transition-all group overflow-hidden cursor-pointer active:scale-95 hover:-translate-y-1"
              >
                <Link href="/book">
                  <span className="relative z-10 flex items-center gap-2">
                    احجز موعد
                    <Calendar className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </span>
                </Link>
              </Button>
            )}
          </div>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex md:hidden size-10 md:size-12 items-center justify-center rounded-xl md:rounded-2xl border border-border/50 bg-muted/50 hover:bg-muted transition-all active:scale-90"
            aria-label="القائمة"
          >
            {isOpen ? <X className="size-5 md:size-6 text-foreground dark:text-white" /> : <Menu className="size-5 md:size-6 text-foreground dark:text-white" />}
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto mt-2 container rounded-2xl border bg-background/95 backdrop-blur-md p-4 md:hidden shadow-2xl relative z-40"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-black transition-all",
                    pathname === link.href
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-border/50">
                {!session ? (
                  <Button asChild className="w-full rounded-xl h-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black shadow-lg shadow-emerald-500/30 active:scale-95">
                    <Link href="/sign-in" onClick={() => setIsOpen(false)}>دخول</Link>
                  </Button>
                ) : (
                  <>
                    <div className="flex flex-col gap-1 mb-2">
                      <Link 
                        href="/dashboard/garage" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-zinc-200 hover:bg-emerald-500/20 active:bg-emerald-500/30 transition-all"
                      >
                        <LayoutDashboard className="size-4 text-emerald-500" />
                        كراجي (My Garage)
                      </Link>
                      
                      {canOpenAdmin && (
                        <>
                          <Link 
                            href="/admin" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-zinc-200 hover:bg-indigo-500/20 active:bg-indigo-500/30 transition-all"
                          >
                            <LayoutDashboard className="size-4 text-indigo-500" />
                            إدارة المركز
                          </Link>
                          <Link 
                            href="/admin/customer-cars" 
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-zinc-200 hover:bg-amber-500/20 active:bg-amber-500/30 transition-all"
                          >
                            <LayoutDashboard className="size-4 text-amber-500" />
                            سيارات العملاء
                          </Link>
                        </>
                      )}
                      
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          authClient.signOut();
                        }}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-500/20 active:bg-red-500/30 transition-all w-full text-right cursor-pointer"
                      >
                        <LogOut className="size-4 text-red-500" />
                        تسجيل خروج
                      </button>
                    </div>

                    <div className="flex items-center gap-3 px-3 py-3 bg-muted/40 rounded-xl mb-3 border border-white/5">
                      <Avatar className="size-10 border border-emerald-500/30">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="bg-emerald-500/20 text-emerald-500 font-black">{session.user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col text-right">
                        <span className="text-sm font-black text-foreground">{session.user.name}</span>
                        <span className="text-xs text-muted-foreground font-bold">{canOpenAdmin ? 'مدير النظام' : 'عميل'}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
