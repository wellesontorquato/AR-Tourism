import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "ar_admin_session";

type AdminSession = {
  user: string;
  issuedAt: number;
};

function getSecret() {
  // IMPORTANTE: defina no .env em produção
  // SESSION_SECRET="uma_string_grande_e_unica"
  return process.env.SESSION_SECRET || "dev-secret-change-me";
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(user: string) {
  const issuedAt = Date.now();
  const payload = `${user}.${issuedAt}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): AdminSession | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [user, issuedAtStr, sig] = parts;
  const payload = `${user}.${issuedAtStr}`;
  const expected = sign(payload);

  // evita timing attacks simples
  const ok =
    expected.length === sig.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));

  if (!ok) return null;

  const issuedAt = Number(issuedAtStr);
  if (!Number.isFinite(issuedAt)) return null;

  // Mock: expira em 7 dias
  const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
  if (Date.now() - issuedAt > maxAgeMs) return null;

  return { user, issuedAt };
}

export function getAdminSession(): AdminSession | null {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function setAdminSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });
}

export function clearAdminSessionCookie() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function getAdminCredentials() {
  return {
    user: process.env.ADMIN_USER || "admin",
    pass: process.env.ADMIN_PASS || "admin",
  };
}
