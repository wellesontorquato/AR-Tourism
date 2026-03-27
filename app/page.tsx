"use client";

import Link from "next/link";
import { useState } from "react";

const heroHighlights = [
  {
    title: "Piscinas naturais de Pajuçara",
    text: "Um dos cenários mais conhecidos de Maceió, com jangadas, mar claro e experiência clássica para quem visita a capital.",
    image: "/images/alagoas/card-pajucara.jpg",
    tag: "Maceió",
  },
  {
    title: "Orla de Ponta Verde",
    text: "Uma das praias urbanas mais emblemáticas de Maceió, perfeita para caminhada, paisagem e vida à beira-mar.",
    image: "/images/alagoas/card-ponta-verde.jpg",
    tag: "Orla urbana",
  },
  {
    title: "Marechal Deodoro histórica",
    text: "Primeira capital de Alagoas e cidade ligada à história de Deodoro da Fonseca, unindo patrimônio e identidade local.",
    image: "/images/alagoas/card-marechal.jpg",
    tag: "História",
  },
];

const collections = [
  {
    title: "Pajuçara",
    subtitle: "Piscinas naturais e jangadas",
    description:
      "Pajuçara reúne orla urbana, jangadas e o passeio até as piscinas naturais, um dos cartões-postais mais lembrados de Maceió.",
    image: "/images/alagoas/colecao-pajucara.jpg",
    pill: "Mar e experiência",
  },
  {
    title: "Ponta Verde e Jatiúca",
    subtitle: "Praias urbanas de Maceió",
    description:
      "O trecho urbano mais famoso da capital reúne praia, calçadão, gastronomia e uma paisagem que ajuda a definir a imagem turística da cidade.",
    image: "/images/alagoas/colecao-orla-maceio.jpg",
    pill: "Orla da capital",
  },
  {
    title: "Marechal Deodoro",
    subtitle: "Centro histórico e memória",
    description:
      "Além da Praia do Francês, o município carrega valor histórico por ter sido a primeira capital do estado e berço de Deodoro da Fonseca.",
    image: "/images/alagoas/colecao-marechal.jpg",
    pill: "Cultura e história",
  },
];

