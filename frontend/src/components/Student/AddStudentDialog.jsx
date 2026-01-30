import React, { useState } from "react";
import Modal from "../modal";
import AddStudentForm from "./AddStudentForm";

export default function AddStudentDialog({ open, onClose, onAdded }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    // Close dialog and trigger optional parent callback
    if (onAdded) onAdded();
    onClose?.();
    // reset inner form if dialog reopens
    setRefreshKey((k) => k + 1);
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Student">
      {/* key forces remount to clear state on close */}
      <AddStudentForm key={refreshKey} onSuccess={handleSuccess} />
    </Modal>
  );
}
