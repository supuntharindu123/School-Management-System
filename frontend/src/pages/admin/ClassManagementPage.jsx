import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetAllStudents } from "../../features/adminFeatures/students/studentListSlice";
import { getClasses } from "../../features/class/classSlice";
import { getAllGrades } from "../../features/grade/gradeSlice";

function ClassManagementPage() {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { grades } = useSelector((state) => state.grades);
  const { classes } = useSelector((state) => state.classes);

  useEffect(() => {
    dispatch(getAllGrades());
    dispatch(GetAllStudents());
    dispatch(getClasses());
  }, [dispatch]);

  const gradeStats = useMemo(() => {
    return grades.map((g) => {
      const gradeClasses = classes.filter((c) => c.gradeId === g.id);
      const studentCount = gradeClasses.reduce(
        (acc, c) => acc + (Array.isArray(c.students) ? c.students.length : 0),
        0,
      );
      return { grade: g, classCount: gradeClasses.length, studentCount };
    });
  }, [grades, classes]);

  const filteredClasses = useMemo(() => {
    return selectedGrade
      ? classes.filter((c) => c.gradeId === selectedGrade)
      : classes;
  }, [classes, selectedGrade]);

  return (
    <div className="max-w-full mx-auto space-y-8 pb-16 animate-fade-in px-4">
      {/* Header Section */}
      <header className="bg-cyan-900 rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold">
            Class management
            {selectedGrade && (
              <span className="font-normal opacity-70">
                {" "}
                | Grade {selectedGrade}
              </span>
            )}
          </h1>
          <p className="text-cyan-100 mt-1">
            Manage grade structures and class teacher assignments.
          </p>
        </div>
        {selectedGrade && (
          <button
            onClick={() => setSelectedGrade(null)}
            className="px-6 py-2 bg-white text-cyan-900 hover:bg-cyan-50 rounded-2xl transition-colors font-bold text-sm"
          >
            Switch grade
          </button>
        )}
      </header>

      {/* Grade Selection Grid */}
      {!selectedGrade && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradeStats.map((g) => (
            <GradeCard
              key={g.grade.id}
              grade={g.grade.gradeName}
              classCount={g.classCount}
              studentCount={g.studentCount}
              onClick={() => setSelectedGrade(g.grade.id)}
            />
          ))}
        </section>
      )}

      {/* Classes Table View */}
      {selectedGrade && (
        <section className="bg-white rounded-3xl border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-100 flex justify-between items-center">
            <h2 className="font-bold text-xl text-neutral-900">
              Assigned classes
            </h2>
            <span className="text-sm font-bold capitalize text-cyan-700 bg-cyan-50 px-4 py-1 rounded-full">
              {filteredClasses.length} divisions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 text-neutral-500 text-sm">
                  <th className="px-6 py-4 font-bold capitalize">
                    Class identity
                  </th>
                  <th className="px-6 py-4 font-bold capitalize">
                    Student capacity
                  </th>
                  <th className="px-6 py-4 font-bold capitalize">
                    Assigned faculty
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredClasses.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => navigate(`/classes/${row.id}`)}
                    className="hover:bg-cyan-50/30 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="font-bold text-neutral-900">
                        {row.className}
                      </div>
                      <div className="text-xs text-neutral-400">
                        Id: {row.id}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-cyan-500"></div>
                        <span className="text-sm">
                          {Array.isArray(row.students)
                            ? row.students.length
                            : 0}{" "}
                          enrolled
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {row.classTeachers?.some((t) => t.isActive) ? (
                        <div className="flex flex-wrap gap-2">
                          {row.classTeachers
                            .filter((t) => t.isActive)
                            .map((t, idx) => (
                              <span
                                key={idx}
                                className="bg-white text-cyan-700 border border-cyan-200 px-3 py-1 rounded-lg text-xs font-bold"
                              >
                                {t.role}: {t.teacherName}
                              </span>
                            ))}
                        </div>
                      ) : (
                        <span className="text-sm italic text-neutral-400">
                          Unassigned
                        </span>
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
      className="group relative bg-white border border-slate-100 p-8 rounded-2xl text-left hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-900/10 transition-all duration-300 flex flex-col justify-between h-56 overflow-hidden shadow-md"
    >
      {/* subtle background glow on hover */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mr-10 -mt-10"></div>

      <div className="relative z-10">
        <p className="text-[10px] font-black text-cyan-600  mb-1">
          Academic Level
        </p>
        <h3 className="text-2xl  font-black text-slate-900">Grade {grade}</h3>
      </div>

      <div className="relative z-10">
        <div className="flex gap-4 border-t border-slate-50 pt-5 mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400">
              Classes
            </span>
            <span className="font-black text-xl text-slate-800">
              {classCount}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400">
              Total Students
            </span>
            <span className="font-black text-xl text-slate-800">
              {studentCount}
            </span>
          </div>
        </div>

        {/* view details action */}
        <div className="flex items-end justify-end gap-2 text-cyan-600 font-black text-xs  group-hover:gap-3 transition-all duration-300">
          <span>View Details</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}

export default ClassManagementPage;
