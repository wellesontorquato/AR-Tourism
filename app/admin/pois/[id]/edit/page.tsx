import { redirect } from "next/navigation";
import PoiForm from "@/components/PoiForm";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const metadata = {
  title: "Editar POI",
};

export default async function EditPoiPage({
  params,
}: {
  params: { id: string };
}) {
  const session = getAdminSession();
  if (!session) redirect("/admin/login");

  const poi = await prisma.poi.findUnique({ where: { id: params.id } });
  if (!poi) redirect("/admin/pois");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-100">Editar POI</h2>
        <p className="text-sm text-slate-400">Atualize dados do ponto.</p>
      </div>

      <PoiForm
        mode="edit"
        initialValues={{
          id: poi.id,
          name: poi.name,
          description: poi.description,
          category: poi.category,
          address: poi.address,
          imageUrl: poi.imageUrl,
          arUrl: poi.arUrl,
          lat: poi.lat,
          lng: poi.lng,
        }}
      />
    </div>
  );
}
