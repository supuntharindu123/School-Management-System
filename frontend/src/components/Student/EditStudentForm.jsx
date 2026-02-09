import React, { useEffect, useState } from "react";
import { updateStudent } from "../../features/adminFeatures/students/studentService";
import Button from "../CommonElements/Button";
import Modal from "../modal";
import ErrorAlert from "../ErrorAlert";
import SuccessAlert from "../SuccessAlert";

export default function EditStudentForm({ open, student, onClose, onSaved }) {
  const [form, setForm] = useState({
    Address: "",
    City: "",
    Gender: "",
    GuardianName: "",
    GuardianRelation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ open: false, msg: "" });
  const [success, setSuccess] = useState({ open: false, msg: "" });

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
    setError({ open: false, msg: "" });
    setSuccess({ open: false, msg: "" });

    const required = ["Address", "City", "Gender", "GuardianName"];
    const missing = required.filter((f) => !String(form[f] || "").trim());
    if (missing.length) {
      setError({
        open: true,
        msg: `Please fill required fields: ${missing.join(", ")}`,
      });
      return;
    }

    try {
      setLoading(true);
      const msg = await updateStudent(student.id, form);
      setSuccess({
        open: true,
        msg: typeof msg === "string" ? msg : "Student updated successfully",
      });
      onSaved;
    } catch (err) {
      const msg =
        err?.response?.message || err?.message || "Failed to update student";
      setError({ open: true, msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Edit Student Details" open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error.open && (
          <ErrorAlert
            message={error.msg}
            isOpen={error.open}
            onClose={() => setError({ open: false, msg: "" })}
          ></ErrorAlert>
        )}
        {success.open && (
          <SuccessAlert
            message={success.msg}
            isOpen={success.open}
            onClose={() => {
              setSuccess({ open: false, msg: "" });
              onClose();
            }}
          ></SuccessAlert>
        )}

        <section className="rounded-xl border border-gray-200 bg-white">
          <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h3 className="text-sm font-medium text-neutral-800">
              Edit Details
            </h3>
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
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
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
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
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
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-800">
                Guardian Name*
              </label>
              <input
                name="GuardianName"
                value={form.GuardianName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
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
                className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                placeholder="Parent / Relative"
              />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-2">
          <Button
            type="submit"
            disabled={loading}
            label={loading ? "Saving..." : "Save Changes"}
            bgcolor="bg-cyan-800"
          ></Button>
        </div>
      </form>
    </Modal>
  );
}
