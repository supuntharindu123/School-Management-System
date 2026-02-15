import React from "react";
import { useParams } from "react-router-dom";

export default function ClassAttendanceTab({
  viewDate,
  setViewDate,
  attendanceView = [],
  viewLoading = false,
  viewError = null,
  user,
  editingId,
  setEditingId,
  editValues,
  setEditValues,
  getTodayLocalISO,
  onRequestSaveEdit,
  students = [],
  teacherId,
  TeacherAttendanceSection,
  todayAttendanceExists,
  onTeacherAttendanceSuccess,
}) {
  const classId = useParams().id;
  console.log(`students`, editValues);
  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-500">
      {/* 1. Date Selection and Historical View */}
      <section className="rounded-3xl border border-neutral-200 bg-white overflow-hidden shadow-sm">
        <div className="bg-neutral-50/80 px-6 py-5 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold capitalize text-neutral-800">
              Attendance Records
            </h3>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-neutral-200 shadow-sm">
            <span className="text-xs font-bold text-neutral-400">Jump to:</span>
            <input
              type="date"
              value={viewDate}
              onChange={(e) => setViewDate(e.target.value)}
              className="bg-transparent text-sm font-bold text-cyan-700 outline-none cursor-pointer"
            />
          </div>
        </div>

        <div className="p-6">
          {/* Status feedback */}
          {viewLoading && (
            <div className="flex items-center justify-center py-20 gap-3 text-cyan-600">
              <div className="w-2 h-2 rounded-full bg-cyan-600 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-cyan-600 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 rounded-full bg-cyan-600 animate-bounce [animation-delay:-.5s]"></div>
              <span className="text-sm font-bold ml-2">Syncing records...</span>
            </div>
          )}

          {viewError && (
            <div className="mb-6 flex items-center gap-3 text-rose-600 bg-rose-50 p-4 rounded-2xl border border-rose-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              <p className="text-sm font-bold">{String(viewError)}</p>
            </div>
          )}

          {/* Table Container */}
          {!viewLoading && (
            <div className="overflow-x-auto rounded-2xl border border-neutral-100 bg-neutral-50/30">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-white border-b border-neutral-200">
                  <tr>
                    <th className="py-4 px-6 font-bold text-xs text-neutral-400 capitalize">
                      Date
                    </th>
                    <th className="py-4 px-6 font-bold text-xs text-neutral-400 capitalize">
                      Student Name
                    </th>
                    <th className="py-4 px-6 font-bold text-xs text-neutral-400 capitalize">
                      Status
                    </th>
                    <th className="py-4 px-6 font-bold text-xs text-neutral-400 capitalize">
                      Reason
                    </th>
                    <th className="py-4 px-6 font-bold text-xs text-neutral-400 capitalize">
                      Recorded by
                    </th>
                    {user?.role === 1 && (
                      <th className="py-4 px-6 font-bold text-xs text-neutral-400 capitalize text-right">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white/50">
                  {(attendanceView || []).map((a) => {
                    const aid = a.id ?? a.Id;
                    const isEditing = editingId === aid;
                    const present = !!(a.isPresent ?? a.IsPresent);

                    return (
                      <tr
                        key={`${aid}-${a.date ?? a.Date}`}
                        className="group hover:bg-white transition-colors"
                      >
                        <td className="py-4 px-6 text-xs font-medium text-neutral-400 font-mono">
                          {a.date ?? a.Date}
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-bold text-neutral-800 group-hover:text-cyan-700 transition-colors">
                            {a.studentName ?? a.StudentName}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          {isEditing ? (
                            <input
                              type="checkbox"
                              className="w-5 h-5 accent-cyan-600 cursor-pointer"
                              checked={
                                !!(editValues[aid]?.isPresent ?? present)
                              }
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [aid]: {
                                    isPresent: e.target.checked,
                                    reason: e.target.checked
                                      ? ""
                                      : (prev[aid]?.reason ?? a.reason ?? ""),
                                  },
                                }))
                              }
                            />
                          ) : (
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold capitalize ${
                                present
                                  ? "bg-cyan-50 text-cyan-700 border border-cyan-100"
                                  : "bg-rose-50 text-rose-700 border border-rose-100"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full mr-2 ${present ? "bg-cyan-500" : "bg-rose-500"}`}
                              ></span>
                              {present ? "Present" : "Absent"}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {isEditing ? (
                            <input
                              type="text"
                              placeholder="Reason for absence"
                              className="w-full border border-neutral-200 rounded-xl px-3 py-1.5 text-xs focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all"
                              value={editValues[aid]?.reason ?? a.reason ?? ""}
                              disabled={editValues[aid]?.isPresent ?? present}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [aid]: {
                                    ...prev[aid],
                                    reason: e.target.value,
                                  },
                                }))
                              }
                            />
                          ) : (
                            <span className="text-xs text-neutral-500 italic">
                              {a.reason ?? a.Reason ?? "—"}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-bold text-neutral-600 capitalize">
                            {a.teacherName ?? a.TeacherName ?? "System"}
                          </span>
                        </td>
                        {user?.role === 1 && (
                          <td className="py-4 px-6 text-right">
                            {isEditing ? (
                              <div className="flex justify-end gap-3">
                                <button
                                  onClick={() =>
                                    onRequestSaveEdit({
                                      idVal: aid,
                                      isPresent:
                                        editValues[aid]?.isPresent ?? present,
                                      reason:
                                        (editValues[aid]?.isPresent ?? present)
                                          ? ""
                                          : (editValues[aid]?.reason ??
                                            a.reason),
                                      dateVal: a.date ?? a.Date,
                                      studentName:
                                        a.studentName ?? a.StudentName,
                                      classId: Number(classId),
                                    })
                                  }
                                  className="text-xs font-bold text-cyan-600 hover:text-cyan-800"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="text-xs font-bold text-neutral-400 hover:text-neutral-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              (a.date ?? a.Date) === getTodayLocalISO() && (
                                <button
                                  onClick={() => setEditingId(aid)}
                                  className="opacity-0 group-hover:opacity-100 bg-white border border-neutral-200 shadow-sm px-4 py-1.5 rounded-xl text-xs font-bold text-neutral-600 hover:border-cyan-500 hover:text-cyan-600 transition-all"
                                >
                                  Modify
                                </button>
                              )
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {(!attendanceView || attendanceView.length === 0) &&
                !viewLoading && (
                  <div className="py-24 flex flex-col items-center justify-center bg-white/50">
                    <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-neutral-400 capitalize">
                      No records found for this date
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </section>

      {/* 2. Record Today Section */}
      {user?.role === 1 && (
        <section className="animate-in slide-in-from-bottom-4 duration-700">
          {todayAttendanceExists ? (
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900 capitalize">
                  Today complete
                </p>
                <p className="text-xs text-emerald-600 font-medium">
                  The daily student registry is up to date.
                </p>
              </div>
            </div>
          ) : (
            TeacherAttendanceSection && (
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="bg-cyan-800 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white text-sm font-bold capitalize">
                    Mark attendance for today
                  </h3>
                  <span className="text-cyan-100 text-xs font-bold">
                    {getTodayLocalISO()}
                  </span>
                </div>
                <div className="p-2">
                  <TeacherAttendanceSection
                    students={students}
                    teacherId={teacherId}
                    classId={classId}
                    onSuccess={onTeacherAttendanceSuccess}
                  />
                </div>
              </div>
            )
          )}
        </section>
      )}
    </div>
  );
}
