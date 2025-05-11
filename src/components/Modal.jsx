import React from 'react';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadein">
      <div className="bg-[#1A0B2E] rounded-2xl shadow-2xl p-8 max-w-lg w-full relative border border-white/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-[#00D4FF] text-2xl font-bold focus:outline-none"
          aria-label="Закрыть"
        >
          ×
        </button>
        {title && <div className="text-xl font-bold text-white mb-4">{title}</div>}
        <div>{children}</div>
      </div>
      <style>{`
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadein { animation: fadein 0.2s; }
      `}</style>
    </div>
  );
} 