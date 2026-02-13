import React, { useEffect, useState } from "react";
import Modal from "../modal";
import Button from "../CommonElements/Button";
import ErrorAlert from "../ErrorAlert";
import { updateTeacher } from "../../features/adminFeatures/teachers/teacherService";

export default function EditTeacherDialog({ open, onClose, teacher, onSaved }) {
  const [form, setForm] = useState({
    FullName: "",
    BirthDay: "",
    Address: "",
    City: "",
    Gender: "",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({ open: false, msg: "" });

  useEffect(() => {
    if (teacher) {
      setForm({
        FullName: teacher.fullName || "",
        BirthDay: teacher.birthDay || "",
        Address: teacher.address || "",
        City: teacher.city || "",
        Gender: teacher.gender || "",
      });
    }
  }, [teacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const req = ["FullName", "BirthDay", "Address", "City", "Gender"];
    const missing = req.filter((k) => !String(form[k] || "").trim());
    if (missing.length) {
      setErrors({
        open: true,
        msg: "Please ensure all mandatory fields are completed before saving.",
      });
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!teacher?.id) return;
    if (!validate()) return;
    setSaving(true);
    try {
      await updateTeacher(teacher.id, form);
      if (onSaved) onSaved();
      onClose?.();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update teacher profile";
      setErrors({ open: true, msg });
    } finally {
      setSaving(false);
    }
  };

  const inputClasses =
    "mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all";
  const labelClasses = "block text-sm font-bold text-slate-700 ml-1";

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Update teacher profile"
        footer={
          <div className="flex items-center justify-end gap-3 w-full">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <Button
              label={saving ? "Saving..." : "Update profile"}
              onClick={handleSave}
              disabled={saving}
              bgcolor="bg-cyan-600 hover:bg-cyan-700 px-8 rounded-xl shadow-lg shadow-cyan-900/10"
            />
          </div>
        }
      >
        <div className="space-y-6 py-2">
          {/* descriptive context */}
          <div className="rounded-2xl bg-cyan-50/50 p-4 border border-cyan-100/50">
            <p className="text-sm text-cyan-800 leading-relaxed">
              <strong>teacher id:</strong> {teacher?.id || "n/a"} <br />
              updating information for <strong>{teacher?.fullName}</strong>.
              changes will take effect immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClasses}>Full name*</label>
              <input
                name="FullName"
                value={form.FullName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Date of birth*</label>
              <input
                type="date"
                name="BirthDay"
                value={form.BirthDay}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Gender*</label>
              <select
                name="Gender"
                value={form.Gender}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClasses}>Residential address*</label>
              <input
                name="Address"
                value={form.Address}
                onChange={handleChange}
                placeholder="Street address and area"
                className={inputClasses}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClasses}>City*</label>
              <input
                name="City"
                value={form.City}
                onChange={handleChange}
                placeholder="e.g. Colombo"
                className={inputClasses}
              />
            </div>
          </div>
        </div>
      </Modal>

      <ErrorAlert
        isOpen={errors.open}
        message={errors.msg}
        onClose={() => setErrors({ open: false, msg: "" })}
      />
    </>
  );
}
