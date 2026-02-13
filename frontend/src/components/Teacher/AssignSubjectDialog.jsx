import React, { useEffect, useState } from "react";
import { getClassesByGrade } from "../../features/class/classService";
import { getAllGrades } from "../../features/grade/gradeSlice";
import { getAllSubjects } from "../../features/subject/subjectSlice";
import { useDispatch, useSelector } from "react-redux";
import { getTeachers } from "../../features/adminFeatures/teachers/teacherSlice";
import Button from "../CommonElements/Button";
import Modal from "../modal";
import { assignSubjectToTeacher } from "../../features/adminFeatures/teachers/teacherService";

export default function AssignSubjectDialog({
  teacherId,
  gradeId,
  classId,
  isTeacher = true,
  onClose,
  onSave,
  open = true,
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
  const grades = useSelector((state) => state.grades.grades);
  const subjects = useSelector((state) => state.subjects.subjects);
  const teachers = useSelector((state) => state.teachers.teachers || []);

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        dispatch(getAllGrades()),
        dispatch(getAllSubjects()),
        dispatch(getTeachers()),
      ]);
      setLoading(false);
    };
    init();
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

  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: null }));
  };

  const validate = () => {
    const e = {};
    if (!isTeacher && !form.teacherId) e.teacherId = "Required";
    if (!form.subjectId) e.subjectId = "Required";
    if (!form.classId) e.classId = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await assignSubjectToTeacher({
        teacherId: Number(teacherId) || Number(form.teacherId),
        subjectId: Number(form.subjectId),
        classId: Number(form.classId) || Number(classId),
        isActive: Boolean(form.isActive),
        description: form.description || null,
      });
      if (onSave) await onSave();
    } catch (err) {
      console.error("Assignment failed", err);
    } finally {
      setSaving(false);
    }
  };

  const selectClasses =
    "mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all disabled:opacity-50";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assign subject to teacher"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            Cancel
          </button>
          <Button
            label={saving ? "Saving..." : "Assign subject"}
            onClick={handleSave}
            disabled={saving}
            bgcolor="bg-cyan-600 hover:bg-cyan-700 px-8 rounded-xl shadow-lg shadow-cyan-900/10"
          />
        </div>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-600 border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-5 py-2">
          {!isTeacher && (
            <Field label="Target teacher" error={errors.teacherId}>
              <select
                value={form.teacherId}
                onChange={(e) => setField("teacherId", e.target.value)}
                className={selectClasses}
              >
                <option value="">Select teacher</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName}
                  </option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Subject*" error={errors.subjectId}>
            <select
              value={form.subjectId}
              onChange={(e) => setField("subjectId", e.target.value)}
              className={selectClasses}
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.subjectName || s.name}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Filter by grade">
              <select
                value={form.gradeId}
                onChange={(e) => setField("gradeId", e.target.value)}
                className={selectClasses}
              >
                <option value="">All grades</option>
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>
                    Grade {g.gradeName}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Target class*" error={errors.classId}>
              <select
                value={form.classId}
                onChange={(e) => setField("classId", e.target.value)}
                className={selectClasses}
                disabled={!form.gradeId}
              >
                <option value="">Select class</option>
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
          </div>

          <div className="flex items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setField("isActive", e.target.checked)}
                className="w-5 h-5 rounded-lg border-slate-300 text-cyan-600 focus:ring-cyan-600/20 transition-all"
              />
              <span className="text-sm font-bold text-slate-700">
                Set as active assignment
              </span>
            </label>
          </div>

          <Field label="Internal notes (optional)">
            <textarea
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              rows={3}
              placeholder="Add specific instructions for this teacher-subject pairing..."
              className={`${selectClasses} resize-none`}
            />
          </Field>
        </div>
      )}
    </Modal>
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
