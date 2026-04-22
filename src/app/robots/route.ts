import { getSafeSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export function GET() {
  const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");
  const content = `User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Host: ${siteUrl}
Sitemap: ${siteUrl}/sitemap.xml
Content-Signal: ai-train=no, search=yes, ai-input=no`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}