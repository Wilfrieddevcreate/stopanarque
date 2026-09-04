import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Limite simple en mémoire : 5 soumissions par IP par heure
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

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de messages envoyés. Réessayez dans une heure." },
      { status: 429 }
    );
  }

  const { name, email, subject, message } = await req.json();

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
  }

  const smtpHost = process.env.SMTP_HOST ?? "smtp.gmail.com";
  const smtpPort = parseInt(process.env.SMTP_PORT ?? "587", 10);
  const smtpSecure = process.env.SMTP_SECURE === "true";
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM ?? smtpUser;
  const contactTo = process.env.CONTACT_EMAIL ?? smtpUser;

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

  const html = `
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
        <p style="margin:0;line-height:1.7;white-space:pre-wrap">${message.replace(/</g, "&lt;")}</p>
      </div>
      <p style="margin-top:24px;font-size:12px;color:#94a3b8">
        IP d'origine : ${ip} · ${new Date().toLocaleString("fr-FR", { timeZone: "Africa/Porto-Novo" })}
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: smtpFrom,
    to: contactTo,
    replyTo: email,
    subject: subjectLine,
    html,
    text: `${name} <${email}>\n\nSujet : ${subject}\n\n${message}`,
  });

  return NextResponse.json({ ok: true });
}
