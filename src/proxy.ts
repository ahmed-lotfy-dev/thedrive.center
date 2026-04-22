import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { isMaintenanceModeEnabled } from "@/lib/site-state";
import { getSafeSiteUrl } from "@/lib/site-url";

function isAdminRole(role?: string | null) {
  return role === "admin" || role === "owner";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");

  if (pathname.startsWith("/en")) {
    const newPathname = pathname.replace("/en", "") || "/";
    return NextResponse.redirect(new URL(newPathname, request.url));
  }

  const acceptHeader = request.headers.get("Accept") || "";

  if (pathname === "/" && acceptHeader.includes("text/markdown")) {
    const markdownContent = `# The Drive Center - مركز فحص سيارات

## Services
- فحص شامل قبل البيع والشراء (Full Car Inspection)
- ضبط زوايا (Wheel Alignment)
- ترصيص عجلات (Tire Balancing)

## Contact
- العنوان: ${process.env.BUSINESS_ADDRESS || "المحلة الكبرى"}
- الهاتف: ${process.env.BUSINESS_PHONE || ""}

## APIs
- API Catalog: ${siteUrl}/.well-known/api-catalog
- OAuth Configuration: ${siteUrl}/.well-known/openid-configuration
- Protected Resource: ${siteUrl}/.well-known/oauth-protected-resource

---
Generated for AI agents. See RFC 8288 and RFC 9727 for standards.`;

    const response = new NextResponse(markdownContent, {
      headers: {
        "Content-Type": "text/markdown",
        "X-Markdown-Tokens": "basic",
      },
    });

    response.headers.set(
      "Link",
      `</.well-known/api-catalog>; rel="api-catalog", </docs/api>; rel="service-doc"`
    );

    return response;
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