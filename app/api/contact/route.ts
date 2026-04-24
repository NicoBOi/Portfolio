import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const FROM = "sempere.studio <contact@sempere.studio>";
const TO = "nicosmp.pro@gmail.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// In-memory IP rate limit. Survives across requests on the same warm
// serverless instance; cold starts reset it, which is acceptable for a
// low-traffic portfolio form. 5 submissions per 10-minute window per IP.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const rateLimitMap = new Map<string, { count: number; reset: number }>();

function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  // Opportunistic cleanup so the map can't grow unbounded.
  if (rateLimitMap.size > 500) {
    for (const [key, value] of rateLimitMap) {
      if (value.reset < now) rateLimitMap.delete(key);
    }
  }
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.reset) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count++;
  return true;
}

function sanitize(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de demandes — réessayez dans quelques minutes" },
      { status: 429 },
    );
  }

  // Refuse anything bigger than ~32KB so a malicious payload can't eat
  // memory parsing JSON it won't pass validation anyway.
  const len = Number(request.headers.get("content-length") ?? 0);
  if (len > 32 * 1024) {
    return NextResponse.json({ error: "Requête trop volumineuse" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  // Honeypot — bots fill this, humans can't see it
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const name = sanitize(body.name, 100);
  const email = sanitize(body.email, 200);
  const type = sanitize(body.type, 50);
  const message = sanitize(body.message, 5000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Nom, email et message requis" },
      { status: 400 }
    );
  }
  if (name.length < 2) {
    return NextResponse.json({ error: "Nom trop court" }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: "Message trop court" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY missing");
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  const subject = `Brief — ${name}`;
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,system-ui,sans-serif;font-size:15px;color:#111;line-height:1.6;max-width:560px">
      <h2 style="font-weight:500;font-size:17px;margin:0 0 24px;color:#000">Nouveau brief</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 16px 6px 0;color:#666;width:100px;vertical-align:top">Nom</td><td style="padding:6px 0">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:6px 16px 6px 0;color:#666;vertical-align:top">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(email)}" style="color:#111">${escapeHtml(email)}</a></td></tr>
        ${type ? `<tr><td style="padding:6px 16px 6px 0;color:#666;vertical-align:top">Type</td><td style="padding:6px 0">${escapeHtml(type)}</td></tr>` : ""}
      </table>
      <div style="margin:28px 0 0;padding:20px;background:#f6f6f6;border-radius:6px;white-space:pre-wrap">${escapeHtml(message)}</div>
      <p style="margin:32px 0 0;color:#999;font-size:12px">Envoyé depuis sempere.studio</p>
    </div>
  `;

  const text = [
    `Nouveau brief`,
    ``,
    `Nom : ${name}`,
    `Email : ${email}`,
    type ? `Type : ${type}` : null,
    ``,
    message,
    ``,
    `— sempere.studio`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject,
      html,
      text,
    });
    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Envoi impossible" }, { status: 502 });
    }
  } catch (err) {
    console.error("Send failed:", err);
    return NextResponse.json({ error: "Envoi impossible" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
