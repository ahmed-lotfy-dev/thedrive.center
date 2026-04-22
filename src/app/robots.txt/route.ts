import { getSafeSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSafeSiteUrl(
    process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center",
  );

  const lines = [
    "User-Agent: *",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /api/",
    "Disallow: /dashboard/",
    "Disallow: /onboarding/",
    "",
    "User-Agent: GPTBot",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /api/",
    "",
    "User-Agent: OAI-SearchBot",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /api/",
    "",
    "User-Agent: Claude-Web",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /api/",
    "",
    "User-Agent: Google-Extended",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /api/",
    "",
    "User-Agent: FacebookBot",
    "Allow: /",
    "",
    "User-Agent: Twitterbot",
    "Allow: /",
    "",
    `Host: ${siteUrl}`,
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
