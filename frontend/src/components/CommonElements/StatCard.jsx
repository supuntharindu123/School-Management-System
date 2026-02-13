import React from "react";

export default function StatCard({ title, subtitle, stats = [] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:shadow-cyan-900/5">
      <header className="mb-5">
        <h4 className="text-sm font-bold text-slate-800 tracking-tight">
          {title}
        </h4>
        {subtitle && (
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {subtitle}
          </p>
        )}
      </header>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-slate-50 p-3.5 border-l-4 border-cyan-500 transition-colors hover:bg-slate-100/50"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {s.label}
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900 leading-none">
              {s.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
