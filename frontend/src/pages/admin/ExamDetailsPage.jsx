import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getAllExams } from "../../features/exam/examSlice";
import { getAllGrades } from "../../features/grade/gradeSlice";
import { getAllSubjects } from "../../features/subject/subjectSlice";
import { examdetails, deleteExam } from "../../features/exam/examService";

import ConfirmDialog from "../../components/ConfirmDialog";
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";

export default function ExamDetailsPage() {
  const { id } = useParams();
  const examId = Number(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { exams } = useSelector((s) => s.exams);
  const { grades } = useSelector((s) => s.grades);
  const { subjects } = useSelector((s) => s.subjects);

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [openGrade, setOpenGrade] = useState(null);

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

  const isAfterEndDate = useMemo(() => {
    if (!exam?.endDate) return false;
    const end = new Date(exam.endDate);
    const today = new Date();
    return today > end;
  }, [exam]);

  if (!exam || loading) {
    return <p className="text-sm text-neutral-700">Loading exam...</p>;
  }

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <header className="flex justify-between items-center rounded-2xl bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 p-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{exam.title}</h1>
          <p className="text-sm text-cyan-100">
            Academic Year: {exam.academicYear ?? exam.academicYearId}
          </p>
        </div>

        <div className="flex gap-2">
          {!isAfterEndDate && (
            <button
              onClick={() => navigate(`/exams/${examId}/assign`)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-cyan-800 hover:border-teal-600 hover:text-teal-600"
            >
              Assign Grades & Subjects
            </button>
          )}

          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700"
          >
            Delete Exam
          </button>
        </div>
      </header>

      {/* ===== EXAM INFO ===== */}
      <section className="bg-white rounded-xl shadow-md p-4 space-y-2 border-t-4 border-cyan-600">
        <Info label="Start Date" value={formatDate(exam.startDate)} />
        <Info label="End Date" value={formatDate(exam.endDate)} />
        <Info label="Description" value={exam.description || "—"} />
      </section>

      {/* ===== CREATIVE GRADE & SUBJECT OVERVIEW ===== */}
      <section className="bg-white rounded-xl shadow-md p-4 border-t-4 border-cyan-600">
        <h2 className="text-sm font-semibold text-neutral-900 mb-4">
          Grade & Subject Overview
        </h2>

        {exam.grades?.length ? (
          <div className="space-y-3">
            {exam.grades.map((g) => {
              const grade = grades.find((x) => x.id === g.gradeId);
              const isOpen = openGrade === g.gradeId;

              const classList = g.classes || [];
              const subjectList = (g.subjects || []).map((s) => {
                const id = s.subjectId ?? s.id;
                const name =
                  s.subjectName ??
                  subjects.find((x) => x.id === id)?.subjectName ??
                  `Subject #${id}`;
                return { id, name };
              });

              return (
                <div
                  key={g.gradeId}
                  className="border-t-1 shadow-sm rounded-lg overflow-hidden border-cyan-600"
                >
                  {/* Grade Header */}
                  <button
                    onClick={() =>
                      navigate(`/exams/${examId}/grades/${g.gradeId}`)
                    }
                    className="w-full flex justify-between items-center px-4 py-3 bg-gray-50 hover:bg-gray-100"
                  >
                    <span className="font-medium text-neutral-900">
                      Grade {grade?.gradeName ?? g.gradeId}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenGrade(isOpen ? null : g.gradeId);
                      }}
                      className="text-cyan-700"
                    >
                      {isOpen ? "▲" : "▼"}
                    </button>
                  </button>

                  {/* Grade Content */}
                  {isOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white">
                      {/* Classes */}
                      <div>
                        <p className="text-xs font-semibold text-neutral-700 mb-2">
                          Classes
                        </p>
                        {classList.length ? (
                          <div className="flex flex-wrap gap-2">
                            {classList.map((c) => (
                              <span
                                key={c.id}
                                className="bg-gray-100 px-2 py-1 rounded text-xs"
                              >
                                {c.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-neutral-500">
                            No classes assigned
                          </p>
                        )}
                      </div>

                      {/* Subjects */}
                      <div>
                        <p className="text-xs font-semibold text-neutral-700 mb-2">
                          Subjects
                        </p>
                        {subjectList.length ? (
                          <div className="flex flex-wrap gap-2">
                            {subjectList.map((s) => (
                              <span
                                key={s.id}
                                className="bg-cyan-50 text-cyan-800 px-2 py-1 rounded text-xs"
                              >
                                {s.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-neutral-500">
                            No subjects assigned
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-neutral-600">
            No grades assigned to this exam
          </p>
        )}
      </section>

      {/* ===== DIALOGS ===== */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Exam"
        message="Are you sure? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        busy={deleteBusy}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={async () => {
          try {
            setDeleteBusy(true);
            await deleteExam(examId);
            setSuccessOpen(true);
          } catch (err) {
            setErrorMessage("Failed to delete exam");
            setErrorOpen(true);
          } finally {
            setDeleteBusy(false);
            setDeleteConfirmOpen(false);
          }
        }}
      />

      <SuccessAlert
        isOpen={successOpen}
        message="Exam deleted successfully"
        onClose={() => navigate("/exams")}
      />

      <ErrorAlert
        isOpen={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />
    </div>
  );
}

/* ===== SMALL COMPONENTS ===== */

function Info({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-neutral-600">{label}</span>
      <span className="font-medium text-neutral-900">{value}</span>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toISOString().split("T")[0];
}
