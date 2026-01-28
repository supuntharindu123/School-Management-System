import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/CommonElements/Button";
import { getAllSubjects } from "../../features/subject/subjectSlice";
import { getAllGrades } from "../../features/grade/gradeSlice";
import {
  addSubject,
  assignSubjectGrades,
} from "../../features/subject/subjectService";

export default function SubjectManagementPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState({ open: false });
  const [assignModal, setAssignModal] = useState({
    open: false,
    subjectId: null,
  });
  const [subjects, setSubjects] = useState([]);
  const [assignSubmitting, setAssignSubmitting] = useState(false);

  const dispatch = useDispatch();

  const subjectsList = useSelector((state) => state.subjects);
  const gradesState = useSelector((state) => state.grades);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllSubjects());
    dispatch(getAllGrades());
  }, [dispatch]);

  useEffect(() => {
    if (subjectsList?.subjects) {
      setSubjects(subjectsList.subjects);
      setLoading(false);
    }
  }, [subjectsList.subjects]);

  // Loaded grades from API
  const grades = useMemo(() => gradesState?.grades || [], [gradesState.grades]);

  const filtered = useMemo(() => {
    return subjects.filter((s) => {
      return query
        ? [s.subjectName, s.moduleCode].some((f) =>
            f.toLowerCase().includes(query.toLowerCase()),
          )
        : true;
    });
  }, [subjects, query]);

  const openAdd = () => setAddModal({ open: true });
  const closeAdd = () => setAddModal({ open: false });
  const saveAdd = async (payload) => {
    try {
      const res = await addSubject(payload);
      console.log("Added subject:", res);
      setSubjects((list) => [
        {
          id: payload.ModuleCode.toLowerCase(),
          subjectName: payload.SubjectName,
          moduleCode: payload.ModuleCode.toUpperCase(),
          grades: [],
        },
        ...list,
      ]);
    } catch (err) {
      alert(err?.response?.data || err?.message || "Failed to add subject");
    }
    closeAdd();
  };

  const openAssign = (row) => setAssignModal({ open: true, subjectId: row.id });
  const closeAssign = () => setAssignModal({ open: false, subjectId: null });
  const saveAssign = async (selectedGradeIds) => {
    if (assignSubmitting) return;
    try {
      setAssignSubmitting(true);
      const payload = selectedGradeIds.map((gid) => ({
        subjectId: assignModal.subjectId,
        gradeId: gid,
      }));
      await assignSubjectGrades(payload);
      await dispatch(getAllSubjects());
      closeAssign();
    } catch (err) {
      alert(
        err?.response?.data ||
          err?.message ||
          "Failed to assign subject to grades",
      );
    } finally {
      setAssignSubmitting(false);
    }
  };

  const currentGrades = (
    subjects.find((s) => s.id === assignModal.subjectId)?.grades || []
  ).map((g) => g.id);

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
      {loading ? (
        <p>Loading subjects...</p>
      ) : (
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
                      {row.subjectName}
                    </td>
                    <td className="border-b border-gray-200 py-2 px-3">
                      {row.moduleCode}
                    </td>
                    <td className="border-b border-gray-200 py-2 px-3 truncate max-w-[280px]">
                      {row.grades.length
                        ? row.grades.map((g) => g.gradeName).join(", ")
                        : "-"}
                    </td>
                    <td className="border-b border-gray-200 py-2 px-3">
                      <div className="flex items-center justify-end gap-2">
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
      )}

      {/* Modals */}
      {addModal.open && <AddSubjectModal onClose={closeAdd} onSave={saveAdd} />}

      {assignModal.open && (
        <AssignGradesModal
          grades={grades}
          selected={currentGrades}
          onClose={closeAssign}
          onSave={saveAssign}
          submitting={assignSubmitting}
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
  const [SubjectName, setSubjectName] = useState("");
  const [ModuleCode, setModuleCode] = useState("");

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
          <Button
            label="Add"
            onClick={() => onSave({ SubjectName, ModuleCode })}
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
            value={SubjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Code
          </label>
          <input
            value={ModuleCode}
            onChange={(e) => setModuleCode(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
      </div>
    </ModalShell>
  );
}

function AssignGradesModal({ grades, selected, onClose, onSave, submitting }) {
  const [picked, setPicked] = useState(selected);
  const toggle = (id) => {
    setPicked((list) =>
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
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
          <Button
            label={submitting ? "Saving..." : "Save"}
            onClick={() => onSave(picked)}
            disabled={submitting}
          />
        </>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        {grades.map((g) => (
          <label
            key={g.id}
            className="flex items-center gap-2 text-sm text-neutral-800"
          >
            <input
              type="checkbox"
              checked={picked.includes(g.id)}
              onChange={() => toggle(g.id)}
            />
            Grade {g.gradeName}
          </label>
        ))}
      </div>
    </ModalShell>
  );
}
