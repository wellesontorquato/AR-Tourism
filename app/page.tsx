"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-sm">
              <span className="text-sm font-black">GA</span>
            </div>
            <div>
              <p className="text-base font-black leading-none text-slate-900">
                Go Alagoas
              </p>
              <p className="text-xs text-slate-500">Turismo interativo</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#descubra" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Descubra
            </a>
            <a href="#como-funciona" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Como funciona
            </a>
            <a href="#destaques" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Destaques
            </a>
            <a href="#sobre" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Sobre
            </a>
          </nav>

          <div className="hidden md:block">
            <Link
              href="/app"
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Abrir aplicativo
            </Link>
          </div>

          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 md:hidden"
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
                href="#descubra"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Descubra
              </a>
              <a
                href="#como-funciona"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Como funciona
              </a>
              <a
                href="#destaques"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Destaques
              </a>
              <a
                href="#sobre"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Sobre
              </a>

              <Link
                href="/app"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Abrir aplicativo
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#ecfeff_35%,#ffffff_100%)]">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_60%)]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Explore Alagoas
            </span>

            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Descubra praias, cultura e lugares incríveis de Alagoas com uma experiência simples e viva.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              O Go Alagoas foi pensado para aproximar turistas e moradores dos
              pontos mais especiais do estado, com uma navegação leve, intuitiva
              e feita para o celular.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="rounded-full bg-slate-900 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Começar a explorar
              </Link>

              <a
                href="#descubra"
                className="rounded-full border border-slate-300 bg-white px-6 py-3.5 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Ver mais
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Praias e orlas</p>
                <p className="mt-1 text-sm text-slate-500">Descubra destinos ao redor</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">História e cultura</p>
                <p className="mt-1 text-sm text-slate-500">Mais contexto sobre cada lugar</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">Experiência mobile</p>
                <p className="mt-1 text-sm text-slate-500">Feita para usar no celular</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl">
              <div className="rounded-[1.5rem] bg-[linear-gradient(160deg,#67e8f9_0%,#22c55e_100%)] p-5">
                <div className="rounded-[1.25rem] bg-white p-5 shadow-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Em destaque</p>
                      <h2 className="mt-1 text-2xl font-black text-slate-900">
                        Pajuçara
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Um dos cenários mais conhecidos de Alagoas, com mar,
                        jangadas, orla e experiências que conectam paisagem,
                        cultura e turismo.
                      </p>
                    </div>

                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
                      Maceió
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Descoberta
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        Lugares próximos a você
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Experiência
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        Navegação leve e intuitiva
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#e0f2fe_0%,#f0fdf4_100%)] p-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Inspirado em</p>
                        <p className="mt-1 text-xl font-black text-slate-900">
                          mar, lagoas, sol e natureza
                        </p>
                      </div>
                      <div className="h-16 w-16 rounded-full bg-yellow-300/80 blur-sm" />
                    </div>
                    <div className="mt-4 flex gap-3">
                      <div className="h-12 flex-1 rounded-full bg-cyan-300/70" />
                      <div className="h-12 w-20 rounded-full bg-emerald-300/70" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-lg md:block">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Alagoas
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                turismo, identidade e experiência local
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Descubra */}
      <section id="descubra" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Descubra
            </span>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              Um jeito mais agradável de conhecer Alagoas
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              A proposta é valorizar o que o estado tem de mais bonito e marcante,
              aproximando tecnologia e turismo de forma natural.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                📍
              </div>
              <h3 className="text-lg font-bold text-slate-900">Pontos turísticos</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Encontre praias, orlas, centros históricos, mirantes e lugares de interesse ao seu redor.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                🌴
              </div>
              <h3 className="text-lg font-bold text-slate-900">Cara de Alagoas</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Uma identidade visual inspirada nas águas claras, na natureza, nas lagoas e no clima acolhedor do estado.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                📱
              </div>
              <h3 className="text-lg font-bold text-slate-900">Pensado para app</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                O site já nasce com estrutura visual e de navegação preparada para evoluir depois para um aplicativo.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Como funciona
            </span>
            <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
              Simples para quem visita, útil para quem explora
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-slate-600">
              O usuário abre a experiência, encontra lugares de interesse e navega
              com facilidade em uma interface limpa, visual e amigável.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">1. Abrir a experiência</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                A pessoa acessa o app/site e começa a visualizar os pontos disponíveis.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">2. Explorar o entorno</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Lugares próximos, destaques turísticos e contexto sobre cada ponto.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">3. Descobrir melhor Alagoas</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                A experiência ajuda a enxergar o estado com mais profundidade, beleza e praticidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section id="destaques" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">
                Destaques
              </span>
              <h2 className="mt-3 text-3xl font-black text-slate-900 sm:text-4xl">
                Lugares e experiências que representam o estado
              </h2>
            </div>

            <Link
              href="/app"
              className="inline-flex rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Ver experiência
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="h-48 bg-[linear-gradient(180deg,#67e8f9_0%,#0ea5e9_100%)]" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900">Praias e orlas</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Visuais marcantes, águas claras e cenários que ajudam a construir a identidade do projeto.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="h-48 bg-[linear-gradient(180deg,#86efac_0%,#16a34a_100%)]" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900">Natureza e lagoas</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Um estado que vai além da praia e também se expressa na paisagem natural e nas lagoas.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="h-48 bg-[linear-gradient(180deg,#fde68a_0%,#f59e0b_100%)]" />
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900">Cultura local</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  História, identidade, memória e elementos locais que tornam a experiência mais rica.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="bg-slate-900 py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
              Sobre o projeto
            </span>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Um projeto para valorizar Alagoas de forma digital e acessível
            </h2>
          </div>

          <div>
            <p className="text-base leading-8 text-slate-300">
              O Go Alagoas nasce como uma proposta de turismo interativo, com foco
              em experiência, identidade visual local e facilidade de uso. A ideia
              é começar com uma base web sólida e evoluir depois para uma aplicação
              mobile ainda mais imersiva.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-base font-black text-slate-900">Go Alagoas</p>
            <p className="mt-1 text-sm text-slate-500">
              Turismo interativo com identidade local.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <a href="#descubra" className="transition hover:text-slate-900">
              Descubra
            </a>
            <a href="#como-funciona" className="transition hover:text-slate-900">
              Como funciona
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