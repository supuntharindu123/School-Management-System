import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getTeacherById } from "../../features/adminFeatures/teachers/teacherService";
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

  // attendance reminder state
  const [attendanceCheckLoading, setAttendanceCheckLoading] = useState(false);
  const [attendanceMissing, setAttendanceMissing] = useState([]);

  const { user } = useSelector((s) => s.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const data = await getTeacherById(user.teacherId);
        setTeacherInfo(data);
        setClasses(data.classAssignments || []);
        setSubjects(data.subjectClasses || []);
        // If exams are part of teacher data, set them here
        setExams(data.exams || []);
      } catch (err) {
        setError("Failed to load teacher data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.teacherId) fetchTeacherData();
  }, [user]);

  const getInitials = (name) => {
    if (!name) return "Tr";
    const parts = name.trim().split(" ").filter(Boolean);
    return parts.length === 1
      ? parts[0].slice(0, 2)
      : parts[0][0] + parts[parts.length - 1][0];
  };

  const getTodayLocalISO = () => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (!user?.teacherId || !classes.length) return;

    let isMounted = true;
    const today = getTodayLocalISO();

    const checkAttendance = async () => {
      setAttendanceCheckLoading(true);
      const results = [];
      for (const c of classes) {
        try {
          const data = await GetClassAttendanceByDate(c.classId, today);
          results.push({
            classId: c.classId,
            className: c.className || `Class ${c.classId}`,
            hasToday: data && data.length > 0,
            isActive: !!c.isActive,
          });
        } catch {
          results.push({
            classId: c.classId,
            className: c.className,
            hasToday: false,
            isActive: !!c.isActive,
          });
        }
      }
      if (isMounted) {
        setAttendanceMissing(results.filter((r) => r.isActive && !r.hasToday));
        setAttendanceCheckLoading(false);
      }
    };

    checkAttendance();
    return () => {
      isMounted = false;
    };
  }, [classes, user?.teacherId]);

  const upcomingExams = useMemo(() => {
    const now = new Date();
    return (exams || []).filter((e) => new Date(e?.endDate) > now);
  }, [exams]);

  const filteredClasses = useMemo(() => {
    if (classView === "active") return classes.filter((c) => c?.isActive);
    if (classView === "history") return classes.filter((c) => !c?.isActive);
    return classes;
  }, [classes, classView]);

  const filteredSubjects = useMemo(() => {
    if (subjectView === "active") return subjects.filter((s) => s?.isActive);
    if (subjectView === "history") return subjects.filter((s) => !s?.isActive);
    return subjects;
  }, [subjects, subjectView]);

  return (
    <div className="max-w-full mx-auto space-y-8 pb-16 animate-fade-in px-4">
      {/* header banner */}
      <header className="relative bg-gradient-to-r from-cyan-800 to-cyan-600 rounded-2xl p-8 text-white shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold">Teacher Dashboard</h1>
            <p className="text-cyan-100 mt-2 font-medium opacity-90">
              Welcome back, {teacherInfo?.fullName || "Professor"}
            </p>
          </div>
          <div className="h-20 w-20 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-3xl font-black shadow-inner">
            {getInitials(teacherInfo?.fullName)}
          </div>
        </div>
      </header>

      {/* quick metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Email address"
          value={teacherInfo?.user?.email || "N/A"}
          icon="📧"
        />
        <MetricCard
          label="Teacher identification"
          value={`${String(user?.teacherId).padStart(4, "0")}`}
          icon="🆔"
        />
        <MetricCard
          label="Total active roles"
          value={
            classes.filter((c) => c.isActive).length +
            subjects.filter((s) => s.isActive).length
          }
          icon="📊"
        />
      </div>

      {/* attendance reminder */}
      {attendanceMissing.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-white border-l-8 border-amber-400 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-400 rounded-full flex items-center justify-center text-white text-xl">
              ⚠️
            </div>
            <div>
              <h3 className="font-black text-amber-900 text-lg">
                Daily attendance missing
              </h3>
              <p className="text-amber-700 text-sm font-medium">
                Please mark today's attendance for the following classes:
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {attendanceMissing.map((c) => (
              <button
                key={c.classId}
                onClick={() => navigate(`/classes/${c.classId}`)}
                className="bg-white border-2 border-amber-200 px-4 py-2 rounded-xl text-sm font-bold text-amber-900 hover:bg-amber-400 hover:text-white hover:border-amber-400 transition-all shadow-sm"
              >
                Mark {c.className}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* main content tables */}
      <div className="grid grid-cols-1 gap-10">
        {/* classes management */}
        <section className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
            <h2 className="font-black text-2xl text-cyan-950">
              Your class assignments
            </h2>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              {["active", "history", "all"].map((view) => (
                <button
                  key={view}
                  onClick={() => setClassView(view)}
                  className={`px-6 py-2 text-xs font-black rounded-xl transition-all ${
                    classView === view
                      ? "bg-white text-cyan-700 shadow-md scale-105"
                      : "text-slate-500 hover:text-cyan-600"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-cyan-800 text-cyan-50 text-sm font-black">
                  <th className="px-8 py-5">Class name</th>
                  <th className="px-8 py-5">Designation</th>
                  <th className="px-8 py-5 text-center">Current status</th>
                  <th className="px-8 py-5 text-right">Date created</th>
                  <th className="px-8 py-5 text-right">End date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredClasses.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/classes/${c.classId}`)}
                    className="hover:bg-cyan-50/40 cursor-pointer transition-colors group"
                  >
                    <td className="px-8 py-6 font-bold text-cyan-900 text-lg group-hover:translate-x-1 transition-transform">
                      {c.className || "Unnamed Class"}
                    </td>
                    <td className="px-8 py-6 font-medium text-slate-600">
                      {c.role || "Primary Teacher"}
                    </td>
                    <td className="px-8 py-6 text-center">
                      {StatusBadge(c.isActive)}
                    </td>
                    <td className="px-8 py-6 text-right font-mono text-slate-400 text-sm">
                      {formatDate(c.createdDate)}
                    </td>
                    <td className="px-8 py-6 text-right font-mono text-slate-400 text-sm">
                      {formatDate(c.updatedDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* subjects section */}
        <section className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-6">
            <h2 className="font-black text-2xl text-cyan-950">
              Subject assignments
            </h2>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              {["active", "history", "all"].map((view) => (
                <button
                  key={view}
                  onClick={() => setSubjectView(view)}
                  className={`px-6 py-2 text-xs font-black rounded-xl transition-all ${
                    subjectView === view
                      ? "bg-white text-cyan-700 shadow-md scale-105"
                      : "text-slate-500 hover:text-cyan-600"
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-cyan-800 text-cyan-50 text-sm font-black">
                  <th className="px-8 py-5">Subject name</th>
                  <th className="px-8 py-5">Target class</th>
                  <th className="px-8 py-5 text-center">Status</th>
                  <th className="px-8 py-5 text-center">Start date</th>
                  <th className="px-8 py-5 text-right">End date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSubjects.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() =>
                      navigate(`/teacher/subject-assignments/${s.id}`, {
                        state: {
                          classId: s.classId,
                          subjectId: s.subjectId,
                          gradeId: s.gradeId,
                          subjectName: s.subjectName,
                          className: s.className,
                          fullName: teacherInfo?.fullName,
                        },
                      })
                    }
                    className="hover:bg-cyan-50/40 cursor-pointer transition-colors"
                  >
                    <td className="px-8 py-6 font-bold text-cyan-900 text-lg">
                      {s.subjectName}
                    </td>
                    <td className="px-8 py-6 font-medium text-slate-600">
                      {s.className}
                    </td>
                    <td className="px-8 py-6 text-center">
                      {StatusBadge(s.isActive)}
                    </td>
                    <td className="px-8 py-6 text-center font-mono text-slate-400 text-sm">
                      {formatDate(s.startDate)}
                    </td>
                    <td className="px-8 py-6 text-right font-mono text-slate-400 text-sm">
                      {formatDate(s.endDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* exams board */}
        <section className="bg-cyan-950 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-900 rounded-full blur-3xl opacity-20 -mb-20 -mr-20"></div>
          <div className="mb-10">
            <h2 className="text-3xl font-black">Upcoming examinations</h2>
            <p className="text-cyan-300 mt-2 font-medium">
              Review scheduled sessions for your assigned grades
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {upcomingExams.length > 0 ? (
              upcomingExams.map((e) => (
                <div
                  key={e.id}
                  className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[1.5rem] hover:bg-white/10 transition-all group"
                >
                  <h4 className="font-black text-cyan-400 text-lg mb-2 group-hover:text-white transition-colors">
                    {e.title}
                  </h4>
                  <p className="text-sm text-cyan-100/70 font-bold">
                    Grade {e.gradeName} • {e.academicYear}
                  </p>
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-[11px] font-black">
                      <span className="text-cyan-500">Starts:</span>
                      <span>{formatDate(e.startDate)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-black">
                      <span className="text-rose-400">Ends:</span>
                      <span>{formatDate(e.endDate)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center border-2 border-dashed border-white/10 rounded-3xl">
                <p className="text-cyan-100/40 italic font-medium">
                  No scheduled exams found at this time
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {error && (
        <div className="fixed bottom-10 right-10 bg-rose-600 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold animate-bounce z-50">
          {error}
        </div>
      )}
    </div>
  );
}

/* ================= reusable sub-components ================= */

function MetricCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all group">
      <div className="text-3xl mb-4 grayscale group-hover:grayscale-0 transition-all">
        {icon}
      </div>
      <p className="text-slate-400 text-sm font-black mb-2">{label}</p>
      <p className="text-cyan-950 font-black text-xl truncate">{value}</p>
    </div>
  );
}

function StatusBadge(active) {
  return (
    <span
      className={`text-sm font-black px-4 py-1.5 rounded-full border ${
        active
          ? "bg-cyan-50 text-cyan-700 border-cyan-200"
          : "bg-slate-100 text-slate-500 border-slate-200"
      }`}
    >
      {active ? "Active role" : "History"}
    </span>
  );
}

function formatDate(d) {
  if (!d) return "Current";

  const date = new Date(d);

  if (isNaN(date.getTime())) {
    return "Not set";
  }
  if (date.getFullYear() <= 1) {
    return "Current";
  }

  return date.toLocaleDateString("en-CA");
}
