import React, { useState } from "react";

/**
 * Modern Metric Card with hover effects
 */
function SummaryCard({ label, value }) {
  return (
    <div className="group bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm hover:border-cyan-500 hover:shadow-md transition-all duration-300">
      <p className="text-xs font-bold capitalize text-neutral-400 group-hover:text-cyan-600 transition-colors">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-neutral-900 tracking-tight">
        {value}
      </p>
    </div>
  );
}

export default function ClassDetailsTab({
  students = [],
  subjectTeachers = [],
  classTeachers = [],
  user,
  onRequestTerminateClass,
  onRequestTerminateSubject,
}) {
  const [classHistoryOpen, setClassHistoryOpen] = useState(false);
  const [subjectHistoryOpen, setSubjectHistoryOpen] = useState(false);

  const activeClassTeacher = classTeachers.find((t) => t.isActive);

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* 1. Metrics Overview */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Total enrollment"
          value={`${students.length} Students`}
        />
        <SummaryCard
          label="Curriculum"
          value={`${subjectTeachers.length} Subjects`}
        />
        <SummaryCard label="Faculty count" value={classTeachers.length} />
        <SummaryCard
          label="Head teacher"
          value={
            activeClassTeacher
              ? activeClassTeacher.teacherName.split(" ")[0]
              : "Unassigned"
          }
        />
      </section>

      {/* 2. Class Faculty Section */}
      <section className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
          <div>
            <h3 className="font-bold text-neutral-900 capitalize text-lg">
              Class teachers
            </h3>
            <p className="text-xs font-medium text-neutral-500">
              Administrative educators overseeing this division.
            </p>
          </div>
          {classTeachers.some((t) => !t.isActive) && (
            <button
              onClick={() => setClassHistoryOpen(!classHistoryOpen)}
              className="text-xs font-bold capitalize px-4 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 transition-all active:scale-95"
            >
              {classHistoryOpen ? "Hide" : "Show"}
            </button>
          )}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {classTeachers
            .filter((t) => t.isActive)
            .map((t) => (
              <div
                key={`${t.teacherId}-${t.role}`}
                className="group bg-white rounded-2xl p-5 border border-neutral-200 flex justify-between items-center hover:border-cyan-200 transition-colors"
              >
                <div>
                  <p className="font-bold text-cyan-950">{t.teacherName}</p>
                  <p className="text-xs font-medium text-neutral-400 capitalize mt-0.5">
                    {t.role}
                  </p>
                  <p className="text-[14px] capitalize font-medium text-neutral-400 mt-1">
                    Start Date : {t.createdDate}
                  </p>
                </div>
                {user?.role === 0 && (
                  <button
                    onClick={() =>
                      onRequestTerminateClass?.(t.teacherId, t.teacherName)
                    }
                    className="opacity-0 group-hover:opacity-100 bg-rose-50 text-rose-600 text-xs font-bold capitalize px-4 py-2 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                  >
                    Terminate
                  </button>
                )}
              </div>
            ))}

          {classTeachers.filter((t) => t.isActive).length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-neutral-100 rounded-2xl text-neutral-400 text-sm italic font-medium">
              No active class teachers assigned.
            </div>
          )}
        </div>

        {classHistoryOpen && (
          <div className="px-6 pb-6 animate-in slide-in-from-top-4 duration-300">
            <div className="pt-6 border-t border-neutral-100">
              <h4 className="text-xs font-bold text-neutral-400 capitalize mb-4">
                Past assignments
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {classTeachers
                  .filter((t) => !t.isActive)
                  .map((t) => (
                    <div
                      key={t.teacherId}
                      className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100"
                    >
                      <p className="text-sm font-bold text-neutral-600">
                        {t.teacherName}
                      </p>
                      <p className="text-[11px] capitalize font-medium text-neutral-400 mt-1">
                        {t.role}
                      </p>
                      <div className="flex flex-row justify-between">
                        <p className="text-[11px] capitalize font-medium text-neutral-500 mt-1">
                          Start Date : {t.createdDate}
                        </p>
                        <p className="text-[11px] capitalize font-medium text-neutral-500 mt-1">
                          End Date : {t.updatedDate}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Subject Faculty Section */}
      <section className="bg-cyan-900 rounded-[2rem] overflow-hidden shadow-xl border border-cyan-800">
        <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-cyan-950/20">
          <div>
            <h3 className="font-bold text-white capitalize text-xl">
              Subject specialists
            </h3>
            <p className="text-xs text-cyan-200/60 font-medium capitalize mt-1">
              Curriculum area experts
            </p>
          </div>
          {subjectTeachers.some((st) => !st.isActive) && (
            <button
              onClick={() => setSubjectHistoryOpen(!subjectHistoryOpen)}
              className="text-xs font-bold capitalize px-5 py-2.5 rounded-xl border border-white/20 text-cyan-100 hover:text-white hover:bg-white/10 transition-all"
            >
              {subjectHistoryOpen ? "Hide" : "Show"}
            </button>
          )}
        </div>

        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjectTeachers
            .filter((st) => st.isActive)
            .map((st) => (
              <div
                key={`${st.subjectId}-${st.teacherId}`}
                className="relative bg-white/10 border border-white/10 rounded-2xl p-6 group hover:bg-white/15 hover:border-cyan-400 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-white/20 text-white text-[10px] font-bold capitalize px-2.5 py-1 rounded-lg border border-white/10">
                    Active
                  </span>
                  {user?.role === 0 && (
                    <button
                      onClick={() =>
                        onRequestTerminateSubject?.(
                          st.subjectId,
                          st.subjectName,
                        )
                      }
                      className="text-cyan-300 hover:text-rose-300 transition-colors p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="text-white font-bold text-xl tracking-tight">
                  {st.subjectName}
                </p>

                <div className=" flex flex-row justify-between mt-3">
                  <p className="text-cyan-100 text-sm font-medium capitalize">
                    {st.teacherName}
                  </p>
                  <p className="text-[14px] capitalize font-medium text-neutral-400 ">
                    Start Date : {st.createdDate}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Legacy Subjects Archive */}
        {subjectHistoryOpen && (
          <div className="px-8 pb-10 animate-in slide-in-from-top-2">
            <h4 className="text-xs font-bold text-cyan-300/50 capitalize mb-6">
              Departmental archive
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
              {subjectTeachers
                .filter((st) => !st.isActive)
                .map((st) => (
                  <div
                    key={st.subjectId}
                    className="bg-white/5 rounded-2xl p-4 border border-white/5 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <p className="text-white text-sm font-bold tracking-tight">
                      {st.subjectName}
                    </p>
                    <p className="text-[11px] text-white font-semibold capitalize mt-2">
                      {st.teacherName}
                    </p>
                    <div className="flex flex-row justify-between">
                      <p className="text-[11px] capitalize font-medium text-cyan-50 mt-1">
                        Start Date : {st.createdDate}
                      </p>
                      <p className="text-[11px] capitalize font-medium text-cyan-50 mt-1">
                        End Date : {st.updatedDate}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
