import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllGrades } from "../../features/grade/gradeSlice";
import { getAllSubjects } from "../../features/subject/subjectSlice";
import {
  assignExamToGrade,
  assignExamToSubject,
} from "../../features/exam/examService";
import { examdetails } from "../../features/exam/examService";
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";

export default function ExamAssignPage() {
  const { id } = useParams();
  const examId = Number(id);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { grades } = useSelector((s) => s.grades);
  const { subjects } = useSelector((s) => s.subjects);

  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedGradeForSubjects, setSelectedGradeForSubjects] =
    useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    dispatch(getAllGrades());
    dispatch(getAllSubjects());
  }, [dispatch]);

  // Fetch existing assignments and preselect checkboxes
  useEffect(() => {
    let active = true;
    setLoadingDetail(true);
    examdetails(examId)
      .then((data) => {
        if (!active || !data) return;
        setDetail(data);
        const assignedGradeIds = Array.from(
          new Set((data.grades || []).map((g) => g.gradeId)),
        );
        setSelectedGrades(assignedGradeIds);
        // Default selected grade for subjects: first assigned grade
        const firstGid = assignedGradeIds[0] ?? null;
        setSelectedGradeForSubjects(firstGid);
        if (firstGid != null) {
          const gradeObj = (data.grades || []).find(
            (g) => g.gradeId === firstGid,
          );
          const subjectIds = Array.from(
            new Set((gradeObj?.subjects || []).map((s) => s.subjectId ?? s.id)),
          );
          setSelectedSubjects(subjectIds);
        } else {
          setSelectedSubjects([]);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoadingDetail(false);
      });
    return () => {
      active = false;
    };
  }, [examId]);

  // When user switches the grade selector, load its assigned subjects from detail
  useEffect(() => {
    if (!detail || !selectedGradeForSubjects) return;
    const gradeObj = (detail.grades || []).find(
      (g) => g.gradeId === selectedGradeForSubjects,
    );
    const subjectIds = Array.from(
      new Set((gradeObj?.subjects || []).map((s) => s.subjectId ?? s.id)),
    );
    setSelectedSubjects(subjectIds);
  }, [detail, selectedGradeForSubjects]);

  /* ------------------ GRADE ASSIGN ------------------ */
  const saveGrades = async () => {
    // DTO: { examId, gradeIds: List<int> }
    const payload = { examId, gradeIds: selectedGrades };

    if (!selectedGrades.length) {
      setErrorMessage("Select at least one grade");
      setErrorOpen(true);
      return;
    }

    try {
      await assignExamToGrade(payload);
      setSuccessMessage("Grades assigned successfully");
      setSuccessOpen(true);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to assign grades";
      setErrorMessage(msg);
      setErrorOpen(true);
    }
  };

  /* ---------------- SUBJECT ASSIGN ---------------- */
  const saveSubjects = async () => {
    if (!selectedGradeForSubjects) {
      setErrorMessage("Select a grade");
      setErrorOpen(true);
      return;
    }

    // DTO: { examId, gradeId, subjectIds: List<int> }
    const payload = {
      examId: Number(examId),
      gradeId: Number(selectedGradeForSubjects),
      subjectIds: selectedSubjects.map((id) => Number(id)),
    };

    if (!selectedSubjects.length) {
      setErrorMessage("Select at least one subject");
      setErrorOpen(true);
      return;
    }

    try {
      console.log(`res`, payload);
      await assignExamToSubject(payload);
      setSuccessMessage("Subjects assigned successfully");
      setSuccessOpen(true);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to assign subjects";
      setErrorMessage(msg);
      setErrorOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header className="mb-2 flex items-center justify-between bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-5 rounded-2xl px-6">
        <div>
          <h1 className="text-2xl font-bold text-cyan-50">
            Assign Grades & Subjects
          </h1>
          <p className="text-xs text-cyan-50">
            Link exam to grades and subjects
          </p>
        </div>
        <div>
          <button
            onClick={() => navigate(`/exams/${examId}`)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-cyan-800 hover:border-teal-600 hover:text-teal-600"
          >
            Back to Exam
          </button>
        </div>
      </header>

      {/* ================= ASSIGN GRADES ================= */}
      <section className="rounded-xl border-t-4 border-cyan-600 bg-white p-4 shadow-md">
        <h2 className="text-sm font-semibold text-neutral-900">
          Assign Grades to Exam
        </h2>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {grades?.map((g) => (
            <label
              key={g.id}
              className="flex items-center gap-2 rounded border border-gray-200 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selectedGrades.includes(g.id)}
                onChange={() =>
                  setSelectedGrades((prev) =>
                    prev.includes(g.id)
                      ? prev.filter((x) => x !== g.id)
                      : [...prev, g.id],
                  )
                }
              />
              <span>Grade {g.gradeName}</span>
            </label>
          ))}
        </div>

        <button
          onClick={saveGrades}
          className="mt-4 rounded-lg bg-cyan-600 px-3 py-2 text-sm text-white hover:bg-cyan-700"
        >
          Save Grades
        </button>
      </section>

      {/* ================= ASSIGN SUBJECTS ================= */}
      <section className="rounded-xl border-t-4 border-cyan-600 bg-white p-4 shadow-md">
        <h2 className="text-sm font-semibold text-neutral-900">
          Assign Subjects to Grade
        </h2>

        {/* Select Grade */}
        <select
          className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          value={selectedGradeForSubjects || ""}
          onChange={(e) => {
            setSelectedGradeForSubjects(Number(e.target.value));
            setSelectedSubjects([]);
          }}
        >
          <option value="">-- Select Grade --</option>
          {selectedGrades.map((gid) => {
            const g = grades.find((x) => x.id === gid);
            return (
              <option key={gid} value={gid}>
                Grade {g?.gradeName}
              </option>
            );
          })}
        </select>

        {/* Subjects */}
        {selectedGradeForSubjects && (
          <>
            <div className="mt-3 h-48 overflow-y-auto rounded-lg border border-gray-200 p-2 space-y-1">
              {subjects?.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedSubjects.includes(s.id)}
                    onChange={() =>
                      setSelectedSubjects((prev) =>
                        prev.includes(s.id)
                          ? prev.filter((x) => x !== s.id)
                          : [...prev, s.id],
                      )
                    }
                  />
                  <span className="text-neutral-800">{s.subjectName}</span>
                </label>
              ))}
            </div>

            <button
              onClick={saveSubjects}
              className="mt-4 rounded-lg bg-cyan-600 px-3 py-2 text-sm text-white hover:bg-cyan-700"
            >
              Save Subjects
            </button>
          </>
        )}
      </section>
      {/* Alerts */}
      <SuccessAlert
        isOpen={successOpen}
        message={successMessage}
        onClose={() => setSuccessOpen(false)}
      />
      <ErrorAlert
        isOpen={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />
    </div>
  );
}
