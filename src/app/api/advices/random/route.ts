import { NextResponse } from "next/server";
import { adviceQueries } from "@/db/queries/advices";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const all = await adviceQueries.findActive();
    if (all.length === 0) {
      return NextResponse.json(null);
    }
    const randomIndex = Math.floor(Math.random() * all.length);
    return NextResponse.json(all[randomIndex]);
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}