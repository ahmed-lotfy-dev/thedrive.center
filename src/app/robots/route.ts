import { getSafeSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export function GET() {
  const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");
  const content = `# The Drive Center - Robots.txt
# https://thedrive.center

# Main crawl rules
User-Agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /onboarding/
Host: ${siteUrl}
Sitemap: ${siteUrl}/sitemap.xml
Content-Signal: ai-train=no, search=yes, ai-input=no

# AI Crawler rules
# GPTBot (OpenAI)
User-Agent: GPTBot
Allow: /
Disallow: /admin/
Disallow: /api/

# OAI-SearchBot (OpenAI)
User-Agent: OAI-SearchBot
Allow: /
Disallow: /admin/
Disallow: /api/

# Claude-Web (Anthropic)
User-Agent: Claude-Web
Allow: /
Disallow: /admin/
Disallow: /api/

# Google-Extended (Google AI)
User-Agent: Google-Extended
Allow: /
Disallow: /admin/
Disallow: /api/

# Facebook crawler
User-Agent: FacebookBot
Allow: /

# Twitter crawler  
User-Agent: Twitterbot
Allow: /`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}