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
    <div className="max-w-full mx-auto space-y-8 pb-16 animate-fade-in px-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between bg-linear-to-r from-cyan-900 via-cyan-800 to-cyan-900 py-8 px-8 rounded-2xl shadow-lg gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white capitalize mb-1">
            Exams
          </h1>
          <p className="text-sm text-cyan-100 capitalize">
            Manage and monitor exam schedules
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              placeholder="Search exams..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-64 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-cyan-200/50 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-md transition-all"
            />
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="bg-white text-cyan-900 px-6 py-2 rounded-xl text-sm font-bold hover:bg-cyan-50 transition-colors shadow-sm capitalize"
          >
            Add exam
          </button>
        </div>
      </header>

      <main>
        {examsLoading ? (
          <div className="p-20 text-center animate-pulse text-cyan-600 font-bold capitalize">
            Loading exams...
          </div>
        ) : filtered.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <ExamCard
                key={e.id}
                exam={e}
                onViewDetails={() => navigate(`/exams/${e.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-200">
            <p className="text-neutral-500 capitalize font-medium">
              No exams found matching your search.
            </p>
          </div>
        )}
      </main>

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

  const termLabel = examType;

  return (
    <div
      onClick={onViewDetails}
      className="group bg-white rounded-2xl p-6 shadow-sm border border-cyan-200 hover:shadow-xl hover:border-cyan-100 transition-all cursor-pointer flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex flex-wrap gap-2 mb-4 justify-between">
          <span className="px-3 py-1 rounded-lg bg-cyan-50 text-cyan-700 text-[10px] font-bold capitalize">
            {termLabel}
          </span>
          <span className="px-3 py-1 rounded-lg bg-neutral-50 text-neutral-500 text-[10px] font-bold capitalize">
            Year {academicYear ?? academicYearId}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-neutral-800 capitalize group-hover:text-cyan-700 transition-colors">
          {title}
        </h3>

        <p className="mt-2 text-sm text-neutral-500 line-clamp-2 leading-relaxed">
          {description || "No description provided for this exam schedule."}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-50 flex items-center justify-between text-xs font-bold">
        <div className="text-neutral-400 capitalize">
          Period:{" "}
          <span className="text-neutral-700">
            {formatDate(startDate)} — {formatDate(endDate)}
          </span>
        </div>
        <div className="text-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity">
          View details
        </div>
      </div>
    </div>
  );
}

function formatDate(d) {
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return String(d);
  }
}
