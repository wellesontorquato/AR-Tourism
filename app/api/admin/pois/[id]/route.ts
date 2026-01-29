import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthedServer } from "@/lib/auth";
import { clampLatLng } from "@/lib/geo";

function requireAdmin() {
  if (!isAdminAuthedServer()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const denied = requireAdmin();
  if (denied) return denied;

  const form = await req.formData();
  const methodOverride = String(form.get("_method") ?? "").toLowerCase();

  if (methodOverride === "delete") {
    await prisma.poi.delete({ where: { id: params.id } }).catch(() => {});
    return NextResponse.redirect(new URL("/admin/pois", req.url));
  }

  // PUT via override
  const title = String(form.get("title") ?? "").trim();
  const latitude = Number(form.get("latitude"));
  const longitude = Number(form.get("longitude"));
  const shortFact = String(form.get("shortFact") ?? "").trim();
  const fullStory = String(form.get("fullStory") ?? "").trim();
  const curatorName = String(form.get("curatorName") ?? "").trim();
  const tags = String(form.get("tags") ?? "").trim() || null;
  const audioUrl = String(form.get("audioUrl") ?? "").trim() || null;
  const isPublished = form.get("isPublished") === "1";

  if (!title || !shortFact || !fullStory || !curatorName) {
    return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 });
  }

  try {
    clampLatLng(latitude, longitude);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }

  await prisma.poi.update({
    where: { id: params.id },
    data: { title, latitude, longitude, shortFact, fullStory, curatorName, tags, audioUrl, isPublished }
  });

  return NextResponse.redirect(new URL("/admin/pois", req.url));
}
