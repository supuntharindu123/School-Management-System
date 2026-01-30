import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAllStudents } from "../../features/adminFeatures/students/studentListSlice";
import { useNavigate } from "react-router-dom";
import AddStudentDialog from "../../components/Student/AddStudentDialog";
import { getClassesByGrade } from "../../features/class/classService";
import { getAllGrades } from "../../features/grade/gradeSlice";

export default function StudentListPage() {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("");
  const [klass, setKlass] = useState("");
  const [year, setYear] = useState("");
  const [classes, setClasses] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const studentList = useSelector((state) => state.studentList);
  const gradesState = useSelector((state) => state.grades);
  const grades = gradesState.grades;
  const yearsState = useSelector((state) => state.years);

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
    return studentList.students.filter((s) => {
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
  }, [studentList.students, query, grade, klass]);

  const onAddStudent = () => setOpenAdd(true);
  const onView = (id) => {
    navigate(`/students/${id}`);
  };
  const downloadExcel = () => {
    window.location.href = "http://localhost:5037/api/student/exportStudents";
  };
  const onExportPdf = () => {};

  return (
    <div>
      <AddStudentDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdded={() => {
          dispatch(GetAllStudents());
        }}
      />
      <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Student Dashboard
          </h1>
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
            onClick={downloadExcel}
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
              placeholder="Search by StudentID No or Name"
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
              className="mt-1 block w-44 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
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
      </section>

      {/* Table */}
      <section className="mt-4 rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-800">
                <th className="border-b border-gray-200 py-2 px-3">
                  Student ID
                </th>
                <th className="border-b border-gray-200 py-2 px-3">Name</th>
                <th className="border-b border-gray-200 py-2 px-3">Email</th>
                <th className="border-b border-gray-200 py-2 px-3">Grade</th>
                <th className="border-b border-gray-200 py-2 px-3">Class</th>

                {/* <th className="border-b border-gray-200 py-2 px-3 text-right">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50"
                  onClick={() => onView(row.id)}
                >
                  <td className="border-b border-gray-200 py-2 px-3">
                    {row.studentIDNumber}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {row.fullName}
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
                  {/* <td className="border-b border-gray-200 py-2 px-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                        getStatus(row) === "Active"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : "bg-gray-100 text-neutral-700 border-gray-200"
                      }`}
                    >
                      {getStatus(row)}
                    </span>
                  </td> */}
                  <td className="border-b border-gray-200 py-2 px-3">
                    <div className="flex items-center justify-end gap-2">
                      {/* <button
                        onClick={() => onToggleStatus(row)}
                        className={`rounded-lg px-3 py-1.5 text-xs border ${
                          getStatus(row) === "Active"
                            ? "border-rose-200 text-rose-700 bg-rose-50 hover:border-rose-400"
                            : "border-teal-200 text-teal-700 bg-teal-50 hover:border-teal-400"
                        }`}
                      >
                        {getStatus(row) === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button> */}
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
