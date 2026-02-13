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
  const [openAdd, setOpenAdd] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const studentList = useSelector((state) => state.studentList);
  const grades = useSelector((state) => state.grades.grades);

  useEffect(() => {
    dispatch(GetAllStudents());
    dispatch(getAllGrades());
  }, [dispatch]);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!grade) {
        setClasses([]);
        return;
      }
      const clz = await getClassesByGrade(Number(grade));
      setClasses(Array.isArray(clz) ? clz : []);
    };
    fetchClasses();
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

  const getInitials = (name) => {
    if (!name) return "St";
    const parts = String(name).trim().split(" ").filter(Boolean);
    return parts.length === 1
      ? parts[0].slice(0, 2).toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const downloadExcel = () => {
    window.location.href = "http://localhost:5037/api/student/exportStudents";
  };

  return (
    <div className="max-w-full mx-auto space-y-8 pb-16 animate-fade-in px-4">
      {openAdd && (
        <AddStudentForm isOpen={openAdd} isClose={() => setOpenAdd(false)} />
      )}

      {/* ===== Header ===== */}
      <header className="flex flex-col md:flex-row md:items-center justify-between bg-linear-to-r from-cyan-900 via-cyan-800 to-cyan-900 py-8 px-8 rounded-2xl shadow-lg gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white capitalize mb-1">
            Student dashboard
          </h1>
          <p className="text-sm text-cyan-100 capitalize">
            Manage student records and class assignments
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={downloadExcel}
            className="bg-white/10 text-white border border-white/20 px-5 py-2 rounded-xl text-sm font-bold hover:bg-white/20 transition-all backdrop-blur-md capitalize"
          >
            Export excel
          </button>
          <button
            onClick={() => setOpenAdd(true)}
            className="bg-white text-cyan-900 px-6 py-2 rounded-xl text-sm font-bold hover:bg-cyan-50 transition-colors shadow-sm capitalize"
          >
            Add student
          </button>
        </div>
      </header>

      {/* ===== Filters ===== */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 capitalize px-1">
              Search student
            </label>
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ID number or name..."
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-cyan-600 hover:text-cyan-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 capitalize px-1">
              Filter by grade
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 appearance-none capitalize"
            >
              <option value="">All grades</option>
              {grades.map((g) => (
                <option key={g.id} value={g.grade}>
                  {g.gradeName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 capitalize px-1">
              Filter by class
            </label>
            <select
              value={klass}
              onChange={(e) => setKlass(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 appearance-none capitalize"
            >
              <option value="">All classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-cyan-50 text-cyan-700 text-[10px] font-bold capitalize">
            {filtered.length} Students found
          </span>
          {(grade || klass) && (
            <button
              onClick={() => {
                setGrade("");
                setKlass("");
              }}
              className="text-[10px] font-bold text-neutral-400 hover:text-red-500 transition-colors capitalize"
            >
              Reset filters
            </button>
          )}
        </div>
      </section>

      {/* ===== Student Table ===== */}
      <section className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-cyan-800 border-b border-neutral-100">
                <th className="px-8 py-5 text-sm font-bold text-cyan-50 capitalize">
                  Full name
                </th>
                <th className="px-6 py-4 text-sm font-bold text-cyan-50 capitalize">
                  ID number
                </th>
                <th className="px-6 py-5 text-sm font-bold text-cyan-50 capitalize">
                  Email address
                </th>
                <th className="px-6 py-5 text-sm font-bold text-cyan-50 capitalize text-center">
                  Grade
                </th>
                <th className="px-6 py-5 text-sm font-bold text-cyan-50 capitalize text-center">
                  Class
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filtered.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => navigate(`/students/${student.id}`)}
                  className="hover:bg-cyan-50/30 cursor-pointer transition-colors group"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-linear-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-[10px] font-bold text-white shadow-sm group-hover:scale-110 transition-transform">
                        {getInitials(student.fullName)}
                      </div>
                      <span className="text-sm font-bold text-neutral-800 capitalize">
                        {student.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500 font-medium">
                    {student.studentIDNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-500">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs font-bold text-neutral-700">
                      {student.currentGrade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-3 py-1 rounded-lg bg-neutral-100 text-neutral-600 text-[12px] font-bold capitalize">
                      {student.currentClass}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-neutral-400 font-medium capitalize">
              No student records match your selection.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
