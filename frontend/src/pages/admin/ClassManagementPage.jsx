import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GetAllStudents } from "../../features/adminFeatures/students/studentListSlice";
import { getClasses } from "../../features/class/classSlice";
import { getAllGrades } from "../../features/grade/gradeSlice";

function ClassManagementPage() {
  const [selectedGrade, setSelectedGrade] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const gradeList = useSelector((state) => state.grades);
  const grades = gradeList.grades;

  const studentList = useSelector((state) => state.studentList);
  const students = studentList.students;

  const classList = useSelector((state) => state.classes);
  const classes = classList.classes;

  useEffect(() => {
    dispatch(getAllGrades());
    dispatch(GetAllStudents());
    dispatch(getClasses());
  }, [dispatch]);

  const gradeStats = useMemo(() => {
    return grades.map((g) => {
      const gradeClasses = classes.filter((c) => c.gradeId === g.id);
      const classCount = gradeClasses.length;
      const studentCount = gradeClasses.reduce(
        (acc, c) => acc + (Array.isArray(c.students) ? c.students.length : 0),
        0,
      );
      return { grade: g, classCount, studentCount };
    });
  }, [grades, classes]);

  const filteredClasses = useMemo(() => {
    const pool = selectedGrade
      ? classes.filter((c) => c.gradeId === selectedGrade)
      : classes;
    return pool;
  }, [classes, selectedGrade]);

  return (
    <div className="mx-auto max-w-7xl">
      <header className="mb-4 flex items-center justify-between bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-6 rounded-2xl px-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-50">Class Management</h1>
          <p className="text-sm text-cyan-50">
            Manage grades, classes, and assign class teachers
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedGrade && (
            <>
              <button
                onClick={() => setSelectedGrade(null)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
              >
                Back
              </button>
              <div className="flex items-center gap-2">
                <span className="rounded bg-cyan-50 px-3 py-2 text-sm text-cyan-700 font-medium">
                  Grade : {selectedGrade}
                </span>
              </div>
            </>
          )}
        </div>
      </header>

      {!selectedGrade && (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {gradeStats.map((g) => (
              <GradeCard
                key={g.grade.id}
                grade={g.grade.gradeName}
                classCount={g.classCount}
                studentCount={g.studentCount}
                onClick={() => setSelectedGrade(g.grade.id)}
              />
            ))}
          </div>
        </section>
      )}

      {selectedGrade && (
        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-cyan-50 text-cyan-900">
                <tr className="text-left">
                  <th className="sticky top-0 z-10 border-b border-cyan-200 py-2 px-3 font-semibold">
                    <div className="inline-flex items-center gap-2">Class</div>
                  </th>
                  <th className="sticky top-0 z-10 border-b border-cyan-200 py-2 px-3 font-semibold">
                    <div className="inline-flex items-center gap-2">
                      Students
                    </div>
                  </th>
                  <th className="sticky top-0 z-10 border-b border-cyan-200 py-2 px-3 font-semibold">
                    <div className="inline-flex items-center gap-2">
                      Class Teacher
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-neutral-800">
                {filteredClasses
                  .filter((c) => c.gradeId === selectedGrade)
                  .map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => navigate(`/classes/${row.id}`)}
                      className="odd:bg-neutral-50 hover:bg-cyan-50/50 transition"
                    >
                      <td className="border-b border-gray-200 py-2 px-3">
                        <div className="flex items-center gap-3">
                          <div className="min-w-0">
                            <div className="font-medium text-neutral-900">
                              {row.className}
                            </div>
                            <div className="text-xs text-neutral-500">
                              Grade {selectedGrade}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="border-b border-gray-200 py-2 px-3">
                        <span className="inline-flex items-center gap-1 rounded-full  text-cyan-700 px-2 py-0.5 text-md">
                          {Array.isArray(row.students)
                            ? row.students.length
                            : 0}{" "}
                          Students
                        </span>
                      </td>
                      <td className="border-b border-gray-200 py-2 px-3">
                        {row.classTeachers?.filter((t) => t?.isActive === true)
                          .length ? (
                          <div className="flex flex-wrap gap-1.5">
                            {row.classTeachers
                              .filter((t) => t?.isActive === true)
                              .map((t, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 rounded-sm text-cyan-700 px-2 py-0.5 text-md"
                                >
                                  {t.role} - {t.teacherName}
                                </span>
                              ))}
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function GradeCard({ grade, classCount, studentCount, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full rounded-xl border border-cyan-200 bg-white/90 p-4 text-left shadow-sm transition transform hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-300"
    >
      {/* Decorative accent */}
      <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-cyan-200 blur-2xl opacity-30 group-hover:opacity-40" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-cyan-700 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M11.7 2.64a.75.75 0 0 1 .6 0l8.25 3.75a.75.75 0 0 1 0 1.36l-8.25 3.75a.75.75 0 0 1-.6 0L3.45 7.75a.75.75 0 0 1 0-1.36L11.7 2.64Z" />
              <path d="M4.5 10.5v3.375a4.125 4.125 0 0 0 8.25 0V10.5" />
            </svg>
          </span>
          <p className="text-lg font-semibold text-neutral-900">
            Grade - {grade}
          </p>
        </div>
        <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-700 border border-cyan-200">
          {classCount} classes
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-sm bg-cyan-50 text-cyan-700 border border-cyan-200 px-2 py-0.5 text-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3.5 w-3.5"
            >
              <path d="M7.5 6a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z" />
              <path d="M3 20.25a7.5 7.5 0 1 1 15 0v.75H3v-.75Z" />
            </svg>
            {studentCount} Students
          </span>
        </div>
      </div>
    </button>
  );
}

export default ClassManagementPage;
