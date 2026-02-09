import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/CommonElements/Button";
import { getAllExams } from "../../features/exam/examSlice";
import { getAllGrades } from "../../features/grade/gradeSlice";
import { getAllYears } from "../../features/year/yearSlice";
import { getAllSubjects } from "../../features/subject/subjectSlice";
import { createExam } from "../../features/exam/examService";

export default function ExamManagementPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { exams, loading: examsLoading } = useSelector((s) => s.exams);
  const { grades } = useSelector((s) => s.grades);
  const { years } = useSelector((s) => s.years);
  const { subjects } = useSelector((s) => s.subjects || {});

  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [assignExam, setAssignExam] = useState(null);

  useEffect(() => {
    dispatch(getAllExams());
    dispatch(getAllGrades());
    dispatch(getAllYears());
    dispatch(getAllSubjects());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return exams || [];
    return (exams || []).filter((e) => {
      return [e.title, e.description, e.gradeName, String(e.academicYear)]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q));
    });
  }, [exams, query]);

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Exams</h1>
          <p className="text-sm text-neutral-700">Manage exam schedules</p>
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Search by title, grade, year"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
          <Button label="Add Exam" onClick={() => setAddOpen(true)} />
        </div>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        {examsLoading ? (
          <p className="text-sm text-neutral-700">Loading exams...</p>
        ) : filtered.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <ExamCard
                key={e.id}
                exam={e}
                onManageAssignments={() => setAssignExam(e)}
                onViewDetails={() => navigate(`/exams/${e.id}`)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-600">No exams found.</p>
        )}
      </section>

      {assignExam && (
        <ManageAssignmentsModal
          exam={assignExam}
          grades={grades}
          subjects={subjects}
          onClose={() => setAssignExam(null)}
        />
      )}

      {addOpen && (
        <AddExamModal
          onClose={() => setAddOpen(false)}
          onSave={async (payload) => {
            try {
              setSaving(true);
              await createExam(payload);
              await dispatch(getAllExams());
              setAddOpen(false);
            } catch (err) {
              alert(
                err?.response?.data || err?.message || "Failed to create exam",
              );
            } finally {
              setSaving(false);
            }
          }}
          grades={grades}
          years={years}
          saving={saving}
        />
      )}
    </div>
  );
}

function ExamCard({ exam, onManageAssignments, onViewDetails }) {
  const { title, description, startDate, endDate, gradeName, academicYear } =
    exam;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-neutral-900">{title}</p>
          <p className="text-xs text-neutral-600">
            Grade {gradeName} · Year {academicYear}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onManageAssignments}
            className="rounded px-2 py-1 text-xs text-teal-700 hover:bg-teal-50 border border-teal-200"
          >
            Assignments
          </button>
          <button
            onClick={onViewDetails}
            className="rounded px-2 py-1 text-xs text-neutral-700 hover:bg-gray-100 border border-gray-200"
          >
            Details
          </button>
        </div>
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-neutral-800">
        {description || "No description"}
      </p>
      <div className="mt-3 flex items-center gap-2 text-xs text-neutral-700">
        <span className="rounded bg-gray-100 px-2 py-1">
          Start: {formatDate(startDate)}
        </span>
        <span className="rounded bg-gray-100 px-2 py-1">
          End: {formatDate(endDate)}
        </span>
      </div>
    </div>
  );
}

function formatDate(d) {
  // d may be a date string; show YYYY-MM-DD
  try {
    const str = typeof d === "string" ? d : String(d);
    // Accept ISO or DateOnly formatted strings
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${dd}`;
    }
    // Fallback: return the raw value
    return str;
  } catch {
    return String(d);
  }
}

function ModalShell({ title, children, onClose, footer }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold text-neutral-900">{title}</p>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-xs text-neutral-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
        <div className="p-4">{children}</div>
        <div className="border-t px-4 py-3 flex justify-end gap-2">
          {footer}
        </div>
      </div>
    </div>
  );
}

function AddExamModal({ onClose, onSave, grades, years, saving }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [gradeId, setGradeId] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");

  const submit = () => {
    if (!title || !startDate || !endDate || !gradeId || !academicYearId) {
      alert("Please fill all required fields");
      return;
    }
    onSave({
      title,
      description,
      startDate, // Expecting YYYY-MM-DD string
      endDate,
      gradeId: Number(gradeId),
      academicYearId: Number(academicYearId),
    });
  };

  return (
    <ModalShell
      title="Add Exam"
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Cancel
          </button>
          <Button label={saving ? "Saving..." : "Save"} onClick={submit} />
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-800">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Grade
            </label>
            <select
              value={gradeId}
              onChange={(e) => setGradeId(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            >
              <option value="">Select grade</option>
              {(grades || []).map((g) => (
                <option key={g.id} value={g.id}>
                  Grade {g.gradeName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Academic Year
            </label>
            <select
              value={academicYearId}
              onChange={(e) => setAcademicYearId(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            >
              <option value="">Select year</option>
              {(years || []).map((y) => (
                <option key={y.id} value={y.id}>
                  {y.year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function ManageAssignmentsModal({ exam, grades, subjects, onClose }) {
  const [selectedGrades, setSelectedGrades] = useState(() => {
    const store = JSON.parse(localStorage.getItem("examAssignments") || "{}");
    const existing = store?.[exam?.id]?.gradeIds || [];
    return existing;
  });
  const [subjectsByGrade, setSubjectsByGrade] = useState(() => {
    const store = JSON.parse(localStorage.getItem("examAssignments") || "{}");
    const existing = store?.[exam?.id]?.subjectsByGrade || {};
    return existing;
  });

  const toggleGrade = (gradeId) => {
    setSelectedGrades((prev) =>
      prev.includes(gradeId)
        ? prev.filter((g) => g !== gradeId)
        : [...prev, gradeId],
    );
  };

  const setSubjectsFor = (gradeId, values) => {
    setSubjectsByGrade((prev) => ({ ...prev, [gradeId]: values }));
  };

  const save = () => {
    const store = JSON.parse(localStorage.getItem("examAssignments") || "{}");
    store[exam.id] = {
      gradeIds: selectedGrades,
      subjectsByGrade,
    };
    localStorage.setItem("examAssignments", JSON.stringify(store));
    alert("Assignments saved (UI only)");
    onClose();
  };

  return (
    <ModalShell
      title={`Manage Assignments — ${exam?.title}`}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Cancel
          </button>
          <Button label="Save Assignments" onClick={save} />
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
                  onChange={() => toggleGrade(g.id)}
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
                      setSubjectsFor(
                        gid,
                        Array.from(e.target.selectedOptions).map((o) =>
                          Number(o.value),
                        ),
                      )
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
    </ModalShell>
  );
}
