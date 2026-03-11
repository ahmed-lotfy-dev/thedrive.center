import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle /en redirect logic
  if (pathname.startsWith("/en")) {
    const newPathname = pathname.replace("/en", "") || "/";
    return NextResponse.redirect(new URL(newPathname, request.url));
  }

  // 1. FEATURE FLAG: Maintenance Mode
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
  const isPublicAsset = pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".");
  // We allow access to dashboard, onboarding, and sign-in even in maintenance mode so the admin can work
  const isExcludedPath = pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding") || pathname.startsWith("/sign-in");

  if (isMaintenanceMode && pathname !== "/" && !isPublicAsset && !isExcludedPath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Get session for onboarding check
  // Note: auth.api.getSession typically works in Edge via headers in Better-Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  // If logged in but not onboarded, redirect to /onboarding
  if (session && !session.user.onboarded && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // Prevent onboarded users from going back to onboarding
  if (session && session.user.onboarded && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
     "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
