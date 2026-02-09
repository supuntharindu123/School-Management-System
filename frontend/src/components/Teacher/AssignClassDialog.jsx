import React, { useEffect, useState } from "react";
import { getClassesByGrade } from "../../features/class/classService";
import { useDispatch, useSelector } from "react-redux";
import { getAllGrades } from "../../features/grade/gradeSlice";
import { getTeachers } from "../../features/adminFeatures/teachers/teacherSlice";
import Button from "../CommonElements/Button";
import SuccessAlert from "../SuccessAlert";
import { assignClassToTeacher } from "../../features/adminFeatures/teachers/teacherService";
import ErrorAlert from "../ErrorAlert";
import Modal from "../modal";

export default function AssignClassDialog({
  open = true,
  teacherId,
  gradeId,
  classNameId,
  isTeacher,
  onClose,
  onSave,
}) {
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    teacherId: teacherId || "",
    gradeId: gradeId || "",
    classNameId: classNameId || "",
    role: "",
    description: "",
  });
  const [errors, setErrors] = useState({ open: false, msg: "" });
  const [success, setSuccess] = useState({ open: false, msg: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const dispatch = useDispatch();

  const gradesList = useSelector((state) => state.grades);
  const grades = gradesList.grades;

  const teachersList = useSelector((state) => state.teachers);
  const teachers = teachersList.teachers;

  const ROLE_OPTIONS = ["Class Teacher", "Assistant Class Teacher"];

  useEffect(() => {
    dispatch(getAllGrades());
    dispatch(getTeachers());
    setLoading(false);
  }, [dispatch]);

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
    if (!form.gradeId) {
      setErrors({ open: true, msg: "Grade is required" });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await assignClassToTeacher({
        TeacherId: Number(teacherId) || Number(form.teacherId),
        Description: form.description || null,
        Role: form.role || null,
        ClassId: form.classNameId
          ? Number(form.classNameId)
          : Number(classNameId),
      });
      await onSave({});
    } catch (error) {
      setSuccess({ open: false, msg: "" });
      setErrors({
        open: true,
        msg:
          error?.response?.data ||
          error?.message ||
          "Failed to assign class. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Assign Class"
        footer={
          <>
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
            >
              Cancel
            </button>
            <Button
              type="submit"
              onClick={handleSave}
              bgcolor="bg-cyan-800"
              disabled={saving}
              label={saving ? "Saving..." : "Save"}
            ></Button>
          </>
        }
      >
        {loading ? (
          <p className="text-sm text-neutral-700">Loading...</p>
        ) : (
          <div className="space-y-3">
            {isTeacher ? null : (
              <Field label="Teacher">
                <select
                  value={form.teacherId}
                  onChange={(e) => setField("teacherId", e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  <option value="">Select</option>
                  {teachers.map((g) => (
                    <option key={g.id} value={g.id}>
                      Teacher {g.fullName}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            <Field label="Grade">
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
      </Modal>
      <SuccessAlert
        isOpen={success.open}
        message={success.msg}
        onClose={onClose}
      />

      <ErrorAlert
        isOpen={errors.open}
        message={errors.msg}
        onClose={() => setErrors({ open: false, msg: "" })}
      />
    </>
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
