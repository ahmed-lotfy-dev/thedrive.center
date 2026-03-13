"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Menu, X, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/cars", label: "سجل التميز" },
    { href: "/book", label: "احجز موعد" },
  ];

  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const canOpenAdmin = userRole === "admin" || userRole === "owner";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 md:pt-6">
      <div
        className={cn(
          "mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between rounded-4xl border transition-all duration-500 px-4 sm:px-8 relative",
          isScrolled 
            ? "bg-background/80 shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-2xl border-border/50 dark:border-white/10" 
            : "bg-background/40 backdrop-blur-xl border-border/20 dark:border-white/5"
        )}
      >
        {/* Top Edge Highlight */}
        <div className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent opacity-50" />
        
        {/* Right Section: Logo (Start in RTL) */}
        <div className="flex-1 flex justify-start relative z-10">
          <Link href="/" className="flex items-center gap-3 md:gap-5 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-emerald-500/20 rounded-2xl blur-md group-hover:bg-emerald-500/40 transition-all duration-500" />
              <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-zinc-950 border border-white/10 overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shrink-0 shadow-lg">
                <img src="/logo.png" alt="The Drive Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="leading-tight hidden sm:block">
              <h1 className="text-xl md:text-3xl font-black tracking-tighter text-foreground dark:text-white group-hover:text-emerald-500 transition-colors uppercase italic italic-bold">The Drive Center</h1>
              <div className="flex items-center gap-2">
                <span className="w-8 h-px bg-emerald-500/50" />
                <p className="text-[9px] md:text-[10px] text-muted-foreground font-black tracking-[0.2em] uppercase">Precision Service</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Center Section: Navigation Links */}
        <div className="hidden md:flex items-center justify-center gap-2 flex-1 relative z-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-5 py-2 text-sm font-bold transition-all duration-300 rounded-full relative group/item",
                pathname === link.href 
                  ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 shadow-inner" 
                  : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#10b981]" />
              )}
            </Link>
          ))}
        </div>

        {/* Left Section: Actions (End in RTL) */}
        <div className="flex-1 flex justify-end items-center gap-3 sm:gap-6 relative z-10">
          <div className="hidden sm:flex items-center gap-4">
            <ThemeToggle />
            <div className="h-8 w-px bg-white/10 mx-1" />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-2xl pr-2 pl-5 h-12 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/20 bg-black/5 dark:bg-white/5 transition-all hover:bg-black/10 dark:hover:bg-white/10 flex items-center gap-3 group">
                    <Avatar className="size-9 border-2 border-emerald-500/30 transition-transform group-hover:scale-105">
                      <AvatarImage src={session.user.image || ""} />
                      <AvatarFallback className="text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black">
                        {session.user.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-black hidden lg:inline text-foreground/80 dark:text-zinc-200 group-hover:text-foreground dark:group-hover:text-white transition-colors">{session.user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-white/10 bg-zinc-950/95 backdrop-blur-2xl">
                  <DropdownMenuLabel className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">لوحة التحكم</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10 mx-2 mb-2" />
                  {canOpenAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer rounded-xl p-4 flex items-center gap-4 font-bold text-zinc-200 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all">
                        <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                           <LayoutDashboard className="h-4 w-4 text-emerald-500" />
                        </div>
                        <span>إدارة المركز</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <div className="mt-2 pt-2 border-t border-white/5 px-2">
                    <DropdownMenuItem 
                      onClick={() => authClient.signOut()} 
                      className="text-red-400 focus:text-red-100 focus:bg-red-500/20 rounded-xl p-4 font-bold cursor-pointer transition-all"
                    >
                      تسجيل خروج
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="lg" className="rounded-2xl px-8 h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg shadow-emerald-500/30 transition-all active:scale-95 border border-emerald-400/20">
                <Link href="/sign-in">دخول</Link>
              </Button>
            )}
          </div>

          <div className="flex sm:hidden items-center gap-3">
             <ThemeToggle />
          </div>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex md:hidden size-12 items-center justify-center rounded-2xl border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all active:scale-90"
            aria-label="القائمة"
          >
            {isOpen ? <X className="size-6 text-foreground dark:text-white" /> : <Menu className="size-6 text-foreground dark:text-white" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border bg-background/95 backdrop-blur-md p-4 md:hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium transition-all",
                  pathname === link.href 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            {!session && (
              <div className="pt-2 mt-2 border-t border-border/50">
                <Button asChild className="w-full rounded-xl h-12 bg-primary">
                  <Link href="/sign-in" onClick={() => setIsOpen(false)}>سجل دخولك</Link>
                </Button>
              </div>
            )}
            {session && (
               <div className="pt-2 mt-2 border-t border-border/50 flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                       <AvatarImage src={session.user.image || ""} />
                       <AvatarFallback>{session.user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-bold">{session.user.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => authClient.signOut()} className="text-destructive h-9">
                    خروج
                  </Button>
               </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
