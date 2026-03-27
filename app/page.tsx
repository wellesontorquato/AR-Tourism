"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7fbfc] text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
              href="#experiencia"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Experiência
            </a>
            <a
              href="#descobrir"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Descobrir
            </a>
            <a
              href="#destaques"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Destaques
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
                href="#experiencia"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Experiência
              </a>
              <a
                href="#descobrir"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Descobrir
              </a>
              <a
                href="#destaques"
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Destaques
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.10),transparent_28%)]" />

        <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-24 lg:pt-16">
          <div className="relative z-10 flex flex-col justify-center">
            <span className="inline-flex w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
              turismo digital em alagoas
            </span>

            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Um jeito mais bonito, leve e inteligente de
              <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">
                {" "}
                explorar Alagoas
              </span>
              .
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Descubra praias, paisagens, cultura, história e experiências locais
              em uma plataforma feita para aproximar pessoas dos lugares mais
              marcantes do estado, com uma navegação moderna e pensada para o
              celular.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Começar a explorar
              </Link>

              <a
                href="#destaques"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Ver destaques
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Visual
                </p>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  Blocos prontos para fotos reais
                </p>
              </div>

              <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Mobile
                </p>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  Estrutura pensada para app
                </p>
              </div>

              <div className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Local
                </p>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  Identidade inspirada em Alagoas
                </p>
              </div>
            </div>
          </div>

          {/* MOCKUP / VISUAL PREMIUM */}
          <div className="relative">
            <div className="relative rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              <div className="grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
                <div className="overflow-hidden rounded-[1.75rem] bg-white p-3">
                  <div className="relative h-[380px] overflow-hidden rounded-[1.4rem] bg-[linear-gradient(180deg,#9be7f5_0%,#2ec5ff_45%,#16a34a_100%)]">
                    {/* Placeholder pronto para foto real */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.45),transparent_35%)]" />
                    <div className="absolute inset-x-0 top-4 px-4">
                      <div className="w-fit rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700 backdrop-blur">
                        foto destaque
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="rounded-[1.25rem] bg-white/88 p-4 backdrop-blur-md">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Ponto em destaque
                        </p>
                        <h2 className="mt-2 text-2xl font-black text-slate-900">
                          Praia de Pajuçara
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          Espaço ideal para receber imagem real da orla, jangadas,
                          mar cristalino e pôr do sol.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-[1.75rem] bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
                      experiência
                    </p>
                    <h3 className="mt-2 text-xl font-black text-slate-900">
                      Visual leve, limpo e acolhedor
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Um layout que transmite natureza, claridade, turismo e
                      sofisticação sem ficar pesado.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="overflow-hidden rounded-[1.75rem] bg-white p-3 shadow-sm">
                      <div className="h-36 rounded-[1.25rem] bg-[linear-gradient(180deg,#d9f8ff_0%,#c7f9e5_100%)]">
                        <div className="flex h-full items-end p-4">
                          <div className="rounded-2xl bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                            bloco para foto de lagoa
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-[1.75rem] bg-white p-3 shadow-sm">
                      <div className="h-36 rounded-[1.25rem] bg-[linear-gradient(180deg,#fff2c7_0%,#fde68a_100%)]">
                        <div className="flex h-full items-end p-4">
                          <div className="rounded-2xl bg-white/90 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
                            bloco para foto cultural
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Feito para evoluir
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      A base visual já prepara o caminho para virar app depois,
                      sem perder clareza e identidade.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-4 hidden rounded-3xl border border-white/80 bg-white/90 px-5 py-4 shadow-[0_18px_40px_rgba(15,23,42,0.10)] md:block">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                identidade visual
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                águas claras, natureza, sol e leveza
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIÊNCIA */}
      <section id="experiencia" className="py-18 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              experiência
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Um produto com cara de turismo, tecnologia e descoberta.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              A proposta do Go Alagoas é unir navegação intuitiva, contexto
              turístico e identidade local em uma experiência visual elegante,
              acolhedora e preparada para crescer.
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
                Lugares próximos e experiências ao redor do usuário em uma
                jornada mais útil e contextual.
              </p>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                🌴
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Identidade inspirada em Alagoas
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Cores, respiro visual e composição pensados para refletir o mar,
                as lagoas, a natureza e a luz do estado.
              </p>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl">
                📱
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Base pronta para app
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Uma estrutura visual que já nasce preparada para evoluir para uma
                aplicação mobile com muito mais imersão.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* DESCOBRIR */}
      <section
        id="descobrir"
        className="bg-[linear-gradient(180deg,#ffffff_0%,#f2fbfd_100%)] py-18 sm:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.95fr_1.05fr] lg:px-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              descobrir
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Blocos pensados para destacar os cenários mais bonitos do estado.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Aqui entram fotos reais de praias, lagoas, centros históricos,
              gastronomia e experiências locais, criando uma vitrine premium para
              o projeto.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-900">
                  Praias e orlas
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Espaço para cenas amplas, mar, jangadas, coqueiros e pôr do sol.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-900">
                  Lagoas e natureza
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Ideal para reforçar a identidade natural de Alagoas além do
                  litoral.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-900">
                  Cultura e história
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Blocos para agregar contexto local e enriquecer a experiência.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm">
              <div className="h-64 rounded-[1.5rem] bg-[linear-gradient(180deg,#a5f3fc_0%,#38bdf8_55%,#0f766e_100%)] p-4">
                <div className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                  foto principal
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm">
              <div className="h-64 rounded-[1.5rem] bg-[linear-gradient(180deg,#d9f99d_0%,#4ade80_100%)] p-4">
                <div className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                  natureza / lagoa
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm">
              <div className="h-64 rounded-[1.5rem] bg-[linear-gradient(180deg,#fde68a_0%,#fb923c_100%)] p-4">
                <div className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                  cultura / centro histórico
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-3 shadow-sm">
              <div className="h-64 rounded-[1.5rem] bg-[linear-gradient(180deg,#bfdbfe_0%,#60a5fa_100%)] p-4">
                <div className="inline-flex rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                  experiência local
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section id="destaques" className="py-18 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
                destaques
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Uma apresentação mais bonita para o que Alagoas tem de melhor.
              </h2>
            </div>

            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Explorar agora
            </Link>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <div className="h-56 bg-[linear-gradient(180deg,#8de7f7_0%,#0ea5e9_100%)]" />
              <div className="p-6">
                <h3 className="text-lg font-black text-slate-900">
                  Praias icônicas
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Área perfeita para receber imagens reais de Pajuçara, Ponta
                  Verde, Francês, Gunga e outros cenários emblemáticos.
                </p>
              </div>
            </article>

            <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <div className="h-56 bg-[linear-gradient(180deg,#bbf7d0_0%,#16a34a_100%)]" />
              <div className="p-6">
                <h3 className="text-lg font-black text-slate-900">
                  Natureza e paisagem
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Blocos que valorizam a pluralidade do estado com leveza,
                  elegância e sensação de descoberta.
                </p>
              </div>
            </article>

            <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
              <div className="h-56 bg-[linear-gradient(180deg,#fde68a_0%,#f59e0b_100%)]" />
              <div className="p-6">
                <h3 className="text-lg font-black text-slate-900">
                  Cultura e vivência local
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Espaço ideal para enriquecer a plataforma com memória,
                  identidade e contexto regional.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* CTA / SOBRE */}
      <section
        id="sobre"
        className="bg-[linear-gradient(180deg,#0f172a_0%,#132238_100%)] py-18 text-white sm:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              sobre o projeto
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Uma base premium para apresentar Alagoas com mais impacto e mais identidade.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              O Go Alagoas nasce como experiência web e já se organiza como
              produto digital escalável, com foco em leveza visual, navegação
              intuitiva e valorização do turismo local.
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
            <a href="#experiencia" className="transition hover:text-slate-900">
              Experiência
            </a>
            <a href="#descobrir" className="transition hover:text-slate-900">
              Descobrir
            </a>
            <a href="#destaques" className="transition hover:text-slate-900">
              Destaques
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