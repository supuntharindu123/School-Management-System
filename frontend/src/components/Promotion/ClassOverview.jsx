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
    const base =
      "px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize ";
    if (status === "Finalized")
      return base + "bg-purple-50 text-purple-700 border-purple-200";
    if (status === "Completed")
      return base + "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "In progress")
      return base + "bg-amber-50 text-amber-700 border-amber-200";
    return base + "bg-neutral-50 text-neutral-600 border-neutral-200";
  };

  return (
    <section className="space-y-6">
      {/* Metrics grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
        <Stat label="Total classes" value={totals} />
        <Stat label="Finalized" value={countByStatus("Finalized")} />
        <Stat label="Completed" value={countByStatus("Completed")} />
        <Stat label="In progress" value={countByStatus("In progress")} />

        <div className="col-span-2 md:col-span-1 rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-neutral-400 capitalize tracking-wider">
            Overall progress
          </p>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg font-bold text-neutral-800">
                {overallPct}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all duration-1000"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Class cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 ">
        {classes.map((c) => {
          const key = c.classNameId ?? c.id;
          const st = classStatuses[key] || {};
          const pct = st.total
            ? Math.round((st.processed / st.total) * 100)
            : 0;

          return (
            <div
              key={key}
              className="group rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-neutral-800 capitalize">
                    {c.name}
                  </h3>
                  <span className={badgeClass(st.status)}>
                    {st.status || "Not started"}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-medium text-neutral-500">
                    <span>Students</span>
                    <span className="text-neutral-900">{st.total || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-neutral-500">
                    <span>Processed</span>
                    <span className="text-neutral-900">
                      {st.processed || 0}
                    </span>
                  </div>

                  <div className="pt-2">
                    <div className="h-1 w-full rounded-full bg-neutral-50 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => onManage(c)}
                  className="w-full rounded-xl bg-cyan-800 py-2.5 text-sm font-bold text-white hover:bg-cyan-600 transition-colors capitalize shadow-sm"
                >
                  Manage class
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
  <div className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm">
    <p className="text-sm font-bold text-neutral-400 capitalize tracking-wider mb-1">
      {label}
    </p>
    <p className="text-2xl font-bold text-neutral-800">{value}</p>
  </div>
);
