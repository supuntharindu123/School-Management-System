import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../features/exam/examSlice";
import { getAllGrades } from "../../features/grade/gradeSlice";
import { getAllSubjects } from "../../features/subject/subjectSlice";
import { examdetails } from "../../features/exam/examService";

export default function ExamGradeDetailsPage() {
  const { examId: examIdParam, gradeId: gradeIdParam } = useParams();
  const examId = Number(examIdParam);
  const gradeId = Number(gradeIdParam);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { exams } = useSelector((s) => s.exams);
  const { grades } = useSelector((s) => s.grades);
  const { subjects } = useSelector((s) => s.subjects);

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getAllExams());
    dispatch(getAllGrades());
    dispatch(getAllSubjects());
  }, [dispatch]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    examdetails(examId)
      .then((data) => active && setDetail(data))
      .finally(() => active && setLoading(false));
    return () => (active = false);
  }, [examId]);

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
      name: c?.name || `Class #${c?.id}`,
    }));
  }, [gradeObj]);

  if (!exam || loading) {
    return <p className="text-sm text-neutral-700">Loading grade details...</p>;
  }
  if (!gradeObj) {
    return (
      <div className="space-y-4">
        <header className="flex items-center justify-between bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-5 rounded-2xl px-6">
          <div>
            <h1 className="text-2xl font-bold text-cyan-50">Grade Details</h1>
            <p className="text-xs text-cyan-50">Exam: {exam.title}</p>
          </div>
          <button
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-cyan-800"
            onClick={() => navigate(`/exams/${examId}`)}
          >
            Back to Exam
          </button>
        </header>
        <section className="rounded-xl border-t-4 border-cyan-600 bg-white p-4 shadow-md">
          <p className="text-sm text-neutral-700">
            No grade data found for this exam.
          </p>
        </section>
      </div>
    );
  }

  const gradeName = grades.find((g) => g.id === gradeId)?.gradeName ?? gradeId;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-5 rounded-2xl px-6">
        <div>
          <h1 className="text-2xl font-bold text-cyan-50">Grade {gradeName}</h1>
          <p className="text-xs text-cyan-50">Exam: {exam.title}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-cyan-800 hover:border-teal-600 hover:text-teal-600"
            onClick={() => navigate(`/exams/${examId}`)}
          >
            Back to Exam
          </button>
        </div>
      </header>

      {/* Quick Info */}
      <section className="rounded-xl border-t-4 border-cyan-600 bg-white p-4 shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border-t-4 border-cyan-600 bg-white p-3 shadow-sm">
            <p className="text-xs text-cyan-800">Subjects</p>
            <p className="text-xl font-bold text-cyan-700">
              {subjectsForGrade.length}
            </p>
          </div>
          <div className="rounded-lg border-t-4 border-cyan-600 bg-white p-3 shadow-sm">
            <p className="text-xs text-cyan-800">Classes</p>
            <p className="text-xl font-bold text-cyan-700">
              {classesForGrade.length}
            </p>
          </div>
          <div className="rounded-lg border-t-4 border-cyan-600 bg-white p-3 shadow-sm">
            <p className="text-xs text-cyan-800">Marks</p>
            <p className="text-xl font-bold text-cyan-700">—</p>
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="rounded-xl border-t-4 border-cyan-600 bg-white p-4 shadow-md">
        <p className="text-sm font-semibold text-neutral-900 mb-2">Subjects</p>
        {subjectsForGrade.length ? (
          <div className="flex flex-wrap gap-2">
            {subjectsForGrade.map((s) => (
              <span
                key={`sub-${s.id}-${s.name}`}
                className="rounded bg-gray-100 px-2 py-1 text-xs text-neutral-800"
              >
                {s.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-neutral-700">No subjects assigned.</p>
        )}
      </section>

      {/* Classes */}
      <section className="rounded-xl border-t-4 border-cyan-600 bg-white p-4 shadow-md">
        <p className="text-sm font-semibold text-neutral-900 mb-2">Classes</p>
        {classesForGrade.length ? (
          <div className="flex flex-wrap gap-2">
            {classesForGrade.map((c) => (
              <span
                key={`cls-${c.id}-${c.name}`}
                className="rounded bg-gray-100 px-2 py-1 text-xs text-neutral-800"
              >
                {c.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-neutral-700">No classes listed.</p>
        )}
      </section>

      {/* Marks (placeholder for integration) */}
      <section className="rounded-xl border-t-4 border-cyan-600 bg-white p-4 shadow-md">
        <p className="text-sm font-semibold text-neutral-900 mb-2">Marks</p>
        <p className="text-xs text-neutral-700">
          Integrate marks filtering by exam and grade when API is available.
        </p>
      </section>
    </div>
  );
}
