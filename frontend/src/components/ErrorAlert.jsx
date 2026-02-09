import React from "react";
import AlertModal from "./AlertModal";

export default function ErrorAlert({ isOpen, message, onClose }) {
  return (
    <AlertModal
      open={isOpen}
      onClose={onClose}
      title="Error"
      footer={
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium focus:ring-2 focus:ring-red-400"
        >
          Close
        </button>
      }
    >
      <div className="text-center space-y-4">
        <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl">
          !
        </div>

        <p className="text-neutral-800 font-medium">{message}</p>
      </div>
    </AlertModal>
  );
}
