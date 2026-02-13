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
  const grades = useSelector((state) => state.grades.grades);
  const teachers = useSelector((state) => state.teachers.teachers);

  const ROLE_OPTIONS = ["Class Teacher", "Assistant Class Teacher"];

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([dispatch(getAllGrades()), dispatch(getTeachers())]);
      setLoading(false);
    };
    loadData();
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

  const handleSave = async () => {
    if (!form.gradeId || (!isTeacher && !form.teacherId)) {
      setErrors({ open: true, msg: "Please fill in all required fields." });
      return;
    }

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
      if (onSave) await onSave({});
    } catch (error) {
      setErrors({
        open: true,
        msg:
          error?.response?.data || error?.message || "Failed to assign class.",
      });
    } finally {
      setSaving(false);
    }
  };

  const selectClasses =
    "mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all disabled:opacity-50 disabled:bg-slate-100";

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Assign class to teacher"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <Button
              type="submit"
              onClick={handleSave}
              bgcolor="bg-cyan-600 hover:bg-cyan-700 px-8 rounded-xl shadow-lg shadow-cyan-900/10"
              disabled={saving}
              label={saving ? "Assigning..." : "Assign class"}
            />
          </div>
        }
      >
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
            <span className="ml-3 text-sm font-medium text-slate-500">
              Loading curriculum data...
            </span>
          </div>
        ) : (
          <div className="space-y-5 py-2">
            {!isTeacher && (
              <Field label="Select teacher">
                <select
                  value={form.teacherId}
                  onChange={(e) => setField("teacherId", e.target.value)}
                  className={selectClasses}
                >
                  <option value="">Choose a teacher</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Field label="Grade level">
                <select
                  value={form.gradeId}
                  onChange={(e) => setField("gradeId", e.target.value)}
                  className={selectClasses}
                >
                  <option value="">Select grade</option>
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      Grade {g.gradeName}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Class name">
                <select
                  value={form.classNameId}
                  onChange={(e) => setField("classNameId", e.target.value)}
                  className={selectClasses}
                  disabled={!form.gradeId}
                >
                  <option value="">Select class</option>
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
            </div>

            <Field label="Role assignment (optional)">
              <select
                value={form.role}
                onChange={(e) => setField("role", e.target.value)}
                className={selectClasses}
              >
                <option value="">Select a role</option>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Additional notes">
              <textarea
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                rows={3}
                placeholder="e.g. Primary contact for parent-teacher meetings"
                className={`${selectClasses} resize-none`}
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
    <div className="w-full">
      <label className="block text-sm font-bold text-slate-700 ml-1 mb-1">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm font-medium text-rose-600 ml-1">{error}</p>
      )}
    </div>
  );
}
