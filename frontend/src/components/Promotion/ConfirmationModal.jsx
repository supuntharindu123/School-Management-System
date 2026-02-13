import React from "react";

export default function ConfirmationModal({
  open,
  onClose,
  context,
  promotions,
  classesLookup,
  onConfirm,
}) {
  if (!open) return null;

  const counts = { Promoted: 0, Repeated: 0, Completed: 0, Leaving: 0 };
  const promotedByClass = {};

  Object.values(promotions).forEach((p) => {
    if (!p?.status) return;
    counts[p.status] = (counts[p.status] || 0) + 1;
    if (p.status === "Promoted" && p.classNameId) {
      promotedByClass[p.classNameId] =
        (promotedByClass[p.classNameId] || 0) + 1;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-xl rounded-[2.5rem] bg-white shadow-2xl overflow-hidden border border-neutral-100 flex flex-col animate-in zoom-in-95 duration-300">
        {/* Header */}
        <header className="px-8 pt-8 pb-4 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800 capitalize">
              Confirm promotions
            </h2>
            <p className="text-sm font-bold text-neutral-400 capitalize tracking-widest mt-1">
              Review changes before saving
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        <div className="px-8 pb-8 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Source info cards */}
          <div className="grid gap-3 grid-cols-3">
            <InfoBox label="Target year" value={context.yearLabel} />
            <InfoBox label="Source grade" value={context.gradeLabel} />
            <InfoBox label="Source class" value={context.classLabel} />
          </div>

          {/* Status counts */}
          <section>
            <h3 className="text-sm font-bold text-neutral-400 capitalize tracking-widest mb-3 px-1">
              Summary by status
            </h3>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              {Object.entries(counts).map(([status, count]) => (
                <div
                  key={status}
                  className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100"
                >
                  <p className="text-xl font-bold text-neutral-800">{count}</p>
                  <p className="text-[10px] font-bold text-neutral-400 capitalize">
                    {status}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Target distribution */}
          <section className="bg-cyan-50/50 rounded-3xl p-6 border border-cyan-100/50">
            <h3 className="text-sm font-bold text-cyan-700/60 capitalize tracking-widest mb-4">
              Promoted distribution
            </h3>
            <div className="space-y-2">
              {Object.keys(promotedByClass).length === 0 ? (
                <p className="text-sm font-medium text-cyan-800/50 italic capitalize">
                  No promoted students selected
                </p>
              ) : (
                Object.entries(promotedByClass).map(([classId, total]) => (
                  <div
                    key={classId}
                    className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow-sm border border-cyan-100"
                  >
                    <span className="text-sm font-bold text-neutral-700 capitalize">
                      {classesLookup[classId]?.name || `Class ${classId}`}
                    </span>
                    <span className="bg-cyan-600 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                      {total} Students
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <footer className="p-6 bg-neutral-50 border-t border-neutral-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-all capitalize"
          >
            Go back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl text-sm font-bold bg-cyan-800 text-white hover:bg-cyan-600 shadow-lg shadow-neutral-200 transition-all capitalize"
          >
            Confirm and save
          </button>
        </footer>
      </div>
    </div>
  );
}

const InfoBox = ({ label, value }) => (
  <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
    <p className="text-[9px] font-bold text-neutral-400 capitalize tracking-tighter mb-1">
      {label}
    </p>
    <p className="text-sm font-bold text-neutral-800 truncate">{value}</p>
  </div>
);
