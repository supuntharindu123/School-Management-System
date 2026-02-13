import React from "react";
import AlertModal from "./AlertModal";

export default function ConfirmSubjectTerminate({
  open,
  subject,
  className,
  onCancel,
  onConfirm,
  busy,
}) {
  const targetType = subject ? "subject" : "class";

  return (
    <AlertModal
      open={open}
      onClose={onCancel}
      title={`Terminate ${targetType} assignment`}
      footer={
        <div className="flex justify-end items-center gap-3">
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
            onClick={onCancel}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center min-w-[120px] bg-red-600 text-white shadow-sm shadow-red-900/10 hover:bg-red-700`}
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
                Terminating...
              </>
            ) : (
              "Terminate"
            )}
          </button>
        </div>
      }
    >
      <div className="flex items-start gap-4">
        {/* red warning icon for destructive actions */}
        <div className="mt-1 flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
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
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>

        <div className="flex-1">
          <p className="text-sm text-slate-600 leading-relaxed py-1">
            Are you sure you want to terminate the assignment for{" "}
            <span className="font-bold text-slate-900">
              {subject || className}
            </span>
            {subject && className ? (
              <>
                {" "}
                in <span className="font-bold text-slate-900">{className}</span>
              </>
            ) : null}
            ?
          </p>
        </div>
      </div>
    </AlertModal>
  );
}
