import React, { useState } from "react";
import Modal from "../modal";
import AddTeacherForm from "./AddTeacherForm";

export default function AddTeacherDialog({ open, onClose, onSave, onAdded }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    onAdded?.();
    onClose?.();
    setRefreshKey((k) => k + 1);
  };

  const isOpen = typeof open === "boolean" ? open : true;

  return (
    <Modal open={isOpen} onClose={onClose} title="Add Teacher">
      <AddTeacherForm
        key={refreshKey}
        onSuccess={handleSuccess}
        onSave={onSave}
      />
    </Modal>
  );
}
