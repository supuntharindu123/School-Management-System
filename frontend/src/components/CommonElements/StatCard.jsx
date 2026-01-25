import React from "react";

export default function StatCard({ title, subtitle, stats = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2">
        <p className="text-sm font-semibold text-neutral-900">{title}</p>
        {subtitle ? (
          <p className="text-xs text-neutral-600">{subtitle}</p>
        ) : null}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, idx) => (
          <div key={idx} className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-[11px] text-neutral-600">{s.label}</p>
            <p className="text-lg font-semibold text-neutral-900">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
