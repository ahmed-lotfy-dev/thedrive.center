import { db } from "@/db";
import { cars } from "@/db/schema";
import { desc, eq, ilike, or, and, count } from "drizzle-orm";
import { isKnownServiceType, type ServiceTypeValue } from "@/lib/constants";

export interface ShowcaseFilters {
  page?: number;
  limit?: number;
  search?: string;
  serviceType?: string;
}

export async function getShowcaseCars(filters: ShowcaseFilters = {}) {
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
    if (isKnownServiceType(serviceType)) {
      whereConditions.push(eq(cars.serviceType, serviceType as ServiceTypeValue));
    }
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
