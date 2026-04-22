import { getSafeSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSafeSiteUrl(process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");

  const resourceMetadata = {
    resource: `${siteUrl}/api`,
    authorization_servers: [`${siteUrl}`],
    scopes_supported: ["openid", "email", "profile", "read", "write"],
    bearer_methods_supported: ["header", "body", "query"],
    resource_signing_alg_values_supported: ["RS256", "ES256"],
    resource_documentation: `${siteUrl}/docs/api`,
    capabilities: ["resource", "retrieve", "replace", "revoke"],
  };

  return new Response(JSON.stringify(resourceMetadata, null, 2), {
    headers: {
      "Content-Type": "application/resource+json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}