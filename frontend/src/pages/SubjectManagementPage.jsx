import React, { useMemo, useState } from "react";
import Button from "../components/CommonElements/Button";

export default function SubjectManagementPage() {
  const [query, setQuery] = useState("");
  const [addModal, setAddModal] = useState({ open: false });
  const [editModal, setEditModal] = useState({ open: false, subject: null });
  const [assignModal, setAssignModal] = useState({
    open: false,
    subjectId: null,
  });

  // Grades 1–13
  const grades = useMemo(() => Array.from({ length: 13 }, (_, i) => i + 1), []);

  // Sample subjects
  const [subjects, setSubjects] = useState([
    { id: "math", name: "Mathematics", code: "MATH", grades: [8, 9, 10] },
    { id: "sci", name: "Science", code: "SCI", grades: [8, 9] },
    { id: "eng", name: "English", code: "ENG", grades: [8, 9, 10, 11] },
  ]);

  const filtered = useMemo(() => {
    return subjects.filter((s) => {
      return query
        ? [s.name, s.code].some((f) =>
            f.toLowerCase().includes(query.toLowerCase())
          )
        : true;
    });
  }, [subjects, query]);

  const openAdd = () => setAddModal({ open: true });
  const closeAdd = () => setAddModal({ open: false });
  const saveAdd = (payload) => {
    setSubjects((list) => [
      {
        id: payload.code.toLowerCase(),
        name: payload.name,
        code: payload.code.toUpperCase(),
        grades: [],
      },
      ...list,
    ]);
    closeAdd();
  };

  const openEdit = (row) => setEditModal({ open: true, subject: row });
  const closeEdit = () => setEditModal({ open: false, subject: null });
  const saveEdit = (up) => {
    setSubjects((list) =>
      list.map((s) =>
        s.id === up.id
          ? { ...s, name: up.name, code: up.code.toUpperCase() }
          : s
      )
    );
    closeEdit();
  };

  const openAssign = (row) => setAssignModal({ open: true, subjectId: row.id });
  const closeAssign = () => setAssignModal({ open: false, subjectId: null });
  const saveAssign = (selectedGrades) => {
    setSubjects((list) =>
      list.map((s) =>
        s.id === assignModal.subjectId ? { ...s, grades: selectedGrades } : s
      )
    );
    closeAssign();
  };

  const currentGrades =
    subjects.find((s) => s.id === assignModal.subjectId)?.grades || [];

  return (
    <div>
      {/* Header */}
      <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Subject Management
          </h1>
          <p className="text-sm text-neutral-700">
            Manage subjects and assign them to grades
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            placeholder="Search by name or code"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
          <Button label="Add Subject" onClick={openAdd} />
        </div>
      </header>

      {/* Table */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-800">
                <th className="border-b border-gray-200 py-2 px-3">Name</th>
                <th className="border-b border-gray-200 py-2 px-3">Code</th>
                <th className="border-b border-gray-200 py-2 px-3">
                  Assigned Grades
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
                    {row.code}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3 truncate max-w-[280px]">
                    {row.grades.length ? row.grades.join(", ") : "-"}
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
                        Assign to Grades
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    className="py-10 text-center text-neutral-600"
                    colSpan={4}
                  >
                    No subjects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modals */}
      {addModal.open && <AddSubjectModal onClose={closeAdd} onSave={saveAdd} />}

      {editModal.open && (
        <EditSubjectModal
          subject={editModal.subject}
          onClose={closeEdit}
          onSave={saveEdit}
        />
      )}

      {assignModal.open && (
        <AssignGradesModal
          grades={grades}
          selected={currentGrades}
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

function AddSubjectModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  return (
    <ModalShell
      title="Add Subject"
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Cancel
          </button>
          <Button label="Add" onClick={() => onSave({ name, code })} />
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Subject Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Code
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
      </div>
    </ModalShell>
  );
}

function EditSubjectModal({ subject, onClose, onSave }) {
  const [name, setName] = useState(subject?.name || "");
  const [code, setCode] = useState(subject?.code || "");

  return (
    <ModalShell
      title="Edit Subject"
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
            onClick={() => onSave({ ...subject, name, code })}
          />
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Subject Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Code
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
      </div>
    </ModalShell>
  );
}

function AssignGradesModal({ grades, selected, onClose, onSave }) {
  const [picked, setPicked] = useState(selected);
  const toggle = (n) => {
    setPicked((list) =>
      list.includes(n) ? list.filter((x) => x !== n) : [...list, n]
    );
  };

  return (
    <ModalShell
      title="Assign Subject to Grades"
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Cancel
          </button>
          <Button label="Save" onClick={() => onSave(picked)} />
        </>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        {grades.map((g) => (
          <label
            key={g}
            className="flex items-center gap-2 text-sm text-neutral-800"
          >
            <input
              type="checkbox"
              checked={picked.includes(g)}
              onChange={() => toggle(g)}
            />
            Grade {g}
          </label>
        ))}
      </div>
    </ModalShell>
  );
}
