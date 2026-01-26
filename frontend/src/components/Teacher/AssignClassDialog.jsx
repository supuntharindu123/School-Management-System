import React, { useEffect, useState } from "react";
import { getGrades } from "../../features/grade/gradeService";
import { getClassesByGrade } from "../../features/class/classService";
import { useDispatch, useSelector } from "react-redux";
import { getAllGrades } from "../../features/grade/gradeSlice";

export default function AssignClassDialog({ teacherId, onClose, onSave }) {
  //   const [grades, setGrades] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    gradeId: "",
    classNameId: "",
    role: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dispatch = useDispatch();

  const gradesList = useSelector((state) => state.grades);
  const grades = gradesList.grades;

  const ROLE_OPTIONS = ["Class Teacher", "Assistant Class Teacher"];

  useEffect(() => {
    dispatch(getAllGrades());
    setLoading(false);
  }, [dispatch]);

  //   useEffect(() => {
  //     let mounted = true;
  //     (async () => {
  //       try {
  //         const gs = await getGrades();
  //         if (mounted) {
  //           setGrades(gs || []);
  //           setLoading(false);
  //         }
  //       } catch (err) {
  //         setLoading(false);
  //       }
  //     })();
  //     return () => {
  //       mounted = false;
  //     };
  //   }, []);

  useEffect(() => {
    (async () => {
      if (!form.gradeId) {
        setClasses([]);
        setForm((f) => ({ ...f, classNameId: "" }));
        return;
      }
      const clz = await getClassesByGrade(Number(form.gradeId));
      setClasses(Array.isArray(clz) ? clz : []);
    })();
  }, [form.gradeId]);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.gradeId) e.gradeId = "Grade is required";
    // Class optional according to DTO; validate if you want to enforce
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        teacherId: Number(teacherId),
        gradeId: Number(form.gradeId),
        classNameId: form.classNameId ? Number(form.classNameId) : 0,
        role: form.role || null,
        description: form.description || null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold text-neutral-900">Assign Class</p>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-xs text-neutral-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
        <div className="p-4">
          {loading ? (
            <p className="text-sm text-neutral-700">Loading...</p>
          ) : (
            <div className="space-y-3">
              <Field label="Grade" error={errors.gradeId}>
                <select
                  value={form.gradeId}
                  onChange={(e) => setField("gradeId", e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="">Select</option>
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      Grade {g.gradeName}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Class">
                <select
                  value={form.classNameId}
                  onChange={(e) => setField("classNameId", e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  disabled={!form.gradeId}
                >
                  <option value="">Select</option>
                  {classes.map((c) => (
                    <option
                      key={c.classNameId ?? c.id}
                      value={c.classNameId ?? c.id}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Role (optional)">
                <select
                  value={form.role}
                  onChange={(e) => setField("role", e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="">Select</option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Description (optional)">
                <textarea
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </Field>
            </div>
          )}
        </div>
        <div className="border-t px-4 py-3 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`rounded-lg px-3 py-2 text-sm ${saving ? "bg-teal-300 text-white" : "bg-teal-600 text-white hover:bg-teal-700"}`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-800">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-700">{error}</p>}
    </div>
  );
}
