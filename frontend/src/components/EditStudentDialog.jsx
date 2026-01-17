import React from "react";
import Modal from "./modal";
import EditStudentForm from "./EditStudentForm";

export default function EditStudentDialog({ open, onClose, student, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title="Edit Student">
      <EditStudentForm student={student} onSuccess={onSaved} />
    </Modal>
  );
}
