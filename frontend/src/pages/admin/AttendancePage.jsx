import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/CommonElements/Button";
import { getAllGrades } from "../../features/grade/gradeSlice";
import { getClasses } from "../../features/class/classSlice";
import { getStudentAttendance } from "../../features/attendances/attendanceSlice";

export default function AttendancePage() {
  const dispatch = useDispatch();

  // Filters
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [gradeId, setGradeId] = useState("");
  const [classId, setClassId] = useState("");
  const [query, setQuery] = useState("");

  // Redux data
  const grades = useSelector((s) => s.grades.grades || []);
  const classes = useSelector((s) => s.classes.classes || []);
  const {
    attendances = [],
    loading,
    error,
  } = useSelector((s) => s.attendances);

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

  // Main Filtering Logic
  const attendanceRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = attendances;

    if (date)
      rows = rows.filter((a) => String(a.date || a.Date) === String(date));

    if (gradeId) {
      const gradeClassNames = new Set(
        classes
          .filter((c) => String(c.gradeId) === String(gradeId))
          .map((c) => c.className || c.name),
      );
      rows = rows.filter((a) =>
        gradeClassNames.has(a.className || a.ClassName),
      );
    }

    if (classId) {
      const selectedClass = classes.find(
        (c) => String(c.id) === String(classId),
      );
      const selectedClassName = selectedClass?.className || selectedClass?.name;
      if (selectedClassName)
        rows = rows.filter(
          (a) => (a.className || a.ClassName) === selectedClassName,
        );
    }

    if (q) {
      rows = rows.filter((a) => {
        const s = (a.studentName || a.StudentName || "").toLowerCase();
        const t = (a.teacherName || a.TeacherName || "").toLowerCase();
        const c = (a.className || a.ClassName || "").toLowerCase();
        return s.includes(q) || t.includes(q) || c.includes(q);
      });
    }
    return rows;
  }, [attendances, date, gradeId, classId, classes, query]);

  // Derived Stats for the Overview
  const stats = useMemo(() => {
    const total = attendanceRows.length;
    const present = attendanceRows.filter(
      (r) => r.isPresent ?? r.IsPresent,
    ).length;
    const absent = total - present;
    const rate = total > 0 ? ((present / total) * 100).toFixed(1) : 0;
    return { total, present, absent, rate };
  }, [attendanceRows]);

  return (
    <div className="max-w-full mx-auto space-y-8 pb-16 animate-fade-in px-4">
      {/* HEADER SECTION */}
      <header className="bg-gradient-to-r from-cyan-900 via-cyan-700 to-cyan-800 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl  font-bold">Attendance Records</h1>
          <p className="text-cyan-100 opacity-90 text-sm mt-1 font-medium">
            Monitoring student presence and daily participation
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
          <p className="text-[10px] font-bold capitalize tracking-widest text-cyan-200">
            Active View
          </p>
          <p className="text-lg font-bold">
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </header>

      {/* FULL WIDTH STATS OVERVIEW */}
      <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-100">
        <StatCard
          label="Filtered Students"
          value={stats.total}
          color="text-neutral-900"
        />
        <StatCard
          label="Present"
          value={stats.present}
          color="text-emerald-600"
        />
        <StatCard label="Absent" value={stats.absent} color="text-rose-600" />
        <StatCard
          label="Attendance Rate"
          value={`${stats.rate}%`}
          color="text-cyan-600"
        />
      </section>

      {/* FILTER CONTROLS */}
      <section className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <Field label="Target Date">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="filter-input"
            />
          </Field>
          <Field label="Academic Grade">
            <select
              value={gradeId}
              onChange={(e) => {
                setGradeId(e.target.value);
                setClassId("");
              }}
              className="filter-input"
            >
              <option value="">All Grades</option>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  Grade {g.gradeName}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Specific Class">
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              disabled={!gradeId}
              className="filter-input disabled:bg-neutral-50"
            >
              <option value="">All Classes</option>
              {classOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.className || c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Keywords">
            <input
              placeholder="Name, ID or Teacher..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="filter-input"
            />
          </Field>
          <div className="flex items-end">
            <button
              onClick={() => {
                setQuery("");
                setGradeId("");
                setClassId("");
              }}
              className="w-full h-[42px] rounded-lg border border-neutral-200 text-xs font-bold text-neutral-500 hover:bg-neutral-50 transition-colors capitalize tracking-widest"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </section>

      {/* RESULTS TABLE */}
      <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
          <h3 className="text-sm font-bold text-neutral-800 capitalize tracking-tighter">
            Attendance Register
          </h3>
          {loading && (
            <span className="text-xs font-bold text-cyan-600 animate-pulse capitalize">
              Refreshing...
            </span>
          )}
        </div>

        {error ? (
          <div className="p-12 text-center text-rose-600 font-medium bg-rose-50/30">
            {String(error)}
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[600px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-500 sticky top-0 z-10">
                <tr>
                  <th className="p-4 font-bold capitalize text-[10px]">ID</th>
                  <th className="p-4 font-bold capitalize text-[10px]">
                    Student Name
                  </th>
                  <th className="p-4 font-bold capitalize text-[10px]">
                    Class/Teacher
                  </th>
                  <th className="p-4 font-bold capitalize text-[10px] text-center">
                    Status
                  </th>
                  <th className="p-4 font-bold capitalize text-[10px]">
                    Reason for Absence
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {attendanceRows.map((a) => {
                  const isPresent = a.isPresent ?? a.IsPresent;
                  return (
                    <tr
                      key={`${a.id || a.Id}-${a.date || a.Date}`}
                      className="hover:bg-cyan-50/40 transition-colors group"
                    >
                      <td className="p-4 font-mono text-xs text-neutral-400 group-hover:text-cyan-600">
                        {a.id ?? a.Id}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-neutral-800 leading-none">
                          {a.studentName ?? a.StudentName}
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-1 capitalize tracking-tight">
                          {a.date ?? a.Date}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-neutral-700 font-medium">
                          {a.className ?? a.ClassName}
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          Mentor: {a.teacherName ?? a.TeacherName}
                        </p>
                      </td>
                      <td className="p-4 text-center">
                        {isPresent === undefined ? (
                          <Badge color="neutral">-</Badge>
                        ) : isPresent ? (
                          <Badge color="cyan">Present</Badge>
                        ) : (
                          <Badge color="rose">Absent</Badge>
                        )}
                      </td>
                      <td className="p-4 max-w-xs">
                        <p
                          className="text-xs text-neutral-500 truncate"
                          title={a.reason}
                        >
                          {a.reason || (
                            <span className="text-neutral-300 italic">
                              No notes
                            </span>
                          )}
                        </p>
                      </td>
                    </tr>
                  );
                })}
                {attendanceRows.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-20 text-center text-neutral-400 italic"
                    >
                      No records found matching your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CSS Injection for standard inputs */}
      <style>{`
        .filter-input {
          margin-top: 4px;
          display: block;
          width: 100%;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          background-color: white;
          padding: 8px 12px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }
        .filter-input:focus {
          border-color: #0891b2;
          box-shadow: 0 0 0 2px rgba(8, 145, 178, 0.1);
        }
      `}</style>
    </div>
  );
}

/* Helper Components */

function Field({ label, children }) {
  return (
    <div>
      <label className="text-[10px] font-bold text-neutral-400 capitalize tracking-widest block ml-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="p-6">
      <p className={`text-2xl font-black ${color} leading-none`}>{value}</p>
      <p className="text-[10px] font-bold text-neutral-400 capitalize mt-1 tracking-tight">
        {label}
      </p>
    </div>
  );
}

function Badge({ children, color }) {
  const styles = {
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    neutral: "bg-neutral-50 text-neutral-500 border-neutral-100",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black capitalize tracking-widest border ${styles[color]}`}
    >
      {children}
    </span>
  );
}
