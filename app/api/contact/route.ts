import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ── Rate limiting en mémoire : 5 messages / IP / heure ───────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

// ── Vérification Cloudflare Turnstile ────────────────────────────────────────
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // pas configuré → on laisse passer (dev)

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token, remoteip: ip }),
  });
  const data = await res.json();
  return data.success === true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  // 1. Rate limiting
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de messages envoyés. Réessayez dans une heure." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { name, email, subject, message, _hp, cfToken } = body;

  // 2. Honeypot — un bot remplit ce champ caché, un humain ne le voit pas
  if (_hp) {
    return NextResponse.json({ ok: true }); // silencieux : le bot croit avoir réussi
  }

  // 3. Validation des champs
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
  }

  // 4. Vérification Turnstile
  const turnstileOk = await verifyTurnstile(cfToken ?? "", ip);
  if (!turnstileOk) {
    return NextResponse.json(
      { error: "Vérification de sécurité échouée. Rechargez la page et réessayez." },
      { status: 403 }
    );
  }

  // 5. Envoi SMTP
  const smtpHost   = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const smtpPort   = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const smtpSecure = process.env.SMTP_SECURE === "true";
  const smtpUser   = process.env.SMTP_USER;
  const smtpPass   = process.env.SMTP_PASS;
  const smtpFrom   = process.env.SMTP_FROM ?? smtpUser;
  const contactTo  = process.env.CONTACT_EMAIL ?? smtpUser;

  if (!smtpUser || !smtpPass) {
    console.error("[contact] SMTP_USER ou SMTP_PASS non configuré");
    return NextResponse.json({ error: "Service indisponible." }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const subjectLine = `[StopArnaque Contact] ${subject} — ${name}`;
  const safeMessage = message.replace(/</g, "&lt;");

  const adminHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <div style="border-left:4px solid #E8112D;padding-left:16px;margin-bottom:24px">
        <h2 style="margin:0;color:#1a1a2e">Nouveau message de contact</h2>
        <p style="margin:4px 0 0;color:#64748b;font-size:14px">StopArnaque Bénin</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
        <tr><td style="padding:8px 0;color:#64748b;font-size:13px;width:120px">Nom</td><td style="padding:8px 0;font-weight:600">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#E8112D">${email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Sujet</td><td style="padding:8px 0">${subject}</td></tr>
      </table>
      <div style="background:#f8fafc;border-radius:8px;padding:16px">
        <p style="margin:0 0 8px;font-size:13px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Message</p>
        <p style="margin:0;line-height:1.7;white-space:pre-wrap">${safeMessage}</p>
      </div>
      <p style="margin-top:24px;font-size:12px;color:#94a3b8">
        IP : ${ip} · ${new Date().toLocaleString("fr-FR", { timeZone: "Africa/Porto-Novo" })}
      </p>
    </div>
  `;

  const confirmHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <div style="border-left:4px solid #008751;padding-left:16px;margin-bottom:24px">
        <h2 style="margin:0;color:#1a1a2e">Message bien reçu ✓</h2>
        <p style="margin:4px 0 0;color:#64748b;font-size:14px">StopArnaque Bénin</p>
      </div>
      <p style="color:#374151;line-height:1.7">Bonjour <strong>${name}</strong>,</p>
      <p style="color:#374151;line-height:1.7">
        Nous avons bien reçu votre message concernant <strong>${subject}</strong>.
        Notre équipe vous répondra dans un délai de <strong>48 heures ouvrées</strong>.
      </p>
      <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:20px 0;border-left:3px solid #e2e8f0">
        <p style="margin:0 0 6px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em">Votre message</p>
        <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6;white-space:pre-wrap">${safeMessage}</p>
      </div>
      <p style="color:#374151;line-height:1.7">
        Si votre demande concerne un signalement, suivez son statut sur
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/suivi" style="color:#E8112D">stopanarque.bj/suivi</a>.
      </p>
      <p style="color:#374151">L'équipe StopArnaque Bénin</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0"/>
      <p style="font-size:11px;color:#94a3b8">Accusé de réception automatique. Ne répondez pas à cet email.</p>
    </div>
  `;

  await Promise.all([
    transporter.sendMail({
      from: smtpFrom, to: contactTo, replyTo: email,
      subject: subjectLine, html: adminHtml,
      text: `${name} <${email}>\n\nSujet : ${subject}\n\n${message}`,
    }),
    transporter.sendMail({
      from: smtpFrom, to: email,
      subject: "Votre message a bien été reçu — StopArnaque Bénin",
      html: confirmHtml,
      text: `Bonjour ${name},\n\nNous avons bien reçu votre message concernant "${subject}".\nNotre équipe vous répondra dans un délai de 48 heures ouvrées.\n\nL'équipe StopArnaque Bénin`,
    }),
  ]);

  return NextResponse.json({ ok: true });
}
