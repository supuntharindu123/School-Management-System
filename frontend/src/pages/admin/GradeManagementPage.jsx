import React, { useState } from "react";
import Button from "../../components/CommonElements/Button";

export default function GradeManagementPage() {
  const initialGrades = Array.from({ length: 13 }, (_, i) => ({
    id: i + 1,
    number: i + 1,
    subjects: [],
  }));
  const [grades, setGrades] = useState(initialGrades);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState({ open: false, gradeId: null });

  const subjects = [
    { id: "math", name: "Mathematics" },
    { id: "sci", name: "Science" },
    { id: "eng", name: "English" },
    { id: "hist", name: "History" },
    { id: "geo", name: "Geography" },
  ];

  const filtered = grades.filter((g) =>
    query ? String(g.number).includes(query) : true
  );

  const openAssign = (gradeId) => setModal({ open: true, gradeId });
  const closeAssign = () => setModal({ open: false, gradeId: null });
  const saveAssign = (selected) => {
    setGrades((list) =>
      list.map((g) =>
        g.id === modal.gradeId ? { ...g, subjects: selected } : g
      )
    );
    closeAssign();
  };

  const currentSubjects =
    grades.find((g) => g.id === modal.gradeId)?.subjects || [];

  return (
    <div>
      {/* Header */}
      <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Grade Management
          </h1>
          <p className="text-sm text-neutral-700">
            Manage grades (1–13) and assign subjects
          </p>
        </div>
        <input
          placeholder="Search by grade number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
        />
      </header>

      {/* Table */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-800">
                <th className="border-b border-gray-200 py-2 px-3">Grade</th>
                <th className="border-b border-gray-200 py-2 px-3">
                  Assigned Subjects
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
                    {row.number}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3 truncate max-w-[340px]">
                    {row.subjects.length ? row.subjects.join(", ") : "-"}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openAssign(row.id)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-neutral-800 hover:border-teal-600 hover:text-teal-600"
                      >
                        Assign Subjects
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {modal.open && (
        <AssignSubjectsModal
          subjects={subjects}
          selected={currentSubjects}
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

function AssignSubjectsModal({ subjects, selected, onClose, onSave }) {
  const [picked, setPicked] = useState(selected);
  const toggle = (id) => {
    setPicked((list) =>
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
    );
  };

  return (
    <ModalShell
      title="Assign Subjects to Grade"
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
      <div className="space-y-2">
        {subjects.map((s) => (
          <label
            key={s.id}
            className="flex items-center gap-2 text-sm text-neutral-800"
          >
            <input
              type="checkbox"
              checked={picked.includes(s.id)}
              onChange={() => toggle(s.id)}
            />
            {s.name}
          </label>
        ))}
      </div>
    </ModalShell>
  );
}
