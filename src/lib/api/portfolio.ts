import { db } from "@/db";
import { cars } from "@/db/schema";
import { desc, eq, ilike, or, and, count, sql } from "drizzle-orm";

export interface PortfolioFilters {
  page?: number;
  limit?: number;
  search?: string;
  serviceType?: string;
}

export async function getPortfolio(filters: PortfolioFilters = {}) {
  const { page = 1, limit = 9, search, serviceType } = filters;
  const offset = (page - 1) * limit;

  const whereConditions = [];

  if (search) {
    whereConditions.push(
      or(
        ilike(cars.title, `%${search}%`),
        ilike(cars.description, `%${search}%`)
      )
    );
  }

  if (serviceType && serviceType !== "all") {
    whereConditions.push(eq(cars.serviceType, serviceType));
  }

  const where = whereConditions.length > 0 ? and(...whereConditions) : undefined;

  const [data, totalResult] = await Promise.all([
    db.query.cars.findMany({
      where,
      orderBy: [desc(cars.createdAt)],
      limit,
      offset,
      with: {
        media: true,
      },
    }),
    db
      .select({ value: count() })
      .from(cars)
      .where(where),
  ]);

  const total = totalResult[0].value;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
