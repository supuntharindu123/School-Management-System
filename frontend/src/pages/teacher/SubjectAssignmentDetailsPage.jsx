import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/CommonElements/Button";
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";
import {
  AddMarks,
  getMarksByClassAndSubject,
} from "../../features/Marks/markServices";
import { GetClassStudents } from "../../features/class/classService";
import { getAllExams } from "../../features/exam/examSlice";
import { getAllYears } from "../../features/year/yearSlice";
import { getAssignmentsByClassAndSubject } from "../../features/adminFeatures/teachers/teacherService";

export default function SubjectAssignmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const state = location?.state || {};
  const { classId, subjectId, gradeId, subjectName, className, fullName } =
    state;

  const [showExamHistory, setShowExamHistory] = useState(false);
  const [showAssignHistory, setShowAssignHistory] = useState(false);

  const [students, setStudents] = useState([]);
  const [examOptions, setExamOptions] = useState([]);
  const [previousExamGroups, setPreviousExamGroups] = useState([]);
  const [assignHistory, setAssignHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const examsSlice = useSelector((s) => s.exams);
  const yearsSlice = useSelector((s) => s.years);
  const currentYear = yearsSlice.years[yearsSlice.years.length - 1]?.year;

  useEffect(() => {
    dispatch(getAllExams());
    dispatch(getAllYears());
  }, [dispatch]);

  const groupMarksByExam = (marks, examsList) => {
    if (!marks || !Array.isArray(marks)) return [];

    const byExam = marks.reduce((acc, m) => {
      const key = m.examId;
      if (!key) return acc;
      if (!acc[key]) acc[key] = [];
      acc[key].push(m);
      return acc;
    }, {});

    return Object.entries(byExam).map(([examIdStr, arr]) => {
      const ex = examsList.find((e) => Number(e.id) === Number(examIdStr));
      // Parsing string scores from backend to numbers for math
      const scores = arr
        .map((m) => parseFloat(m.score))
        .filter((n) => !isNaN(n));

      return {
        id: Number(examIdStr),
        title: ex?.title || "Unknown Exam",
        date: ex?.endDate,
        stats: {
          average: scores.length
            ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
            : 0,
          highest: scores.length ? Math.max(...scores) : 0,
          lowest: scores.length ? Math.min(...scores) : 0,
        },
        marks: arr.map((m) => ({
          studentId: m.studentId,
          studentIDNumber: m.studentIDNumber,
          name: m.studentName,
          score: m.score, // Keeps as string
          isPresent: m.isPresent,
          reason: m.reason,
        })),
      };
    });
  };

  useEffect(() => {
    async function loadData() {
      if (!classId || !subjectId) return;
      try {
        setLoading(true);
        const [studentList, marks, assignments] = await Promise.all([
          GetClassStudents(classId),
          getMarksByClassAndSubject(classId, subjectId).catch(() => []),
          getAssignmentsByClassAndSubject(classId, subjectId).catch(() => []),
        ]);

        setStudents(studentList || []);
        setPreviousExamGroups(groupMarksByExam(marks, examsSlice.exams));
        setAssignHistory(
          assignments.sort(
            (a, b) => new Date(b.startDate) - new Date(a.startDate),
          ),
        );

        const filteredExams = examsSlice.exams.filter((e) =>
          currentYear ? e.academicYear === currentYear : true,
        );
        setExamOptions(filteredExams);
      } catch (err) {
        const msg =
          err?.response?.data?.title || err?.message || "Failed to load data";
        setLoadError(msg);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [classId, subjectId, examsSlice.exams, currentYear]);

  const refreshMarks = async () => {
    const marks = await getMarksByClassAndSubject(classId, subjectId);
    setPreviousExamGroups(groupMarksByExam(marks, examsSlice.exams));
  };

  return (
    <div className="max-w-full mx-auto space-y-6 pb-12">
      <header className="bg-gradient-to-r from-cyan-900 via-cyan-700 to-cyan-800 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-cyan-200 text-sm font-bold capitalize tracking-widest">
            Portal Access
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight mt-1">
            Assignment Portal
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button label="Back to List" onClick={() => navigate(-1)} />
        </div>
      </header>

      <section className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm ring-1 ring-neutral-100">
        <div className="flex items-center justify-between mb-6 border-b border-neutral-100 pb-4">
          <h2 className="text-lg font-bold text-neutral-800">
            Assignment Overview
          </h2>
          <span
            className={`px-4 py-1 rounded-full text-sm font-bold capitalize tracking-widest border ${
              state.isActive !== false
                ? "bg-cyan-50 border-cyan-200 text-cyan-700"
                : "bg-neutral-50 border-neutral-200 text-neutral-500"
            }`}
          >
            {state.isActive !== false ? "Active Session" : "Inactive"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <OverviewItem label="Subject" value={subjectName} />
          <OverviewItem label="Classroom" value={className} />
          <OverviewItem label="Lead Teacher" value={fullName} />
          <OverviewItem label="Assignment ID" value={`${id}`} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {loadError && (
            <ErrorAlert
              isOpen={true}
              message={
                typeof loadError === "object"
                  ? "An error occurred while loading."
                  : loadError
              }
              onClose={() => setLoadError("")}
            />
          )}

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <div className="p-6 bg-neutral-50/50 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="font-bold text-neutral-800">Marks Entry Sheet</h3>
              <p className="text-sm text-neutral-500">
                Academic Year: {currentYear}
              </p>
            </div>
            <div className="p-6">
              <MarksEntry
                examOptions={examOptions}
                students={students}
                existingMarks={previousExamGroups}
                onMarksSaved={refreshMarks}
                context={{
                  classId,
                  gradeId,
                  subjectId,
                  teacherId: user?.teacherId,
                  currentYear,
                }}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowAssignHistory(!showAssignHistory)}
              className="w-full flex justify-between items-center p-5 hover:bg-neutral-50 transition-colors"
            >
              <span className="text-sm font-bold text-neutral-800 capitalize tracking-tighter">
                History Log
              </span>
              <span className="text-sm text-cyan-600 font-bold">
                {showAssignHistory ? "Hide" : "Show"}
              </span>
            </button>
            {showAssignHistory && (
              <div className="px-5 pb-5 space-y-3 max-h-80 overflow-y-auto border-t border-neutral-50 pt-4">
                {assignHistory.length ? (
                  assignHistory.map((a) => (
                    <div
                      key={a.id}
                      className="p-4 bg-neutral-50 rounded-xl text-sm border border-neutral-100"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-neutral-800 leading-tight">
                          {a.teacherName}
                        </span>
                        <span
                          className={`text-sm font-bold px-2 py-0.5 rounded ${
                            a.isActive
                              ? "bg-cyan-100 text-cyan-700"
                              : "bg-neutral-200 text-neutral-500"
                          }`}
                        >
                          {a.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-neutral-600">
                          {a.subjectName}
                        </span>
                        <p className="text-neutral-500 text-xs">
                          Start: {new Date(a.startDate).toLocaleDateString()}
                        </p>
                        <p className="text-neutral-500 text-xs">
                          End: {new Date(a.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-neutral-400 text-center py-4 italic">
                    No previous logs found
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowExamHistory(!showExamHistory)}
              className="w-full flex justify-between items-center p-5 hover:bg-neutral-50 transition-colors"
            >
              <span className="text-sm font-bold text-neutral-800 capitalize tracking-tighter">
                Exam Analytics
              </span>
              <span className="text-sm text-cyan-600 font-bold">
                {showExamHistory ? "Hide" : "Show"}
              </span>
            </button>
            {showExamHistory && (
              <div className="p-5 border-t border-neutral-50 bg-neutral-50/30">
                <PreviousExams exams={previousExamGroups} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const OverviewItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-bold text-neutral-400 capitalize tracking-widest mb-1">
      {label}
    </p>
    <p className="text-base font-semibold text-neutral-800">{value || "—"}</p>
  </div>
);

function getGrade(score) {
  const s = Number(score);
  if (isNaN(s) || score === "" || score === null) return "-";
  if (s >= 75) return "A";
  if (s >= 65) return "B";
  if (s >= 55) return "C";
  if (s >= 35) return "S";
  return "F";
}

function MarksEntry({
  examOptions,
  students,
  existingMarks,
  onMarksSaved,
  context,
}) {
  const [examId, setExamId] = useState(null);
  const [rows, setRows] = useState({});
  const [saving, setSaving] = useState(false);
  const [alerts, setAlerts] = useState({ success: "", error: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (examOptions.length > 0 && !examId) {
      setExamId(examOptions[0].id);
    }
  }, [examOptions]);

  useEffect(() => {
    if (!examId) return;

    const group = existingMarks?.find((g) => Number(g.id) === Number(examId));

    const next = {};
    students.forEach((s) => {
      const existing = group?.marks?.find((m) => m.studentId === s.id);

      next[s.id] = {
        score: existing?.score ?? "",
        isPresent: existing ? !!existing.isPresent : true,
        reason: existing?.reason ?? "",
      };
    });

    setRows(next);
  }, [examId, students, existingMarks]);

  const onSave = async () => {
    if (!examId)
      return setAlerts({ ...alerts, error: "Please select an exam." });

    // Important: Matching your Backend.Models.Marks structure
    const payload = students.map((s) => ({
      score: rows[s.id]?.score?.toString() || "", // Must be string? per your model
      isPresent: !!rows[s.id]?.isPresent,
      reason: rows[s.id]?.isPresent ? null : rows[s.id]?.reason || null,
      studentId: Number(s.id),
      gradeId: Number(context.gradeId),
      classId: Number(context.classId),
      examId: Number(examId),
      teacherId: Number(context.teacherId),
      subjectId: Number(context.subjectId),
      // Do NOT include navigation properties (Student, Exam, etc)
    }));

    try {
      setSaving(true);
      await AddMarks(payload);
      if (onMarksSaved) await onMarksSaved();
      setAlerts({ error: "", success: "Marks recorded successfully." });
    } catch (e) {
      const errorData = e?.response?.data;
      let errorMessage = "Failed to save marks";

      if (typeof errorData === "object" && errorData !== null) {
        // Handle ASP.NET Core Validation Problem details
        errorMessage =
          errorData.title || errorData.message || JSON.stringify(errorData);
      } else if (typeof errorData === "string") {
        errorMessage = errorData;
      }

      setAlerts({ success: "", error: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-8 pb-16 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:w-72">
          <label className="text-sm font-bold text-neutral-500 capitalize mb-1 block">
            Select Exam
          </label>
          <select
            className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-shadow"
            value={examId ?? ""}
            onChange={(e) => setExamId(Number(e.target.value))}
          >
            {examOptions.length === 0 ? (
              <option value="">No Exams Available</option>
            ) : (
              examOptions.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title} ({new Date(e.endDate).toLocaleDateString()})
                </option>
              ))
            )}
          </select>
        </div>
        {existingMarks?.find((g) => Number(g.id) === Number(examId)) && (
          <span className="text-sm bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-bold border border-emerald-100">
            RECORDED DATA LOADED
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="p-4 font-bold capitalize">Student Info</th>
              <th className="p-4 font-bold capitalize text-center">Presence</th>
              <th className="p-4 font-bold capitalize">Score</th>
              <th className="p-4 font-bold capitalize">Grade</th>
              <th className="p-4 font-bold capitalize">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {students.map((s) => {
              const r = rows[s.id] || {
                score: "",
                isPresent: true,
                reason: "",
              };
              return (
                <tr
                  key={s.id}
                  className="hover:bg-cyan-50/40 transition-colors"
                >
                  <td className="p-4">
                    <button
                      onClick={() => navigate(`/students/${s.id}`)}
                      className="text-cyan-700 font-bold hover:underline block"
                    >
                      {s.fullName}
                    </button>
                    <span className="text-sm text-neutral-400 font-mono">
                      {s.studentIDNumber}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      className="w-5 h-5 accent-cyan-600 rounded"
                      checked={r.isPresent}
                      onChange={(e) =>
                        setRows((prev) => ({
                          ...prev,
                          [s.id]: { ...r, isPresent: e.target.checked },
                        }))
                      }
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      className="w-24 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm disabled:bg-neutral-100 focus:border-cyan-500 outline-none"
                      value={r.score}
                      disabled={!r.isPresent}
                      onChange={(e) =>
                        setRows((prev) => ({
                          ...prev,
                          [s.id]: { ...r, score: e.target.value },
                        }))
                      }
                    />
                  </td>
                  <td className="p-4 font-black text-neutral-600">
                    {getGrade(r.score)}
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm disabled:bg-neutral-100 focus:border-cyan-500 outline-none"
                      placeholder="Enter reason..."
                      value={r.reason}
                      disabled={r.isPresent}
                      onChange={(e) =>
                        setRows((prev) => ({
                          ...prev,
                          [s.id]: { ...r, reason: e.target.value },
                        }))
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          label={saving ? "Processing..." : "Submit All Changes"}
          onClick={onSave}
          disabled={saving || !examId}
        />
      </div>

      {alerts.success && (
        <SuccessAlert
          isOpen={!!alerts.success}
          message={alerts.success}
          onClose={() => setAlerts({ ...alerts, success: "" })}
        />
      )}
      {alerts.error && (
        <ErrorAlert
          isOpen={!!alerts.error}
          message={alerts.error}
          onClose={() => setAlerts({ ...alerts, error: "" })}
        />
      )}
    </div>
  );
}

function PreviousExams({ exams }) {
  if (!exams?.length)
    return (
      <p className="text-sm text-neutral-400 py-6 text-center italic">
        No datasets available
      </p>
    );

  return (
    <div className="space-y-6">
      {exams.map((e) => (
        <div
          key={e.id}
          className="bg-white border border-neutral-100 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-4 bg-cyan-50/50 border-b border-cyan-100">
            <h4 className="font-bold text-cyan-900 text-sm">{e.title}</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              <StatItem label="AVG" value={e.stats.average} />
              <StatItem label="MAX" value={e.stats.highest} />
              <StatItem label="MIN" value={e.stats.lowest} />
            </div>
          </div>
          <div className="p-2 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-neutral-400">
                  <th className="px-2 py-1">Student</th>
                  <th className="px-2 py-1">Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {e.marks.map((m) => (
                  <tr key={m.studentId}>
                    <td className="px-2 py-1 text-neutral-600 truncate max-w-[150px]">
                      {m.name}
                    </td>
                    <td className="px-2 py-1 font-bold text-neutral-800">
                      {m.score ?? "ABS"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

const StatItem = ({ label, value }) => (
  <span className="text-[9px] font-black px-2 py-0.5 rounded bg-white border border-cyan-100 text-cyan-700">
    {label}: {value}
  </span>
);
