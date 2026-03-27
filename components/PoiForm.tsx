"use client";

import { useEffect, useState } from "react";

export type PoiFormValues = {
  name: string;
  description: string;
  category: string;
  address: string;
  imageUrl: string;
  arUrl: string;
  lat: string;
  lng: string;
};

const initialValues: PoiFormValues = {
  name: "",
  description: "",
  category: "",
  address: "",
  imageUrl: "",
  arUrl: "",
  lat: "",
  lng: "",
};

type PoiFormProps = {
  mode: "create" | "edit";
  initialData?: Partial<PoiFormValues>;
  onSubmit: (values: PoiFormValues) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
};

export default function PoiForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: PoiFormProps) {
  const [values, setValues] = useState<PoiFormValues>(initialValues);

  useEffect(() => {
    setValues({
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? "",
      address: initialData?.address ?? "",
      imageUrl: initialData?.imageUrl ?? "",
      arUrl: initialData?.arUrl ?? "",
      lat: initialData?.lat ?? "",
      lng: initialData?.lng ?? "",
    });
  }, [initialData]);

  function updateField<K extends keyof PoiFormValues>(field: K, value: PoiFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Nome do ponto"
          value={values.name}
          onChange={(v) => updateField("name", v)}
          placeholder="Ex.: Praia de Pajuçara"
          required
        />

        <Field
          label="Categoria"
          value={values.category}
          onChange={(v) => updateField("category", v)}
          placeholder="Ex.: Praia, Museu, Igreja..."
        />
      </div>

      <TextAreaField
        label="Descrição"
        value={values.description}
        onChange={(v) => updateField("description", v)}
        placeholder="Descreva o ponto turístico..."
      />

      <Field
        label="Endereço"
        value={values.address}
        onChange={(v) => updateField("address", v)}
        placeholder="Ex.: Av. Dr. Antônio Gouveia, Maceió - AL"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Latitude"
          value={values.lat}
          onChange={(v) => updateField("lat", v)}
          placeholder="-9.6658"
          required
        />

        <Field
          label="Longitude"
          value={values.lng}
          onChange={(v) => updateField("lng", v)}
          placeholder="-35.7353"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="URL da imagem"
          value={values.imageUrl}
          onChange={(v) => updateField("imageUrl", v)}
          placeholder="https://..."
        />

        <Field
          label="URL do conteúdo AR"
          value={values.arUrl}
          onChange={(v) => updateField("arUrl", v)}
          placeholder="https://..."
        />
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-700 disabled:opacity-60"
        >
          {loading
            ? mode === "create"
              ? "Salvando..."
              : "Atualizando..."
            : mode === "create"
            ? "Adicionar ponto"
            : "Salvar alterações"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
      />
    </label>
  );
}