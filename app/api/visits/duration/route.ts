import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/validation";

const BOT_PATTERNS = /bot|crawler|spider|slurp|wget|curl|python|java|php/i;

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const { allowed } = await checkRateLimit(ip, "default");
  if (!allowed) return new NextResponse(null, { status: 204 });

  const ua = request.headers.get("user-agent") ?? "";
  if (BOT_PATTERNS.test(ua)) return new NextResponse(null, { status: 204 });

  try {
    const body = await request.json().catch(() => null);
    if (!body?.page || typeof body.page !== "string") {
      return new NextResponse(null, { status: 204 });
    }
    if (typeof body.duration !== "number" || body.duration < 3 || body.duration > 1800) {
      return new NextResponse(null, { status: 204 });
    }

    const page = body.page.slice(0, 200);
    const duration = Math.round(body.duration);

    prisma.pageVisit.create({ data: { page, duration } }).catch(() => {});
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 204 });
  }
}
