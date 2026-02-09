import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/CommonElements/Button";
import { useDispatch, useSelector } from "react-redux";
import { getTeachers } from "../../features/adminFeatures/teachers/teacherSlice";
import AddTeacherForm from "../../components/Teacher/AddTeacherForm";

export default function TeacherListPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [addModal, setAddModal] = useState({ open: false });

  const dispatch = useDispatch();

  const teacherList = useSelector((state) => state.teachers);
  const teachers = teacherList.teachers;

  useEffect(() => {
    dispatch(getTeachers());
  }, [dispatch]);

  const filtered = useMemo(() => {
    return teachers.filter((t) => {
      const name = t.fullName || "";
      const email = t.user?.email || "";
      const matchesQuery = query
        ? [name, email].some((f) =>
            f.toLowerCase().includes(query.toLowerCase()),
          )
        : true;
      return matchesQuery;
    });
  }, [teachers, query]);

  const stats = useMemo(() => {
    const filteredCount = filtered.length;
    const activeClassesTotal = filtered.reduce(
      (acc, row) =>
        acc + (row.classAssignments?.filter((ca) => ca.isActive).length || 0),
      0,
    );
    const unassignedTeachers = filtered.filter(
      (row) => !row.classAssignments?.some((ca) => ca.isActive),
    ).length;
    return { filteredCount, activeClassesTotal, unassignedTeachers };
  }, [filtered]);

  const getInitials = (name) => {
    if (!name) return "T";
    const parts = String(name).trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const openAdd = () => setAddModal({ open: true });
  const closeAdd = () => setAddModal({ open: false });

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-4 flex items-center justify-between bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-6 rounded-2xl px-6 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />
        <div>
          <h1 className="text-3xl font-bold text-cyan-50">Teachers</h1>
          <p className="text-sm text-cyan-50">
            Manage teachers, assignments, and status
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <input
              placeholder="Search by name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white pl-8 pr-8 py-2 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 min-w-64"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-xs text-neutral-500 hover:text-cyan-700"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          <Button label="Add Teacher" onClick={openAdd} />
        </div>
      </header>

      <section className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-cyan-200 bg-white p-4 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-cyan-700 text-white text-sm font-bold">
            {stats.filteredCount}
          </span>
          <div>
            <div className="text-sm font-semibold text-neutral-900">
              All Teachers
            </div>
            <div className="text-xs text-neutral-600">
              After current filters
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-cyan-200 bg-white p-4 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-cyan-700 text-white text-sm font-bold">
            {stats.activeClassesTotal}
          </span>
          <div>
            <div className="text-sm font-semibold text-neutral-900">
              Active Class Assignments
            </div>
            <div className="text-xs text-neutral-600">
              Across visible teachers
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-cyan-200 bg-white p-4 flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-cyan-700 text-white text-sm font-bold">
            {stats.unassignedTeachers}
          </span>
          <div>
            <div className="text-sm font-semibold text-neutral-900">
              Unassigned Teachers
            </div>
            <div className="text-xs text-neutral-600">No active classes</div>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="rounded-xl border border-gray-300 bg-white">
        <div className="max-h-[60vh] overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-cyan-50 text-cyan-900 sticky top-0">
              <tr className="text-left">
                <th className="border-b border-cyan-200 py-2 px-3 sticky top-0 font-semibold">
                  Name
                </th>
                <th className="border-b border-cyan-200 py-2 px-3 sticky top-0 font-semibold">
                  Email
                </th>
                <th className="border-b border-cyan-200 py-2 px-3 sticky top-0 font-semibold">
                  Gender
                </th>
                <th className="border-b border-cyan-200 py-2 px-3 sticky top-0 font-semibold">
                  Classes
                </th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-cyan-50 transition-colors"
                  onClick={() => navigate(`/teachers/${row.id}`)}
                >
                  <td className="border-b border-cyan-200 py-2 px-3 font-medium">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-cyan-700 text-white text-xs font-semibold">
                        {getInitials(row.fullName)}
                      </span>
                      <span>{row.fullName}</span>
                    </div>
                  </td>
                  <td className="border-b border-cyan-200 py-2 px-3">
                    {row.user?.email || "—"}
                  </td>
                  <td className="border-b border-cyan-200 py-2 px-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 px-2 py-0.5 text-xs">
                      {row.gender || "—"}
                    </span>
                  </td>
                  <td className="border-b border-cyan-200 py-2 px-3">
                    {row.classAssignments?.filter((ca) => ca.isActive)
                      .length ? (
                      <div className="flex flex-wrap gap-1.5">
                        {row.classAssignments
                          .filter((ca) => ca.isActive)
                          .map((ca, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 rounded-sm bg-cyan-50 text-cyan-700 border border-cyan-200 px-2 py-0.5 text-xs"
                            >
                              {ca.className}
                            </span>
                          ))}
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-500">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    className="py-10 text-center text-neutral-600"
                    colSpan={4}
                  >
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Modal */}
      {addModal.open && (
        <AddTeacherForm
          isOpen={addModal.open}
          isClose={() => setAddModal({ open: false })}
        />
      )}
    </div>
  );
}
