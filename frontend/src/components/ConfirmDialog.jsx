import React from "react";
import AlertModal from "./AlertModal";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  busy = false,
  variant = "primary", // can be "primary" or "danger"
  onCancel,
  onConfirm,
}) {
  const confirmButtonClasses =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-900/10"
      : "bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm shadow-cyan-900/10";

  return (
    <AlertModal
      open={!!open}
      onClose={onCancel}
      title={title || "Confirm action"}
      footer={
        <div className="flex justify-end items-center gap-3">
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
            onClick={onCancel}
            disabled={busy}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center min-w-[100px] ${confirmButtonClasses}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      }
    >
      <div className="flex items-start gap-4">
        {/* conditional icon based on variant */}
        <div
          className={`mt-1 flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full ${variant === "danger" ? "bg-red-50 text-red-600" : "bg-cyan-50 text-cyan-600"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
        </div>

        <div className="flex-1">
          <p className="text-sm text-slate-600 leading-relaxed py-2">
            {message}
          </p>
        </div>
      </div>
    </AlertModal>
  );
}
