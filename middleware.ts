import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "ar_admin_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";
  const isPoisApi = pathname.startsWith("/api/pois");

  const hasSession = Boolean(req.cookies.get(COOKIE_NAME)?.value);

  // Protege /admin (exceto login)
  if (isAdminArea && !isAdminLogin && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // ✅ /api/pois: GET público, escrita protegida
  if (isPoisApi) {
    const method = req.method.toUpperCase();

    // Permite leitura pública (lista + detalhe)
    if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
      return NextResponse.next();
    }

    // Bloqueia escrita sem sessão (POST/PUT/PATCH/DELETE)
    if (!hasSession) {
      return NextResponse.json(
        { ok: false, error: "Não autorizado" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/pois/:path*"],
};
