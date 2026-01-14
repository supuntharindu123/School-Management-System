import React from "react";
import Button from "./CommonElements/Button";

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Admin Dashboard
        </h1>
        <p className="text-sm text-neutral-800">Overview and quick actions</p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Total Students", value: "1,245" },
          { label: "Teachers", value: "68" },
          { label: "Active Classes", value: "42" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-4"
          >
            <p className="text-sm text-neutral-800">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold text-neutral-900">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      {/* Quick actions */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-medium text-neutral-800">Quick Actions</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button label={"Add Student"} />
          <Button label={"Add Student"} bgcolor={""} />
          <Button label={"Add Student"} />
        </div>
      </section>

      {/* Recent activity */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-medium text-neutral-800">
          Recent Activity
        </h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-800">
                <th className="border-b border-gray-200 py-2 pr-4">Date</th>
                <th className="border-b border-gray-200 py-2 pr-4">Event</th>
                <th className="border-b border-gray-200 py-2">User</th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {[
                {
                  date: "2026-01-10",
                  event: "Student enrolled",
                  user: "Admin",
                },
                { date: "2026-01-09", event: "Class created", user: "Admin" },
                {
                  date: "2026-01-08",
                  event: "Report generated",
                  user: "Admin",
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border-b border-gray-200 py-2 pr-4">
                    {row.date}
                  </td>
                  <td className="border-b border-gray-200 py-2 pr-4">
                    {row.event}
                  </td>
                  <td className="border-b border-gray-200 py-2">{row.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
