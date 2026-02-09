import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/CommonElements/Button";
import { getSubjects } from "../../features/subject/subjectService";

export default function SubjectDetailsPage() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSubjects();
        if (alive) {
          setSubjects(Array.isArray(data) ? data : []);
          // Preselect first subject
          setSelectedId((prev) => prev ?? (Array.isArray(data) && data[0]?.id));
        }
      } catch (err) {
        if (alive) {
          setError(
            err?.response?.data || err?.message || "Failed to load subjects",
          );
        }
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subjects || [];
    return (subjects || []).filter((s) => {
      const name = String(s?.subjectName || s?.name || "").toLowerCase();
      const code = String(s?.code || s?.subjectCode || "").toLowerCase();
      return name.includes(q) || code.includes(q);
    });
  }, [subjects, query]);

  const selected = useMemo(() => {
    return (subjects || []).find((s) => s?.id === selectedId) || null;
  }, [subjects, selectedId]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Subject Details
          </h1>
          <p className="text-sm text-neutral-700">
            Browse and view information about subjects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by name or code"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
          />
        </div>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {String(error)}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Subjects list */}
        <section className="lg:col-span-1 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-neutral-800">Subjects</h2>
            {loading && (
              <span className="text-xs text-neutral-600">Loading…</span>
            )}
          </div>
          <ul className="mt-3 space-y-2">
            {(filtered || []).map((s) => (
              <li
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`rounded-lg border p-3 cursor-pointer transition-colors ${
                  selectedId === s.id
                    ? "border-cyan-600 bg-cyan-50"
                    : "border-gray-200 hover:border-cyan-600"
                }`}
              >
                <p className="font-medium text-neutral-900">
                  {s.subjectName || s.name || "Untitled Subject"}
                </p>
                <p className="text-xs text-neutral-700">
                  {s.moduleCode ?? "No code"}
                </p>
              </li>
            ))}
            {!filtered?.length && !loading && (
              <li className="rounded-lg border border-gray-200 p-3 text-sm text-neutral-700">
                No subjects found.
              </li>
            )}
          </ul>
        </section>

        {/* Subject details */}
        <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-4">
          {!selected ? (
            <p className="text-sm text-neutral-700">
              Select a subject to view details.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    {selected.subjectName ||
                      selected.name ||
                      "Untitled Subject"}
                  </h2>
                  <p className="text-sm text-neutral-700">
                    Code: {(selected.code || selected.subjectCode) ?? "-"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    label="Back to Classes"
                    onClick={() => navigate(-1)}
                    bgcolor="bg-neutral-900 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <SummaryCard
                  title="Total Grades"
                  value={
                    Array.isArray(selected?.grades)
                      ? selected.grades.length
                      : (selected?.gradeCount ?? 0)
                  }
                />
                <SummaryCard
                  title="Active Classes"
                  value={
                    Array.isArray(selected?.classAssignments)
                      ? selected.classAssignments.filter((c) => c?.isActive)
                          .length
                      : (selected?.activeClassCount ?? 0)
                  }
                />
                <SummaryCard
                  title="Total Classes"
                  value={
                    Array.isArray(selected?.classAssignments)
                      ? selected.classAssignments.length
                      : (selected?.classCount ?? 0)
                  }
                />
              </div>

              {/* Grades table */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm font-medium text-neutral-800">Grades</p>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="text-left bg-cyan-600 text-cyan-50">
                        <th className="border-b border-cyan-200 py-2 px-3">
                          Grade
                        </th>
                        <th className="border-b border-cyan-200 py-2 px-3">
                          Active
                        </th>
                        <th className="border-b border-cyan-200 py-2 px-3">
                          Updated
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-neutral-800">
                      {(selected?.grades || []).map((g, idx) => (
                        <tr key={g.id ?? idx} className="hover:bg-gray-50">
                          <td className="border-b border-gray-200 py-2 px-3">
                            {g.gradeName ?? g.name ?? "-"}
                          </td>
                          <td className="border-b border-gray-200 py-2 px-3">
                            {statusBadge(g.isActive)}
                          </td>
                          <td className="border-b border-gray-200 py-2 px-3">
                            {formatDateTime(g.updatedDate ?? g.updatedAt)}
                          </td>
                        </tr>
                      ))}
                      {!selected?.grades?.length && (
                        <tr>
                          <td
                            className="py-6 text-center text-neutral-600"
                            colSpan={3}
                          >
                            No grade mappings available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Classes table */}
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm font-medium text-neutral-800">
                  Assigned Classes
                </p>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="text-left bg-cyan-600 text-cyan-50">
                        <th className="border-b border-cyan-200 py-2 px-3">
                          Class
                        </th>
                        <th className="border-b border-cyan-200 py-2 px-3">
                          Active
                        </th>
                        <th className="border-b border-cyan-200 py-2 px-3">
                          Assigned
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-neutral-800">
                      {(selected?.classAssignments || []).map((c, idx) => (
                        <tr key={c.id ?? idx} className="hover:bg-gray-50">
                          <td className="border-b border-gray-200 py-2 px-3">
                            {c.className ?? `Class #${c.classId}`}
                          </td>
                          <td className="border-b border-gray-200 py-2 px-3">
                            {statusBadge(c.isActive)}
                          </td>
                          <td className="border-b border-gray-200 py-2 px-3">
                            {formatDateTime(c.createdDate ?? c.assignedDate)}
                          </td>
                        </tr>
                      ))}
                      {!selected?.classAssignments?.length && (
                        <tr>
                          <td
                            className="py-6 text-center text-neutral-600"
                            colSpan={3}
                          >
                            No class assignments.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-md">
      <p className="text-xs text-neutral-600">{title}</p>
      <p className="text-2xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function statusBadge(active) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs ${
        active
          ? "border-cyan-200 bg-cyan-100 text-cyan-800"
          : "border-gray-200 bg-gray-100 text-gray-700"
      }`}
    >
      {active ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-3 w-3"
        >
          <path d="M9 16.5 4.5 12l1.5-1.5L9 13.5l9-9L19.5 6l-9 10.5Z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-3 w-3"
        >
          <path d="M6 12.75h12v-1.5H6v1.5Z" />
        </svg>
      )}
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function formatDateTime(d) {
  try {
    const date = new Date(d);
    if (!isNaN(date.getTime())) return date.toLocaleString();
    return String(d);
  } catch {
    return String(d);
  }
}
