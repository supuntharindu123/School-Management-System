import React from "react";

export default function ExamManagementPage() {
  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Exams</h1>
          <p className="text-sm text-neutral-700">
            Manage exam schedules and results
          </p>
        </div>
      </header>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-neutral-700">
          This is a placeholder page for Exams. We can add listing, creation,
          and result management here.
        </p>
      </section>
    </div>
  );
}
