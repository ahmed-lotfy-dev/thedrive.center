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
    { href: "/book", label: "احجز موعد" },
  ];

  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const canOpenAdmin = userRole === "admin" || userRole === "owner";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <div
        className={cn(
          "mx-auto flex h-16 md:h-20 max-w-7xl items-center justify-between rounded-2xl border pl-5 pr-2 transition-all duration-300",
          isScrolled ? "bg-background/95 shadow-md backdrop-blur-md" : "bg-background/80 backdrop-blur-sm"
        )}
      >
        <Link href="/" className="flex items-center gap-4">
          <img
            src="/logo.webp"
            alt="The Drive Logo"
            className="h-12 md:h-16 w-auto object-contain rounded-md"
          />
          <div className="leading-tight">
            <h1 className="text-xl font-bold">The Drive</h1>
            <p className="text-[11px] text-muted-foreground mr-1">مركز ضبط زوايا وترصيص</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm transition-colors",
                pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full pr-2 pl-3">
                  <Avatar className="size-7">
                    <AvatarImage src={session.user.image || ""} />
                    <AvatarFallback className="text-[10px]">
                      {session.user.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">{session.user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {canOpenAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      <LayoutDashboard className="ml-2 h-4 w-4" />
                      لوحة التحكم
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => authClient.signOut()}>
                  تسجيل خروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="rounded-full px-5">
              <Link href="/sign-in">دخول</Link>
            </Button>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex size-9 items-center justify-center rounded-lg border"
            aria-label="القائمة"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border bg-background p-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  pathname === link.href ? "bg-muted font-semibold" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
