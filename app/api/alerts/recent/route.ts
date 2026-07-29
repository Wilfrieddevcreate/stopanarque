import { NextResponse } from "next/server";
import { getRecentAlerts } from "@/lib/statistics";

export async function GET() {
  const alerts = await getRecentAlerts();
  return NextResponse.json({ alerts }, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  });
}
