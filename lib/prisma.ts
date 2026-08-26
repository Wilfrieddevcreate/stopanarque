import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  // DATABASE_URL set in env → use it (prod: file:/var/data/stopanarque.db, dev: file:./dev.db)
  // TURSO_DATABASE_URL set → use Turso cloud DB
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const dbUrl = tursoUrl
    ?? process.env.DATABASE_URL
    ?? `file:${path.join(process.cwd(), "dev.db")}`;

  const adapter = new PrismaLibSql({
    url: dbUrl,
    ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {}),
  });

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
