import React from "react";
import AlertModal from "./AlertModal";

export default function SuccessAlert({ isOpen, message, onClose }) {
  return (
    <AlertModal
      open={isOpen}
      onClose={onClose}
      title="Action successful"
      footer={
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-8 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-cyan-900/10 transition-all active:scale-[0.98] focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
        >
          Continue
        </button>
      }
    >
      <div className="flex flex-col items-center text-center py-2">
        {/* soft emerald success icon with ring effect */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">Great job!</h3>

        <p className="text-sm text-slate-600 leading-relaxed max-w-[280px]">
          {message || "The operation was completed successfully."}
        </p>
      </div>
    </AlertModal>
  );
}
