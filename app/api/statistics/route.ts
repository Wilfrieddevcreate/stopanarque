import { NextResponse } from "next/server";
import { getStatistics } from "@/lib/statistics";

export async function GET() {
  const data = await getStatistics();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
