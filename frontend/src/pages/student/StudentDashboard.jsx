import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { GetStudentById } from "../../features/adminFeatures/students/studentService";
import { GetAttendanceByStudent } from "../../features/attendances/attendanceService";
import Info from "../../components/CommonElements/Info";
import SummaryCard from "../../components/CommonElements/SummaryCard";

export default function StudentDashboard() {
  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  // state: unified data and ui objects
  const [data, setData] = useState({ student: null, attendance: [] });
  const [ui, setUi] = useState({ loading: false, error: null });

  // helper: initials logic
  const getInitials = (name) => {
    if (!name) return "S";
    const parts = String(name).trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // load data: simultaneous fetching via promise.all
  const loadDashboardData = useCallback(async () => {
    if (!user?.studentId) {
      setUi({ loading: false, error: "Missing student identity" });
      return;
    }

    setUi({ loading: true, error: null });
    try {
      const [studentProfile, attendanceRecords] = await Promise.all([
        GetStudentById(user.studentId),
        GetAttendanceByStudent(user.studentId),
      ]);

      setData({
        student: studentProfile,
        attendance: Array.isArray(attendanceRecords) ? attendanceRecords : [],
      });
    } catch (e) {
      setUi({
        loading: false,
        error: e?.response?.data || e?.message || "Failed to load data",
      });
    } finally {
      setUi((prev) => ({ ...prev, loading: false }));
    }
  }, [user?.studentId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // computed stats: memoized for performance
  const stats = useMemo(() => {
    const total = data.attendance.length;
    const presentCount = data.attendance.filter(
      (a) => (a.isPresent ?? a.IsPresent) === true,
    ).length;
    const absentCount = total - presentCount;
    const percentage = total ? Math.round((presentCount / total) * 100) : 0;

    return { total, presentCount, absentCount, percentage };
  }, [data.attendance]);

  // recent records: sorted by date descending (top 10)
  const recentRecords = useMemo(() => {
    return [...data.attendance]
      .sort((a, b) => {
        const dateA = new Date(a.date ?? a.Date);
        const dateB = new Date(b.date ?? b.Date);
        return dateB - dateA;
      })
      .slice(0, 10);
  }, [data.attendance]);

  return (
    <div className="max-w-full mx-auto space-y-8 pb-16 animate-fade-in px-4">
      {/* header section */}
      <header className="mb-4 flex items-center justify-between bg-linear-to-r from-cyan-900 via-cyan-800 to-cyan-900 py-6 rounded-2xl px-6 relative overflow-hidden shadow-lg">
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />
        <div className="z-10">
          <h1 className="text-3xl font-bold text-cyan-50">
            Student Dashboard
            {data.student?.fullName ? ` — ${data.student.fullName}` : ""}
          </h1>
          <p className="text-sm text-cyan-50/90">
            Overview of your class, attendance, and recent activity
          </p>
        </div>

        <Link
          to={`/students/${user?.studentId ?? ""}`}
          className="z-10 transition-transform hover:scale-110"
        >
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-cyan-700 text-white text-2xl font-bold border-2 border-cyan-400/30">
            {getInitials(data.student?.fullName)}
          </span>
        </Link>
      </header>

      {/* summary stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Current Class"
          value={data.student?.currentClass ?? "-"}
        />
        <SummaryCard
          title="Attendance Percentage"
          value={`${stats.percentage}%`}
        />
        <SummaryCard title="Total Absences" value={stats.absentCount} />
      </section>

      {/* identity details */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-neutral-900">
            My Class Details
          </h2>
          {ui.loading && (
            <span className="text-xs text-cyan-600 animate-pulse font-medium">
              Updating Data...
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Info label="Current Class" value={data.student?.currentClass} />
          <Info label="Grade Level" value={data.student?.currentGrade} />
          <Info label="Student ID" value={data.student?.studentIDNumber} />
        </div>
      </section>

      {/* attendance records table */}
      <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-900 mb-4">
          Recent Attendance Records
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-cyan-800 ">
              <tr className=" p-1 border-b border-gray-100 text-neutral-500">
                <th className="p-2 text-cyan-50 font-semibold">Date</th>
                <th className="p-2 text-cyan-50 font-semibold">Class</th>
                <th className="p-2 text-cyan-50 font-semibold">Teacher</th>
                <th className="p-2 text-cyan-50 font-semibold">Status</th>
                <th className="p-2 text-cyan-50 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentRecords.map((record) => (
                <tr
                  key={record.id ?? record.Id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="py-3 pr-2 text-neutral-900 font-medium">
                    {record.date ?? record.Date}
                  </td>
                  <td className="py-3 px-2 text-neutral-700">
                    {record.className ?? record.ClassName ?? "-"}
                  </td>
                  <td className="py-3 px-2 text-neutral-700">
                    {record.teacherName ?? record.TeacherName ?? "-"}
                  </td>
                  <td className="py-3 px-2">
                    <StatusBadge
                      present={record.isPresent ?? record.IsPresent}
                    />
                  </td>
                  <td className="py-3 pl-2 text-neutral-500 italic">
                    {record.reason ?? record.Reason ?? "-"}
                  </td>
                </tr>
              ))}
              {!recentRecords.length && !ui.loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-neutral-400"
                  >
                    No attendance records found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* error state alert */}
      {ui.error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          <p>
            <strong>Error:</strong> {ui.error}
          </p>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ present }) {
  const styles = present
    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
    : "bg-rose-100 text-rose-800 border-rose-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles}`}
    >
      {present ? "Present" : "Absent"}
    </span>
  );
}
