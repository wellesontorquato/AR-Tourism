"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main id="top" className="min-h-screen bg-[#f7fbfc] text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-emerald-500 text-white shadow-sm">
              <span className="text-sm font-black">GA</span>
            </div>

            <div>
              <p className="text-base font-black tracking-tight text-slate-900">
                Go Alagoas
              </p>
              <p className="text-xs text-slate-500">
                turismo interativo com identidade local
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#explorar"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Explorar
            </a>
            <a
              href="#colecoes"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Coleções
            </a>
            <a
              href="#experiencia"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Experiência
            </a>
            <a
              href="#sobre"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Sobre
            </a>
          </nav>

          <div className="hidden md:block">
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Abrir experiência
            </Link>
          </div>

          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {menuOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
              <a
                href="#explorar"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Explorar
              </a>
              <a
                href="#colecoes"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Coleções
              </a>
              <a
                href="#experiencia"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Experiência
              </a>
              <a
                href="#sobre"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Sobre
              </a>

              <Link
                href="/app"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-2xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Abrir experiência
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="relative min-h-[92vh] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(8,15,28,0.35), rgba(8,15,28,0.55)), url('/images/alagoas/hero-pajucara.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_24%)]" />

          <div className="relative mx-auto grid min-h-[92vh] max-w-7xl items-end gap-10 px-4 pb-10 pt-20 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-14">
            <div className="max-w-3xl text-white">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] backdrop-blur-md">
                descubra alagoas com mais profundidade
              </span>

              <h1 className="mt-6 text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-7xl">
                Turismo com cara de
                <span className="block text-cyan-200">Alagoas de verdade</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
                Explore praias, orlas, lagoas, cultura e experiências locais em
                uma plataforma visual, leve e pronta para evoluir para app.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Começar a explorar
                </Link>

                <a
                  href="#colecoes"
                  className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
                >
                  Ver coleções
                </a>
              </div>
            </div>

            {/* Cards estilo app */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              <article className="rounded-[2rem] border border-white/15 bg-white/12 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <div
                  className="aspect-[9/14] overflow-hidden rounded-[1.5rem] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(15,23,42,0.05), rgba(15,23,42,0.35)), url('/images/alagoas/card-praia.jpg')",
                  }}
                >
                  <div className="flex h-full flex-col justify-between p-4">
                    <span className="w-fit rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                      praia
                    </span>
                    <div className="rounded-[1.25rem] bg-white/85 p-4 text-slate-900 backdrop-blur">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        em destaque
                      </p>
                      <h3 className="mt-2 text-lg font-black">
                        Pajuçara e arredores
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Perfeito para receber foto real da orla e jangadas.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-[2rem] border border-white/15 bg-white/12 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <div
                  className="aspect-[9/14] overflow-hidden rounded-[1.5rem] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(15,23,42,0.05), rgba(15,23,42,0.35)), url('/images/alagoas/card-lagoa.jpg')",
                  }}
                >
                  <div className="flex h-full flex-col justify-between p-4">
                    <span className="w-fit rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                      natureza
                    </span>
                    <div className="rounded-[1.25rem] bg-white/85 p-4 text-slate-900 backdrop-blur">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        coleção visual
                      </p>
                      <h3 className="mt-2 text-lg font-black">
                        Lagoas e paisagens
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Ideal para dar diversidade e identidade ao projeto.
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORAR */}
      <section id="explorar" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              explorar
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Uma experiência turística mais bonita, clara e preparada para o mobile.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              O Go Alagoas nasce com visual premium, estrutura flexível e blocos
              visuais que valorizam o que o estado tem de mais marcante.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-2xl">
                📍
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Descoberta por localização
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Lugares próximos, contexto e descoberta de pontos turísticos ao redor.
              </p>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                🌴
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Identidade visual local
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Cores, fotos e respiro inspirados no mar, nas lagoas e na luz de Alagoas.
              </p>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl">
                📱
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Estrutura pronta para app
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Layout pensado para migrar depois para uma experiência mobile mais imersiva.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* COLEÇÕES */}
      <section
        id="colecoes"
        className="bg-[linear-gradient(180deg,#ffffff_0%,#effbfc_100%)] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                coleções visuais
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Blocos prontos para receber fotos reais de Alagoas.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Aqui você pode destacar paisagens, praias, lagoas, cultura e experiências locais.
              </p>
            </div>

            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Abrir experiência
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <div
                className="aspect-[4/5] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(15,23,42,0.05), rgba(15,23,42,0.28)), url('/images/alagoas/colecao-praias.jpg')",
                }}
              />
              <div className="p-6">
                <h3 className="text-lg font-black text-slate-900">Praias e orlas</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Use imagens amplas com mar cristalino, coqueiros, areia clara e jangadas.
                </p>
              </div>
            </article>

            <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <div
                className="aspect-[4/5] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(15,23,42,0.05), rgba(15,23,42,0.28)), url('/images/alagoas/colecao-lagoas.jpg')",
                }}
              />
              <div className="p-6">
                <h3 className="text-lg font-black text-slate-900">Lagoas e natureza</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Traga variedade visual mostrando natureza, água, vegetação e horizontes.
                </p>
              </div>
            </article>

            <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <div
                className="aspect-[4/5] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(15,23,42,0.05), rgba(15,23,42,0.28)), url('/images/alagoas/colecao-cultura.jpg')",
                }}
              />
              <div className="p-6">
                <h3 className="text-lg font-black text-slate-900">Cultura e história</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Ideal para centro histórico, artesanato, arquitetura e experiências locais.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* EXPERIÊNCIA */}
      <section id="experiencia" className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.95fr_1.05fr] lg:px-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              experiência
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Visual com proporção de app e navegação mais envolvente.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Os blocos ao lado simulam melhor como o projeto pode ser percebido
              no celular, ajudando a vender a ideia de produto digital.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-900">
                  Estrutura de descoberta
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Destaques, contexto e conteúdo turístico em um fluxo visual simples.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-900">
                  Mais cara de produto
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Os cards verticais ajudam a comunicar a futura experiência mobile.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              <div
                className="aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(15,23,42,0.08), rgba(15,23,42,0.35)), url('/images/alagoas/app-card-1.jpg')",
                }}
              >
                <div className="flex h-full flex-col justify-end p-4">
                  <div className="rounded-[1.25rem] bg-white/90 p-4 backdrop-blur-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      destaque
                    </p>
                    <h3 className="mt-2 text-lg font-black text-slate-900">
                      Rota turística
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Ideal para foto vertical com bastante impacto visual.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              <div
                className="aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(15,23,42,0.08), rgba(15,23,42,0.35)), url('/images/alagoas/app-card-2.jpg')",
                }}
              >
                <div className="flex h-full flex-col justify-end p-4">
                  <div className="rounded-[1.25rem] bg-white/90 p-4 backdrop-blur-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      coleção
                    </p>
                    <h3 className="mt-2 text-lg font-black text-slate-900">
                      Experiência local
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Perfeito para transmitir lifestyle e conexão com o lugar.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* CTA / SOBRE */}
      <section
        id="sobre"
        className="bg-[linear-gradient(180deg,#0f172a_0%,#132238_100%)] py-20 text-white sm:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              sobre o projeto
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Uma base visual quase pronta para publicar e evoluir depois para app.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Com boas imagens reais de Alagoas, essa home já ganha cara de
              produto turístico premium e comunica muito melhor o valor da ideia.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Abrir experiência
            </Link>
            <a
              href="#top"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white/90 transition hover:bg-white/5"
            >
              Voltar ao topo
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-base font-black text-slate-900">Go Alagoas</p>
            <p className="mt-1 text-sm text-slate-500">
              turismo interativo com leveza, identidade e experiência local
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <a href="#explorar" className="transition hover:text-slate-900">
              Explorar
            </a>
            <a href="#colecoes" className="transition hover:text-slate-900">
              Coleções
            </a>
            <a href="#experiencia" className="transition hover:text-slate-900">
              Experiência
            </a>
            <a href="#sobre" className="transition hover:text-slate-900">
              Sobre
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}