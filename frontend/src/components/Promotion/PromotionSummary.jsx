import React, { useMemo } from "react";

export default function PromotionSummary({ promotions }) {
  const summary = useMemo(() => {
    const counts = { Promoted: 0, Repeated: 0, Completed: 0, Leaving: 0 };
    const byClass = {};
    promotions.forEach((p) => {
      if (p.status && Object.prototype.hasOwnProperty.call(counts, p.status)) {
        counts[p.status]++;
      }
      if (p.status === "Promoted" && p.classNameId) {
        const key = p.classNameId;
        byClass[key] = (byClass[key] || 0) + 1;
      }
    });
    return { counts, byClass };
  }, [promotions]);

  return (
    <section className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-neutral-800 capitalize">
            Promotion summary
          </h3>
          <p className="text-sm font-bold text-neutral-400 capitalize tracking-widest mt-1">
            Real-time distribution
          </p>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
      </div>

      {/* Main status counters */}
      <div className="grid gap-4 sm:grid-cols-4">
        {Object.entries(summary.counts).map(([label, value]) => (
          <div
            key={label}
            className="group rounded-2xl bg-neutral-50 p-5 transition-all hover:bg-neutral-100/50"
          >
            <p className="text-[15px] font-bold text-neutral-400 capitalize tracking-tighter mb-1 transition-colors group-hover:text-cyan-600">
              {label}
            </p>
            <p className="text-2xl font-bold text-neutral-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Detailed class distribution */}
      <div className="mt-8 pt-8 border-t border-neutral-100">
        <h4 className="text-sm font-bold text-neutral-400 capitalize tracking-widest mb-4 px-1">
          Promoted students by target class
        </h4>

        {Object.keys(summary.byClass).length === 0 ? (
          <div className="bg-neutral-50 rounded-2xl p-6 text-center border border-dashed border-neutral-200">
            <p className="text-sm font-medium text-neutral-400 capitalize">
              No students have been assigned to classes yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {Object.entries(summary.byClass).map(([cls, total]) => (
              <div
                key={cls}
                className="flex items-center justify-between rounded-xl border border-neutral-100 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                  <span className="text-sm font-bold text-neutral-700 capitalize">
                    Class id: {cls}
                  </span>
                </div>
                <span className="text-sm font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg">
                  {total}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
