import React from "react";

export default function ClassOverview({
  classes = [],
  classStatuses = {},
  onManage,
}) {
  const totals = classes.length;

  const countByStatus = (status) =>
    classes.filter(
      (c) => classStatuses[c.classNameId ?? c.id]?.status === status,
    ).length;

  const processedTotal = classes.reduce(
    (a, c) => a + (classStatuses[c.classNameId ?? c.id]?.processed ?? 0),
    0,
  );
  const studentTotal = classes.reduce(
    (a, c) => a + (classStatuses[c.classNameId ?? c.id]?.total ?? 0),
    0,
  );

  const overallPct = studentTotal
    ? Math.round((processedTotal / studentTotal) * 100)
    : 0;

  const badgeClass = (status) => {
    if (status === "Finalized")
      return "bg-purple-100 text-purple-700 border border-purple-200";
    if (status === "Completed")
      return "bg-green-100 text-green-700 border border-green-200";
    if (status === "In Progress")
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    return "bg-gray-100 text-neutral-700 border border-gray-200";
  };

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-5">
        <Stat label="Total Classes" value={totals} />
        <Stat label="Finalized" value={countByStatus("Finalized")} />
        <Stat label="Completed" value={countByStatus("Completed")} />
        <Stat label="In Progress" value={countByStatus("In Progress")} />

        <div className="rounded-xl border border-cyan-200 bg-white p-4 shadow-md">
          <p className="text-xs text-neutral-600">Overall Progress</p>
          <div className="mt-1 h-2 rounded bg-gray-100">
            <div
              className="h-2 rounded bg-cyan-600"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <p className="mt-1 text-sm font-semibold text-neutral-900">
            {overallPct}%
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((c) => {
          const key = c.classNameId ?? c.id;
          const st = classStatuses[key] || {};
          const pct = st.total
            ? Math.round((st.processed / st.total) * 100)
            : 0;

          return (
            <div
              key={key}
              className="rounded-xl border-t-4 border-cyan-600 bg-white p-4 shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral-900">
                  {c.name}
                </p>
                <span
                  className={`rounded px-2 py-0.5 text-xs ${badgeClass(
                    st.status,
                  )}`}
                >
                  {st.status}
                </span>
              </div>

              <p className="mt-1 text-[11px] text-neutral-600">
                Students: {st.total} • Processed: {st.processed}
              </p>

              <div className="mt-2 h-2 rounded bg-gray-100">
                <div
                  className="h-2 rounded bg-cyan-600"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => onManage(c)}
                  className="rounded-lg border border-gray-200 bg-cyan-600 px-3 py-1.5 text-sm text-white hover:bg-cyan-500"
                >
                  Manage
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const Stat = ({ label, value }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-md">
    <p className="text-xs text-neutral-600">{label}</p>
    <p className="text-xl font-semibold text-neutral-900">{value}</p>
  </div>
);
