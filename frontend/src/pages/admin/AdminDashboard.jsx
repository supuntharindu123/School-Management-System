import React, { useEffect, useState } from "react";
import Button from "../../components/CommonElements/Button";
import { useDispatch, useSelector } from "react-redux";
import { GetAllStudents } from "../../features/adminFeatures/students/studentListSlice";
import { getClasses } from "../../features/class/classSlice";
import { getTeachers } from "../../features/adminFeatures/teachers/teacherSlice";
import { getStudentAttendance } from "../../features/attendances/attendanceSlice";
import AddStudentDialog from "../../components/Student/AddStudentDialog";
import AddTeacherDialog from "../../components/Teacher/AddTeacherDialog";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const students = useSelector((state) => state.studentList);
  const teachers = useSelector((state) => state.teachers);
  const classes = useSelector((state) => state.classes);
  const attendance = useSelector((state) => state.attendances);

  const [stdcount, setStdcount] = useState(0);
  const [teachercount, setTeachercount] = useState(0);
  const [classcount, setClasscount] = useState(0);
  const [attendancecount, setAttendancecount] = useState(0);
  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [openAddTeacherModal, setOpenAddTeacherModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(GetAllStudents());
    dispatch(getClasses());
    dispatch(getTeachers());
    dispatch(getStudentAttendance());
  }, [dispatch]);

  useEffect(() => {
    const std = students.students.filter((s) => s.status == "Active");

    const per = attendance.attendances.filter((item) => {
      const today = new Date();
      const attendanceDate = new Date(item.date);
      return (
        attendanceDate.getFullYear() === today.getFullYear() &&
        attendanceDate.getMonth() === today.getMonth() &&
        attendanceDate.getDate() === today.getDate()
      );
    });
    setStdcount(std.length);
    setTeachercount(teachers.teachers.length);
    setClasscount(classes.classes.length);
    setAttendancecount(((per.length / std.length) * 100).toFixed(2) || 0);
  }, [students, teachers, classes, attendance]);

  const stats = [
    {
      label: "Total Students",
      value: stdcount,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path d="M7.5 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z" />
          <path d="M3 20.25a7.5 7.5 0 1 1 15 0v.75H3v-.75Z" />
        </svg>
      ),
    },
    {
      label: "Teachers",
      value: teachercount,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path d="M11.7 2.64a.75.75 0 0 1 .6 0l8.25 3.75a.75.75 0 0 1 0 1.36l-8.25 3.75a.75.75 0 0 1-.6 0L3.45 7.75a.75.75 0 0 1 0-1.36L11.7 2.64Z" />
          <path d="M4.5 10.5v3.375a4.125 4.125 0 0 0 8.25 0V10.5" />
        </svg>
      ),
    },
    {
      label: "Active Classes",
      value: classcount,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75V9H3V6.75Z" />
          <path d="M3 12h18v5.25A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25V12Z" />
        </svg>
      ),
    },
    {
      label: "Attendance Today",
      value: attendancecount + "%",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6"
        >
          <path d="M6.75 3A2.25 2.25 0 0 0 4.5 5.25v13.5A2.25 2.25 0 0 0 6.75 21h10.5A2.25 2.25 0 0 0 19.5 18.75V5.25A2.25 2.25 0 0 0 17.25 3H6.75Z" />
          <path d="M8.25 7.5h7.5v1.5h-7.5V7.5ZM8.25 11.25h7.5v1.5h-7.5v-1.5Z" />
        </svg>
      ),
    },
  ];

  const activity = [
    { date: "2026-01-10", event: "Student enrolled", user: "Admin" },
    { date: "2026-01-09", event: "Class created", user: "Admin" },
    { date: "2026-01-08", event: "Report generated", user: "Admin" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <AddStudentDialog
        open={openAddStudentModal}
        onClose={() => setOpenAddStudentModal(false)}
      />
      <AddTeacherDialog
        open={openAddTeacherModal}
        onClose={() => setOpenAddTeacherModal(false)}
      />
      {/* Hero */}
      <div className="rounded-xl bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 p-6 text-white shadow">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-white/90">
              Insights, quick actions, and latest activity
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="rounded bg-white/10 px-3 py-1 text-lg">Today</span>
            <span className="rounded bg-white/10 px-3 py-1 text-lg">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-cyan-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-md bg-cyan-50 text-cyan-700 p-2 border border-cyan-200">
                {s.icon}
              </div>
              <span className="text-xs text-cyan-700">Overview</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-neutral-900">
              {s.value}
            </p>
            <p className="text-sm text-neutral-700">{s.label}</p>
          </div>
        ))}
      </section>

      {/* Quick actions */}
      <section className="mt-6 rounded-xl border border-cyan-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-neutral-800">Quick Actions</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button
            label={"Add Student"}
            onClick={() => setOpenAddStudentModal(true)}
          />
          <Button
            label={"Add Teacher"}
            onClick={() => setOpenAddTeacherModal(true)}
          />
          <Button label={"Create Class"} />
          <Button
            label={"Student Attendance"}
            bgcolor="bg-cyan-700"
            onClick={() => navigate("/attendance")}
          />
        </div>
      </section>

      {/* Management shortcuts */}
      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Manage Students", to: "/students" },
          { label: "Manage Teachers", to: "/teachers" },
          { label: "Manage Classes", to: "/classes" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-cyan-200 bg-white p-4 hover:border-cyan-600 transition"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-neutral-800">
                {card.label}
              </p>
              <span className="text-xs rounded bg-cyan-50 text-cyan-700 px-2 py-1 border border-cyan-200">
                Shortcut
              </span>
            </div>
            <p className="mt-2 text-sm text-neutral-700">
              Go to {card.label.toLowerCase()} page
            </p>
          </div>
        ))}
      </section>

      {/* Recent activity */}
      <section className="mt-6 rounded-xl border border-cyan-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium text-neutral-800">
          Recent Activity
        </h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-800">
                <th className="border-b border-cyan-200 py-2 pr-4">Date</th>
                <th className="border-b border-cyan-200 py-2 pr-4">Event</th>
                <th className="border-b border-cyan-200 py-2">User</th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {activity.map((row, i) => (
                <tr key={i} className="hover:bg-cyan-50">
                  <td className="border-b border-cyan-200 py-2 pr-4">
                    {row.date}
                  </td>
                  <td className="border-b border-cyan-200 py-2 pr-4">
                    {row.event}
                  </td>
                  <td className="border-b border-cyan-200 py-2">{row.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
