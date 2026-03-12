import type { MetadataRoute } from "next";

export const revalidate = 0;

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/admin/", "/onboarding/", "/sign-in/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
