import React, { useState } from "react";
import Button from "../CommonElements/Button";
import Modal from "../modal";

export default function AddSubjectModal({ open = true, onClose, onSave }) {
  const [SubjectName, setSubjectName] = useState("");
  const [ModuleCode, setModuleCode] = useState("");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Subject"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Cancel
          </button>
          <Button
            label="Add"
            onClick={() => onSave({ SubjectName, ModuleCode })}
          />
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Subject Name
          </label>
          <input
            value={SubjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Code
          </label>
          <input
            value={ModuleCode}
            onChange={(e) => setModuleCode(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
      </div>
    </Modal>
  );
}
