"use client";

export default function Modal({
  open,
  onClose,
  title,
  children
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center p-3">
        <div className="w-full sm:max-w-2xl rounded-2xl bg-[#0b1220] border border-white/15 shadow-xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between gap-3">
            <div className="font-bold text-lg">{title}</div>
            <button
              onClick={onClose}
              className="rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-sm font-semibold"
            >
              Fechar
            </button>
          </div>
          <div className="p-4 max-h-[70vh] overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
