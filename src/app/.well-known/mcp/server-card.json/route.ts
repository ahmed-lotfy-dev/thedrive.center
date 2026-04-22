import { getSafeSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSafeSiteUrl(
    process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center",
  );

  const serverCard = {
    serverInfo: {
      name: "The Drive Center API",
      version: "1.0.0",
      description: "Car inspection and wheel alignment services API",
    },
    transports: [
      {
        type: "http",
        url: `${siteUrl}/api/mcp`,
      },
    ],
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
    authentication: {
      type: "oauth2",
      openidConfigurationUrl: `${siteUrl}/.well-known/openid-configuration`,
      protectedResourceUrl: `${siteUrl}/.well-known/oauth-protected-resource`,
    },
  };

  return Response.json(serverCard, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
