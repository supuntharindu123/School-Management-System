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
    return (
      <div className="p-20 text-center animate-pulse text-cyan-600 font-bold capitalize">
        Loading exam details...
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto space-y-8 pb-16 animate-fade-in px-4">
      {/* ===== Header ===== */}
      <header className="flex justify-between items-center rounded-3xl bg-linear-to-r from-cyan-900 via-cyan-800 to-cyan-900 p-8 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-white capitalize">
            {exam.title}
          </h1>
          <p className="text-sm text-cyan-100 capitalize">
            Academic year: {exam.academicYear}
          </p>
        </div>

        <div className="flex gap-3">
          {!isAfterEndDate && (
            <button
              onClick={() => navigate(`/exams/${examId}/assign`)}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-md hover:bg-white hover:text-cyan-900 transition-all capitalize"
            >
              Assign grades & subjects
            </button>
          )}

          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors capitalize"
          >
            Delete exam
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== Exam Info ===== */}
        <section className="lg:col-span-1 bg-white rounded-3xl shadow-sm p-6 space-y-4 border border-neutral-100">
          <h2 className="text-lg font-bold text-neutral-600 capitalize tracking-wider">
            General information
          </h2>
          <div className="space-y-3">
            <Info label="Exam Type" value={exam.examType} />
            <Info label="Start date" value={formatDate(exam.startDate)} />
            <Info label="End date" value={formatDate(exam.endDate)} />
            <Info label="Exam Duration Days" value={exam.examDurationDays} />
            <Info label="Number Of Grades" value={exam.totalGrades} />
            <Info label="Number Of Subjects" value={exam.totalSubjects} />
            <Info label="Exam Year" value={exam.academicYear} />
            <div className="pt-2 border-t border-neutral-50">
              <p className="text-xs text-neutral-500 mb-1 capitalize">
                Description
              </p>
              <p className="text-sm text-neutral-800 leading-relaxed">
                {exam.description || "No description provided for this exam."}
              </p>
            </div>
          </div>
        </section>

        {/* ===== Grade & Subject Overview ===== */}
        <section className="lg:col-span-2 bg-white rounded-3xl shadow-sm p-6 border border-neutral-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-neutral-600 capitalize tracking-wider">
              Grade & subject overview
            </h2>
            <span className="text-[10px] font-bold bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full capitalize">
              {exam.grades?.length || 0} grades assigned
            </span>
          </div>

          {exam.grades?.length ? (
            <div className="space-y-3">
              {exam.grades.map((g) => {
                const grade = grades.find((x) => x.id === g.gradeId);
                const isOpen = openGrade === g.gradeId;
                const classList = g.classes || [];
                const subjectList = (g.subjects || []).map((s) => {
                  const id = s.subjectId ?? s.id;
                  return {
                    id,
                    name:
                      s.subjectName ??
                      subjects.find((x) => x.id === id)?.subjectName ??
                      `Subject #${id}`,
                  };
                });

                return (
                  <div
                    key={g.gradeId}
                    className="rounded-2xl border border-neutral-100 overflow-hidden"
                  >
                    {/* Grade Header */}
                    <div
                      className={`flex justify-between items-center px-5 py-4 cursor-pointer transition-colors ${
                        isOpen
                          ? "bg-cyan-50/50"
                          : "bg-neutral-50/50 hover:bg-neutral-50"
                      }`}
                      onClick={() => setOpenGrade(isOpen ? null : g.gradeId)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-600" />
                        <span className="font-bold text-neutral-800 capitalize">
                          Grade {grade?.gradeName ?? g.gradeId}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/exams/${examId}/grades/${g.gradeId}`);
                          }}
                          className="text-sm font-bold text-cyan-600 hover:underline capitalize"
                        >
                          View results
                        </button>
                        <span
                          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Grade Content */}
                    {isOpen && (
                      <div className="p-5 bg-white space-y-5 animate-in slide-in-from-top-2">
                        <div>
                          <p className="text-[10px] font-bold text-neutral-400 mb-2 capitalize">
                            Assigned classes
                          </p>
                          {classList.length ? (
                            <div className="flex flex-wrap gap-2">
                              {classList.map((c) => (
                                <span
                                  key={c.id}
                                  className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-lg text-xs font-medium"
                                >
                                  {c.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-neutral-400 italic capitalize">
                              No classes assigned
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-neutral-400 mb-2 capitalize">
                            Exam subjects
                          </p>
                          {subjectList.length ? (
                            <div className="flex flex-wrap gap-2">
                              {subjectList.map((s) => (
                                <span
                                  key={s.id}
                                  className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-lg text-xs font-bold capitalize"
                                >
                                  {s.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-neutral-400 italic capitalize">
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
            <div className="text-center py-12 border border-dashed border-neutral-200 rounded-2xl">
              <p className="text-sm text-neutral-400 capitalize">
                No grades assigned to this exam yet.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* ===== Dialogs ===== */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete exam"
        message="Are you sure you want to remove this exam? This action cannot be undone."
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
            setErrorMessage("Failed to delete exam. Please try again.");
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

/* ===== Small Components ===== */

function Info({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm py-1">
      <span className="text-neutral-500 capitalize">{label}</span>
      <span className="font-bold text-neutral-800">{value}</span>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
