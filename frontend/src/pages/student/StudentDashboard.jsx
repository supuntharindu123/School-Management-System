import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { GetStudentById } from "../../features/adminFeatures/students/studentService";
import { GetAttendanceByStudent } from "../../features/attendances/attendanceService";
import Info from "../../components/CommonElements/Info";
import SummaryCard from "../../components/CommonElements/SummaryCard";

export default function StudentDashboard() {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!user?.studentId) throw new Error("Missing student identity");
        const s = await GetStudentById(user.studentId);
        setStudent(s);
        const att = await GetAttendanceByStudent(user.studentId);
        setAttendance(Array.isArray(att) ? att : []);
      } catch (e) {
        setError(e?.response?.data || e?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.studentId]);

  const stats = useMemo(() => {
    const total = attendance.length;
    const present = attendance.filter(
      (a) => (a.isPresent ?? a.IsPresent) === true,
    ).length;
    const absent = total - present;
    const pct = total ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, pct };
  }, [attendance]);

  const recent = useMemo(() => {
    return attendance
      .slice()
      .sort(
        (a, b) =>
          new Date((b.date ?? b.Date) + "T00:00:00") -
          new Date((a.date ?? a.Date) + "T00:00:00"),
      )
      .slice(0, 10);
  }, [attendance]);

  const getInitials = (name) => {
    if (!name) return "T";
    const parts = String(name).trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between bg-gradient-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-6 rounded-2xl px-6 relative overflow-hidden">
        <div>
          <h1 className="text-3xl font-bold text-cyan-50">
            Student Dashboard{student?.fullName ? ` — ${student.fullName}` : ""}
          </h1>
          <p className="text-sm text-cyan-50">
            Overview of your class, attendance, and recent activity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/students/${user?.studentId ?? ""}`}
            className="rounded-lg px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-700"
          >
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-cyan-700 text-white text-2xl font-semibold mr-2">
              {getInitials(student?.fullName)}
            </span>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          title="Current Class"
          value={student?.currentClass ?? "-"}
        />
        <SummaryCard title="Attendance %" value={`${stats.pct}%`} />
        <SummaryCard title="Absences" value={stats.absent} />
      </div>

      {/* Class & Details */}
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-neutral-900">My Class</p>
          {loading && (
            <span className="text-xs text-neutral-600">Loading...</span>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Info label="Class" value={student?.currentClass} />
          <Info label="Grade" value={student?.currentGrade} />
          <Info label="Student ID" value={student?.studentIDNumber} />
        </div>
      </section>

      {/* Attendance Overview */}
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm font-semibold text-neutral-900">
          Recent Attendance
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-800">
                <th className="border-b border-gray-200 py-2 px-3">Date</th>
                <th className="border-b border-gray-200 py-2 px-3">Class</th>
                <th className="border-b border-gray-200 py-2 px-3">Teacher</th>
                <th className="border-b border-gray-200 py-2 px-3">Present</th>
                <th className="border-b border-gray-200 py-2 px-3">Reason</th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {recent.map((r) => (
                <tr key={r.id ?? r.Id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-200 py-2 px-3">
                    {r.date ?? r.Date}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {r.className ?? r.ClassName ?? "-"}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {r.teacherName ?? r.TeacherName ?? "-"}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {(r.isPresent ?? r.IsPresent)
                      ? statusBadge(true)
                      : statusBadge(false)}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {r.reason ?? r.Reason ?? "-"}
                  </td>
                </tr>
              ))}
              {!recent.length && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-neutral-600">
                    No recent attendance records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}

function statusBadge(active) {
  return (
    <span
      className={`rounded px-2 py-1 text-xs ${active ? "bg-teal-100 text-teal-800" : "bg-gray-200 text-gray-800"}`}
    >
      {active ? "Present" : "Absent"}
    </span>
  );
}
