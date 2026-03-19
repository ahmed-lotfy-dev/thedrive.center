import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { isMaintenanceModeEnabled } from "@/lib/site-state";

function isAdminRole(role?: string | null) {
  return role === "admin" || role === "owner";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/en")) {
    const newPathname = pathname.replace("/en", "") || "/";
    return NextResponse.redirect(new URL(newPathname, request.url));
  }

  const isMaintenanceMode = isMaintenanceModeEnabled();
  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".");
  const isExcludedPath =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/sign-in");

  if (isMaintenanceMode && pathname !== "/" && !isPublicAsset && !isExcludedPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const role = (session?.user as { role?: string } | undefined)?.role;

  if (pathname.startsWith("/admin")) {
    if (!session?.user || !isAdminRole(role)) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  if (session && !session.user.onboarded && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (session && session.user.onboarded && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
