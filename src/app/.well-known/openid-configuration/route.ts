import { getSafeSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSafeSiteUrl(process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");

  const oidcConfig = {
    issuer: siteUrl,
    authorization_endpoint: `${siteUrl}/api/auth/sign-in`,
    token_endpoint: `${siteUrl}/api/auth/token`,
    userinfo_endpoint: `${siteUrl}/api/auth/get-session`,
    jwks_uri: `${siteUrl}/api/auth/oauth/jwks`,
    registration_endpoint: `${siteUrl}/api/auth/sign-up`,
    scopes_supported: ["openid", "email", "profile"],
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post"],
    code_challenge_methods_supported: ["S256"],
    revocation_endpoint: `${siteUrl}/api/auth/oauth/revoke`,
    end_session_endpoint: `${siteUrl}/api/auth/sign-out`,
  };

  return new Response(JSON.stringify(oidcConfig, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}