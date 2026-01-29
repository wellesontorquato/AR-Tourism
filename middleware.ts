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

  // Protege /api/pois
  if (isPoisApi && !hasSession) {
    return NextResponse.json(
      { ok: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/pois/:path*"],
};
