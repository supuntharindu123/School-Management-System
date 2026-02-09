import React from "react";

/**
 * UI statuses (user-friendly)
 * Will be mapped to backend values
 */
const STATUS = ["Promoted", "Repeated", "Completed", "Leaving"];

/**
 * Backend mapping
 */
const STATUS_MAP = {
  Promoted: "Promoted",
  Repeated: "Repeated",
  Completed: "Completed",
  Leaving: "Leaving",
};

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
  const classes = gradeId ? classesByGrade[gradeId] || [] : [];

  /**
   * ALWAYS send a full PromotionDto-compatible object
   */
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
    <tr className="hover:bg-cyan-50">
      {/* Student Name */}
      <td className="border-b border-gray-200 py-2 px-3">
        <div className="truncate max-w-[220px] text-neutral-800">
          {student.fullName}
        </div>
      </td>

      {/* Admission Number */}
      <td className="border-b border-gray-200 py-2 px-3">
        <div className="text-neutral-800">{student.studentIDNumber}</div>
      </td>

      {/* Status */}
      <td className="border-b border-gray-200 py-2 px-3">
        <select
          value={status || ""}
          disabled={locked}
          onChange={(e) =>
            update({
              status: STATUS_MAP[e.target.value],
              gradeId: null,
              classNameId: null,
            })
          }
          className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:bg-gray-100 disabled:text-neutral-500"
        >
          <option value="">Select</option>
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </td>

      {/* Target Grade */}
      <td className="border-b border-gray-200 py-2 px-3">
        <select
          disabled={!isPromoted || locked}
          value={gradeId || ""}
          onChange={(e) => update({ gradeId: Number(e.target.value) })}
          className={`w-full rounded-lg border px-2 py-1.5 text-sm ${
            locked || !isPromoted
              ? "border-gray-200 bg-gray-100 text-neutral-500"
              : "border-gray-200 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          }`}
        >
          <option value="">Select</option>
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              Grade {g.gradeName}
            </option>
          ))}
        </select>
      </td>

      {/* Target Class */}
      <td className="border-b border-gray-200 py-2 px-3">
        <select
          disabled={!isPromoted || locked}
          value={classNameId || ""}
          onChange={(e) => update({ classNameId: Number(e.target.value) })}
          className={`w-full rounded-lg border px-2 py-1.5 text-sm ${
            locked || !isPromoted
              ? "border-gray-200 bg-gray-100 text-neutral-500"
              : "border-gray-200 bg-white text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          }`}
        >
          <option value="">Select</option>
          {classes.map((c) => (
            <option key={c.classNameId ?? c.id} value={c.classNameId ?? c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </td>

      {/* Description */}
      <td className="border-b border-gray-200 py-2 px-3">
        <input
          value={description || ""}
          disabled={locked}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Optional notes"
          className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:bg-gray-100 disabled:text-neutral-500"
        />
      </td>
    </tr>
  );
}
