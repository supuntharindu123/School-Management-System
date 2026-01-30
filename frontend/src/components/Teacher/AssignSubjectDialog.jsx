import React, { useEffect, useState } from "react";

import { getClassesByGrade } from "../../features/class/classService";
import { getAllGrades } from "../../features/grade/gradeSlice";
import { getAllSubjects } from "../../features/subject/subjectSlice";
import { useDispatch, useSelector } from "react-redux";
import { getTeachers } from "../../features/adminFeatures/teachers/teacherSlice";

export default function AssignSubjectDialog({
  teacherId,
  gradeId,
  classId,
  isTeacher = true,
  onClose,
  onSave,
}) {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    teacherId: teacherId || "",
    subjectId: "",
    gradeId: gradeId || "",
    classId: classId || "",
    isActive: true,
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dispatch = useDispatch();

  const gradesList = useSelector((state) => state.grades);
  const grades = gradesList.grades;

  const subjectList = useSelector((state) => state.subjects);
  const subjects = subjectList.subjects;

  const teachersList = useSelector((state) => state.teachers);
  const teachers = teachersList.teachers || [];

  useEffect(() => {
    dispatch(getAllGrades());
    dispatch(getAllSubjects());
    dispatch(getTeachers());
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      if (!form.gradeId) {
        setClasses([]);
        setForm((f) => ({ ...f, classId: "" }));
        return;
      }
      const clz = await getClassesByGrade(Number(form.gradeId));
      setClasses(Array.isArray(clz) ? clz : []);
    })();
  }, [form.gradeId]);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!isTeacher && !form.teacherId) e.teacherId = "Teacher is required";
    if (!form.subjectId) e.subjectId = "Subject is required";
    if (!form.classId) e.classId = "Class is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        teacherId: Number(teacherId) || Number(form.teacherId),
        subjectId: Number(form.subjectId),
        classId: Number(form.classId) || Number(classId),
        isActive: Boolean(form.isActive),
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
          <p className="text-sm font-semibold text-neutral-900">
            Assign Subject
          </p>
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
            <div className="space-y-4">
              {isTeacher ? null : (
                <Field label="Teacher" error={errors.teacherId}>
                  <select
                    value={form.teacherId}
                    onChange={(e) => setField("teacherId", e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="">Select</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Subject" error={errors.subjectId}>
                  <select
                    value={form.subjectId}
                    onChange={(e) => setField("subjectId", e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="">Select</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.subjectName || s.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Grade (to filter classes)">
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
                <Field label="Class" error={errors.classId}>
                  <select
                    value={form.classId}
                    onChange={(e) => setField("classId", e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  >
                    <option value="">Select</option>
                    {classes.map((c) => (
                      <option
                        key={c.id ?? c.classNameId}
                        value={c.id ?? c.classNameId}
                      >
                        {c.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Active">
                  <label className="inline-flex items-center gap-2 text-sm text-neutral-800">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setField("isActive", e.target.checked)}
                    />
                    Is Active
                  </label>
                </Field>
              </div>
              <Field label="Description (optional)">
                <textarea
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  rows={4}
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
