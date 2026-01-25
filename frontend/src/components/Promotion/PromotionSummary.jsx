import React, { useMemo } from "react";

export default function PromotionSummary({ promotions }) {
  const summary = useMemo(() => {
    const counts = { Promoted: 0, Repeated: 0, Completed: 0, Leaving: 0 };
    const byClass = {};
    promotions.forEach((p) => {
      if (p.status && counts.hasOwnProperty(p.status)) counts[p.status]++;
      if (p.status === "Promoted" && p.classNameId) {
        const key = p.classNameId;
        byClass[key] = (byClass[key] || 0) + 1;
      }
    });
    return { counts, byClass };
  }, [promotions]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="mb-2 text-sm font-semibold text-neutral-900">Summary</p>
      <div className="grid gap-3 sm:grid-cols-4">
        {Object.entries(summary.counts).map(([label, value]) => (
          <div key={label} className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-[11px] text-neutral-600">{label}</p>
            <p className="text-lg font-semibold text-neutral-900">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="mb-2 text-sm text-neutral-700">
          Promoted students by target class
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {Object.keys(summary.byClass).length === 0 ? (
            <p className="text-sm text-neutral-600">No data</p>
          ) : (
            Object.entries(summary.byClass).map(([cls, total]) => (
              <div
                key={cls}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2"
              >
                <p className="text-[11px] text-neutral-600">Class ID: {cls}</p>
                <p className="text-sm font-semibold text-neutral-900">
                  {total} promoted
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
