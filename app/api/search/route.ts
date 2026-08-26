import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { clientIp } from "@/lib/validation";
import { checkBan } from "@/lib/security";

const MAX_QUERY = 200;
const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[\w]{2,}(\/\S*)?$/i;
const PHONE_RE = /^[+\d\s\-().]{7,}$/;

function maskPhone(phone: string): string {
  if (phone.length <= 6) return "****";
  return phone.slice(0, 3) + "****" + phone.slice(-2);
}

function extractDomain(input: string): string {
  try {
    const withProto = /^https?:\/\//i.test(input) ? input : `https://${input}`;
    const hostname = new URL(withProto).hostname;
    return hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return input.toLowerCase().replace(/^www\./i, "").split("/")[0];
  }
}

function detectType(q: string): "url" | "phone" | "general" {
  if (URL_RE.test(q.trim())) return "url";
  if (PHONE_RE.test(q.trim())) return "phone";
  return "general";
}

export async function GET(request: NextRequest) {
  const ip = clientIp(request);

  if (await checkBan(ip)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const { allowed, remaining, resetAt } = await checkRateLimit(ip, "search");
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans une minute." },
      { status: 429, headers: rateLimitHeaders(0, resetAt) }
    );
  }

  const raw = request.nextUrl.searchParams.get("q");
  if (!raw || !raw.trim()) {
    return NextResponse.json({ result: null });
  }

  const query = raw.trim().slice(0, MAX_QUERY);
  const queryType = detectType(query);

  let whereClause;
  let searchTerm: string;

  if (queryType === "url") {
    const domain = extractDomain(query);
    searchTerm = domain;
    whereClause = {
      OR: [
        { suspectUrl: { contains: domain } },
        { suspectAccount: { contains: domain } },
      ],
    };
  } else if (queryType === "phone") {
    const normalized = query.replace(/\s/g, "");
    searchTerm = normalized;
    whereClause = {
      OR: [
        { phoneNumber: { contains: normalized } },
        { suspectAccount: { contains: normalized } },
      ],
    };
  } else {
    searchTerm = query;
    whereClause = {
      OR: [
        { suspectName: { contains: query } },
        { suspectAccount: { contains: query } },
        { suspectUrl: { contains: query } },
      ],
    };
  }

  const reports = await prisma.report.findMany({
    where: whereClause,
    select: {
      phoneNumber: true,
      scamType: true,
      suspectName: true,
      suspectPlatform: true,
      suspectUrl: true,
    },
    take: 200,
  });

  if (reports.length === 0) {
    return NextResponse.json(
      { result: { query: searchTerm, queryType, count: 0, scamTypes: [], phones: [], names: [], platforms: [], urls: [] } },
      { headers: rateLimitHeaders(remaining, resetAt) }
    );
  }

  const scamTypes = [...new Set(reports.map((r) => r.scamType))];
  const phones = [...new Set(
    reports.map((r) => r.phoneNumber ? maskPhone(r.phoneNumber) : null).filter(Boolean) as string[]
  )];
  const names = [...new Set(reports.map((r) => r.suspectName).filter(Boolean) as string[])];
  const platforms = [...new Set(reports.map((r) => r.suspectPlatform).filter(Boolean) as string[])];
  // URLs: show only the domain part, deduplicated
  const urls = [...new Set(
    reports.map((r) => r.suspectUrl ? extractDomain(r.suspectUrl) : null).filter(Boolean) as string[]
  )];

  return NextResponse.json(
    { result: { query: searchTerm, queryType, count: reports.length, scamTypes, phones, names, platforms, urls } },
    { headers: rateLimitHeaders(remaining, resetAt) }
  );
}
