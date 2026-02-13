import React, { useMemo, useState } from "react";
import Modal from "../modal";
import { deleteStudent } from "../../features/adminFeatures/students/studentService";

export default function DeleteStudentDialog({
  open,
  onClose,
  student,
  onDeleted,
}) {
  const [confirmValue, setConfirmValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const requiredText = useMemo(() => {
    return student?.studentIDNumber ? String(student.studentIDNumber) : "";
  }, [student]);

  const canDelete = requiredText && confirmValue.trim() === requiredText;

  async function handleDelete() {
    setError("");
    try {
      setLoading(true);
      await deleteStudent(student.id);
      onDeleted?.();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete student";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    "mt-3 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-600/20 focus:border-rose-600 transition-all";

  return (
    <Modal open={open} onClose={onClose} title="Delete student record">
      <div className="space-y-6">
        {/* error message alert */}
        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        {/* permanent action warning */}
        <div className="flex gap-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <div className="text-amber-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-amber-900 leading-relaxed">
            This action is permanent. The student record for{" "}
            <span className="font-bold">
              {student?.fullName || "this student"}
            </span>{" "}
            will be erased from the system forever.
          </p>
        </div>

        {/* confirmation input area */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5">
          <label className="block text-sm font-bold text-slate-700">
            Confirm identity
          </label>
          <p className="mt-1 text-sm text-slate-500">
            To confirm, please type the student id number:{" "}
            <span className="font-bold text-slate-900 select-all">
              {requiredText || "(id not found)"}
            </span>
          </p>

          <input
            value={confirmValue}
            onChange={(e) => setConfirmValue(e.target.value)}
            placeholder="Type id number here..."
            className={inputClasses}
          />
        </div>

        {/* action buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Go back
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!canDelete || loading}
            className={`rounded-xl px-8 py-2.5 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98] flex items-center gap-2
              ${
                !canDelete || loading
                  ? "bg-slate-300 shadow-none cursor-not-allowed"
                  : "bg-rose-600 hover:bg-rose-700 shadow-rose-900/10"
              }`}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              "Delete record"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
