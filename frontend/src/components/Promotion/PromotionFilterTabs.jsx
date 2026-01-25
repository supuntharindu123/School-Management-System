import React from "react";

const tabs = ["all", "Promoted", "Repeated", "Completed", "Leaving"];

export default function PromotionFilterTabs({ active, onChange }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`rounded-lg px-3 py-1.5 text-sm ${
            active === t
              ? "bg-teal-600 text-white"
              : "border border-gray-200 bg-white text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
