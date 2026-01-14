import React, { useMemo, useState } from "react";
import Button from "../components/CommonElements/Button";

export default function ClassManagementPage() {
  const years = ["2024-2025", "2025-2026"];
  const [year, setYear] = useState("2025-2026");
  const [grade, setGrade] = useState(10);
  const [query, setQuery] = useState("");
  const [assignModal, setAssignModal] = useState({
    open: false,
    classId: null,
  });

  // Sample teachers list for assignment
  const teachers = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Marina Patel" },
    { id: 3, name: "Elena Garcia" },
  ];

  // Sample classes for a grade per year
  const baseSections = ["A", "B", "C"];
  const initialClasses = baseSections.map((sec, idx) => ({
    id: `${grade}${sec}`,
    name: `Grade ${grade} - ${sec}`,
    section: sec,
    year,
    teacher: null,
  }));

  const [classes, setClasses] = useState(initialClasses);

  // Recompute when year or grade changes
  React.useEffect(() => {
    setClasses(
      baseSections.map((sec) => ({
        id: `${grade}${sec}`,
        name: `Grade ${grade} - ${sec}`,
        section: sec,
        year,
        teacher: null,
      }))
    );
  }, [year, grade]);

  const filtered = useMemo(() => {
    return classes.filter((c) => {
      const matchesQuery = query
        ? c.name.toLowerCase().includes(query.toLowerCase())
        : true;
      return matchesQuery;
    });
  }, [classes, query]);

  const openAssign = (row) => setAssignModal({ open: true, classId: row.id });
  const closeAssign = () => setAssignModal({ open: false, classId: null });
  const saveAssign = (teacherId) => {
    const teacher = teachers.find((t) => t.id === teacherId) || null;
    setClasses((list) =>
      list.map((c) => (c.id === assignModal.classId ? { ...c, teacher } : c))
    );
    closeAssign();
  };

  return (
    <div>
      {/* Header */}
      <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Class Management
          </h1>
          <p className="text-sm text-neutral-700">
            Manage classes for each grade and assign class teachers
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-neutral-700">Academic Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-neutral-700">Grade</label>
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            >
              {Array.from({ length: 13 }, (_, i) => i + 1).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          <input
            placeholder="Search classes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
      </header>

      {/* Table */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-800">
                <th className="border-b border-gray-200 py-2 px-3">Class</th>
                <th className="border-b border-gray-200 py-2 px-3">
                  Academic Year
                </th>
                <th className="border-b border-gray-200 py-2 px-3">
                  Class Teacher
                </th>
                <th className="border-b border-gray-200 py-2 px-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-200 py-2 px-3 font-medium">
                    {row.name}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {row.year}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {row.teacher ? row.teacher.name : "-"}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openAssign(row)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-neutral-800 hover:border-teal-600 hover:text-teal-600"
                      >
                        Assign Teacher
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Assign Teacher Modal */}
      {assignModal.open && (
        <AssignTeacherModal
          teachers={teachers}
          onClose={closeAssign}
          onSave={saveAssign}
        />
      )}
    </div>
  );
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

function AssignTeacherModal({ teachers, onClose, onSave }) {
  const [picked, setPicked] = useState(null);
  return (
    <ModalShell
      title="Assign Class Teacher"
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Cancel
          </button>
          <Button label="Save" onClick={() => picked && onSave(picked)} />
        </>
      }
    >
      <div className="space-y-2">
        {teachers.map((t) => (
          <label
            key={t.id}
            className="flex items-center gap-2 text-sm text-neutral-800"
          >
            <input
              type="radio"
              name="teacher"
              checked={picked === t.id}
              onChange={() => setPicked(t.id)}
            />
            {t.name}
          </label>
        ))}
      </div>
    </ModalShell>
  );
}
