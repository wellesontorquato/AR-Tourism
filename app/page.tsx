import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl w-full rounded-2xl bg-white/10 border border-white/15 p-6 shadow-lg">
        <h1 className="text-2xl font-black">AR Turismo Cultural (MVP)</h1>
        <p className="mt-3 text-white/80">
          MVP com “AR leve”: câmera + GPS + bússola e curadoria via painel admin.
        </p>

        <div className="mt-6 grid gap-3">
          <Link
            href="/app"
            className="text-center rounded-xl bg-white text-black font-semibold py-3"
          >
            Abrir App do Turista
          </Link>
          <Link
            href="/admin"
            className="text-center rounded-xl bg-black/40 border border-white/20 font-semibold py-3"
          >
            Abrir Admin (Curadoria)
          </Link>
        </div>

        <p className="mt-6 text-sm text-white/60">
          Dica: para testar câmera/bússola, abra em um celular (HTTPS recomendado).
        </p>
      </div>
    </main>
  );
}
