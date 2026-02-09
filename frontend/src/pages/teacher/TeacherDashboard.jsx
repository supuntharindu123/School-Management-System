import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getTeacherById } from "../../features/adminFeatures/teachers/teacherService";
import { useNavigate } from "react-router-dom";
import { GetClassAttendanceByDate } from "../../features/attendances/attendanceService";

export default function TeacherDashboard() {
  const [teacherInfo, setTeacherInfo] = useState(null);

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [classView, setClassView] = useState("active");
  const [subjectView, setSubjectView] = useState("active");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Attendance reminder state
  const [attendanceCheckLoading, setAttendanceCheckLoading] = useState(false);
  const [attendanceMissing, setAttendanceMissing] = useState([]);

  const { user } = useSelector((s) => s.auth);

  console.log("user", user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 1) {
      console.warn("User is not a teacher or not logged in");
    }

    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const data = await getTeacherById(user.teacherId);
        setTeacherInfo(data);
        setClasses(data.classAssignments || []);
        setSubjects(data.subjectClasses || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching teacher details:", err);
        setError("Failed to load teacher data");
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [user]);

  const getInitials = (name) => {
    if (!name) return "T";
    const parts = String(name).trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Helper: today's date in local YYYY-MM-DD
  const getTodayLocalISO = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  };

  // Check today's attendance for all assigned classes and build reminder list
  useEffect(() => {
    const list = classes || [];
    if (!user?.teacherId || !list.length) {
      setAttendanceMissing([]);
      return;
    }
    let alive = true;
    const today = getTodayLocalISO();
    const checkAttendance = async () => {
      setAttendanceCheckLoading(true);
      try {
        const results = [];
        for (const c of list) {
          try {
            const data = await GetClassAttendanceByDate(c.classId, today);
            results.push({
              classId: c.classId,
              className: c.className || `Class #${c.classId}`,
              hasToday: data ? data.length > 0 : !!data,
              isActive: !!c.isActive,
            });
          } catch (err) {
            // Treat per-class error as missing attendance for reminder purposes
            results.push({
              classId: c.classId,
              className: c.className || `Class #${c.classId}`,
              hasToday: false,
              isActive: !!c.isActive,
            });
          }
        }
        if (alive) {
          const missing = results.filter((r) => r.isActive && !r.hasToday);
          setAttendanceMissing(missing);
        }
      } catch (err) {
        // Unexpected failure in reminder workflow; show no reminder list
        if (alive) setAttendanceMissing([]);
      } finally {
        if (alive) setAttendanceCheckLoading(false);
      }
    };
    checkAttendance();
    return () => {
      alive = false;
    };
  }, [classes, user?.teacherId]);

  const classDetails = (id) => {
    navigate(`/classes/${id}`);
  };

  console.log("teacherInfo", teacherInfo);

  const upcomingExams = useMemo(() => {
    const now = new Date();
    return (exams || []).filter((e) => {
      const end = new Date(e?.endDate);
      return !isNaN(end) && now < end;
    });
  }, [exams]);

  const filteredClasses = useMemo(() => {
    const list = classes || [];
    if (classView === "active") return list.filter((c) => c?.isActive);
    if (classView === "history") return list.filter((c) => !c?.isActive);
    return list;
  }, [classes, classView]);

  const filteredSubjects = useMemo(() => {
    const list = subjects || [];
    if (subjectView === "active") return list.filter((s) => s?.isActive);
    if (subjectView === "history") return list.filter((s) => !s?.isActive);
    return list;
  }, [subjects, subjectView]);

  return (
    <div className="space-y-6">
      {/* Attendance Reminder Banner */}

      <div className="mb-4 flex items-center justify-between bg-gradient-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-6 rounded-2xl px-6 relative overflow-hidden">
        <div>
          <h1 className="text-3xl font-bold text-cyan-50">
            Teacher Dashboard
            {teacherInfo?.fullName ? ` — ${teacherInfo.fullName}` : ""}
          </h1>
          <p className="text-sm text-cyan-50">
            Overview of assigned classes, subjects, and upcoming exams
          </p>
        </div>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-cyan-700 text-white text-xl font-semibold mr-2">
          {getInitials(teacherInfo?.fullName)}
        </span>
      </div>

      {/* Teacher Info */}
      <section className="rounded-xl  bg-white p-4 shadow-md">
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 text-md text-neutral-800">
          <div>
            <span className="text-neutral-600 font-semibold">Email:</span>{" "}
            {teacherInfo?.user.email ?? "-"}
          </div>
          <div>
            <span className="text-neutral-600 font-semibold">Teacher ID:</span>{" "}
            {user?.teacherId ?? teacherInfo?.id ?? "-"}
          </div>
          <div>
            <span className="text-neutral-600 font-semibold">
              Total Assignments:
            </span>{" "}
            {(classes?.length ?? 0) + (subjects?.length ?? 0)}
          </div>
          <div>
            <span className="text-neutral-600 font-semibold">
              Active Assignments:
            </span>{" "}
            {(classes || []).filter((c) => c?.isActive).length +
              (subjects || []).filter((s) => s?.isActive).length}
          </div>
        </div>
      </section>

      {(attendanceMissing?.length || 0) > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Attendance reminder
              </p>
              <p className="text-xs text-amber-900/80">
                You haven't marked today's attendance for the following active
                classes:
              </p>
            </div>
            {attendanceCheckLoading && (
              <span className="text-xs text-amber-800">Checking…</span>
            )}
          </div>
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {attendanceMissing.map((c) => (
              <li
                key={c.classId}
                className="flex items-center justify-between rounded-lg border border-amber-200 bg-white p-3"
              >
                <span className="text-sm text-neutral-900">{c.className}</span>
                <button
                  type="button"
                  className="text-xs rounded bg-cyan-600 text-white px-2 py-1 hover:bg-cyan-700"
                  onClick={() => navigate(`/classes/${c.classId}`)}
                >
                  Mark now
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          title="Assigned Classes"
          value={teacherInfo?.classAssignments?.length ?? 0}
        />
        <SummaryCard
          title="Assigned Subjects"
          value={teacherInfo?.subjectClasses?.length ?? 0}
        />
        <SummaryCard
          title="Total Assignments"
          value={
            (teacherInfo?.classAssignments?.length ?? 0) +
            (teacherInfo?.subjectClasses?.length ?? 0)
          }
        />
      </div>

      {/* Assigned Classes */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-neutral-900">
            Assigned Classes
          </p>
          <div className="flex items-center gap-2">
            {loading && (
              <span className="text-xs text-neutral-600">Loading...</span>
            )}
            <div className="flex items-center shadow-md">
              <button
                type="button"
                onClick={() => setClassView("active")}
                className={` rounded-l-md border px-3 py-2 text-xs font-medium transition-colors ${
                  classView === "active"
                    ? "border-cyan-600 bg-cyan-600 text-white"
                    : "border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100"
                }`}
                aria-pressed={classView === "active"}
              >
                Active ({(classes || []).filter((c) => c?.isActive).length})
              </button>
              <button
                type="button"
                onClick={() => setClassView("history")}
                className={` border px-3 py-2 text-xs font-medium transition-colors ${
                  classView === "history"
                    ? "border-cyan-600 bg-cyan-600 text-white"
                    : "border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100"
                }`}
                aria-pressed={classView === "history"}
              >
                History ({(classes || []).filter((c) => !c?.isActive).length})
              </button>
              <button
                type="button"
                onClick={() => setClassView("all")}
                className={`rounded-r-md border px-3 py-2 text-xs font-medium transition-colors ${
                  classView === "all"
                    ? "border-cyan-600 bg-cyan-600 text-white"
                    : "border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100"
                }`}
                aria-pressed={classView === "all"}
              >
                All ({classes?.length ?? 0})
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left bg-cyan-600 text-cyan-50 rounded-xl border-2">
                <th className="border-b border-cyan-200 py-2 px-3">Class</th>
                <th className="border-b border-cyan-200 py-2 px-3">Role</th>
                <th className="border-b border-cyan-200 py-2 px-3">Active</th>
                <th className="border-b border-cyan-200 py-2 px-3">Assigned</th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {filteredClasses
                .slice()
                .sort((a, b) => (b.isActive === true) - (a.isActive === true))
                .map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50"
                    onClick={() => {
                      classDetails(c.classId);
                    }}
                  >
                    <td className="border-b border-gray-200 py-2 px-3">
                      {c.className || `Class #${c.classId}`}
                    </td>
                    <td className="border-b border-gray-200 py-2 px-3">
                      {c.role || "-"}
                    </td>
                    <td className="border-b border-gray-200 py-2 px-3">
                      {c.isActive ? statusBadge(true) : statusBadge(false)}
                    </td>
                    <td className="border-b border-gray-200 py-2 px-3">
                      {formatDateTime(c.createdDate)}
                    </td>
                  </tr>
                ))}
              {!filteredClasses?.length && (
                <tr>
                  <td className="py-8 text-center text-neutral-600" colSpan={4}>
                    No class assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Assigned Subjects */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-neutral-900">
            Assigned Subjects
          </p>
          <div className="flex items-center gap-2">
            {loading && (
              <span className="text-xs text-neutral-600">Loading...</span>
            )}
            <div className="flex items-center shadow-md ">
              <button
                type="button"
                onClick={() => setSubjectView("active")}
                className={`rounded-l-md border px-3 py-2 text-xs font-medium transition-colors ${
                  subjectView === "active"
                    ? "border-cyan-600 bg-cyan-600 text-white"
                    : "border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100"
                }`}
                aria-pressed={subjectView === "active"}
              >
                Active ({(subjects || []).filter((s) => s?.isActive).length})
              </button>
              <button
                type="button"
                onClick={() => setSubjectView("history")}
                className={` border px-3 py-2 text-xs font-medium transition-colors ${
                  subjectView === "history"
                    ? "border-cyan-600 bg-cyan-600 text-white"
                    : "border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100"
                }`}
                aria-pressed={subjectView === "history"}
              >
                History ({(subjects || []).filter((s) => !s?.isActive).length})
              </button>
              <button
                type="button"
                onClick={() => setSubjectView("all")}
                className={`rounded-r-md border px-3 py-2 text-xs font-medium transition-colors ${
                  subjectView === "all"
                    ? "border-cyan-600 bg-cyan-600 text-white"
                    : "border-cyan-200 bg-cyan-50 text-cyan-800 hover:bg-cyan-100"
                }`}
                aria-pressed={subjectView === "all"}
              >
                All ({subjects?.length ?? 0})
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left bg-cyan-600 text-cyan-50 ">
                <th className="border-b border-cyan-200 py-2 px-3">Subject</th>
                <th className="border-b border-cyan-200 py-2 px-3">Class</th>
                <th className="border-b border-cyan-200 py-2 px-3">Active</th>
                <th className="border-b border-cyan-200 py-2 px-3">Assigned</th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {filteredSubjects
                .slice()
                .sort((a, b) => (b.isActive === true) - (a.isActive === true))
                .map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="border-b border-gray-200 py-2 px-3">
                      {s.subjectName || "-"}
                    </td>
                    <td className="border-b border-gray-200 py-2 px-3">
                      {s.className || "-"}
                    </td>
                    <td className="border-b border-gray-200 py-2 px-3">
                      {s.isActive ? statusBadge(true) : statusBadge(false)}
                    </td>
                    <td className="border-b border-gray-200 py-2 px-3">
                      {formatDateTime(s?.startDate)}
                    </td>
                  </tr>
                ))}
              {!filteredSubjects?.length && (
                <tr>
                  <td className="py-8 text-center text-neutral-600" colSpan={4}>
                    No subject assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Upcoming Exams */}
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3">
          <p className="text-sm font-semibold text-neutral-900">
            Upcoming Exams
          </p>
          <p className="text-xs text-neutral-600">
            Based on assigned classes/grades
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(upcomingExams || []).map((e) => (
            <div
              key={e.id}
              className="rounded-lg border border-gray-200 bg-white p-3"
            >
              <p className="text-sm font-semibold text-neutral-900">
                {e.title}
              </p>
              <p className="text-xs text-neutral-700">
                Year {e.academicYear} · Grade {e.gradeName}
              </p>
              <div className="mt-2 text-xs text-neutral-700">
                <span className="rounded bg-gray-100 px-2 py-1">
                  Start: {formatDate(e.startDate)}
                </span>
                <span className="ml-2 rounded bg-gray-100 px-2 py-1">
                  End: {formatDate(e.endDate)}
                </span>
              </div>
            </div>
          ))}
          {!upcomingExams?.length && (
            <p className="text-sm text-neutral-600">No upcoming exams.</p>
          )}
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

function SummaryCard({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-md">
      <p className="text-xs text-neutral-600">{title}</p>
      <p className="text-2xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function statusBadge(active) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs ${
        active
          ? "border-cyan-200 bg-cyan-100 text-cyan-800"
          : "border-gray-200 bg-gray-100 text-gray-700"
      }`}
    >
      {active ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-3 w-3"
        >
          <path d="M9 16.5 4.5 12l1.5-1.5L9 13.5l9-9L19.5 6l-9 10.5Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-3 w-3"
        >
          <path d="M6 12.75h12v-1.5H6v1.5Z" />
        </svg>
      )}
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function formatDate(d) {
  try {
    const str = typeof d === "string" ? d : String(d);
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${dd}`;
    }
    return str;
  } catch {
    return String(d);
  }
}

function formatDateTime(d) {
  try {
    const date = new Date(d);
    if (!isNaN(date.getTime())) return date.toLocaleString();
    return String(d);
  } catch {
    return String(d);
  }
}

function formatRange(s, e) {
  return `${formatDate(s)} — ${formatDate(e)}`;
}
