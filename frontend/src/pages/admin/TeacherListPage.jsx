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
    <div>
      {/* Header */}
      <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Teachers</h1>
          <p className="text-sm text-neutral-700">
            Manage teachers, assignments, and status
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
          <Button label="Add Teacher" onClick={openAdd} />
        </div>
      </header>

      {/* Table */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-800">
                <th className="border-b border-gray-200 py-2 px-3">Name</th>
                <th className="border-b border-gray-200 py-2 px-3">Email</th>
                <th className="border-b border-gray-200 py-2 px-3">Gender</th>
                <th className="border-b border-gray-200 py-2 px-3">Classes</th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50"
                  onClick={() => navigate(`/teachers/${row.id}`)}
                >
                  <td className="border-b border-gray-200 py-2 px-3 font-medium">
                    <button className="text-teal-700 hover:underline hover:text-teal-800">
                      {row.fullName}
                    </button>
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {row.user.email}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {row.gender}
                  </td>
                  <AssignmentsCells teacherId={row.id} />
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

// Fetch and render class/subject assignments per teacher as two cells
function AssignmentsCells({ teacherId }) {
  const { classes, loading } = useTeacherAssignments(teacherId);

  const classesText =
    classes && classes.length
      ? classes
          .map((c) => c.className || c.ClassName || c.name)
          .filter(Boolean)
          .join(", ")
      : "—";

  return (
    <>
      <td className="border-b border-gray-200 py-2 px-3">
        {loading ? "Loading..." : classesText}
      </td>
    </>
  );
}

function useTeacherAssignments(teacherId) {
  const [state, setState] = useState({ classes: [], loading: true });

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!teacherId) {
        if (alive) setState({ classes: [], subjects: [], loading: false });
        return;
      }
      try {
        const cls = await getClassAssignmentsForTeacher(teacherId);
        if (alive)
          setState({ classes: Array.isArray(cls) ? cls : [], loading: false });
      } catch {
        if (alive) setState({ classes: [], loading: false });
      }
    }
    load();
    return () => {
      alive = false;
    };
  }, [teacherId]);

  return state;
}
