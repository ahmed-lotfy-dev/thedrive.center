import { MetadataRoute } from "next";
import { getSafeSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSafeSiteUrl(process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
