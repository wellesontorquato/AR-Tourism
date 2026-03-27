"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminNav() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!res.ok) {
        alert("Não foi possível sair do painel.");
        return;
      }

      router.push("/admin/login");
      router.refresh();
    } catch {
      alert("Erro ao sair do painel.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-700">
            Go Alagoas
          </p>
          <h1 className="text-xl font-black text-slate-900">
            Painel Administrativo
          </h1>
        </div>

        <button
          onClick={handleLogout}
          disabled={loading}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          {loading ? "Saindo..." : "Sair"}
        </button>
      </div>
    </header>
  );
}