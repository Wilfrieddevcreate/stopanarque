import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24h

const SECRET = process.env.SESSION_SECRET;
if (!SECRET && process.env.NODE_ENV === "production") {
  throw new Error("SESSION_SECRET environment variable is required in production.");
}
const EFFECTIVE_SECRET = SECRET ?? "dev-only-insecure-secret-do-not-use-in-production";

function signToken(sessionId: string): string {
  const hmac = crypto.createHmac("sha256", EFFECTIVE_SECRET).update(sessionId).digest("hex");
  return Buffer.from(`${sessionId}.${hmac}`).toString("base64url");
}

function verifyToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const lastDot = decoded.lastIndexOf(".");
    if (lastDot === -1) return null;
    const sessionId = decoded.slice(0, lastDot);
    const signature = decoded.slice(lastDot + 1);
    const expected = crypto.createHmac("sha256", EFFECTIVE_SECRET).update(sessionId).digest("hex");
    // Constant-time comparison to prevent timing attacks
    if (
      signature.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"))
    ) return null;
    return sessionId;
  } catch {
    return null;
  }
}

export async function authenticateAdmin(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;
  return user;
}

export async function createSession(userId: string): Promise<void> {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  // Clean up expired sessions for this user (housekeeping)
  await prisma.session.deleteMany({
    where: { userId, expiresAt: { lt: new Date() } },
  });

  const session = await prisma.session.create({
    data: { userId, expiresAt },
  });

  const token = signToken(session.id);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_TTL_MS / 1000,
    path: "/",
  });
}

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const sessionId = verifyToken(token);
  if (!sessionId) return null;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    // Expired — clean up and reject
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
    return null;
  }

  return session.user;
}

export async function destroySession(): Promise<void> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) {
    const sessionId = verifyToken(token);
    if (sessionId) {
      // Revoke from DB immediately — token is now dead even if intercepted
      await prisma.session.delete({ where: { id: sessionId } }).catch(() => {});
    }
  }
  (await cookies()).delete(SESSION_COOKIE);
}

// Revoke all sessions for a user (e.g. password change, security incident)
export async function destroyAllSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({ where: { userId } });
}
