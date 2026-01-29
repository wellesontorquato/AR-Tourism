import { redirect } from "next/navigation";
import PoiForm from "@/components/PoiForm";
import { getAdminSession } from "@/lib/auth";

export const metadata = {
  title: "Novo POI",
};

export default function NewPoiPage() {
  const session = getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-100">Novo POI</h2>
        <p className="text-sm text-slate-400">Cadastre um ponto de interesse.</p>
      </div>

      <PoiForm
        mode="create"
        initialValues={{
          name: "",
          description: "",
          category: "",
          address: "",
          imageUrl: "",
          arUrl: "",
          lat: "",
          lng: "",
        }}
      />
    </div>
  );
}
