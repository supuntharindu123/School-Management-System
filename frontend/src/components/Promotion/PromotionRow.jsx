import React from "react";

/**
 * UI statuses (user-friendly)
 */
const STATUS = ["Promoted", "Repeated", "Completed", "Leaving"];

export default function PromotionRow({
  student,
  grades,
  classesByGrade,
  value = {},
  onChange,
  locked,
  academicYearId,
}) {
  const { status, gradeId, classNameId, description } = value;

  const isPromoted = status === "Promoted";
  const hasSelection = !!status;
  const classes = gradeId ? classesByGrade[gradeId] || [] : [];

  const update = (data) => {
    onChange(student.id, {
      studentId: student.id,
      gradeId: data.gradeId ?? gradeId ?? 0,
      classNameId: data.classNameId ?? classNameId ?? 0,
      academicYearId,
      status: data.status ?? status,
      description: data.description ?? description ?? "",
    });
  };

  return (
    <tr
      className={`group transition-colors ${
        hasSelection ? "bg-cyan-50/40" : "hover:bg-neutral-50"
      }`}
    >
      {/* Student identity */}
      <td className="border-b border-neutral-100 py-4 px-4">
        <div className="flex flex-col">
          <span className="text-[16px] font-bold text-neutral-800 capitalize">
            {student.fullName?.toLowerCase()}
          </span>
          <span className="text-[12px] font-bold text-neutral-400 capitalize tracking-tight">
            ID: {student.studentIDNumber}
          </span>
        </div>
      </td>

      {/* Promotion status */}
      <td className="border-b border-neutral-100 py-4 px-3">
        <select
          value={status || ""}
          disabled={locked}
          onChange={(e) =>
            update({
              status: e.target.value,
              gradeId: null,
              classNameId: null,
            })
          }
          className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-bold text-neutral-700 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 disabled:bg-neutral-50 disabled:text-neutral-400 transition-all capitalize"
        >
          <option value="">Select status</option>
          {STATUS.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s.toLowerCase()}
            </option>
          ))}
        </select>
      </td>

      {/* Target grade */}
      <td className="border-b border-neutral-100 py-4 px-3">
        <select
          disabled={!isPromoted || locked}
          value={gradeId || ""}
          onChange={(e) => update({ gradeId: Number(e.target.value) })}
          className={`w-full rounded-xl border px-3 py-2 text-sm font-bold transition-all ${
            locked || !isPromoted
              ? "border-neutral-100 bg-neutral-50 text-neutral-300"
              : "border-neutral-200 bg-white text-neutral-700 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
          }`}
        >
          <option value="">Select grade</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              Grade {g.gradeName}
            </option>
          ))}
        </select>
      </td>

      {/* Target class */}
      <td className="border-b border-neutral-100 py-4 px-3">
        <select
          disabled={!isPromoted || locked}
          value={classNameId || ""}
          onChange={(e) => update({ classNameId: Number(e.target.value) })}
          className={`w-full rounded-xl border px-3 py-2 text-sm font-bold transition-all ${
            locked || !isPromoted
              ? "border-neutral-100 bg-neutral-50 text-neutral-300"
              : "border-neutral-200 bg-white text-neutral-700 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10"
          }`}
        >
          <option value="">Select class</option>
          {classes.map((c) => (
            <option key={c.classNameId ?? c.id} value={c.classNameId ?? c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </td>

      {/* Notes/description */}
      <td className="border-b border-cyan-100 py-4 px-4">
        <div className="relative">
          <input
            value={description || ""}
            disabled={locked}
            onChange={(e) => update({ description: e.target.value })}
            placeholder="Add notes..."
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 placeholder:text-neutral-300 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 disabled:bg-neutral-50 disabled:text-neutral-400 transition-all"
          />
          {description && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 flex h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
          )}
        </div>
      </td>
    </tr>
  );
}
