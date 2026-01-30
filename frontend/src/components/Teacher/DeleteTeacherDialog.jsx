import React, { useState } from "react";
import Modal from "../modal";
import { deleteTeacher } from "../../features/adminFeatures/teachers/teacherService";

export default function DeleteTeacherDialog({
  open,
  onClose,
  teacher,
  onDeleted,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!teacher?.id) return;
    setError("");
    try {
      setLoading(true);
      await deleteTeacher(teacher.id);
      onDeleted?.();
      onClose?.();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete teacher";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Teacher"
      footer={
        <>
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
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm ${loading ? "bg-rose-300 text-white" : "bg-rose-600 text-white hover:bg-rose-700"}`}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </>
      }
    >
      {error && (
        <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}
      <p className="text-sm text-neutral-800">
        Are you sure you want to delete this teacher
        {teacher?.fullName ? ` (${teacher.fullName})` : ""}? This action cannot
        be undone.
      </p>
    </Modal>
  );
}
