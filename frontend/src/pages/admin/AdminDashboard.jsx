import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/CommonElements/Button";
import { GetAllStudents } from "../../features/adminFeatures/students/studentListSlice";
import { getClasses } from "../../features/class/classSlice";
import { getTeachers } from "../../features/adminFeatures/teachers/teacherSlice";
import { getStudentAttendance } from "../../features/attendances/attendanceSlice";
import AddTeacherForm from "../../components/Teacher/AddTeacherForm";
import AddStudentForm from "../../components/Student/AddStudentForm";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const students = useSelector((state) => state.studentList);
  const teachers = useSelector((state) => state.teachers);
  const classes = useSelector((state) => state.classes);
  const attendance = useSelector((state) => state.attendances);

  const [counts, setCounts] = useState({
    std: 0,
    teacher: 0,
    class: 0,
    attendanceRate: 0,
  });

  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [openAddTeacherModal, setOpenAddTeacherModal] = useState(false);

  useEffect(() => {
    dispatch(GetAllStudents());
    dispatch(getClasses());
    dispatch(getTeachers());
    dispatch(getStudentAttendance());
  }, [dispatch]);

  useEffect(() => {
    const activeStudents = students.students.filter(
      (s) => s.status === "Active",
    );
    const today = new Date().toISOString().split("T")[0];

    const todayAttendance = attendance.attendances.filter((item) => {
      const attendanceDate = new Date(item.date).toISOString().split("T")[0];
      return attendanceDate === today;
    });

    const rate =
      activeStudents.length > 0
        ? ((todayAttendance.length / activeStudents.length) * 100).toFixed(1)
        : 0;

    setCounts({
      std: activeStudents.length,
      teacher: teachers.teachers.length,
      class: classes.classes.length,
      attendanceRate: rate,
    });
  }, [students, teachers, classes, attendance]);

  const stats = [
    {
      label: "Total Students",
      value: counts.std,
      icon: <StudentIcon />,
      color: "text-cyan-700",
      bg: "bg-cyan-50",
    },
    {
      label: "Faculty Members",
      value: counts.teacher,
      icon: <TeacherIcon />,
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      label: "Active Classes",
      value: counts.class,
      icon: <ClassIcon />,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "Today's Attendance",
      value: `${counts.attendanceRate}%`,
      icon: <AttendanceIcon />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="max-w-full mx-auto space-y-8 pb-16 animate-fade-in px-4">
      <AddStudentForm
        open={openAddStudentModal}
        onClose={() => setOpenAddStudentModal(false)}
      />
      <AddTeacherForm
        open={openAddTeacherModal}
        onClose={() => setOpenAddTeacherModal(false)}
      />

      {/* HERO SECTION - Deep Cyan Gradient (Professional, Not Black) */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-800 via-cyan-700 to-cyan-600 p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-cyan-50 opacity-90 font-medium">
              Insights, quick actions, and latest activity for today.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] capitalize font-bold tracking-widest text-cyan-100">
                Today
              </p>
              <p className="text-lg font-bold">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="h-10 w-px bg-white/20 hidden sm:block mx-2"></div>
            <div className="bg-white/20 h-10 w-10 rounded-full flex items-center justify-center shadow-inner">
              <CalendarIcon />
            </div>
          </div>
        </div>
      </header>

      {/* FULL WIDTH OVERVIEW SECTION */}
      <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-100">
          {stats.map((s) => (
            <div
              key={s.label}
              className="p-6 hover:bg-cyan-50/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-2xl font-black text-neutral-900 leading-none">
                    {s.value}
                  </p>
                  <p className="text-xs font-bold text-neutral-400 capitalize mt-1 tracking-tight">
                    {s.label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACTION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Operations (Lighter style) */}
        <section className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-neutral-800 capitalize tracking-tighter mb-4">
            Quick Operations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ActionButton
              label="Add Student"
              onClick={() => setOpenAddStudentModal(true)}
              isPrimary
            />
            <ActionButton
              label="Add Teacher"
              onClick={() => setOpenAddTeacherModal(true)}
            />
            <ActionButton
              label="Create Exam"
              onClick={() => {
                navigate("/exams");
              }}
              isPrimary
            />
            <ActionButton
              label="Attendance"
              onClick={() => navigate("/attendance")}
            />
          </div>
        </section>

        {/* Navigation Shortcuts - Swapped from Black to Light Cyan */}
        <section className="bg-cyan-50 rounded-2xl p-6 border border-cyan-100 shadow-sm">
          <h2 className="text-sm font-bold text-cyan-800 capitalize tracking-tighter mb-4">
            Management
          </h2>
          <div className="space-y-3">
            {[
              { label: "Manage Students", to: "/students" },
              { label: "Manage Teachers", to: "/teachers" },
              { label: "Manage Classes", to: "/classes" },
            ].map((item) => (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className="w-full group flex items-center justify-between p-3 rounded-xl bg-white border border-cyan-200/50 hover:border-cyan-500 hover:shadow-md hover:shadow-cyan-500/10 transition-all text-left"
              >
                <span className="text-sm font-bold text-cyan-900">
                  {item.label}
                </span>
                <svg
                  className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* HELPER COMPONENTS */

const ActionButton = ({ label, onClick, isPrimary = false }) => {
  const styles = isPrimary
    ? "bg-cyan-50 border-cyan-300 text-neutral-700 hover:bg-cyan-100 shadow-lg shadow-cyan-600/20"
    : "bg-white border-neutral-200 text-neutral-700 hover:border-cyan-500 hover:text-cyan-700 hover:bg-cyan-50";

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl border font-bold text-[11px] capitalize tracking-tight transition-all active:scale-95 h-24 ${styles}`}
    >
      {label}
    </button>
  );
};

// SVG Icons
const StudentIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);
const TeacherIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM7 8h10M7 12h10M7 16h10"
    />
  </svg>
);
const ClassIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
    />
  </svg>
);
const AttendanceIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const CalendarIcon = () => (
  <svg
    className="h-6 w-6 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);
