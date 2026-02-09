import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/CommonElements/Button";
import { getAllGrades } from "../../features/grade/gradeSlice";
import { getClasses } from "../../features/class/classSlice";
import { getStudentAttendance } from "../../features/attendances/attendanceSlice";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-800">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function AttendancePage() {
  const dispatch = useDispatch();

  // Filters
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [gradeId, setGradeId] = useState("");
  const [classId, setClassId] = useState("");
  const [query, setQuery] = useState("");

  // Redux data
  const gradesState = useSelector((s) => s.grades);
  const grades = gradesState.grades || [];
  const classesState = useSelector((s) => s.classes);
  const classes = classesState.classes || [];
  const attendanceState = useSelector((s) => s.attendances);
  const attendances = attendanceState.attendances || [];
  const loading = attendanceState.loading;
  const error = attendanceState.error;

  console.log("Attendances:", attendances);

  useEffect(() => {
    dispatch(getAllGrades());
    dispatch(getClasses());
    dispatch(getStudentAttendance());
  }, [dispatch]);

  // Class options filtered by grade
  const classOptions = useMemo(() => {
    if (!gradeId) return [];
    return classes.filter((c) => String(c.gradeId) === String(gradeId));
  }, [classes, gradeId]);

  // Filter attendance records from API by date/grade/class/search
  const attendanceRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = attendances;

    // date filter (exact match)
    if (date) {
      rows = rows.filter((a) => String(a.date) === String(date));
    }

    // grade filter using classes map -> class names in selected grade
    if (gradeId) {
      const gradeClassNames = new Set(
        classes
          .filter((c) => String(c.gradeId) === String(gradeId))
          .map((c) => c.className || c.name),
      );
      rows = rows.filter((a) => gradeClassNames.has(a.className));
    }

    // class filter using selected class name
    if (classId) {
      const selectedClass = classes.find(
        (c) => String(c.id) === String(classId),
      );
      const selectedClassName = selectedClass?.className || selectedClass?.name;
      if (selectedClassName) {
        rows = rows.filter((a) => a.className === selectedClassName);
      }
    }

    // search filter over student/teacher/class
    if (q) {
      rows = rows.filter((a) => {
        const s = (a.studentName || "").toLowerCase();
        const t = (a.teacherName || "").toLowerCase();
        const c = (a.className || "").toLowerCase();
        return s.includes(q) || t.includes(q) || c.includes(q);
      });
    }

    return rows;
  }, [attendances, date, gradeId, classId, classes, query]);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <header className="mb-4 flex items-center justify-between bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-6 rounded-2xl px-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-50">Attendance</h1>
          <p className="text-sm text-cyan-50">
            Search and filter students to record attendance
          </p>
        </div>
      </header>

      {/* Filters */}
      <section className="rounded-xl border border-gray-300 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <Field label="Date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </Field>
          <Field label="Grade">
            <select
              value={gradeId}
              onChange={(e) => {
                setGradeId(e.target.value);
                setClassId("");
              }}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
            >
              <option value="">All</option>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  Grade {g.gradeName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Class">
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              disabled={!gradeId}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 disabled:bg-gray-50"
            >
              <option value="">All</option>
              {classOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.className || c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Search">
            <input
              placeholder="Search by name or ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </Field>
          <div className="flex items-end">
            <Button
              label="Filter"
              onClick={() => {
                /* UI-only filter applies instantly */
              }}
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="rounded-xl border border-gray-300 bg-white mt-6">
        <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3">
          <p className="text-sm font-semibold text-neutral-900">Results</p>
          <span className="text-xs text-neutral-600">
            {attendanceRows.length} records
          </span>
        </div>
        {loading && (
          <div className="px-4 py-3 text-sm text-neutral-700">
            Loading attendance...
          </div>
        )}
        {error && (
          <div className="px-4 py-3 text-sm text-rose-700">{String(error)}</div>
        )}
        <div className="max-h-[60vh] overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0">
              <tr className="text-left text-neutral-800 bg-cyan-500 rounded-lg">
                <th className="border-b border-gray-100 py-2 px-3 sticky top-0">
                  <span className="inline-flex items-center gap-1">ID</span>
                </th>
                <th className="border-b border-gray-300 py-2 px-3 sticky top-0">
                  <span className="inline-flex items-center gap-1">Date</span>
                </th>
                <th className="border-b border-gray-300 py-2 px-3 sticky top-0">
                  Student
                </th>
                <th className="border-b border-gray-300 py-2 px-3 sticky top-0">
                  Class
                </th>
                <th className="border-b border-gray-300 py-2 px-3 sticky top-0">
                  Teacher
                </th>
                <th className="border-b border-gray-300 py-2 px-3 sticky top-0">
                  Present
                </th>
                <th className="border-b border-gray-300 py-2 px-3 sticky top-0">
                  Reason
                </th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {attendanceRows.map((a) => (
                <tr
                  key={`${a.id ?? a.Id}-${a.date ?? a.Date}`}
                  className="odd:bg-white even:bg-gray-50 hover:bg-cyan-50 transition-colors"
                >
                  <td className="border-b border-gray-300 py-2 px-3">
                    {a.id ?? a.Id}
                  </td>
                  <td className="border-b border-gray-300 py-2 px-3">
                    {a.date ?? a.Date}
                  </td>
                  <td className="border-b border-gray-300 py-2 px-3 font-medium">
                    {a.studentName ?? a.StudentName}
                  </td>
                  <td className="border-b border-gray-300 py-2 px-3">
                    {a.className ?? a.ClassName}
                  </td>
                  <td className="border-b border-gray-300 py-2 px-3">
                    {a.teacherName ?? a.TeacherName}
                  </td>
                  <td className="border-b border-gray-300 py-2 px-3">
                    {a.isPresent === undefined && a.IsPresent === undefined ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-gray-100 text-neutral-700 border border-gray-200">
                        -
                      </span>
                    ) : (a.isPresent ?? a.IsPresent) ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-emerald-700 ">
                        Prsent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs text-rose-700 ">
                        Absent
                      </span>
                    )}
                  </td>
                  <td className="border-b border-gray-300 py-2 px-3 max-w-[18rem] truncate">
                    {a.reason ? a.reason || "-" : "-"}
                  </td>
                </tr>
              ))}
              {attendanceRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-neutral-600">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
