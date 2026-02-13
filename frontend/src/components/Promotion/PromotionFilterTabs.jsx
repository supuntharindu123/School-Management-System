import React from "react";

const tabs = ["all", "Promoted", "Repeated", "Completed", "Leaving"];

export default function PromotionFilterTabs({ active, onChange }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2 items-center bg-neutral-100/50 p-1.5 rounded-2xl w-fit">
      {tabs.map((t) => {
        const isActive = active === t;
        return (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`relative px-5 py-2 text-sm font-bold transition-all duration-200 capitalize rounded-xl ${
              isActive
                ? "bg-cyan-700 text-cyan-50 shadow-sm ring-1 ring-neutral-200/50"
                : "text-neutral-500 hover:text-cyan-600 hover:bg-white/50"
            }`}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}
