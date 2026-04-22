import { getSafeSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSafeSiteUrl(
    process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center",
  );

  const body = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /onboarding/

User-agent: GPTBot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: OAI-SearchBot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Claude-Web
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Google-Extended
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: FacebookBot
Allow: /

User-agent: Twitterbot
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
