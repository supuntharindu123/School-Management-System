import React from "react";
import AlertModal from "./AlertModal";

export default function SuccessAlert({ isOpen, message, onClose }) {
  return (
    <AlertModal
      open={isOpen}
      onClose={onClose}
      title="Success"
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium focus:ring-2 focus:ring-teal-400"
        >
          OK
        </button>
      }
    >
      <div className="text-center space-y-4">
        <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-teal-100 text-teal-700 text-2xl">
          ✓
        </div>

        <p className="text-neutral-800 font-medium">{message}</p>
      </div>
    </AlertModal>
  );
}
