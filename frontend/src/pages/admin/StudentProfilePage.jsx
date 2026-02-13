import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetStudentById } from "../../features/adminFeatures/students/studentService";
import DeleteStudentDialog from "../../components/Student/DeleteStudentDialog";
import { useSelector, useDispatch } from "react-redux";
import { GetAttendanceByStudent } from "../../features/attendances/attendanceService";
import EditStudentForm from "../../components/Student/EditStudentForm";
import { getMarksByStudent } from "../../features/Marks/markServices";
import { getAllSubjects } from "../../features/subject/subjectSlice";
import { getAllExams } from "../../features/exam/examSlice";
import { getAllYears } from "../../features/year/yearSlice";
import { getClasses } from "../../features/class/classSlice";

export default function StudentProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("personal");
  const [details, setDetails] = useState({});
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [attRecords, setAttRecords] = useState([]);
  const [attLoading, setAttLoading] = useState(false);
  const [attError, setAttError] = useState(null);
  const [marks, setMarks] = useState([]);
  const [marksLoading, setMarksLoading] = useState(false);
  const [marksError, setMarksError] = useState(null);

  const tabs = [
    { key: "personal", label: "Personal information" },
    { key: "attendance", label: "Attendance summary" },
    { key: "exams", label: "Exam results" },
  ];

  const { user } = useSelector((state) => state.auth);
  const { subjects } = useSelector((state) => state.subjects);
  const { classes } = useSelector((state) => state.classes);
  const { years } = useSelector((state) => state.years);
  const { exams } = useSelector((state) => state.exams);

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
    dispatch(getAllSubjects());
    dispatch(getAllExams());
    dispatch(getAllYears());
    dispatch(getClasses());
  }, [id, dispatch]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setAttLoading(true);
        const res = await GetAttendanceByStudent(id);
        setAttRecords(res || []);
      } catch (err) {
        setAttError("Failed to load attendance");
      } finally {
        setAttLoading(false);
      }
    };
    fetchAttendance();
  }, [id]);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        setMarksLoading(true);
        const res = await getMarksByStudent(id);
        setMarks(res || []);
      } catch (err) {
        setMarksError("Failed to load marks");
      } finally {
        setMarksLoading(false);
      }
    };
    fetchMarks();
  }, [id]);

  const attendance = useMemo(() => {
    const total = attRecords.length;
    const presentDays = attRecords.filter((a) => a.isPresent).length;
    const percentage = total ? Math.round((presentDays / total) * 100) : 0;

    const monthStats = new Map();
    attRecords.forEach((a) => {
      if (!a.date) return;
      const d = new Date(`${a.date}T00:00:00`);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleString(undefined, { month: "short" });
      const cur = monthStats.get(key) || { label, total: 0, present: 0 };
      cur.total += 1;
      if (a.isPresent) cur.present += 1;
      monthStats.set(key, cur);
    });

    const monthly = Array.from(monthStats.values()).map((v) => ({
      month: v.label,
      pct: v.total ? Math.round((v.present / v.total) * 100) : 0,
    }));

    return {
      presentDays,
      absentDays: total - presentDays,
      percentage,
      monthly,
    };
  }, [attRecords]);

  const marksByExam = useMemo(() => {
    const groups = new Map();
    marks.forEach((m) => {
      const key = m.examId;
      if (!key) return;
      const arr = groups.get(key) || [];
      arr.push(m);
      groups.set(key, arr);
    });
    return Array.from(groups.entries()).map(([examId, items]) => ({
      examId,
      items,
    }));
  }, [marks]);

  function getName(list, id, label = "-") {
    if (id == null) return label;
    const item = Array.isArray(list)
      ? list.find((x) => Number(x.id) === Number(id))
      : null;
    return (
      item?.name ||
      item?.title ||
      item?.subjectName ||
      item?.className ||
      item?.year ||
      `${label} #${id}`
    );
  }

  function getGradeColor(score) {
    if (score >= 75) return "text-emerald-600";
    if (score >= 50) return "text-cyan-600";
    if (score >= 35) return "text-orange-500";
    return "text-rose-500";
  }

  return (
    <div className="max-w-full mx-auto space-y-8 pb-16 animate-fade-in px-4">
      <EditStudentForm
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        student={selectedStudent}
        onSaved={fetchStudent}
      />
      <DeleteStudentDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        student={selectedStudent || details}
        onDeleted={() => navigate("/students")}
      />

      {/* ===== Header ===== */}
      <header className="flex flex-col md:flex-row md:items-center justify-between bg-linear-to-r from-cyan-900 via-cyan-800 to-cyan-900 py-6 px-8 rounded-2xl shadow-lg gap-6">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl font-bold text-white border border-white/20">
            {details?.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white capitalize">
              {details.fullName}
            </h1>
            <p className="text-cyan-100 text-sm opacity-80 capitalize">
              Student ID: {details.studentIDNumber}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 text-white border border-white/20 px-5 py-2 rounded-xl text-sm font-bold hover:bg-white/20 transition-all capitalize"
          >
            Back
          </button>
          {user?.role === 0 && (
            <>
              <button
                onClick={() => {
                  setSelectedStudent(details);
                  setOpenEdit(true);
                }}
                className="bg-white text-cyan-900 px-5 py-2 rounded-xl text-sm font-bold hover:bg-cyan-50 transition-colors capitalize"
              >
                Edit profile
              </button>
              <button
                onClick={() => {
                  setSelectedStudent(details);
                  setOpenDelete(true);
                }}
                className="bg-rose-500/20 text-rose-100 border border-rose-500/30 px-5 py-2 rounded-xl text-sm font-bold hover:bg-rose-500/40 transition-all capitalize"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </header>

      {/* ===== Tab Navigation ===== */}
      <div className="flex p-2 bg-neutral-100 rounded-2xl w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${
              tab === t.key
                ? "bg-cyan-800 text-cyan-50 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <main className="grid grid-cols-1 gap-6">
        {/* ===== Personal Info Panel ===== */}
        {tab === "personal" && (
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12">
            <Field label="Admission number" value={details.id} />
            <Field label="Date of birth" value={details.birthDay} />
            <Field label="Gender" value={details.gender} />
            <Field label="Contact number" value={details.phoneNumber} />
            <Field label="Email address" value={details.email} />
            <Field label="Current class" value={details.currentClass} />
            <Field
              label="Residential address"
              value={`${details.address}, ${details.city}`}
              full
            />
            <div className="md:col-span-3 h-px bg-neutral-200 my-2" />
            <Field label="Guardian name" value={details.guardianName} />
            <Field label="Relationship" value={details.guardianRelation} />
            <Field label="Emergency contact" value={details.guardianDate} />
          </section>
        )}

        {/* ===== Attendance Panel ===== */}
        {tab === "attendance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                label="Overall attendance"
                value={`${attendance.percentage}%`}
                progress={attendance.percentage}
              />
              <StatCard
                label="Total present"
                value={attendance.presentDays}
                sub="Days"
                color="text-emerald-600"
              />
              <StatCard
                label="Total absent"
                value={attendance.absentDays}
                sub="Days"
                color="text-rose-500"
              />
            </div>

            <section className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
              <div className="px-8 py-4 border-b border-neutral-50 flex justify-between items-center">
                <h3 className="font-bold text-neutral-800 capitalize">
                  Attendance history
                </h3>
                <div className="flex gap-2">
                  {attendance.monthly.map((m) => (
                    <span
                      key={m.month}
                      className="px-3 py-1 bg-neutral-50 rounded-lg text-[14px] font-bold text-neutral-500 capitalize"
                    >
                      {m.month}: {m.pct}%
                    </span>
                  ))}
                </div>
              </div>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-cyan-800 rounded-2xl">
                    <th className="px-8 py-4 text-sm font-bold text-cyan-50 capitalize">
                      Date
                    </th>
                    <th className="px-8 py-4 text-sm font-bold text-cyan-50 capitalize">
                      Status
                    </th>
                    <th className="px-8 py-4 text-sm font-bold text-cyan-50 capitalize">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {attRecords.map((r, i) => (
                    <tr
                      key={i}
                      className="hover:bg-neutral-50/50 transition-colors"
                    >
                      <td className="px-8 py-4 font-medium text-neutral-700">
                        {r.date}
                      </td>
                      <td className="px-8 py-4">
                        <span
                          className={`px-3 py-1 rounded-lg text-[12px] font-bold capitalize ${r.isPresent ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                        >
                          {r.isPresent ? "Present" : "Absent"}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-neutral-500">
                        {r.reason || "No remarks"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {/* ===== Exams Panel ===== */}
        {tab === "exams" && (
          <div className="space-y-8">
            {marksByExam.map((group) => (
              <section
                key={group.examId}
                className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden"
              >
                <div className="px-8 py-4 bg-neutral-100/50 border-b border-neutral-100">
                  <h3 className="font-bold text-cyan-900 capitalize">
                    {getName(exams, group.examId, "Exam")}
                  </h3>
                  <p className="text-[10px] font-bold text-neutral-400 capitalize tracking-wider">
                    {getName(years, group.items[0].academicYearId, "Year")}
                  </p>
                </div>
                <table className="w-full text-left text-sm">
                  <thead className=" bg-cyan-800">
                    <tr>
                      <th className="px-8 py-4 text-sm font-bold text-cyan-50 capitalize">
                        Subject
                      </th>
                      <th className="px-8 py-4 text-sm font-bold text-cyan-50 capitalize text-center">
                        Score
                      </th>
                      <th className="px-8 py-4 text-[14px]  font-bold text-cyan-50 capitalize text-center">
                        Grade
                      </th>
                      <th className="px-8 py-4 text-sm font-bold text-cyan-50 capitalize">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {group.items.map((m, i) => (
                      <tr
                        key={i}
                        className="group hover:bg-cyan-50/30 transition-colors"
                      >
                        <td className="px-8 py-4 font-bold text-neutral-700 capitalize">
                          {getName(
                            subjects,
                            m.subjectId || m.SubjectId,
                            "Subject",
                          )}
                        </td>
                        <td
                          className={`px-8 py-4 text-center font-bold ${getGradeColor(m.score)}`}
                        >
                          {m.score || "0"}
                        </td>
                        <td className="px-8 py-4 text-center">
                          <span className="h-8 w-8 rounded-lg bg-neutral-100 flex items-center justify-center mx-auto text-[15px] font-black text-neutral-600">
                            {m.score >= 75
                              ? "A"
                              : m.score >= 65
                                ? "B"
                                : m.score >= 50
                                  ? "C"
                                  : m.score >= 35
                                    ? "S"
                                    : "W"}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-sm text-neutral-500 capitalize">
                          {m.isPresent
                            ? "Completed"
                            : `Absent: ${m.reason || "No reason"}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ))}
            {marksByExam.length === 0 && (
              <div className="text-center py-20 text-neutral-400 capitalize">
                No exam records found for this student.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, value, full = false }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <p className="text-[14px] font-bold text-neutral-400 capitalize  mb-1">
        {label}
      </p>
      <p className="text-[15px] font-bold text-neutral-800 capitalize">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function StatCard({ label, value, sub, progress, color = "text-cyan-900" }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
      <p className="text-[15px] font-bold text-neutral-400 capitalize  mb-4">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-black ${color}`}>{value}</span>
        {sub && (
          <span className="text-xs font-bold text-neutral-400 capitalize">
            {sub}
          </span>
        )}
      </div>
      {progress !== undefined && (
        <div className="mt-4 h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-600 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
