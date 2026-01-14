import React, { useMemo, useState } from "react";

export default function StudentListPage() {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("");
  const [klass, setKlass] = useState("");
  const [year, setYear] = useState("");

  // Sample data for UI
  const students = [
    {
      id: 1,
      admissionNo: "ADM001",
      name: "Alice Johnson",
      grade: "8",
      class: "A",
      year: "2025-2026",
      status: "Active",
    },
    {
      id: 2,
      admissionNo: "ADM002",
      name: "Brian Lee",
      grade: "8",
      class: "B",
      year: "2025-2026",
      status: "Inactive",
    },
    {
      id: 3,
      admissionNo: "ADM003",
      name: "Carla Grant",
      grade: "9",
      class: "A",
      year: "2025-2026",
      status: "Active",
    },
    {
      id: 4,
      admissionNo: "ADM004",
      name: "Daniel Kim",
      grade: "9",
      class: "C",
      year: "2024-2025",
      status: "Active",
    },
  ];

  const grades = ["", "7", "8", "9", "10"];
  const classes = ["", "A", "B", "C", "D"];
  const years = ["", "2024-2025", "2025-2026"];

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesQuery = query
        ? [s.admissionNo, s.name].some((f) =>
            f.toLowerCase().includes(query.toLowerCase())
          )
        : true;
      const matchesGrade = grade ? s.grade === grade : true;
      const matchesClass = klass ? s.class === klass : true;
      const matchesYear = year ? s.year === year : true;
      return matchesQuery && matchesGrade && matchesClass && matchesYear;
    });
  }, [students, query, grade, klass, year]);

  const onAddStudent = () => {};
  const onView = (row) => {};
  const onEdit = (row) => {};
  const onToggleStatus = (row) => {};
  const onExportExcel = () => {};
  const onExportPdf = () => {};

  return (
    <div>
      <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Students</h1>
          <p className="text-sm text-neutral-700">
            Search, filter, and manage student records
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onExportPdf}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Export PDF
          </button>
          <button
            onClick={onExportExcel}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Export Excel
          </button>
          <button
            onClick={onAddStudent}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Add Student
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
          <div className="flex-1">
            <label
              className="block text-sm font-medium text-neutral-800"
              htmlFor="search"
            >
              Search
            </label>
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Admission No or Name"
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-neutral-800"
              htmlFor="grade"
            >
              Grade
            </label>
            <select
              id="grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="mt-1 block w-44 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            >
              {grades.map((g) => (
                <option key={g} value={g}>
                  {g || "All"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="block text-sm font-medium text-neutral-800"
              htmlFor="class"
            >
              Class
            </label>
            <select
              id="class"
              value={klass}
              onChange={(e) => setKlass(e.target.value)}
              className="mt-1 block w-44 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            >
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c || "All"}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="block text-sm font-medium text-neutral-800"
              htmlFor="year"
            >
              Academic Year
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 block w-52 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y || "All"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="mt-4 rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-800">
                <th className="border-b border-gray-200 py-2 px-3">
                  Admission No
                </th>
                <th className="border-b border-gray-200 py-2 px-3">Name</th>
                <th className="border-b border-gray-200 py-2 px-3">Grade</th>
                <th className="border-b border-gray-200 py-2 px-3">Class</th>
                <th className="border-b border-gray-200 py-2 px-3">Status</th>
                <th className="border-b border-gray-200 py-2 px-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {filtered.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-200 py-2 px-3">
                    {row.admissionNo}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {row.name}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {row.grade}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {row.class}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                        row.status === "Active"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : "bg-gray-100 text-neutral-700 border-gray-200"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView(row)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-neutral-800 hover:border-teal-600 hover:text-teal-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => onEdit(row)}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-neutral-800 hover:border-teal-600 hover:text-teal-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onToggleStatus(row)}
                        className={`rounded-lg px-3 py-1.5 text-xs border ${
                          row.status === "Active"
                            ? "border-rose-200 text-rose-700 bg-rose-50 hover:border-rose-400"
                            : "border-teal-200 text-teal-700 bg-teal-50 hover:border-teal-400"
                        }`}
                      >
                        {row.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    className="py-10 text-center text-neutral-600"
                    colSpan={6}
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
