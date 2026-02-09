import React from "react";

export default function AlertModal({ open, onClose, title, children, footer }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-2xl border border-cyan-200 sm:mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-cyan-800 rounded-t-xl">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md border border-cyan-300 bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6 text-neutral-800">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-2 px-4 py-3 border-t border-gray-200 bg-cyan-50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
