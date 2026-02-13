import React from "react";
import AlertModal from "./AlertModal";

export default function ErrorAlert({ isOpen, message, onClose }) {
  return (
    <AlertModal
      open={isOpen}
      onClose={onClose}
      title="System error"
      footer={
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-lg shadow-slate-200 transition-all active:scale-[0.98] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          Dismiss
        </button>
      }
    >
      <div className="flex flex-col items-center text-center py-2">
        {/* soft red danger icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-600 ring-8 ring-rose-50/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Something went wrong
        </h3>

        <p className="text-sm text-slate-600 leading-relaxed max-w-[280px]">
          {message ||
            "An unexpected error occurred. please try again later or contact the system administrator."}
        </p>
      </div>
    </AlertModal>
  );
}
