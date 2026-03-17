"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

interface UserMenuProps {
  session: any;
}

export function UserMenu({ session }: UserMenuProps) {
  if (!session) {
    return (
      <Button asChild size="lg" className="rounded-2xl px-8 h-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black shadow-lg shadow-emerald-500/30 transition-all active:scale-95 border border-emerald-400/20">
        <Link href="/sign-in">دخول</Link>
      </Button>
    );
  }

  const userRole = (session?.user as { role?: string } | undefined)?.role;
  const canOpenAdmin = userRole === "admin" || userRole === "owner";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-3xl pr-2 pl-5 h-12 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/20 bg-black/5 dark:bg-white/5 transition-all hover:bg-black/10 flex items-center gap-3 group cursor-pointer">
          <Avatar className="size-9 border-2 border-emerald-500/30 transition-transform group-hover:scale-105">
            <AvatarImage src={session.user.image || ""} />
            <AvatarFallback className="text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black">
              {session.user.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-black hidden lg:inline text-foreground/80 dark:text-emerald-50/90 group-hover:text-foreground dark:group-hover:text-white transition-colors">{session.user.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-3xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-black/5 dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl">
        <DropdownMenuLabel className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">لوحة التحكم</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-black/5 dark:bg-white/10 mx-2 mb-2" />
        <DropdownMenuItem asChild className="p-0 focus:bg-emerald-500/5 dark:focus:bg-emerald-500/10 focus:text-emerald-700 dark:focus:text-emerald-400">
          <Link 
            href="/dashboard/garage" 
            className="group/item cursor-pointer rounded-2xl p-4 flex items-center gap-4 font-bold transition-all duration-300 w-full
              text-zinc-700 dark:text-zinc-200 
              hover:text-emerald-700 dark:hover:text-emerald-400
              hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20
              border border-transparent hover:border-emerald-500/20 dark:hover:border-emerald-500/30 overflow-hidden shadow-xs hover:shadow-md"
          >
            <div className="size-8 rounded-lg bg-emerald-500/10 group-hover/item:bg-emerald-500/20 flex items-center justify-center transition-colors">
              <LayoutDashboard className="h-4 w-4 text-emerald-600 dark:text-emerald-500 transition-colors" />
            </div>
            <span className="transition-colors">كراجي (My Garage)</span>
          </Link>
        </DropdownMenuItem>
        
        {canOpenAdmin && (
          <>
            <DropdownMenuSeparator className="bg-black/5 dark:bg-white/10 mx-2 mb-2" />
            <DropdownMenuItem asChild className="p-0 focus:bg-emerald-500/5 dark:focus:bg-emerald-500/10 focus:text-emerald-700 dark:focus:text-emerald-400">
              <Link 
                href="/admin" 
                className="group/item cursor-pointer rounded-2xl p-4 flex items-center gap-4 font-bold transition-all duration-300 w-full
                  text-zinc-700 dark:text-zinc-200 
                  hover:text-emerald-700 dark:hover:text-emerald-400
                  hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20
                  border border-transparent hover:border-emerald-500/20 dark:hover:border-emerald-500/30 overflow-hidden shadow-xs hover:shadow-md"
              >
                <div className="size-8 rounded-lg bg-indigo-500/10 group-hover/item:bg-indigo-500/20 flex items-center justify-center transition-colors">
                  <LayoutDashboard className="h-4 w-4 text-indigo-600 dark:text-indigo-500 transition-colors" />
                </div>
                <span className="transition-colors">إدارة المركز</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="p-0 focus:bg-emerald-500/5 dark:focus:bg-emerald-500/10 focus:text-emerald-700 dark:focus:text-emerald-400">
              <Link 
                href="/admin/customer-cars" 
                className="group/item cursor-pointer rounded-2xl p-4 flex items-center gap-4 font-bold transition-all duration-300 w-full
                  text-zinc-700 dark:text-zinc-200 
                  hover:text-emerald-700 dark:hover:text-emerald-400
                  hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20
                  border border-transparent hover:border-emerald-500/20 dark:hover:border-emerald-500/30 overflow-hidden shadow-xs hover:shadow-md"
              >
                <div className="size-8 rounded-lg bg-amber-500/10 group-hover/item:bg-amber-500/20 flex items-center justify-center transition-colors">
                  <LayoutDashboard className="h-4 w-4 text-amber-600 dark:text-amber-500 transition-colors" />
                </div>
                <span className="transition-colors">سيارات العملاء</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5 px-2">
          <DropdownMenuItem
            onClick={() => authClient.signOut()}
            className="group/logout flex items-center gap-4 rounded-2xl p-4 font-bold cursor-pointer transition-all duration-300
              text-red-600 dark:text-red-400 
              hover:bg-red-500/10 dark:hover:bg-red-500/20
              hover:text-red-700 dark:hover:text-red-300
              focus:bg-red-500/10 dark:focus:bg-red-500/20
              focus:text-red-700 dark:focus:text-red-300
              border border-transparent hover:border-red-500/20 dark:hover:border-red-500/30"
          >
            <div className="size-8 rounded-lg bg-red-500/10 group-hover/logout:bg-red-500/20 flex items-center justify-center transition-colors">
              <LogOut className="h-4 w-4 text-red-600 dark:text-red-400 group-hover/logout:text-red-700 dark:group-hover:text-red-300 transition-colors" />
            </div>
            <span className="transition-colors">تسجيل خروج</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
