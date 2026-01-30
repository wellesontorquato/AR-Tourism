import { cookies } from "next/headers";
import crypto from "node:crypto";

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
  // retorna hex
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(user: string) {
  const issuedAt = Date.now();
  // token format: user.issuedAt.sigHex
  const payload = `${user}.${issuedAt}`;
  const sigHex = sign(payload);
  return `${payload}.${sigHex}`;
}

function hexToUint8(hex: string): Uint8Array {
  // garante "bytes" reais (não Buffer) para satisfazer Node 22 + TS
  return Uint8Array.from(Buffer.from(hex, "hex"));
}

export function verifySessionToken(token: string): AdminSession | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [user, issuedAtStr, sigHex] = parts;

  if (!user || !issuedAtStr || !sigHex) return null;
  if (!/^\d+$/.test(issuedAtStr)) return null; // issuedAt só dígitos
  if (!/^[0-9a-f]+$/i.test(sigHex)) return null; // assinatura hex

  const payload = `${user}.${issuedAtStr}`;
  const expectedHex = sign(payload);

  // evita timing attacks (comparação constante)
  let ok = false;
  try {
    const a = hexToUint8(expectedHex);
    const b = hexToUint8(sigHex);
    ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return null;
  }

  if (!ok) return null;

  const issuedAt = Number(issuedAtStr);
  if (!Number.isFinite(issuedAt)) return null;

  // expira em 7 dias
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
    maxAge: 60 * 60 * 24 * 7 // 7 dias
  });
}

export function clearAdminSessionCookie() {
  cookies().set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}

export function getAdminCredentials() {
  return {
    user: process.env.ADMIN_USER || "admin",
    pass: process.env.ADMIN_PASS || "admin"
  };
}

export function isAdminAuthedServer() {
  return Boolean(getAdminSession());
}
