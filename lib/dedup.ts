import { prisma } from "./prisma";

export async function findDuplicates(phoneNumber: string, scamType: string): Promise<string | null> {
  const normalized = phoneNumber.replace(/\s/g, "");

  const existing = await prisma.report.findFirst({
    where: {
      phoneNumber: normalized,
      scamType,
      status: { not: "REJETE" },
    },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  return existing?.id ?? null;
}
