import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../features/exam/examSlice";
import { getAllGrades } from "../../features/grade/gradeSlice";
import { getAllSubjects } from "../../features/subject/subjectSlice";
import { examdetails } from "../../features/exam/examService";
import { getMarksByGradeandExam } from "../../features/Marks/markServices";
import { GetStudents } from "../../features/adminFeatures/students/studentService";
import { GetAllStudents } from "../../features/adminFeatures/students/studentListSlice";

export default function ExamGradeDetailsPage() {
  const { examId: examIdParam, gradeId: gradeIdParam } = useParams();
  const examId = Number(examIdParam);
  const gradeId = Number(gradeIdParam);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { exams } = useSelector((s) => s.exams);
  const { grades } = useSelector((s) => s.grades);
  const { subjects } = useSelector((s) => s.subjects);
  const { students } = useSelector((s) => s.studentList);

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState([]);
  const [marksLoading, setMarksLoading] = useState(false);
  const [marksError, setMarksError] = useState("");
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  useEffect(() => {
    dispatch(getAllExams());
    dispatch(getAllGrades());
    dispatch(getAllSubjects());
    dispatch(GetAllStudents());
  }, [dispatch]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    examdetails(examId)
      .then((data) => active && setDetail(data))
      .finally(() => active && setLoading(false));
    return () => (active = false);
  }, [examId]);

  useEffect(() => {
    let active = true;
    async function fetchMarks() {
      setMarksLoading(true);
      setMarksError("");
      try {
        const data = await getMarksByGradeandExam(examId, gradeId);
        if (active) setMarks(data ? data : []);
      } catch (err) {
        if (active) setMarksError("Failed to load marks.");
      } finally {
        if (active) setMarksLoading(false);
      }
    }
    fetchMarks();
    return () => (active = false);
  }, [examId, gradeId]);

  const exam = useMemo(
    () => detail || exams?.find((e) => e.id === examId),
    [detail, exams, examId],
  );

  const gradeObj = useMemo(() => {
    const list = exam?.grades || [];
    return list.find((g) => g.gradeId === gradeId);
  }, [exam, gradeId]);

  const subjectsForGrade = useMemo(() => {
    const seen = new Set();
    return (gradeObj?.subjects || [])
      .filter((s) => {
        const key = s?.subjectId ?? s?.id;
        if (key == null) return true;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((s) => {
        const id = s?.subjectId ?? s?.id;
        const name =
          s?.subjectName ??
          subjects.find((x) => x.id === id)?.subjectName ??
          `Subject #${id ?? "?"}`;
        return { id, name };
      });
  }, [gradeObj, subjects]);

  const classesForGrade = useMemo(() => {
    return (gradeObj?.classes || []).map((c) => ({
      id: c?.id,
      name: c?.name || `Class ${c?.id}`,
    }));
  }, [gradeObj]);

  const gradeName = grades.find((g) => g.id === gradeId)?.gradeName ?? gradeId;

  function getSubjectName(id) {
    if (!id) return "—";
    const s = subjects.find((x) => x.id === id);
    return s?.subjectName ?? `Subject   ${id}`;
  }

  function getClassName(id) {
    if (!id) return "—";
    const c = classesForGrade.find((x) => x.id === id);
    return c?.name ?? `Class #${id}`;
  }

  function getStudentName(id) {
    if (!id) return "—";
    const s = Array.isArray(students)
      ? students.find((x) => x.id === id)
      : null;
    const composed = s?.fullName;
    return composed;
  }

  const filteredMarks = useMemo(() => {
    const q = search.trim().toLowerCase();
    const bySelection = marks.filter((m) => {
      const classOk =
        !classFilter || String(m?.classId) === String(classFilter);
      const subjectOk =
        !subjectFilter || String(m?.subjectId) === String(subjectFilter);
      return classOk && subjectOk;
    });

    if (!q) return bySelection;

    return bySelection.filter((m) => {
      const fields = [
        String(m?.score ?? ""),
        getStudentName(m?.studentId),
        getSubjectName(m?.subjectId),
        getClassName(m?.classId),
      ].map((x) => String(x).toLowerCase());
      return fields.some((f) => f.includes(q));
    });
  }, [marks, search, classFilter, subjectFilter]);

  return (
    <div className="max-w-full mx-auto space-y-8 pb-16 animate-fade-in px-4">
      {!exam || loading ? (
        <div className="p-20 text-center animate-pulse text-cyan-600 font-bold capitalize">
          Loading grade details...
        </div>
      ) : (
        <>
          <header className="flex items-center justify-between bg-linear-to-r from-cyan-900 via-cyan-800 to-cyan-900 py-6 px-8 rounded-2xl shadow-lg">
            <div>
              <h1 className="text-2xl font-bold text-white capitalize">
                Grade {gradeName}
              </h1>
              <p className="text-sm text-cyan-100 capitalize">
                Exam: {exam.title}
              </p>
            </div>
            <button
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-md hover:bg-white hover:text-cyan-900 transition-all capitalize"
              onClick={() => navigate(`/exams/${examId}`)}
            >
              Back to exam
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard label="Subjects" value={subjectsForGrade.length} />
            <StatCard label="Classes" value={classesForGrade.length} />
            <StatCard label="Students" value={filteredMarks.length} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="Subjects assigned">
              <div className="flex flex-wrap gap-2">
                {subjectsForGrade.map((s) => (
                  <Badge key={s.id} text={s.name} color="cyan" />
                ))}
              </div>
            </Section>

            <Section title="Classes assigned">
              <div className="flex flex-wrap gap-2">
                {classesForGrade.map((c) => (
                  <Badge key={c.id} text={c.name} color="neutral" />
                ))}
              </div>
            </Section>
          </div>

          {/* Marks Table Section */}
          <section className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-neutral-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-neutral-800 capitalize">
                Examination marks
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student or subject..."
                  className="w-64 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm focus:ring-2 focus:ring-cyan-600 outline-none transition-all"
                />
                <FilterSelect
                  value={subjectFilter}
                  onChange={setSubjectFilter}
                  options={subjectsForGrade}
                  label="All subjects"
                />
                <FilterSelect
                  value={classFilter}
                  onChange={setClassFilter}
                  options={classesForGrade}
                  label="All classes"
                />
              </div>
            </div>

            <div className="px-4 pb-4">
              {marksLoading ? (
                <div className="p-10 text-center text-cyan-600 font-bold capitalize">
                  Loading marks...
                </div>
              ) : marksError ? (
                <div className="p-10 text-center text-rose-500 font-bold capitalize">
                  {marksError}
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-neutral-100">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-cyan-800 text-white text-sm font-bold capitalize">
                      <tr>
                        <th className="px-6 py-4">Student</th>
                        <th className="px-6 py-4">Subject</th>
                        <th className="px-6 py-4 text-center">Class</th>
                        <th className="px-6 py-4 text-center">Score</th>
                        <th className="px-6 py-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                      {filteredMarks.map((m) => (
                        <tr
                          key={
                            m.id ?? `${m.studentId}-${m.subjectId}-${m.classId}`
                          }
                          className="hover:bg-cyan-50/20 transition-colors"
                        >
                          <td className="px-6 py-4 font-bold text-neutral-800 capitalize">
                            {m.studentName ??
                              getStudentName(m.studentId) ??
                              `Student ${m.studentId}`}
                          </td>
                          <td className="px-6 py-4 text-neutral-600 capitalize">
                            {getSubjectName(m.subjectId)}
                          </td>
                          <td className="px-6 py-4 text-center text-neutral-500">
                            {getClassName(m.classId)}
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-cyan-700">
                            {m.score ?? "—"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold capitalize ${
                                m.isPresent
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {m.isPresent ? "Present" : "Absent"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* ===== UI Components ===== */

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
      <p className="text-sm font-bold text-neutral-400 capitalize tracking-tight mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-neutral-800">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
      <h3 className="text-sm font-bold text-neutral-800 mb-4 capitalize">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Badge({ text, color }) {
  const styles =
    color === "cyan"
      ? "bg-cyan-50 text-cyan-700"
      : "bg-neutral-100 text-neutral-600";
  return (
    <span
      className={`px-3 py-1 rounded-lg text-sm font-bold capitalize ${styles}`}
    >
      {text}
    </span>
  );
}

function FilterSelect({ value, onChange, options, label }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-bold text-neutral-700 outline-none capitalize"
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </select>
  );
}
