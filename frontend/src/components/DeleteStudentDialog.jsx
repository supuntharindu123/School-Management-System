import React, { useMemo, useState } from "react";
import Modal from "./modal";
import { deleteStudent } from "../features/adminFeatures/students/studentApi";

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
    // Require typing the exact Student ID Number to confirm
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

  return (
    <Modal open={open} onClose={onClose} title="Delete Student">
      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          This action is permanent and cannot be undone. The student's record
          will be removed.
        </div>
        <div className="text-sm text-neutral-800">
          <p className="mb-2">
            To confirm deletion, type the student's ID number below:
          </p>
          <p className="mb-2 font-semibold">
            {requiredText || "(ID not available)"}
          </p>
          <input
            value={confirmValue}
            onChange={(e) => setConfirmValue(e.target.value)}
            placeholder="Enter student ID number to confirm"
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-rose-600"
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-neutral-800 hover:border-neutral-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!canDelete || loading}
            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
