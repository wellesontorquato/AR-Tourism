import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const poi = await prisma.poi.findUnique({
      where: { id: params.id },
    });

    if (!poi) {
      return NextResponse.json(
        { ok: false, error: "Ponto turístico não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, poi });
  } catch (error) {
    console.error("ERRO GET /api/pois/[id]:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Erro ao buscar ponto turístico",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
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

    const poiExists = await prisma.poi.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!poiExists) {
      return NextResponse.json(
        { ok: false, error: "Ponto turístico não encontrado" },
        { status: 404 }
      );
    }

    const poi = await prisma.poi.update({
      where: { id: params.id },
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

    return NextResponse.json({ ok: true, poi });
  } catch (error) {
    console.error("ERRO PATCH /api/pois/[id]:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Erro ao atualizar ponto turístico",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const session = getAdminSession();

    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Não autorizado" },
        { status: 401 }
      );
    }

    const poiExists = await prisma.poi.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!poiExists) {
      return NextResponse.json(
        { ok: false, error: "Ponto turístico não encontrado" },
        { status: 404 }
      );
    }

    await prisma.poi.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("ERRO DELETE /api/pois/[id]:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Erro ao remover ponto turístico",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}