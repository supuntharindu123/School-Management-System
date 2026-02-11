import { useState } from "react";
import Modal from "../modal";
import Button from "../CommonElements/Button";

function AddExamModal({ onClose, onSave, years, saving }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [examType, setExamType] = useState("");

  const submit = () => {
    if (!title || !startDate || !endDate || !academicYearId || !examType) {
      alert("Please fill all required fields");
      return;
    }
    onSave({
      title,
      description,
      startDate,
      endDate,
      academicYearId: Number(academicYearId),
      examType: Number(examType),
    });
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title="Add Exam"
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Cancel
          </button>
          <Button label={saving ? "Saving..." : "Save"} onClick={submit} />
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-800">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-800">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Academic Year
            </label>
            <select
              value={academicYearId}
              onChange={(e) => setAcademicYearId(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            >
              <option value="">Select year</option>
              {(years || []).map((y) => (
                <option key={y.id} value={y.id}>
                  {y.year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Exam Type
            </label>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            >
              <option value="">Select type</option>
              <option value={1}>Term 01</option>
              <option value={2}>Term 02</option>
              <option value={3}>Term 03</option>
            </select>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AddExamModal;
