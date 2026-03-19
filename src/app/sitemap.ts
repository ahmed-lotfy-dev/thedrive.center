import { MetadataRoute } from "next";
import { db } from "@/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center";
  const baseUrl = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;

  // Static routes
  const routes = ["", "cars", "book"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : route === "book" ? 0.9 : 0.8,
  }));

  // Dynamic routes from showcase
  try {
    const allCars = await db.query.cars.findMany({
      columns: {
        slug: true,
        updatedAt: true,
      },
      orderBy: (cars, { desc }) => [desc(cars.updatedAt)],
    });

    const carRoutes = allCars.map((car) => ({
      url: `${baseUrl}cars/${car.slug}`,
      lastModified: car.updatedAt || new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    return [...routes, ...carRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return routes;
  }
}
