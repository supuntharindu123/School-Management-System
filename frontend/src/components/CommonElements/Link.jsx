import React from "react";
import { Link } from "react-router-dom";

export default function LinkComponent({
  to,
  children,
  variant = "primary",
  className = "",
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-cyan-600 text-white shadow-sm hover:bg-cyan-700 hover:shadow-md active:scale-[0.98]",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:border-cyan-500 hover:text-cyan-600 hover:bg-slate-50 shadow-sm",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 active:bg-red-200",
  };

  const combinedClasses = `${baseClasses} ${variants[variant] || variants.primary} ${className}`;

  return (
    <Link to={to} className={combinedClasses}>
      {children}
    </Link>
  );
}
