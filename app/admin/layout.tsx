import { redirect } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import { getAdminSession } from "@/lib/auth";

export const metadata = {
  title: "Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getAdminSession();

  // Protege tudo em /admin (exceto /admin/login, que deve ficar fora deste layout via route group)
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="p-4 border-b border-slate-800">
          <div className="text-sm font-semibold text-slate-100">
            AR Tourism — Admin
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Logado como: <span className="text-slate-200">{session.user}</span>
          </div>
        </div>

        <div className="p-3">
          <AdminNav />
        </div>
      </aside>

      <main className="admin-content">
        <div className="container-page">{children}</div>
      </main>
    </div>
  );
}
