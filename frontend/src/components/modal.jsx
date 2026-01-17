import React from "react";

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-4xl rounded-xl bg-white shadow-2xl transition-all duration-200 ease-out sm:mx-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 bg-teal-600 rounded-t-xl">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-teal-300 bg-white/10 text-white hover:bg-white/20"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-4 max-h-[80vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-4 py-3 bg-gray-50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
