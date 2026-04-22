import { getSafeSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");

  const apiCatalog = {
    linkset: [
      {
        anchor: `${siteUrl}`,
        links: [
          {
            rel: "service-desc",
            href: `${siteUrl}/docs/api`,
            type: "application/openapi+json",
            title: "OpenAPI specification for The Drive Center API",
          },
          {
            rel: "service-doc",
            href: `${siteUrl}/docs/api`,
            type: "text/html",
            title: "API documentation",
          },
          {
            rel: "status",
            href: `${siteUrl}/api/health`,
            type: "application/json",
            title: "API health endpoint",
          },
        ],
      },
    ],
  };

  return new Response(JSON.stringify(apiCatalog, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}