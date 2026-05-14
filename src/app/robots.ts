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
      // Block AI crawlers entirely — crawl budget is better spent on Google
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "Claude-Web", disallow: "/" },
      { userAgent: "OAI-SearchBot", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      // Allow social preview crawlers
      { userAgent: "FacebookBot", allow: "/" },
      { userAgent: "Twitterbot", allow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
