"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

// O export default é OBRIGATÓRIO aqui
export default function Modal({ open, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Bloqueia o scroll do body quando aberto e escuta o ESC
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);

      return () => {
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [open, onClose]);

  // Evita renderizar no servidor (Next.js) ou se fechado
  if (!mounted || !open) return null;

  // Renderiza via Portal para garantir que fique acima de tudo
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop com Blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Conteúdo do Modal */}
      <div 
        className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-[#0b1220] border border-white/10 shadow-2xl transition-all animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-white/5">
          <h3 id="modal-title" className="text-lg font-bold text-white leading-6">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="p-5 max-h-[70vh] overflow-y-auto text-white/90">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}