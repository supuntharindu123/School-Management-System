import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { GetStudentById } from "../../features/adminFeatures/students/studentService";

import DeleteStudentDialog from "../../components/Student/DeleteStudentDialog";
import { useSelector } from "react-redux";
import { GetAttendanceByStudent } from "../../features/attendances/attendanceService";
import EditStudentForm from "../../components/Student/EditStudentForm";

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("personal");
  const [details, setDetails] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [attRecords, setAttRecords] = useState([]);
  const [attLoading, setAttLoading] = useState(false);
  const [attError, setAttError] = useState(null);

  const tabs = [
    { key: "personal", label: "Personal Information" },
    { key: "attendance", label: "Attendance Summary" },
    { key: "exams", label: "Exam Results Summary" },
  ];

  const { user } = useSelector((state) => state.auth);

  const fetchStudent = async () => {
    try {
      const res = await GetStudentById(id);
      setDetails(res);
    } catch (err) {
      console.error("Failed to load student", err);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setAttLoading(true);
        setAttError(null);
        const res = await GetAttendanceByStudent(id);
        setAttRecords(Array.isArray(res) ? res : []);
      } catch (err) {
        setAttError(
          err?.response?.data || err?.message || "Failed to load attendance",
        );
      } finally {
        setAttLoading(false);
      }
    };
    fetchAttendance();
  }, [id]);

  const attendance = useMemo(() => {
    const total = attRecords.length;
    const presentDays = attRecords.filter(
      (a) => (a.isPresent ?? a.IsPresent) === true,
    ).length;
    const absentDays = total - presentDays;
    const percentage = total ? Math.round((presentDays / total) * 100) : 0;
    const monthStats = new Map();
    attRecords.forEach((a) => {
      const ds = a.date ?? a.Date;
      if (!ds) return;
      const d = new Date(`${ds}T00:00:00`);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString(undefined, { month: "short" });
      const cur = monthStats.get(key) || { label, total: 0, present: 0 };
      cur.total += 1;
      if ((a.isPresent ?? a.IsPresent) === true) cur.present += 1;
      monthStats.set(key, cur);
    });
    const monthly = Array.from(monthStats.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([_, v]) => ({
        month: v.label,
        pct: v.total ? Math.round((v.present / v.total) * 100) : 0,
      }));
    return { presentDays, absentDays, percentage, monthly };
  }, [attRecords]);

  const exams = [
    { exam: "Midterm", subject: "Mathematics", score: 88, grade: "A" },
    { exam: "Midterm", subject: "Science", score: 84, grade: "A-" },
    { exam: "Midterm", subject: "English", score: 79, grade: "B+" },
    { exam: "Quiz 3", subject: "Algebra", score: 17, grade: "A" },
  ];

  const onEdit = (row) => {
    setSelectedStudent(row);
    setOpenEdit(true);
  };
  const onDelete = (row) => {
    setSelectedStudent(row);
    setOpenDelete(true);
  };

  return (
    <div className="mx-auto max-w-7xl">
      <EditStudentForm
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        student={selectedStudent}
        onSaved={fetchStudent()}
      />
      <DeleteStudentDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        student={selectedStudent || details}
        onDeleted={() => {
          setOpenDelete(false);
          // After deleting, go back to list
          window.location.href = "/students";
        }}
      />
      {/* Header */}
      <header className="mb-4 flex items-center justify-between bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-6 rounded-2xl px-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-50">Student Profile</h1>
          <p className="text-sm text-cyan-50">
            Student ID: {details.studentIDNumber}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
          >
            Back
          </button>

          {user?.role === 0 && (
            <>
              <button
                className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
                onClick={() => onEdit(details)}
              >
                Edit Profile
              </button>
              <button
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                onClick={() => onDelete(details)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </header>

      {/* Summary card */}
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-cyan-700 text-white text-lg font-semibold">
            {details?.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("") || ""}
          </span>
          <div>
            <p className="text-lg font-semibold text-neutral-900">
              {details.fullName}
            </p>
            <p className="text-sm text-neutral-700">
              ID: {details.studentIDNumber}
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="mt-4">
        <div
          role="tablist"
          aria-label="Student profile tabs"
          className="flex flex-wrap gap-2"
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              aria-controls={`panel-${t.key}`}
              id={`tab-${t.key}`}
              onClick={() => setTab(t.key)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-600 ${
                tab === t.key
                  ? "border-cyan-600 bg-cyan-50 text-cyan-700"
                  : "border-gray-200 bg-white text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div className="mt-4 space-y-4">
          {/* Personal Information */}
          {tab === "personal" && (
            <section
              role="tabpanel"
              id="panel-personal"
              aria-labelledby="tab-personal"
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <h2 className="text-sm font-medium text-neutral-800">
                Personal Information
              </h2>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full Name" value={details.fullName} />
                <Field label="Admission No" value={details.id} />
                <Field label="Date of Birth" value={details.birthDay} />
                <Field label="Gender" value={details.gender} />
                <Field label="Contact" value={details.phoneNumber} />
                <Field label="Email" value={details.email} />
                <Field label="Address" value={details.address} />
                <Field label="City" value={details.city} />
                <Field label="Class" value={details.currentClass} />
                <Field label="GuardianDate" value={details.guardianDate} />
                <Field
                  label={details.guardianRelation}
                  value={details.guardianName}
                />
              </div>
            </section>
          )}

          {/* Attendance Summary */}
          {tab === "attendance" && (
            <section
              role="tabpanel"
              id="panel-attendance"
              aria-labelledby="tab-attendance"
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <h2 className="text-sm font-medium text-neutral-800">
                Attendance Summary
              </h2>
              {attLoading && (
                <div className="mt-2 text-sm text-neutral-700">
                  Loading attendance...
                </div>
              )}
              {attError && (
                <div className="mt-2 text-sm text-rose-700">
                  {String(attError)}
                </div>
              )}
              <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-neutral-700">
                    Attendance Percentage
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-neutral-900">
                    {attendance.percentage}%
                  </p>
                  <div className="mt-3 h-2 w-full rounded bg-gray-100">
                    <div
                      className="h-2 rounded bg-cyan-600"
                      style={{ width: attendance.percentage + "%" }}
                    />
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-neutral-700">Present Days</p>
                  <p className="mt-1 text-2xl font-semibold text-neutral-900">
                    {attendance.presentDays}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4">
                  <p className="text-sm text-neutral-700">Absent Days</p>
                  <p className="mt-1 text-2xl font-semibold text-neutral-900">
                    {attendance.absentDays}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-neutral-800">
                  Monthly Trend
                </p>
                <div className="mt-2 grid grid-cols-4 gap-3">
                  {attendance.monthly.map((m, idx) => (
                    <div
                      key={`${m.month}-${idx}`}
                      className="rounded-lg border border-gray-200 p-3 text-center"
                    >
                      <p className="text-xs text-neutral-600">{m.month}</p>
                      <p className="text-lg font-semibold text-neutral-900">
                        {m.pct}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendance Records */}
              <div className="mt-6">
                <p className="text-sm font-medium text-neutral-800">
                  Attendance Records
                </p>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="text-left text-neutral-800">
                        <th className="border-b border-gray-200 py-2 px-3">
                          Date
                        </th>
                        <th className="border-b border-gray-200 py-2 px-3">
                          Class
                        </th>
                        <th className="border-b border-gray-200 py-2 px-3">
                          Teacher
                        </th>
                        <th className="border-b border-gray-200 py-2 px-3">
                          Present
                        </th>
                        <th className="border-b border-gray-200 py-2 px-3">
                          Reason
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-neutral-800">
                      {attRecords
                        .slice()
                        .sort((a, b) => {
                          const da = new Date(
                            `${(a.date ?? a.Date) || "1970-01-01"}T00:00:00`,
                          ).getTime();
                          const db = new Date(
                            `${(b.date ?? b.Date) || "1970-01-01"}T00:00:00`,
                          ).getTime();
                          return db - da;
                        })
                        .map((r, idx) => (
                          <tr
                            key={`${r.id ?? r.Id}-${idx}`}
                            className="hover:bg-gray-50"
                          >
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
                              {(r.isPresent ?? r.IsPresent) ? "Yes" : "No"}
                            </td>
                            <td className="border-b border-gray-200 py-2 px-3">
                              {(r.reason ?? r.Reason) || "-"}
                            </td>
                          </tr>
                        ))}
                      {(!attRecords || attRecords.length === 0) && (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-8 text-center text-neutral-600"
                          >
                            No attendance records.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Exam Results Summary */}
          {tab === "exams" && (
            <section
              role="tabpanel"
              id="panel-exams"
              aria-labelledby="tab-exams"
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <h2 className="text-sm font-medium text-neutral-800">
                Exam Results Summary
              </h2>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="text-left text-neutral-800">
                      <th className="border-b border-gray-200 py-2 px-3">
                        Exam
                      </th>
                      <th className="border-b border-gray-200 py-2 px-3">
                        Subject
                      </th>
                      <th className="border-b border-gray-200 py-2 px-3">
                        Score
                      </th>
                      <th className="border-b border-gray-200 py-2 px-3">
                        Grade
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-800">
                    {exams.map((e, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border-b border-gray-200 py-2 px-3">
                          {e.exam}
                        </td>
                        <td className="border-b border-gray-200 py-2 px-3">
                          {e.subject}
                        </td>
                        <td className="border-b border-gray-200 py-2 px-3">
                          {e.score}
                        </td>
                        <td className="border-b border-gray-200 py-2 px-3">
                          {e.grade}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, full = false }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <p className="text-xs text-neutral-600">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-neutral-900">{value}</p>
    </div>
  );
}
