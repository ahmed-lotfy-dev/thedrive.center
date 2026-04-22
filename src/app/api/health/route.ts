import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "The Drive Center API",
    timestamp: new Date().toISOString(),
  });
}