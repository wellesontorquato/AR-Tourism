"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type PoiFormMode = "create" | "edit";

export type PoiFormValues = {
  id?: string;
  name: string;
  description?: string | null;
  category?: string | null;
  address?: string | null;
  imageUrl?: string | null;
  arUrl?: string | null;
  lat: number | string;
  lng: number | string;
};

export default function PoiForm({
  mode,
  initialValues,
}: {
  mode: PoiFormMode;
  initialValues: PoiFormValues;
}) {
  const router = useRouter();

  const [values, setValues] = useState<PoiFormValues>(initialValues);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = mode === "edit";

  const payload = useMemo(() => {
    const latNum =
      typeof values.lat === "string" ? Number(values.lat) : values.lat;
    const lngNum =
      typeof values.lng === "string" ? Number(values.lng) : values.lng;

    return {
      name: String(values.name || "").trim(),
      description: values.description ? String(values.description) : null,
      category: values.category ? String(values.category) : null,
      address: values.address ? String(values.address) : null,
      imageUrl: values.imageUrl ? String(values.imageUrl) : null,
      arUrl: values.arUrl ? String(values.arUrl) : null,
      lat: latNum,
      lng: lngNum,
    };
  }, [values]);

  function setField<K extends keyof PoiFormValues>(key: K, val: PoiFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const url = isEdit ? `/api/pois/${values.id}` : "/api/pois";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Erro ao salvar.");
        return;
      }

      router.push("/admin/pois");
      router.refresh();
    } catch {
      setError("Erro inesperado ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!values.id) return;
    const ok = confirm("Tem certeza que deseja excluir este POI?");
    if (!ok) return;

    setError(null);
    setDeleting(true);

    try {
      const res = await fetch(`/api/pois/${values.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Erro ao excluir.");
        return;
      }

      router.push("/admin/pois");
      router.refresh();
    } catch {
      setError("Erro inesperado ao excluir.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="card space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label">Nome *</label>
            <input
              className="input"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Ex.: Mirante da Cidade"
              required
            />
          </div>

          <div>
            <label className="label">Categoria</label>
            <input
              className="input"
              value={values.category || ""}
              onChange={(e) => setField("category", e.target.value)}
              placeholder="Ex.: Natureza, História..."
            />
          </div>

          <div>
            <label className="label">Endereço</label>
            <input
              className="input"
              value={values.address || ""}
              onChange={(e) => setField("address", e.target.value)}
              placeholder="Ex.: Centro"
            />
          </div>

          <div>
            <label className="label">Latitude *</label>
            <input
              className="input"
              value={values.lat}
              onChange={(e) => setField("lat", e.target.value)}
              placeholder="-9.649"
              required
            />
          </div>

          <div>
            <label className="label">Longitude *</label>
            <input
              className="input"
              value={values.lng}
              onChange={(e) => setField("lng", e.target.value)}
              placeholder="-35.708"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Descrição</label>
            <textarea
              className="input min-h-[110px]"
              value={values.description || ""}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Breve descrição do local..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Image URL</label>
            <input
              className="input"
              value={values.imageUrl || ""}
              onChange={(e) => setField("imageUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">AR URL</label>
            <input
              className="input"
              value={values.arUrl || ""}
              onChange={(e) => setField("arUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary disabled:opacity-60"
          >
            {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar POI"}
          </button>

          {isEdit ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="btn btn-danger disabled:opacity-60"
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </button>
          ) : null}
        </div>
      </div>
    </form>
  );
}
