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
      title="Assign Subject to Grades"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Cancel
          </button>
          <Button
            label={submitting ? "Saving..." : "Save"}
            onClick={() => onSave(picked)}
            disabled={submitting}
          />
        </>
      }
    >
      <div className="grid grid-cols-3 gap-2">
        {grades.map((g) => (
          <label
            key={g.id}
            className="flex items-center gap-2 text-sm text-neutral-800"
          >
            <input
              type="checkbox"
              checked={picked.includes(g.id)}
              onChange={() => toggle(g.id)}
            />
            Grade {g.gradeName}
          </label>
        ))}
      </div>
    </Modal>
  );
}
