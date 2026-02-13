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
  const teachers = teacherList.teachers || [];

  useEffect(() => {
    dispatch(getTeachers());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return teachers.filter((t) => {
      const name = t.fullName || "";
      const email = t.user?.email || "";
      return !q || [name, email].some((f) => f.toLowerCase().includes(q));
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
    if (!name) return "t";
    const parts = String(name).trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toLowerCase();
    return (parts[0][0] + parts[1][0]).toLowerCase();
  };

  return (
    <div className="max-w-full mx-auto space-y-8 pb-16 animate-fade-in px-4">
      {/* Page header */}
      <header className="relative flex flex-col md:flex-row items-center justify-between gap-4 bg-linear-to-r from-cyan-900 via-cyan-800 to-cyan-900 p-8 rounded-2xl shadow-xl overflow-hidden group">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white capitalize">Teachers</h1>
          <p className="text-cyan-200/70 text-sm font-medium mt-1 capitalize">
            Manage teachers, assignments, and status
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-64 rounded-2xl border-none bg-white/10 px-5 py-3 text-sm text-white placeholder:text-cyan-200/40 focus:bg-white focus:text-neutral-900 focus:ring-4 focus:ring-cyan-500/20 transition-all outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-cyan-400 hover:text-cyan-600 capitalize"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={() => setAddModal({ open: true })}
            className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-bold text-white hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-900/20 capitalize"
          >
            Add teacher
          </button>
        </div>
        <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-cyan-500/10 rounded-full blur-3xl" />
      </header>

      {/* Stats overview */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total teachers"
          value={stats.filteredCount}
          subtext="After current filters"
        />
        <StatCard
          label="Active assignments"
          value={stats.activeClassesTotal}
          subtext="Across visible teachers"
        />
        <StatCard
          label="Unassigned"
          value={stats.unassignedTeachers}
          subtext="No active classes"
        />
      </section>

      {/* Teachers table */}
      <section className="rounded-2xl border border-neutral-100 bg-white shadow-sm overflow-hidden">
        <div className="max-h-[60vh] overflow-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-20 bg-cyan-800 backdrop-blur-md">
              <tr className="text-left">
                <th className="py-5 px-6 text-sm font-bold text-cyan-50 capitalize ">
                  Teacher identity
                </th>
                <th className="py-5 px-3 text-sm font-bold text-cyan-50 capitalize ">
                  Contact email
                </th>
                <th className="py-5 px-3 text-sm font-bold text-cyan-50 capitalize ">
                  Gender
                </th>
                <th className="py-5 px-6 text-sm font-bold text-cyan-50 capitalize ">
                  Active classes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="group cursor-pointer hover:bg-cyan-50/30 transition-colors"
                  onClick={() => navigate(`/teachers/${row.id}`)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-cyan-700 flex items-center justify-center text-white text-[10px] font-bold uppercase shadow-sm group-hover:scale-110 transition-transform">
                        {getInitials(row.fullName)}
                      </div>
                      <span className="text-sm font-bold text-neutral-800 capitalize">
                        {row.fullName?.toLowerCase()}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-sm font-medium text-neutral-500">
                    {row.user?.email || "—"}
                  </td>
                  <td className="py-4 px-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold capitalize tracking-wider border border-neutral-100 bg-neutral-50 text-neutral-500">
                      {row.gender?.toLowerCase() || "—"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1.5">
                      {row.classAssignments?.filter((ca) => ca.isActive)
                        .length > 0 ? (
                        row.classAssignments
                          .filter((ca) => ca.isActive)
                          .map((ca, idx) => (
                            <span
                              key={idx}
                              className="text-sm font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md capitalize"
                            >
                              {ca.className?.toLowerCase()}
                            </span>
                          ))
                      ) : (
                        <span className="text-[10px] font-bold text-neutral-300 capitalize italic">
                          No active classes
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-20 text-center">
                    <p className="text-sm font-bold text-neutral-400 capitalize">
                      No teachers found matching your search
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modals */}
      {addModal.open && (
        <AddTeacherForm
          isOpen={addModal.open}
          isClose={() => setAddModal({ open: false })}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, subtext }) {
  return (
    <div className="rounded-2xl  border border-neutral-100 bg-white p-6 shadow-sm flex items-center gap-5 transition-all hover:shadow-md group">
      <div className="h-12 w-12 rounded-2xl bg-cyan-800 flex items-center justify-center text-cyan-50 font-bold text-lg group-hover:bg-cyan-500 group-hover:text-white transition-colors">
        {value}
      </div>
      <div>
        <p className="text-sm font-bold text-neutral-800 capitalize">{label}</p>
        <p className="text-[9px] font-bold text-neutral-400 capitalize tracking-tighter mt-0.5">
          {subtext}
        </p>
      </div>
    </div>
  );
}
