import React from "react";

export default function ConfirmationModal({
  open,
  onClose,
  context,
  promotions,
  gradesLookup,
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold text-neutral-900">
            Confirm Promotion Changes
          </p>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-xs text-neutral-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-[11px] text-neutral-600">Academic Year</p>
              <p className="text-sm font-semibold text-neutral-900">
                {context.yearLabel}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-[11px] text-neutral-600">Source Grade</p>
              <p className="text-sm font-semibold text-neutral-900">
                {context.gradeLabel}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-[11px] text-neutral-600">Source Class</p>
              <p className="text-sm font-semibold text-neutral-900">
                {context.classLabel}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-neutral-900">
              Counts by status
            </p>
            <div className="grid gap-3 sm:grid-cols-4">
              {Object.entries(counts).map(([k, v]) => (
                <div key={k} className="rounded-lg bg-gray-50 px-3 py-2">
                  <p className="text-[11px] text-neutral-600">{k}</p>
                  <p className="text-lg font-semibold text-neutral-900">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm text-neutral-700">
              Promoted target distribution
            </p>
            <div className="space-y-1">
              {Object.keys(promotedByClass).length === 0 ? (
                <p className="text-sm text-neutral-600">
                  No promoted students selected
                </p>
              ) : (
                Object.entries(promotedByClass).map(([classId, total]) => (
                  <div
                    key={classId}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2"
                  >
                    <p className="text-sm text-neutral-800">
                      Class ID: {classId}
                    </p>
                    <p className="text-sm font-semibold text-neutral-900">
                      {total}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="border-t px-4 py-3 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-teal-600 px-3 py-2 text-sm text-white hover:bg-teal-700"
          >
            Confirm & Save
          </button>
        </div>
      </div>
    </div>
  );
}
