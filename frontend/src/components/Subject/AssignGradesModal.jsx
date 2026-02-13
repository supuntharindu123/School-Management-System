import React, { useState } from "react";
import Button from "../CommonElements/Button";
import Modal from "../modal";

export default function AssignGradesModal({
  grades,
  selected,
  onClose,
  onSave,
  submitting,
  open = true,
}) {
  const [picked, setPicked] = useState(selected || []);

  const toggle = (id) => {
    setPicked((list) =>
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Assign subject to grades"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            Cancel
          </button>
          <Button
            label={submitting ? "Applying..." : "Apply changes"}
            onClick={() => onSave(picked)}
            disabled={submitting}
            bgcolor="bg-cyan-600 hover:bg-cyan-700 px-8 rounded-xl shadow-lg shadow-cyan-900/10"
          />
        </div>
      }
    >
      <div className="space-y-6 py-2">
        {/* instruction header */}
        <div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Select the grades that will include this subject in their
            curriculum. Click a grade card to toggle its selection.
          </p>
        </div>

        {/* selection grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {grades.map((g) => {
            const isSelected = picked.includes(g.id);
            return (
              <button
                key={g.id}
                onClick={() => toggle(g.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 text-left
                  ${
                    isSelected
                      ? "border-cyan-600 bg-cyan-50/50 text-cyan-700"
                      : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
                  }`}
              >
                <span className="text-sm font-bold">
                  Grade {g.gradeName || g.id}
                </span>

                {/* custom checkbox indicator */}
                <div
                  className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all
                  ${
                    isSelected
                      ? "bg-cyan-600 border-cyan-600"
                      : "bg-white border-slate-300"
                  }`}
                >
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3 h-3 text-white"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
