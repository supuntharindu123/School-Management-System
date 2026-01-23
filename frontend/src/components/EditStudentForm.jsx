import React, { useEffect, useState } from "react";
import { updateStudent } from "../features/adminFeatures/students/studentService";

export default function EditStudentForm({ student, onSuccess }) {
  const [form, setForm] = useState({
    Address: "",
    City: "",
    Gender: "",
    GuardianName: "",
    GuardianRelation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (student) {
      setForm({
        Address: student.address || "",
        City: student.city || "",
        Gender: student.gender || "",
        GuardianName: student.guardianName || "",
        GuardianRelation: student.guardianRelation || "",
      });
    }
  }, [student]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const required = ["Address", "City", "Gender", "GuardianName"];
    const missing = required.filter((f) => !String(form[f] || "").trim());
    if (missing.length) {
      setError(`Please fill required fields: ${missing.join(", ")}`);
      return;
    }

    try {
      setLoading(true);
      const msg = await updateStudent(student.id, form);
      setSuccess(
        typeof msg === "string" ? msg : "Student updated successfully",
      );
      onSuccess?.(msg);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update student";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <section className="rounded-xl border border-gray-200 bg-white">
        <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 className="text-sm font-medium text-neutral-800">Edit Details</h3>
        </header>
        <div className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-neutral-800">
              Address*
            </label>
            <input
              name="Address"
              value={form.Address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
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
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Gender*
            </label>
            <input
              name="Gender"
              value={form.Gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
              placeholder="Male / Female"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Guardian Name*
            </label>
            <input
              name="GuardianName"
              value={form.GuardianName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Guardian Relation
            </label>
            <input
              name="GuardianRelation"
              value={form.GuardianRelation}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
              placeholder="Parent / Relative"
            />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
