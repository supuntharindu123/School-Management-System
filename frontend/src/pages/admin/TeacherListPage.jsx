import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/CommonElements/Button";
import AddTeacherDialog from "../../components/Teacher/AddTeacherDialog";
import { createTeacher } from "../../features/adminFeatures/teachers/teacherService";
import { useDispatch, useSelector } from "react-redux";
import { getTeachers } from "../../features/adminFeatures/teachers/teacherSlice";
import { getClassAssignmentsForTeacher } from "../../features/adminFeatures/teachers/teacherService";

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

  const getInitials = (name) => {
    if (!name) return "T";
    const parts = String(name).trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const openAdd = () => setAddModal({ open: true });
  const closeAdd = () => setAddModal({ open: false });
  const saveAdd = async (dto) => {
    try {
      await createTeacher(dto);
      // Refresh via redux instead of local state setter
      dispatch(getTeachers());
      closeAdd();
    } catch (err) {
      console.error("Failed to add teacher:", err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <header className="mb-4 flex items-center justify-between bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-6 rounded-2xl px-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-50">Teachers</h1>
          <p className="text-sm text-cyan-50">
            Manage teachers, assignments, and status
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
          />
          <Button label="Add Teacher" onClick={openAdd} />
        </div>
      </header>

      {/* Table */}
      <section className="rounded-xl border border-gray-300 bg-white">
        <div className="max-h-[60vh] overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-800 bg-cyan-50">
                <th className="border-b border-cyan-200 py-2 px-3 sticky top-0">
                  Name
                </th>
                <th className="border-b border-cyan-200 py-2 px-3 sticky top-0">
                  Email
                </th>
                <th className="border-b border-cyan-200 py-2 px-3 sticky top-0">
                  Gender
                </th>
                <th className="border-b border-cyan-200 py-2 px-3 sticky top-0">
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
                    {row.user.email}
                  </td>
                  <td className="border-b border-cyan-200 py-2 px-3 inline-flex items-center text-xs font-medium ">
                    {row.gender}
                  </td>
                  <td className="border-b border-cyan-200 py-2 px-3 inline-flex items-center text-xs font-medium ">
                    {row.gender}
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
        <AddTeacherDialog onClose={closeAdd} onSave={saveAdd} />
      )}
    </div>
  );
}
