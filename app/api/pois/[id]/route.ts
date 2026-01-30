import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

type Params = { params: { id: string } };

function normalizeId(id: string) {
  const v = String(id || "").trim();
  return v.length ? v : null;
}

// GET /api/pois/:id  ✅ PÚBLICO
export async function GET(_: Request, { params }: Params) {
  const id = normalizeId(params.id);
  if (!id) {
    return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
  }

  const poi = await prisma.poi.findUnique({ where: { id } });
  if (!poi) {
    return NextResponse.json({ ok: false, error: "POI não encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, poi });
}

// PUT /api/pois/:id 🔒 PROTEGIDO
export async function PUT(req: Request, { params }: Params) {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }

  const id = normalizeId(params.id);
  if (!id) {
    return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));

  const data: Record<string, any> = {};
  if (body?.name !== undefined) data.name = String(body.name).trim();
  if (body?.description !== undefined) data.description = body.description ? String(body.description) : null;
  if (body?.category !== undefined) data.category = body.category ? String(body.category) : null;
  if (body?.address !== undefined) data.address = body.address ? String(body.address) : null;
  if (body?.imageUrl !== undefined) data.imageUrl = body.imageUrl ? String(body.imageUrl) : null;
  if (body?.arUrl !== undefined) data.arUrl = body.arUrl ? String(body.arUrl) : null;
  if (body?.lat !== undefined) data.lat = Number(body.lat);
  if (body?.lng !== undefined) data.lng = Number(body.lng);

  if (data.lat !== undefined && !Number.isFinite(data.lat)) {
    return NextResponse.json({ ok: false, error: "lat inválido" }, { status: 400 });
  }
  if (data.lng !== undefined && !Number.isFinite(data.lng)) {
    return NextResponse.json({ ok: false, error: "lng inválido" }, { status: 400 });
  }

  try {
    const poi = await prisma.poi.update({ where: { id }, data });
    return NextResponse.json({ ok: true, poi });
  } catch {
    return NextResponse.json({ ok: false, error: "POI não encontrado" }, { status: 404 });
  }
}

// DELETE /api/pois/:id 🔒 PROTEGIDO
export async function DELETE(_: Request, { params }: Params) {
  const session = getAdminSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 401 });
  }

  const id = normalizeId(params.id);
  if (!id) {
    return NextResponse.json({ ok: false, error: "ID inválido" }, { status: 400 });
  }

  try {
    await prisma.poi.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "POI não encontrado" }, { status: 404 });
  }
}
