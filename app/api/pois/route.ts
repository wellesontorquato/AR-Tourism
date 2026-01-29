import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

// GET /api/pois  (list)
export async function GET() {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  const pois = await prisma.poi.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ ok: true, pois });
}

// POST /api/pois (create)
export async function POST(req: Request) {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Não autorizado" },
      { status: 401 }
    );
  }

  const body = await req.json().catch(() => ({}));

  const name = String(body?.name || "").trim();
  const lat = Number(body?.lat);
  const lng = Number(body?.lng);

  if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      { ok: false, error: "Campos obrigatórios: name, lat, lng" },
      { status: 400 }
    );
  }

  const poi = await prisma.poi.create({
    data: {
      name,
      description: body?.description ? String(body.description) : null,
      category: body?.category ? String(body.category) : null,
      address: body?.address ? String(body.address) : null,
      imageUrl: body?.imageUrl ? String(body.imageUrl) : null,
      arUrl: body?.arUrl ? String(body.arUrl) : null,
      lat,
      lng,
    },
  });

  return NextResponse.json({ ok: true, poi }, { status: 201 });
}