const experienceCards = [
  {
    title: "Explorar perto de você",
    text: "Abra a experiência e descubra pontos turísticos ao redor com uma navegação mais visual e intuitiva.",
    icon: "📍",
  },
  {
    title: "Descobrir lugares marcantes",
    text: "Praias, orlas, centros históricos e experiências locais organizados de forma mais bonita e direta.",
    icon: "🌊",
  },
  {
    title: "Base pronta para app",
    text: "A linguagem visual e os blocos já apontam para uma evolução natural da plataforma para o mobile.",
    icon: "📱",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main id="top" className="min-h-screen bg-[#f6fbfc] text-slate-800">
      <header className="sticky top-0 z-50 border-b border-white/20 bg-white/75 backdrop-blur-xl">
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
            <a href="#explorar" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Explorar
            </a>
            <a href="#colecoes" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Coleções
            </a>
            <a href="#experiencia" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
              Experiência
            </a>
            <a href="#sobre" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
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

      <section className="relative overflow-hidden">
        <div
          className="relative min-h-[92vh] bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(8,15,28,0.28), rgba(8,15,28,0.58)), url('/images/alagoas/hero-pajucara.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_24%)]" />

          <div className="relative mx-auto grid min-h-[92vh] max-w-7xl gap-10 px-4 pb-10 pt-20 sm:px-6 lg:grid-cols-[1.02fr_.98fr] lg:px-8 lg:pb-14">
            <div className="flex flex-col justify-end text-white">
              <span className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] backdrop-blur-md">
                alagoas com mais beleza, contexto e descoberta
              </span>

              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-7xl">
                Explore praias, história e experiências de
                <span className="block text-cyan-200">Alagoas de um jeito mais vivo</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/85 sm:text-lg">
                Do mar de Pajuçara ao patrimônio de Marechal Deodoro, o Go Alagoas
                reúne lugares marcantes do estado em uma experiência pensada para
                quem quer descobrir mais no celular.
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
                  Ver lugares em destaque
                </a>
              </div>
            </div>

            <div className="self-end lg:pb-2">
              <div className="md:hidden">
                <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {heroHighlights.map((item) => (
                    <article
                      key={item.title}
                      className="min-w-[83%] snap-center rounded-[2rem] border border-white/15 bg-white/12 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
                    >
                      <div
                        className="aspect-[9/14] overflow-hidden rounded-[1.5rem] bg-cover bg-center"
                        style={{
                          backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.05), rgba(15,23,42,0.38)), url('${item.image}')`,
                        }}
                      >
                        <div className="flex h-full flex-col justify-between p-4">
                          <span className="w-fit rounded-full bg-white/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                            {item.tag}
                          </span>

                          <div className="rounded-[1.25rem] bg-white/88 p-4 text-slate-900 backdrop-blur">
                            <h3 className="text-lg font-black">{item.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="hidden gap-4 md:grid md:grid-cols-2">
                {heroHighlights.slice(0, 2).map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[2rem] border border-white/15 bg-white/12 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl"
                  >
                    <div
                      className="aspect-[9/14] overflow-hidden rounded-[1.5rem] bg-cover bg-center"
                      style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.05), rgba(15,23,42,0.38)), url('${item.image}')`,
                      }}
                    >
                      <div className="flex h-full flex-col justify-between p-4">
                        <span className="w-fit rounded-full bg-white/88 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                          {item.tag}
                        </span>

                        <div className="rounded-[1.25rem] bg-white/88 p-4 text-slate-900 backdrop-blur">
                          <h3 className="text-lg font-black">{item.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="explorar" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              explorar
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Uma forma mais clara de apresentar o melhor de Alagoas no mobile.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              A estrutura abaixo já comunica descoberta, contexto turístico e uma
              linguagem visual pronta para app.
            </p>
          </div>

          <div className="mt-10 md:hidden">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {experienceCards.map((card) => (
                <article
                  key={card.title}
                  className="min-w-[85%] snap-center rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
                >
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-2xl">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{card.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
            {experienceCards.map((card, index) => (
              <article
                key={card.title}
                className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
              >
                <div
                  className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${
                    index === 0
                      ? "bg-cyan-50"
                      : index === 1
                      ? "bg-emerald-50"
                      : "bg-amber-50"
                  }`}
                >
                  {card.icon}
                </div>
                <h3 className="text-lg font-black text-slate-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

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
                Lugares reais para transformar a home em uma vitrine de Alagoas.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Em vez de blocos genéricos, aqui entram destinos que já comunicam
                mar, cidade, história e identidade.
              </p>
            </div>

            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Abrir experiência
            </Link>
          </div>

          <div className="mt-10 md:hidden">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {collections.map((item) => (
                <article
                  key={item.title}
                  className="min-w-[86%] snap-center overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
                >
                  <div
                    className="aspect-[4/5] bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.05), rgba(15,23,42,0.28)), url('${item.image}')`,
                    }}
                  />
                  <div className="p-6">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                      {item.pill}
                    </span>
                    <h3 className="mt-3 text-xl font-black text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-sm font-medium text-slate-500">{item.subtitle}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-10 hidden gap-6 lg:grid lg:grid-cols-3">
            {collections.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]"
              >
                <div
                  className="aspect-[4/5] bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.05), rgba(15,23,42,0.28)), url('${item.image}')`,
                  }}
                />
                <div className="p-6">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    {item.pill}
                  </span>
                  <h3 className="mt-3 text-xl font-black text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">{item.subtitle}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experiencia" className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[.95fr_1.05fr] lg:px-8">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
              experiência
            </span>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Visual com proporção de app e mais conexão com os destinos.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Esses cards ajudam a vender melhor a ideia do Go Alagoas como um
              produto digital turístico e não só como um site institucional.
            </p>

            <div className="mt-8 grid gap-4">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-900">
                  Descoberta mais visual
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Fotos fortes e blocos verticais ajudam o usuário a entrar no clima do lugar.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-900">
                  Melhor leitura no celular
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  No mobile, os cards funcionam como carrosséis arrastáveis com foco em imagem.
                </p>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <article className="min-w-[84%] snap-center rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
                <div
                  className="aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(15,23,42,0.08), rgba(15,23,42,0.35)), url('/images/alagoas/app-card-pajucara.jpg')",
                  }}
                >
                  <div className="flex h-full flex-col justify-end p-4">
                    <div className="rounded-[1.25rem] bg-white/90 p-4 backdrop-blur-md">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        destaque
                      </p>
                      <h3 className="mt-2 text-lg font-black text-slate-900">
                        Pajuçara no mobile
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Um card vertical para comunicar mar, jangadas e descoberta.
                      </p>
                    </div>
                  </div>
                </div>
              </article>

              <article className="min-w-[84%] snap-center rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
                <div
                  className="aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(15,23,42,0.08), rgba(15,23,42,0.35)), url('/images/alagoas/app-card-marechal.jpg')",
                  }}
                >
                  <div className="flex h-full flex-col justify-end p-4">
                    <div className="rounded-[1.25rem] bg-white/90 p-4 backdrop-blur-md">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        história
                      </p>
                      <h3 className="mt-2 text-lg font-black text-slate-900">
                        Marechal Deodoro
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Patrimônio, centro histórico e identidade cultural no formato de app.
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <div className="hidden gap-5 sm:grid sm:grid-cols-2">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-[0_12px_35px_rgba(15,23,42,0.06)]">
              <div
                className="aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(to bottom, rgba(15,23,42,0.08), rgba(15,23,42,0.35)), url('/images/alagoas/app-card-pajucara.jpg')",
                }}
              >
                <div className="flex h-full flex-col justify-end p-4">
                  <div className="rounded-[1.25rem] bg-white/90 p-4 backdrop-blur-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      destaque
                    </p>
                    <h3 className="mt-2 text-lg font-black text-slate-900">
                      Pajuçara no mobile
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Um card vertical para comunicar mar, jangadas e descoberta.
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
                    "linear-gradient(to bottom, rgba(15,23,42,0.08), rgba(15,23,42,0.35)), url('/images/alagoas/app-card-marechal.jpg')",
                }}
              >
                <div className="flex h-full flex-col justify-end p-4">
                  <div className="rounded-[1.25rem] bg-white/90 p-4 backdrop-blur-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      história
                    </p>
                    <h3 className="mt-2 text-lg font-black text-slate-900">
                      Marechal Deodoro
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Patrimônio, centro histórico e identidade cultural no formato de app.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

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
              Uma home mais forte no mobile e mais coerente com o turismo de Alagoas.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Com imagens boas e esses blocos já preenchidos com destinos reais,
              a apresentação fica mais profissional, mais memorável e mais próxima
              do que um app turístico precisa comunicar.
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