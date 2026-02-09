import React from "react";

export default function PromotionHeader({ yearLabel, gradeLabel, classLabel }) {
  return (
    <section className="mb-4 grid gap-3 sm:grid-cols-3">
      <Info label="Academic Year" value={yearLabel} />
      <Info label="Grade" value={gradeLabel} />
      <Info label="Class" value={classLabel} />
    </section>
  );
}

const Info = ({ label, value }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-md">
    <p className="text-xs text-neutral-600">{label}</p>
    <p className="text-sm font-semibold text-neutral-900">{value}</p>
  </div>
);
