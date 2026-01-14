import React from "react";

function Button({ label, onClick, bgcolor, type }) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`rounded-lg ${
        bgcolor ? bgcolor : "bg-teal-600"
      } px-4 py-2 text-sm text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600`}
    >
      {label}
    </button>
  );
}

export default Button;
