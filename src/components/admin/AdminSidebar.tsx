"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CalendarDays, Images, LogOut, Home, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const sidebarItems = [
  { title: "نظرة عامة", href: "/admin", icon: LayoutDashboard },
  { title: "الحجوزات", href: "/admin/appointments", icon: CalendarDays },
  { title: "سجل التميز", href: "/admin/portfolio", icon: LayoutGrid },
  { title: "صور الهيرو", href: "/admin/carousel", icon: Images },
];

export function AdminSidebar() {
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
    <div className="w-64 border-l bg-sidebar text-sidebar-foreground h-screen sticky top-0 flex flex-col shadow-xl">
      <div className="p-6 border-b border-sidebar-border flex items-center gap-3">
        <div className="bg-primary/20 p-2 rounded-lg">
          <span className="text-sm font-bold">TD</span>
        </div>
        <span className="font-bold text-lg font-cairo tracking-wide">إدارة الموقع</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
              pathname === item.href
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md font-bold translate-x-1"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1"
            )}
          >
            <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/50 group-hover:text-sidebar-accent-foreground")} />
            <span>{item.title}</span>
          </Link>
        ))}

        <div className="pt-4 mt-4 border-t border-sidebar-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-2"
          >
            <Home className="w-5 h-5 opacity-70" />
            <span>عودة للموقع</span>
          </Link>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-4 py-6 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل خروج</span>
          </Button>
        </div>
      </nav>
    </div>
  );
}
