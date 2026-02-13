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

    try {
      setLoading(true);
      const msg = await updateStudent(student.id, form);
      setSuccess({
        open: true,
        msg:
          typeof msg === "string"
            ? msg
            : "Student details updated successfully",
      });
      // trigger the refresh in the parent list
      if (onSaved) onSaved();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update student";
      setError({ open: true, msg });
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    "mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all";
  const labelClasses = "block text-sm font-bold text-slate-700 ml-1";

  return (
    <>
      <Modal title="Edit student details" open={open} onClose={onClose}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
            <header className="bg-slate-50/50 px-5 py-3 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">
                Update information
              </h3>
              <span className="text-sm font-medium text-slate-400 font-mono">
                id: {student?.studentIDNumber || "---"}
              </span>
            </header>

            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={labelClasses}>Home address*</label>
                <input
                  name="Address"
                  value={form.Address}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Street address"
                />
              </div>

              <div>
                <label className={labelClasses}>City*</label>
                <input
                  name="City"
                  value={form.City}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="e.g. Colombo"
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

              <div>
                <label className={labelClasses}>Guardian name*</label>
                <input
                  name="GuardianName"
                  value={form.GuardianName}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className={labelClasses}>Relation</label>
                <input
                  name="GuardianRelation"
                  value={form.GuardianRelation}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder="Parent / Relative"
                />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all"
            >
              Discard
            </button>
            <Button
              type="submit"
              disabled={loading}
              label={loading ? "Updating..." : "Update details"}
              bgcolor="bg-cyan-600 hover:bg-cyan-700 px-8 rounded-xl shadow-lg shadow-cyan-900/10"
            />
          </div>
        </form>
      </Modal>

      {/* integrated alerts */}
      <SuccessAlert
        isOpen={success.open}
        message={success.msg}
        onClose={() => {
          setSuccess({ open: false, msg: "" });
          onClose();
        }}
      />

      <ErrorAlert
        isOpen={error.open}
        message={error.msg}
        onClose={() => setError({ open: false, msg: "" })}
      />
    </>
  );
}
