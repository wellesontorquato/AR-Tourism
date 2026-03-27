"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "@/components/AdminNav";
import Modal from "@/components/Modal";
import PoiForm, { PoiFormValues } from "@/components/PoiForm";

type Poi = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  address?: string | null;
  imageUrl?: string | null;
  arUrl?: string | null;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
};

type DashboardCardProps = {
  label: string;
  value: string | number;
  help?: string;
};

export default function AdminPage() {
  const [pois, setPois] = useState<Poi[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);

  async function loadPois() {
    try {
      setLoading(true);
      const res = await fetch("/api/pois", { cache: "no-store" });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        alert(data?.error || "Erro ao carregar pontos turísticos.");
        setPois([]);
        return;
      }

      setPois(Array.isArray(data.pois) ? data.pois : []);
    } catch {
      alert("Erro ao carregar pontos turísticos.");
      setPois([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPois();
  }, []);

  const categories = useMemo(() => {
    const list = Array.from(
      new Set(
        pois
          .map((poi) => (poi.category || "").trim())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));

    return list;
  }, [pois]);

  const filteredPois = useMemo(() => {
    const term = query.trim().toLowerCase();

    return pois.filter((poi) => {
      const matchesQuery =
        !term ||
        poi.name.toLowerCase().includes(term) ||
        (poi.category || "").toLowerCase().includes(term) ||
        (poi.address || "").toLowerCase().includes(term);

      const matchesCategory =
        categoryFilter === "all" || (poi.category || "") === categoryFilter;

      return matchesQuery && matchesCategory;
    });
  }, [pois, query, categoryFilter]);

  const totalWithImage = pois.filter((p) => !!p.imageUrl).length;
  const totalWithDescription = pois.filter((p) => !!p.description).length;
  const totalCategories = categories.length;

  async function handleCreate(values: PoiFormValues) {
    try {
      setSaving(true);

      const res = await fetch("/api/pois", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          lat: Number(values.lat),
          lng: Number(values.lng),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        alert(data?.error || "Erro ao criar ponto turístico.");
        return;
      }

      setCreateOpen(false);
      await loadPois();
    } catch {
      alert("Erro ao criar ponto turístico.");
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(values: PoiFormValues) {
    if (!selectedPoi) return;

    try {
      setSaving(true);

      const res = await fetch(`/api/pois/${selectedPoi.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          lat: Number(values.lat),
          lng: Number(values.lng),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        alert(data?.error || "Erro ao atualizar ponto turístico.");
        return;
      }

      setEditOpen(false);
      setSelectedPoi(null);
      await loadPois();
    } catch {
      alert("Erro ao atualizar ponto turístico.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedPoi) return;

    try {
      setSaving(true);

      const res = await fetch(`/api/pois/${selectedPoi.id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        alert(data?.error || "Erro ao remover ponto turístico.");
        return;
      }

      setDeleteOpen(false);
      setSelectedPoi(null);
      await loadPois();
    } catch {
      alert("Erro ao remover ponto turístico.");
    } finally {
      setSaving(false);
    }
  }

  function openEdit(poi: Poi) {
    setSelectedPoi(poi);
    setEditOpen(true);
  }

  function openDelete(poi: Poi) {
    setSelectedPoi(poi);
    setDeleteOpen(true);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <AdminNav />

      <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Gerencie os pontos turísticos do aplicativo
            </p>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">
              Dashboard de Pontos Turísticos
            </h2>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700"
          >
            + Novo ponto turístico
          </button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            label="Total de pontos"
            value={pois.length}
            help="Quantidade total cadastrada"
          />
          <DashboardCard
            label="Categorias"
            value={totalCategories}
            help="Categorias ativas na base"
          />
          <DashboardCard
            label="Com imagem"
            value={totalWithImage}
            help="Pontos com URL de imagem"
          />
          <DashboardCard
            label="Com descrição"
            value={totalWithDescription}
            help="Pontos com conteúdo textual"
          />
        </div>

        <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Buscar ponto turístico
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nome, categoria ou endereço..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">
                Filtrar categoria
              </span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="all">Todas</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Pontos cadastrados
              </h3>
              <p className="text-sm text-slate-500">
                {loading
                  ? "Carregando..."
                  : `${filteredPois.length} resultado(s) encontrado(s)`}
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {loading && (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                Carregando pontos turísticos...
              </div>
            )}

            {!loading && filteredPois.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                Nenhum ponto turístico encontrado.
              </div>
            )}

            {!loading &&
              filteredPois.map((poi) => (
                <article
                  key={poi.id}
                  className="grid gap-4 px-5 py-5 lg:grid-cols-[1.5fr_1fr_auto]"
                >
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h4 className="truncate text-lg font-bold text-slate-900">
                        {poi.name}
                      </h4>

                      <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                        {poi.category || "Sem categoria"}
                      </span>
                    </div>

                    <p className="mb-2 text-sm text-slate-600">
                      {poi.address || "Endereço não informado"}
                    </p>

                    <div className="grid gap-1 text-xs text-slate-500">
                      <span>
                        <strong>Latitude:</strong> {poi.lat}
                      </span>
                      <span>
                        <strong>Longitude:</strong> {poi.lng}
                      </span>
                      <span>
                        <strong>Imagem:</strong>{" "}
                        {poi.imageUrl ? "Disponível" : "Não informada"}
                      </span>
                      <span>
                        <strong>AR:</strong>{" "}
                        {poi.arUrl ? "Disponível" : "Não informado"}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1 text-sm font-semibold text-slate-700">
                      Descrição
                    </p>
                    <p className="line-clamp-4 text-sm text-slate-500">
                      {poi.description || "Sem descrição cadastrada."}
                    </p>
                  </div>

                  <div className="flex flex-row gap-2 lg:flex-col">
                    <button
                      onClick={() => openEdit(poi)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => openDelete(poi)}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                    >
                      Remover
                    </button>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </section>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Novo ponto turístico"
      >
        <PoiForm
          mode="create"
          loading={saving}
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
        />
      </Modal>

      <Modal
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedPoi(null);
        }}
        title="Editar ponto turístico"
      >
        <PoiForm
          mode="edit"
          loading={saving}
          initialData={
            selectedPoi
              ? {
                  name: selectedPoi.name,
                  description: selectedPoi.description ?? "",
                  category: selectedPoi.category ?? "",
                  address: selectedPoi.address ?? "",
                  imageUrl: selectedPoi.imageUrl ?? "",
                  arUrl: selectedPoi.arUrl ?? "",
                  lat: String(selectedPoi.lat),
                  lng: String(selectedPoi.lng),
                }
              : undefined
          }
          onSubmit={handleEdit}
          onCancel={() => {
            setEditOpen(false);
            setSelectedPoi(null);
          }}
        />
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedPoi(null);
        }}
        title="Remover ponto turístico"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Tem certeza que deseja remover{" "}
            <strong>{selectedPoi?.name || "este ponto"}</strong>?
          </p>

          <p className="text-sm text-red-600">
            Essa ação não poderá ser desfeita.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              onClick={handleDelete}
              disabled={saving}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {saving ? "Removendo..." : "Sim, remover"}
            </button>

            <button
              onClick={() => {
                setDeleteOpen(false);
                setSelectedPoi(null);
              }}
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </main>
  );
}

function DashboardCard({ label, value, help }: DashboardCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
        {value}
      </p>
      {help && <p className="mt-2 text-xs text-slate-400">{help}</p>}
    </div>
  );
}