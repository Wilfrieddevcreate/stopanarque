import { prisma } from "./prisma";

type RateLimitConfig = {
  windowMs: number;
  max: number;
};

const PRESETS = {
  // Login: 5 attempts per 15 min — blocks bruteforce
  login: { windowMs: 15 * 60 * 1000, max: 5 },
  // Report submission: 5 per minute
  report: { windowMs: 60 * 1000, max: 5 },
  // Search/tracking: 30 per minute
  search: { windowMs: 60 * 1000, max: 30 },
  // Generic public: 20 per minute
  default: { windowMs: 60 * 1000, max: 20 },
} satisfies Record<string, RateLimitConfig>;

export type RateLimitPreset = keyof typeof PRESETS;

export async function checkRateLimit(
  identifier: string,
  preset: RateLimitPreset = "default"
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const { windowMs, max } = PRESETS[preset];
  const now = new Date();
  const id = `rl:${preset}:${identifier}`;

  const existing = await prisma.rateLimit.findUnique({ where: { id } });

  if (!existing || existing.resetAt < now) {
    const resetAt = new Date(now.getTime() + windowMs);
    await prisma.rateLimit.upsert({
      where: { id },
      update: { count: 1, resetAt },
      create: { id, count: 1, resetAt },
    });
    return { allowed: true, remaining: max - 1, resetAt };
  }

  if (existing.count >= max) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  await prisma.rateLimit.update({
    where: { id },
    data: { count: existing.count + 1 },
  });

  return { allowed: true, remaining: max - existing.count - 1, resetAt: existing.resetAt };
}

export function rateLimitHeaders(remaining: number, resetAt: Date) {
  return {
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(resetAt.getTime() / 1000)),
    "Retry-After": String(Math.ceil((resetAt.getTime() - Date.now()) / 1000)),
  };
}
