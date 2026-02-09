import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../features/exam/examSlice";
import { getAllGrades } from "../../features/grade/gradeSlice";
import { getAllSubjects } from "../../features/subject/subjectSlice";
import Modal from "../../components/modal";

export default function ExamDetailsPage() {
  const { id } = useParams();
  const examId = Number(id);
  const dispatch = useDispatch();
  const { exams } = useSelector((s) => s.exams);
  const { grades } = useSelector((s) => s.grades);
  const { subjects } = useSelector((s) => s.subjects || {});

  // Manage assignments modal state (UI only)
  const [manageOpen, setManageOpen] = useState(false);
  const [assignRev, setAssignRev] = useState(0);
  const [selectedGrades, setSelectedGrades] = useState(() => {
    const store = JSON.parse(localStorage.getItem("examAssignments") || "{}");
    return store?.[examId]?.gradeIds || [];
  });
  const [subjectsByGrade, setSubjectsByGrade] = useState(() => {
    const store = JSON.parse(localStorage.getItem("examAssignments") || "{}");
    return store?.[examId]?.subjectsByGrade || {};
  });

  useEffect(() => {
    if (!exams?.length) dispatch(getAllExams());
    if (!grades?.length) dispatch(getAllGrades());
    if (!subjects?.length) dispatch(getAllSubjects());
  }, [dispatch]);

  const exam = useMemo(
    () => (exams || []).find((e) => e.id === examId),
    [exams, examId],
  );

  // Prefer nested grade details from the exam object when available
  const gradeDetails = useMemo(() => exam?.grades || [], [exam]);

  const getGradeLabel = (gid) => {
    const g = (grades || []).find((gg) => gg.id === gid);
    return g ? `Grade ${g.gradeName}` : `Grade #${gid}`;
  };

  const assignments = useMemo(() => {
    const store = JSON.parse(localStorage.getItem("examAssignments") || "{}");
    return store?.[examId] || { gradeIds: [], subjectsByGrade: {} };
  }, [examId, assignRev]);

  const gradeNames = useMemo(() => {
    const fromData = (gradeDetails || []).map((g) => getGradeLabel(g.gradeId));
    if (fromData.length) return fromData;
    return (assignments.gradeIds || []).map((gid) => getGradeLabel(gid));
  }, [gradeDetails, assignments, grades]);

  const subjectsByGradeNames = useMemo(() => {
    // Use exam.grades subjects when available
    if ((gradeDetails || []).length) {
      return gradeDetails.map((g) => {
        const uniqSubjects = dedupeByKey(g.subjects || [], "id");
        const subjectNames = uniqSubjects.map(
          (s) => s?.subjectName || `Subject #${s?.id}`,
        );
        return {
          gradeLabel: getGradeLabel(g.gradeId),
          subjectNames,
        };
      });
    }
    // Fallback to UI-only local assignments
    return Object.entries(assignments.subjectsByGrade || {}).map(
      ([gidStr, subIds]) => {
        const gid = Number(gidStr);
        const subjectNames = (subIds || []).map((sid) => {
          const s = (subjects || []).find((ss) => ss.id === sid);
          return s ? s.subjectName : `Subject #${sid}`;
        });
        return {
          gradeLabel: getGradeLabel(gid),
          subjectNames,
        };
      },
    );
  }, [gradeDetails, assignments, subjects, grades]);

  const classesByGradeRows = useMemo(() => {
    if (!(gradeDetails || []).length) return [];
    return gradeDetails.map((g) => ({
      gradeLabel: getGradeLabel(g.gradeId),
      classNames: (g.classes || []).map((c) => c?.name || `Class #${c?.id}`),
    }));
  }, [gradeDetails, grades]);

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Exam Details
          </h1>
          <p className="text-sm text-neutral-700">
            Full details and assignments
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setManageOpen(true)}
            className="rounded border border-teal-200 px-3 py-2 text-sm text-teal-700 hover:bg-teal-50"
          >
            Manage Assignments
          </button>
          <Link
            to="/exams"
            className="rounded border border-gray-200 px-3 py-2 text-sm text-neutral-700 hover:bg-gray-100"
          >
            Back to exams
          </Link>
        </div>
      </header>

      {!exam ? (
        <p className="text-sm text-neutral-700">Loading exam info...</p>
      ) : (
        <section className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                {exam.title}
              </p>
              <p className="text-xs text-neutral-600">
                Year {exam.academicYear ?? exam.academicYearId}
              </p>
            </div>
            <div className="text-xs text-neutral-700">
              <span className="rounded bg-gray-100 px-2 py-1">
                Start: {formatDate(exam.startDate)}
              </span>
              <span className="rounded bg-gray-100 px-2 py-1 ml-2">
                End: {formatDate(exam.endDate)}
              </span>
            </div>
          </div>
          <p className="text-sm text-neutral-800">
            {exam.description || "No description"}
          </p>
        </section>
      )}

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm font-semibold text-neutral-900">
          Assigned Grades
        </p>
        {gradeNames.length ? (
          <ul className="mt-2 list-disc pl-5 text-sm text-neutral-800">
            {gradeNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-neutral-700">
            No grades assigned yet.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm font-semibold text-neutral-900">
          Subjects by Grade
        </p>
        {subjectsByGradeNames.length ? (
          <div className="mt-2 space-y-3">
            {subjectsByGradeNames.map((row) => (
              <div key={row.gradeLabel}>
                <p className="text-xs font-medium text-neutral-800">
                  {row.gradeLabel}
                </p>
                {row.subjectNames.length ? (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {row.subjectNames.map((n) => (
                      <span
                        key={n}
                        className="rounded bg-gray-100 px-2 py-1 text-xs text-neutral-800"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-700">
                    No subjects assigned.
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-neutral-700">
            No subject assignments yet.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm font-semibold text-neutral-900">
          Classes by Grade
        </p>
        {classesByGradeRows.length ? (
          <div className="mt-2 space-y-3">
            {classesByGradeRows.map((row) => (
              <div key={row.gradeLabel}>
                <p className="text-xs font-medium text-neutral-800">
                  {row.gradeLabel}
                </p>
                {row.classNames.length ? (
                  <ul className="mt-1 list-disc pl-5 text-sm text-neutral-800">
                    {row.classNames.map((cn) => (
                      <li key={cn}>{cn}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-neutral-700">No classes listed.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-neutral-700">
            No classes data available.
          </p>
        )}
      </section>

      {/* Assignments Modal */}
      <Modal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
        title={`Manage Assignments — ${exam?.title || "Exam"}`}
        footer={
          <>
            <button
              onClick={() => setManageOpen(false)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const store = JSON.parse(
                  localStorage.getItem("examAssignments") || "{}",
                );
                store[examId] = {
                  gradeIds: selectedGrades,
                  subjectsByGrade,
                };
                localStorage.setItem("examAssignments", JSON.stringify(store));
                setAssignRev((v) => v + 1);
                setManageOpen(false);
                alert("Assignments saved (UI only)");
              }}
              className="rounded-lg bg-cyan-600 px-3 py-2 text-sm text-white hover:bg-cyan-700"
            >
              Save Assignments
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              Assign Grades
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(grades || []).map((g) => (
                <label
                  key={g.id}
                  className="flex items-center gap-2 rounded border border-gray-200 px-3 py-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedGrades.includes(g.id)}
                    onChange={() => {
                      setSelectedGrades((prev) =>
                        prev.includes(g.id)
                          ? prev.filter((x) => x !== g.id)
                          : [...prev, g.id],
                      );
                      setSubjectsByGrade((prev) => {
                        if (prev[g.id]) return prev;
                        return { ...prev, [g.id]: [] };
                      });
                    }}
                  />
                  <span>Grade {g.gradeName}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-neutral-900">
              Assign Subjects per Grade
            </p>
            <div className="mt-2 space-y-3">
              {selectedGrades.length === 0 ? (
                <p className="text-sm text-neutral-700">Select grades first.</p>
              ) : (
                selectedGrades.map((gid) => (
                  <div key={gid} className="rounded border border-gray-200 p-3">
                    <p className="text-xs font-medium text-neutral-800">
                      Grade {grades?.find((g) => g.id === gid)?.gradeName}
                    </p>
                    <select
                      multiple
                      value={subjectsByGrade[gid] || []}
                      onChange={(e) =>
                        setSubjectsByGrade((prev) => ({
                          ...prev,
                          [gid]: Array.from(e.target.selectedOptions).map((o) =>
                            Number(o.value),
                          ),
                        }))
                      }
                      className="mt-2 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 h-32"
                    >
                      {(subjects || []).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.subjectName}
                        </option>
                      ))}
                    </select>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function formatDate(d) {
  try {
    const str = typeof d === "string" ? d : String(d);
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${dd}`;
    }
    return str;
  } catch {
    return String(d);
  }
}

function dedupeByKey(arr, key) {
  const seen = new Set();
  return (arr || []).filter((item) => {
    const k = item?.[key];
    if (k == null) return true;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
