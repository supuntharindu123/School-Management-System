import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllStudents } from "../../features/adminFeatures/students/studentListSlice";
import { useNavigate } from "react-router-dom";
import AddStudentForm from "../../components/Student/AddStudentForm";
import { getClassesByGrade } from "../../features/class/classService";
import { getAllGrades } from "../../features/grade/gradeSlice";

export default function StudentListPage() {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("");
  const [klass, setKlass] = useState("");
  const [classes, setClasses] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const studentList = useSelector((state) => state.studentList);
  const gradesState = useSelector((state) => state.grades);
  const grades = gradesState.grades;

  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    dispatch(GetAllStudents());
    dispatch(getAllGrades());
  }, [dispatch]);

  useEffect(() => {
    const clzfromgrade = async () => {
      const clz = await getClassesByGrade(Number(grade));
      setClasses(Array.isArray(clz) ? clz : []);
    };
    clzfromgrade();
  }, [grade]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const f = studentList.students.filter((s) => {
      const searchable = [s.studentIDNumber, s.fullName]
        .filter(Boolean)
        .map((v) => String(v).toLowerCase());

      const matchesQuery = q ? searchable.some((f) => f.includes(q)) : true;
      const matchesGrade = grade
        ? String(s.currentGrade) === String(grade)
        : true;
      const matchesClass = klass
        ? String(s.currentClass) === String(klass)
        : true;

      return matchesQuery && matchesGrade && matchesClass;
    });

    return f;
  }, [studentList.students, query, grade, klass]);

  const getInitials = (name) => {
    if (!name) return "T";
    const parts = String(name).trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const onAddStudent = () => setOpenAdd(true);
  const onView = (id) => {
    navigate(`/students/${id}`);
  };
  const downloadExcel = () => {
    window.location.href = "http://localhost:5037/api/student/exportStudents";
  };

  return (
    <div className="mx-auto max-w-7xl">
      {openAdd && (
        <AddStudentForm isOpen={openAdd} isClose={() => setOpenAdd(false)} />
      )}

      <header className="mb-4 flex items-center justify-between bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-6 rounded-2xl px-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-50">Student Dashboard</h1>
          <p className="text-sm text-cyan-50">
            Search, filter, and manage student records
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={downloadExcel}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
          >
            Export Excel
          </button>
          <button
            onClick={onAddStudent}
            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
          >
            Add Student
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="rounded-xl border border-gray-300  p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
          <div className="flex-1">
            <label
              className="block text-sm font-medium text-neutral-800"
              htmlFor="search"
            >
              Search
            </label>
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-600"
              >
                <path d="M10.5 3.75a6.75 6.75 0 1 0 3.89 12.3l3.28 3.28a.75.75 0 1 0 1.06-1.06l-3.28-3.28A6.75 6.75 0 0 0 10.5 3.75Zm0 1.5a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5Z" />
              </svg>
              <input
                id="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by StudentID No or Name"
                className="mt-1 block w-full rounded-lg border border-gray-300 bg-white pl-9 pr-9 py-2 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs text-cyan-700 hover:bg-cyan-50 border border-cyan-300"
                >
                  Clear
                </button>
              )}
            </div>
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
              className="mt-1 block w-44 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
            >
              <option value="">All</option>
              {grades.map((g) => (
                <option key={g.id} value={g.grade}>
                  {g.gradeName || "All"}
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
              className="mt-1 block w-44 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
            >
              <option value="">All</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name || "All"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters and count */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {grade && (
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 px-3 py-1 text-xs">
                Grade: {grade}
                <button
                  type="button"
                  className="ml-1 text-cyan-700 hover:text-cyan-900"
                  onClick={() => setGrade("")}
                >
                  ×
                </button>
              </span>
            )}
            {klass && (
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-300 px-3 py-1 text-xs">
                Class: {klass}
                <button
                  type="button"
                  className="ml-1 text-cyan-700 hover:text-cyan-900"
                  onClick={() => setKlass("")}
                >
                  ×
                </button>
              </span>
            )}
          </div>
          <span className="text-xs rounded bg-cyan-50 text-cyan-700 px-2 py-1 border border-cyan-200">
            {filtered.length} results
          </span>
        </div>
      </section>

      {/* Table */}
      <section className="mt-4 rounded-2xl border border-gray-200 bg-white">
        <div className="max-h-[60vh] overflow-auto rounded-md">
          <table className="w-full border-collapse text-sm">
            <thead className=" rounded-xl sticky top-0">
              <tr className="text-left text-neutral-800 bg-cyan-600 rounded-xl">
                <th className="border-b border-cyan-200 py-2 px-3 sticky top-0">
                  Name
                </th>
                <th className="border-b border-cyan-200 py-2 px-3 sticky top-0">
                  Student ID
                </th>
                <th className="border-b border-cyan-200 py-2 px-3 sticky top-0">
                  Email
                </th>
                <th className="border-b border-cyan-200 py-2 px-3 sticky top-0">
                  Grade
                </th>
                <th className="border-b border-cyan-200 py-2 px-3 sticky top-0">
                  Class
                </th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-cyan-50"
                  onClick={() => onView(row.id)}
                >
                  <td className="border-b border-gray-200 py-2 px-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-cyan-700 text-white text-xs font-semibold mr-2">
                      {getInitials(row.fullName)}
                    </span>
                    <span> {row.fullName}</span>
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {row.studentIDNumber}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {row.email}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {row.currentGrade}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {row.currentClass}
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
