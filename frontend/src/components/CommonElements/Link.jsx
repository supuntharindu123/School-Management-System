import React from "react";
import { Link } from "react-router-dom";

export default function LinkComponent({ to, children, variant }) {
  const baseClasses =
    "inline-flex justify-center rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-600";

  const variants = {
    primary: "bg-cyan-600 text-white hover:bg-cyan-700",
    secondary:
      "border border-gray-200 bg-white text-neutral-800 hover:border-cyan-600 hover:text-cyan-600",
  };

  const className = `${baseClasses} ${variants[variant] || variants.primary}`;

  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}
