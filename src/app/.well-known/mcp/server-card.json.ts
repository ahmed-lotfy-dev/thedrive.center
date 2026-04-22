import { getSafeSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");

  const serverCard = {
    schema_version: "1.0.0",
    server_info: {
      name: "The Drive Center API",
      version: "1.0.0",
      description: "Car inspection and wheel alignment services API",
    },
    transport: {
      type: "http",
      endpoint: `${siteUrl}/api/mcp`,
    },
    capabilities: {
      tools: {
        list: true,
      },
      resources: {
        list: true,
      },
    },
    auth: {
      type: "oauth",
      server: `${siteUrl}/.well-known/openid-configuration`,
    },
  };

  return new Response(JSON.stringify(serverCard, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}