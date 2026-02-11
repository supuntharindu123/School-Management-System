import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/CommonElements/Button";
import { getAllExams } from "../../features/exam/examSlice";
import { getAllYears } from "../../features/year/yearSlice";
import { createExam } from "../../features/exam/examService";
import AddExamModal from "../../components/Exam/AddExam";

export default function ExamManagementPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { exams, loading: examsLoading } = useSelector((s) => s.exams);
  const { years } = useSelector((s) => s.years);

  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  // cleaned: removed unused assignment state and subjects/grades selectors

  useEffect(() => {
    dispatch(getAllExams());
    dispatch(getAllYears());
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
      <header className="mb-4 flex items-center justify-between bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-6 rounded-2xl px-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-50 mb-2">Exams</h1>
          <p className="text-sm text-cyan-50">Manage exam schedules</p>
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
                onViewDetails={() => navigate(`/exams/${e.id}`)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-600">No exams found.</p>
        )}
      </section>

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
          years={years}
          saving={saving}
        />
      )}
    </div>
  );
}

function ExamCard({ exam, onViewDetails }) {
  const {
    title,
    description,
    startDate,
    endDate,
    academicYear,
    academicYearId,
    examType,
  } = exam;
  const termMap = { 1: "Term 01", 2: "Term 02", 3: "Term 03" };
  const termLabel = termMap[Number(examType)] || "Term";
  return (
    <div
      onClick={onViewDetails}
      className="group relative overflow-hidden rounded-xl border-t-4 border-cyan-600 bg-white p-4 shadow-sm hover:shadow-md cursor-pointer"
    >
      <div className="absolute  bg-cyan-600" />
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-medium text-cyan-800 border border-cyan-200">
              {termLabel}
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-800 border border-gray-200">
              Year {academicYear ?? academicYearId}
            </span>
          </div>
          <p className="mt-1 text-lg font-bold text-neutral-900 capitalize">
            {title}
          </p>
        </div>
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-neutral-800">
        {description || "No description"}
      </p>
      <div className="mt-3 flex items-center gap-2 text-xs text-neutral-700 justify-between">
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
