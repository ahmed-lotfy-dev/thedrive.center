"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  CalendarDays,
  Images,
  LogOut,
  Home,
  LayoutGrid,
  Sparkles,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";

const sidebarItems = [
  { title: "نظرة عامة", href: "/admin", icon: LayoutDashboard },
  { title: "الحجوزات", href: "/admin/appointments", icon: CalendarDays },
  { title: "سيارات العملاء", href: "/admin/customer-cars", icon: LayoutGrid },
  { title: "سجل التميز", href: "/admin/portfolio", icon: LayoutGrid },
  { title: "صورة الهيرو", href: "/admin/hero-image", icon: Images },
  { title: "نصيحة اليوم", href: "/admin/advices", icon: Sparkles },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/";
        },
      },
    });
  };

  return (
    <nav className="flex-1 p-4 space-y-2">
      {sidebarItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
            pathname === item.href
              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md font-bold"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <item.icon
            className={cn(
              "w-5 h-5 shrink-0",
              pathname === item.href
                ? "text-sidebar-primary-foreground"
                : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground"
            )}
          />
          <span>{item.title}</span>
        </Link>
      ))}

      <div className="pt-4 mt-4 border-t border-sidebar-border">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-2"
        >
          <Home className="w-5 h-5 opacity-70 shrink-0" />
          <span>عودة للموقع</span>
        </Link>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-4 py-6 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>تسجيل خروج</span>
        </Button>
      </div>
    </nav>
  );
}

function SidebarHeader() {
  return (
    <div className="p-5 border-b border-sidebar-border flex items-center gap-3">
      <div className="bg-emerald-500/20 p-2 rounded-lg w-9 h-9 flex items-center justify-center shrink-0">
        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">TD</span>
      </div>
      <span className="font-black text-base font-cairo tracking-wide">إدارة الموقع</span>
    </div>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* ─── DESKTOP SIDEBAR ──────────────────────────────────────── */}
      <div className="hidden lg:flex w-64 border-l bg-sidebar text-sidebar-foreground min-h-screen sticky top-0 flex-col shadow-xl shrink-0">
        <SidebarHeader />
        <SidebarNav />
      </div>

      {/* ─── MOBILE TOP BAR ───────────────────────────────────────── */}
      <div className="lg:hidden fixed top-0 right-0 left-0 z-50 h-14 bg-sidebar/95 backdrop-blur-md border-b border-sidebar-border flex items-center justify-between px-4 shadow-sm">
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-xl hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
          aria-label="فتح القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-black text-sm font-cairo">إدارة الموقع</span>
        <div className="bg-emerald-500/20 p-1.5 rounded-lg w-8 h-8 flex items-center justify-center">
          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">TD</span>
        </div>
      </div>

      {/* ─── MOBILE SHEET ─────────────────────────────────────────── */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
          <SheetTitle className="sr-only">قائمة الإدارة</SheetTitle>
          <SidebarHeader />
          <SidebarNav onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
