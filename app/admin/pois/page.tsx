import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const metadata = {
  title: "POIs",
};

export default async function AdminPoisPage() {
  const session = getAdminSession();
  if (!session) redirect("/admin/login");

  const pois = await prisma.poi.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-100">POIs</h2>
          <p className="text-sm text-slate-400">
            Lista de pontos de interesse cadastrados.
          </p>
        </div>

        <Link href="/admin/pois/new" className="btn btn-primary">
          + Novo POI
        </Link>
      </div>

      <div className="card">
        {pois.length === 0 ? (
          <div className="text-sm text-slate-400">
            Nenhum POI cadastrado ainda. Clique em <b>Novo POI</b>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-400">
                <tr className="border-b border-slate-800">
                  <th className="py-2 text-left font-medium">Nome</th>
                  <th className="py-2 text-left font-medium">Categoria</th>
                  <th className="py-2 text-left font-medium">Lat/Lng</th>
                  <th className="py-2 text-right font-medium">Ações</th>
                </tr>
              </thead>

              <tbody>
                {pois.map((p) => (
                  <tr key={p.id} className="border-b border-slate-900">
                    <td className="py-3 text-slate-100">
                      <div className="font-semibold">{p.name}</div>
                      {p.address ? (
                        <div className="text-xs text-slate-400">{p.address}</div>
                      ) : null}
                    </td>
                    <td className="py-3 text-slate-200">
                      {p.category || <span className="text-slate-500">—</span>}
                    </td>
                    <td className="py-3 text-slate-200">
                      <span className="text-slate-300">
                        {p.lat.toFixed(6)}, {p.lng.toFixed(6)}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        className="btn btn-secondary"
                        href={`/admin/pois/${p.id}/edit`}
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
