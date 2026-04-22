import { getSafeSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSafeSiteUrl(
    process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center",
  );

  const authorizationServer = {
    issuer: siteUrl,
    authorization_endpoint: `${siteUrl}/api/auth/sign-in`,
    token_endpoint: `${siteUrl}/api/auth/token`,
    jwks_uri: `${siteUrl}/api/auth/oauth/jwks`,
    registration_endpoint: `${siteUrl}/api/auth/sign-up`,
    scopes_supported: ["openid", "email", "profile"],
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post"],
    code_challenge_methods_supported: ["S256"],
    revocation_endpoint: `${siteUrl}/api/auth/oauth/revoke`,
  };

  return Response.json(authorizationServer, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
