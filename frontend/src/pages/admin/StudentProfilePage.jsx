import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GetStudentById } from "../../features/adminFeatures/students/studentApi";
import EditStudentDialog from "../../components/EditStudentDialog";
import DeleteStudentDialog from "../../components/DeleteStudentDialog";

export default function StudentProfilePage() {
  const { id } = useParams();
  const [tab, setTab] = useState("personal");
  const [details, setDetails] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const tabs = [
    { key: "personal", label: "Personal Information" },
    { key: "guardian", label: "Guardian Details" },
    { key: "attendance", label: "Attendance Summary" },
    { key: "exams", label: "Exam Results Summary" },
  ];

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

  console.log("Student details:", details);

  const attendance = {
    presentDays: 132,
    absentDays: 8,
    lateDays: 4,
    percentage: 94,
    monthly: [
      { month: "Sep", pct: 95 },
      { month: "Oct", pct: 92 },
      { month: "Nov", pct: 96 },
      { month: "Dec", pct: 93 },
    ],
  };

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
    <div>
      <EditStudentDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        student={selectedStudent}
        onSaved={() => {
          setOpenEdit(false);
          fetchStudent();
        }}
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
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Student Profile
          </h1>
          <p className="text-sm text-neutral-700">
            Student ID: {details.studentIDNumber} • Grade {details.grade}-
            {details.class} • {details.academicYear}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/students"
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Back to List
          </Link>
          <button
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
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
        </div>
      </header>

      {/* Summary card */}
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-teal-700 text-white text-lg font-semibold">
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
              className={`rounded-lg border px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                tab === t.key
                  ? "border-teal-600 bg-teal-50 text-teal-700"
                  : "border-gray-200 bg-white text-neutral-800 hover:border-teal-600 hover:text-teal-600"
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
                <Field label="Grade" value={details.grade} />
                <Field label="Class" value={details.class} />
                <Field label="GuardianDate" value={details.guardianDate} />
              </div>
            </section>
          )}

          {/* Guardian Details */}
          {tab === "guardian" && (
            <section
              role="tabpanel"
              id="panel-guardian"
              aria-labelledby="tab-guardian"
              className="rounded-xl border border-gray-200 bg-white p-4"
            >
              <h2 className="text-sm font-medium text-neutral-800">
                Guardian Details
              </h2>
              <ul className="mt-3 space-y-3">
                <li className="rounded-lg border border-gray-200 p-3">
                  <p className="font-medium text-neutral-900">
                    {details.guardianRelation}: {details.guardianName}
                  </p>
                  <p className="text-sm text-neutral-700">
                    Phone: {} • Email: {}
                  </p>
                </li>
              </ul>
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
                      className="h-2 rounded bg-teal-600"
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
                  {attendance.monthly.map((m) => (
                    <div
                      key={m.month}
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
