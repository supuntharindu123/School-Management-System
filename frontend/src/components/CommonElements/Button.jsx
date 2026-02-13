import React from "react";

export default function Button({
  label,
  onClick,
  bgcolor,
  type = "button",
  disabled = false,
  variant = "primary", // 'primary' | 'secondary' | 'outline'
  className = "",
  icon: Icon,
}) {
  // base structural classes
  const baseClasses =
    "relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl active:scale-[0.98]";

  // dynamic variant styles
  const variants = {
    primary: `${bgcolor ? bgcolor : "bg-cyan-600 hover:bg-cyan-700"} text-white shadow-lg shadow-cyan-900/10 focus:ring-cyan-600`,
    secondary:
      "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-300",
    outline:
      "border border-slate-200 bg-transparent text-slate-600 hover:border-cyan-600 hover:text-cyan-600 focus:ring-cyan-600",
  };

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {/* optional icon rendering */}
      {Icon && <Icon className="w-4 h-4" />}

      <span className="relative">{label}</span>

      {/* subtle shine overlay for primary buttons */}
      {variant === "primary" && !disabled && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      )}
    </button>
  );
}
