import { NextResponse } from "next/server";
import { getStatistics } from "@/lib/statistics";
import { pruneOldLogs } from "@/lib/security";

export async function GET() {
  try {
    // Fire-and-forget: purge logs older than 90 days on ~1/20 requests
    if (Math.random() < 0.05) pruneOldLogs().catch(() => {});
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
