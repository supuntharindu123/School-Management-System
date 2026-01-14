import React from "react";

export default function TeacherDashboardPage() {
  const classes = [
    { name: "Grade 8 - A", subject: "Mathematics", time: "09:00 - 09:45" },
    { name: "Grade 8 - B", subject: "Mathematics", time: "10:00 - 10:45" },
    { name: "Grade 9 - A", subject: "Algebra", time: "12:00 - 12:45" },
  ];

  const attendance = {
    present: 86,
    absent: 14,
  };

  const pendingMarks = [
    { class: "Grade 9 - A", assessment: "Midterm", due: "2026-01-18" },
    { class: "Grade 8 - B", assessment: "Quiz 3", due: "2026-01-16" },
  ];

  const notifications = [
    { id: 1, text: "Staff meeting at 3 PM in Room 201." },
    { id: 2, text: "Submit gradebook export by Friday." },
    { id: 3, text: "New student added to Grade 8 - A." },
  ];

  const total = attendance.present + attendance.absent;
  const presentPct = total ? Math.round((attendance.present / total) * 100) : 0;
  const absentPct = 100 - presentPct;

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Teacher Dashboard
        </h1>
        <p className="text-sm text-neutral-800">
          Your classes and daily updates
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* My Classes */}
        <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-medium text-neutral-800">My Classes</h2>
          <ul className="mt-3 space-y-2">
            {classes.map((c, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-gray-200 p-3 hover:border-teal-600"
              >
                <p className="font-medium text-neutral-900">{c.name}</p>
                <p className="text-sm text-neutral-700">
                  {c.subject} • {c.time}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Today Attendance Status */}
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-medium text-neutral-800">
            Today Attendance Status
          </h2>
          <div className="mt-4">
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-3 bg-teal-600"
                style={{ width: presentPct + "%" }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-neutral-800">
              <span>
                Present:{" "}
                <span className="font-semibold text-teal-700">
                  {attendance.present}
                </span>{" "}
                ({presentPct}%)
              </span>
              <span>
                Absent:{" "}
                <span className="font-semibold text-rose-700">
                  {attendance.absent}
                </span>{" "}
                ({absentPct}%)
              </span>
            </div>
          </div>
        </section>

        {/* Pending Marks */}
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-medium text-neutral-800">
            Pending Marks
          </h2>
          <ul className="mt-3 space-y-2">
            {pendingMarks.map((m, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-gray-200 p-3 flex items-center justify-between hover:border-teal-600"
              >
                <div>
                  <p className="font-medium text-neutral-900">{m.class}</p>
                  <p className="text-sm text-neutral-700">{m.assessment}</p>
                </div>
                <span className="text-xs rounded bg-teal-50 text-teal-700 px-2 py-1 border border-teal-200">
                  Due {m.due}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Notifications */}
        <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-medium text-neutral-800">
            Notifications
          </h2>
          <ul className="mt-3 space-y-2">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="rounded-lg border border-gray-200 p-3 text-sm text-neutral-800 hover:border-teal-600"
              >
                {n.text}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
