import { NextResponse } from "next/server";
import { getStatistics } from "@/lib/statistics";

export async function GET() {
  try {
    const data = await getStatistics();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json(
      { totalReports: 0, confirmedReports: 0, totalSearches: 0, thisMonthReports: 0, reportsPerMonth: [], topScamTypes: [], topPlatforms: [], topNumbers: [] },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}
