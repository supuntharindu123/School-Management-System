import React, { useEffect, useState } from "react";
import Modal from "../modal";
import {
  updateTeacher,
  getTeacherById,
} from "../../features/adminFeatures/teachers/teacherService";

export default function EditTeacherDialog({ open, onClose, teacher, onSaved }) {
  const [form, setForm] = useState({
    FullName: "",
    BirthDay: "",
    Address: "",
    City: "",
    Gender: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

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
      setError(`Please fill required fields: ${missing.join(", ")}`);
      return false;
    }
    setError("");
    return true;
  };

  const handleSave = async () => {
    if (!teacher?.id) return;
    if (!validate()) return;
    setSaving(true);
    try {
      await updateTeacher(teacher.id, form);
      onSaved ? onSaved() : null;
      onClose?.();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update teacher";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Teacher"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-neutral-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`rounded-lg px-3 py-2 text-sm ${saving ? "bg-teal-300 text-white" : "bg-teal-600 text-white hover:bg-teal-700"}`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </>
      }
    >
      {error && (
        <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Full Name*
          </label>
          <input
            name="FullName"
            value={form.FullName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Birth Day*
          </label>
          <input
            type="date"
            name="BirthDay"
            value={form.BirthDay}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-800">
            Address*
          </label>
          <input
            name="Address"
            value={form.Address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            City*
          </label>
          <input
            name="City"
            value={form.City}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Gender*
          </label>
          <select
            name="Gender"
            value={form.Gender}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </Modal>
  );
}
