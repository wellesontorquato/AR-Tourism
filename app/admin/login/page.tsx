"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password })
    });

    setLoading(false);

    if (!res.ok) {
      setErr("Senha inválida.");
      return;
    }

    router.push("/admin/pois");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl bg-white/10 border border-white/15 p-6 shadow-lg">
        <h1 className="text-2xl font-black">Login Admin</h1>
        <p className="mt-2 text-white/70 text-sm">
          Entre com a senha definida em <code className="text-white">ADMIN_PASSWORD</code>.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl bg-black/30 border border-white/15 px-4 py-3 outline-none"
            placeholder="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <div className="text-sm text-red-200">{err}</div>}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-white text-black font-semibold py-3 disabled:opacity-70"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
