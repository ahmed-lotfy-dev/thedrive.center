import { db } from "@/db";
import { cars } from "@/db/schema";
import { desc } from "drizzle-orm";
import type { MetadataRoute } from "next";

export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://thedrive.center";

  // Fetch all cars for dynamic routes
  const allCars = await db.query.cars.findMany({
    orderBy: [desc(cars.createdAt)],
  });

  const carRoutes = allCars.map((car) => ({
    url: `${siteUrl}/cars/${car.id}`,
    lastModified: car.updatedAt || car.createdAt || new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const staticRoutes = [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${siteUrl}/cars`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${siteUrl}/book`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  return [...staticRoutes, ...carRoutes];
}
