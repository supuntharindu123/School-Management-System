import React, { useMemo, useState } from "react";
import Button from "../components/CommonElements/Button";

export default function TeacherListPage() {
  const [year, setYear] = useState("2025-2026");
  const [query, setQuery] = useState("");
  const [assignModal, setAssignModal] = useState({
    open: false,
    teacherId: null,
  });
  const [editModal, setEditModal] = useState({ open: false, teacher: null });
  const [addModal, setAddModal] = useState({ open: false });

  const years = ["2024-2025", "2025-2026"];

  const classesByYear = {
    "2024-2025": [
      { id: "8A", name: "Grade 8 - A" },
      { id: "8B", name: "Grade 8 - B" },
      { id: "9A", name: "Grade 9 - A" },
    ],
    "2025-2026": [
      { id: "8A", name: "Grade 8 - A" },
      { id: "8C", name: "Grade 8 - C" },
      { id: "9B", name: "Grade 9 - B" },
    ],
  };

  const subjects = [
    { id: "math", name: "Mathematics" },
    { id: "sci", name: "Science" },
    { id: "eng", name: "English" },
  ];

  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      status: "Active",
      assigned: {
        year: "2025-2026",
        classes: ["8A"],
        subjects: ["math", "eng"],
      },
    },
    {
      id: 2,
      name: "Marina Patel",
      email: "marina.patel@example.com",
      status: "Inactive",
      assigned: { year: "2024-2025", classes: ["9A"], subjects: ["sci"] },
    },
  ]);

  const filtered = useMemo(() => {
    return teachers.filter((t) => {
      const matchesQuery = query
        ? [t.name, t.email].some((f) =>
            f.toLowerCase().includes(query.toLowerCase())
          )
        : true;
      return matchesQuery;
    });
  }, [teachers, query]);

  const onDeactivate = (row) => {
    setTeachers((list) =>
      list.map((t) =>
        t.id === row.id
          ? { ...t, status: t.status === "Active" ? "Inactive" : "Active" }
          : t
      )
    );
  };

  const openAssign = (row) => setAssignModal({ open: true, teacherId: row.id });
  const closeAssign = () => setAssignModal({ open: false, teacherId: null });

  const saveAssign = (payload) => {
    setTeachers((list) =>
      list.map((t) =>
        t.id === assignModal.teacherId
          ? {
              ...t,
              assigned: {
                year,
                classes: payload.classes,
                subjects: payload.subjects,
              },
            }
          : t
      )
    );
    closeAssign();
  };

  const openEdit = (row) => setEditModal({ open: true, teacher: row });
  const closeEdit = () => setEditModal({ open: false, teacher: null });
  const saveEdit = (up) => {
    setTeachers((list) =>
      list.map((t) => (t.id === up.id ? { ...t, ...up } : t))
    );
    closeEdit();
  };

  const openAdd = () => setAddModal({ open: true });
  const closeAdd = () => setAddModal({ open: false });
  const saveAdd = (up) => {
    setTeachers((list) => [
      {
        ...up,
        id: Math.max(...list.map((x) => x.id)) + 1,
        status: "Active",
        assigned: { year, classes: [], subjects: [] },
      },
      ...list,
    ]);
    closeAdd();
  };

  const assignableClasses = classesByYear[year] || [];

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
                <th className="border-b border-gray-200 py-2 px-3">Status</th>
                <th className="border-b border-gray-200 py-2 px-3">
                  Assigned (Year)
                </th>
                <th className="border-b border-gray-200 py-2 px-3">Classes</th>
                <th className="border-b border-gray-200 py-2 px-3">Subjects</th>
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
                    {row.email}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                        row.status === "Active"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : "bg-gray-100 text-neutral-700 border-gray-200"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {row.assigned?.year || "-"}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3 truncate max-w-[220px]">
                    {row.assigned?.classes?.length
                      ? row.assigned.classes.join(", ")
                      : "-"}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3 truncate max-w-[220px]">
                    {row.assigned?.subjects?.length
                      ? row.assigned.subjects.join(", ")
                      : "-"}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(row)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-neutral-800 hover:border-teal-600 hover:text-teal-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openAssign(row)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-neutral-800 hover:border-teal-600 hover:text-teal-600"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => onDeactivate(row)}
                        className={`rounded-lg px-3 py-1.5 text-xs border ${
                          row.status === "Active"
                            ? "border-rose-200 text-rose-700 bg-rose-50 hover:border-rose-400"
                            : "border-teal-200 text-teal-700 bg-teal-50 hover:border-teal-400"
                        }`}
                      >
                        {row.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    className="py-10 text-center text-neutral-600"
                    colSpan={7}
                  >
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Assign Modal */}
      {assignModal.open && (
        <AssignModal
          onClose={closeAssign}
          onSave={saveAssign}
          year={year}
          classes={assignableClasses}
          subjects={subjects}
        />
      )}

      {/* Edit Modal */}
      {editModal.open && (
        <EditTeacherModal
          teacher={editModal.teacher}
          onClose={closeEdit}
          onSave={saveEdit}
        />
      )}

      {/* Add Modal */}
      {addModal.open && <AddTeacherModal onClose={closeAdd} onSave={saveAdd} />}
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

function AssignModal({ onClose, onSave, year, classes, subjects }) {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const toggle = (setFn, list, id) => {
    setFn(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  return (
    <ModalShell
      title={`Assign Classes & Subjects (${year})`}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Cancel
          </button>
          <Button
            label="Save"
            onClick={() =>
              onSave({ classes: selectedClasses, subjects: selectedSubjects })
            }
          />
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-neutral-800">Classes</p>
          <div className="mt-2 space-y-2">
            {classes.map((c) => (
              <label
                key={c.id}
                className="flex items-center gap-2 text-sm text-neutral-800"
              >
                <input
                  type="checkbox"
                  checked={selectedClasses.includes(c.id)}
                  onChange={() =>
                    toggle(setSelectedClasses, selectedClasses, c.id)
                  }
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-800">Subjects</p>
          <div className="mt-2 space-y-2">
            {subjects.map((s) => (
              <label
                key={s.id}
                className="flex items-center gap-2 text-sm text-neutral-800"
              >
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(s.id)}
                  onChange={() =>
                    toggle(setSelectedSubjects, selectedSubjects, s.id)
                  }
                />
                {s.name}
              </label>
            ))}
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function EditTeacherModal({ teacher, onClose, onSave }) {
  const [name, setName] = useState(teacher?.name || "");
  const [email, setEmail] = useState(teacher?.email || "");

  return (
    <ModalShell
      title="Edit Teacher"
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Cancel
          </button>
          <Button
            label="Save"
            onClick={() => onSave({ ...teacher, name, email })}
          />
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Full Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
      </div>
    </ModalShell>
  );
}

function AddTeacherModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <ModalShell
      title="Add Teacher"
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Cancel
          </button>
          <Button label="Add" onClick={() => onSave({ name, email })} />
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Full Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
      </div>
    </ModalShell>
  );
}
