import React, { useState } from "react";
import Button from "../CommonElements/Button";
import Modal from "../modal";

export default function AddSubjectModal({ open = true, onClose, onSave }) {
  const [subjectName, setSubjectName] = useState("");
  const [moduleCode, setModuleCode] = useState("");

  const inputClasses =
    "mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600/20 focus:border-cyan-600 transition-all";
  const labelClasses = "block text-sm font-bold text-slate-700 ml-1";

  const handleSave = () => {
    if (subjectName.trim() && moduleCode.trim()) {
      onSave({ SubjectName: subjectName, ModuleCode: moduleCode });
      setSubjectName("");
      setModuleCode("");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create new subject"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            Cancel
          </button>
          <Button
            label="Create subject"
            onClick={handleSave}
            bgcolor="bg-cyan-600 hover:bg-cyan-700 px-8 rounded-xl shadow-lg shadow-cyan-900/10"
          />
        </div>
      }
    >
      <div className="space-y-6 py-2">
        {/* descriptive header */}
        <div className="mb-2">
          <p className="text-sm text-slate-500">
            Enter the details below to add a new subject to the school
            curriculum.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClasses}>Subject name</label>
            <input
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g., Mathematics"
              className={inputClasses}
            />
          </div>

          <div>
            <label className={labelClasses}>Module code</label>
            <input
              value={moduleCode}
              onChange={(e) => setModuleCode(e.target.value)}
              placeholder="e.g., MATH-101"
              className={inputClasses}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
