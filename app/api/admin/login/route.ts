import { NextResponse } from "next/server";
import {
  createSessionToken,
  getAdminCredentials,
  setAdminSessionCookie,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const username = String(body?.username || "");
  const password = String(body?.password || "");

  const creds = getAdminCredentials();

  if (username !== creds.user || password !== creds.pass) {
    return NextResponse.json(
      { ok: false, error: "Credenciais inválidas" },
      { status: 401 }
    );
  }

  const token = createSessionToken(username);
  setAdminSessionCookie(token);

  return NextResponse.json({ ok: true });
}
