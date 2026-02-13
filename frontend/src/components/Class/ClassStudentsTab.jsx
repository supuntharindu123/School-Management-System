import React from "react";

export default function ClassStudentsTab({ students = [], onViewStudent }) {
  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header Summary */}
      <div className="flex justify-between items-end border-b-2 border-cyan-100 pb-6">
        <div>
          <h3 className="text-2xl font-bold text-neutral-900 tracking-tight capitalize">
            Student enrollment
          </h3>
          <p className="text-xs font-medium text-neutral-400 capitalize mt-1">
            Academic year 2025/26
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-cyan-700">
            {students.length}
          </span>
          <p className="text-xs font-bold text-neutral-400 capitalize">
            Active records
          </p>
        </div>
      </div>

      {/* Modern Data Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cyan-800 border-b border-neutral-100 text-white text-xs font-bold capitalize">
                <th className="px-6 py-5">Student id</th>
                <th className="px-6 py-5">Full name</th>
                <th className="px-6 py-5">Gender</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {students.map((s) => (
                <tr
                  key={s.id}
                  className="group hover:bg-cyan-50/30 transition-colors cursor-pointer"
                  onClick={() => onViewStudent?.(s.id)}
                >
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-neutral-100 rounded-lg text-xs font-bold text-neutral-700">
                      {s.studentIDNumber}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-neutral-900 group-hover:text-cyan-700 transition-colors">
                      {s.fullName}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs font-medium text-neutral-600 capitalize">
                      {s.gender}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          s.status === "Active"
                            ? "bg-cyan-500"
                            : "bg-neutral-300"
                        }`}
                      ></span>
                      <span className="text-xs font-bold capitalize text-neutral-700">
                        {s.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-xs font-bold capitalize text-cyan-600 hover:text-cyan-800 transition-colors">
                      View details &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {students.length === 0 && (
          <div className="py-24 text-center flex flex-col items-center justify-center">
            <div className="h-14 w-14 rounded-2xl bg-neutral-50 mb-4 flex items-center justify-center text-neutral-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-neutral-400 italic">
              No student records found in this division.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
