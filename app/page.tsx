import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-500 via-cyan-400 to-emerald-300 text-white">
      {/* Fundo decorativo */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-56 w-full bg-gradient-to-t from-emerald-900/20 to-transparent" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Lado esquerdo */}
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur-md">
              Turismo imersivo em Alagoas
            </span>

            <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Descubra <span className="text-amber-200">Alagoas</span> de um jeito
              mais vivo, local e interativo.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-lg">
              O <strong>Go Alagoas</strong> conecta tecnologia, localização e
              curadoria para apresentar praias, centros históricos, cultura,
              gastronomia e pontos turísticos do estado com uma experiência leve,
              intuitiva e pensada para turistas e alagoanos.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="rounded-2xl bg-white px-6 py-4 text-center text-base font-bold text-sky-700 shadow-xl transition hover:scale-[1.02] hover:bg-sky-50"
              >
                Explorar Alagoas
              </Link>

              <Link
                href="/admin"
                className="rounded-2xl border border-white/25 bg-black/15 px-6 py-4 text-center text-base font-semibold text-white backdrop-blur-md transition hover:scale-[1.02] hover:bg-black/25"
              >
                Painel de Curadoria
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                <p className="text-sm text-white/75">Experiência</p>
                <p className="mt-1 font-bold">Mapa + AR leve</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                <p className="text-sm text-white/75">Descoberta</p>
                <p className="mt-1 font-bold">Praias, cultura e história</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                <p className="text-sm text-white/75">Gestão</p>
                <p className="mt-1 font-bold">Curadoria por admin</p>
              </div>
            </div>
          </div>

          {/* Lado direito */}
          <div className="relative">
            <div className="rounded-[2rem] border border-white/20 bg-white/12 p-5 shadow-2xl backdrop-blur-xl">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-sky-200 via-cyan-100 to-emerald-100 p-5 text-slate-800">
                <div className="rounded-3xl bg-white p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Destino em destaque
                      </p>
                      <h2 className="text-2xl font-black text-sky-800">
                        Pajuçara
                      </h2>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      Alagoas
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl bg-gradient-to-br from-sky-500 via-cyan-400 to-emerald-400 p-6 text-white shadow-inner">
                    <p className="text-sm text-white/85">Experiência sugerida</p>
                    <p className="mt-2 text-xl font-extrabold">
                      Veja os pontos ao seu redor e descubra histórias, curiosidades e rotas.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-sky-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                        Localização
                      </p>
                      <p className="mt-1 font-bold text-slate-800">
                        Próximo de você
                      </p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                        Descoberta
                      </p>
                      <p className="mt-1 font-bold text-slate-800">
                        Cultura + paisagem
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Um guia digital com o clima das águas claras, da orla, das
                  lagoas, do artesanato, da gastronomia e da identidade alagoana.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-10">
          <p className="text-sm text-white/75">
            Dica: para testar câmera, bússola e geolocalização, abra em um celular
            com HTTPS.
          </p>
        </div>
      </div>
    </main>
  );
}