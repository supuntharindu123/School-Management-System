import React from "react";

export default function SummaryCard({ title, value, icon, trend, trendValue }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-cyan-100">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">
            {title}
          </p>
          <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        </div>

        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={`flex items-center text-xs font-bold ${
              trend === "up" ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {trend === "up" ? "↑" : "↓"} {trendValue}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Since last month
          </span>
        </div>
      )}
    </div>
  );
}
