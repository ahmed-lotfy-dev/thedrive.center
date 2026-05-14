import type { MetadataRoute } from "next";
import { getSafeSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/dashboard/", "/api/", "/onboarding", "/sign-in"],
      },
      // Allow AI crawlers — we want to appear in ChatGPT, Claude, Gemini, Perplexity recommendations
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      // Allow social preview crawlers
      { userAgent: "FacebookBot", allow: "/" },
      { userAgent: "Twitterbot", allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
