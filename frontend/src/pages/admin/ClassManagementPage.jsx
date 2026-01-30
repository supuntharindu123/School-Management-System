import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Button from "../../components/CommonElements/Button";
import { GetAllStudents } from "../../features/adminFeatures/students/studentListSlice";
import { getClasses } from "../../features/class/classSlice";
import { getAllGrades } from "../../features/grade/gradeSlice";
import AssignClassDialog from "../../components/Teacher/AssignClassDialog";
import { assignClassToTeacher } from "../../features/adminFeatures/teachers/teacherService";

function ClassManagementPage() {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [assignModal, setAssignModal] = useState({
    open: false,
    classId: null,
  });

  // Teachers are fetched inside AssignClassDialog via Redux slice

  const dispatch = useDispatch();

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
      const gradeClasses = classes.filter((c) => c.gradeId === g.id).length;
      const studentCount = students.filter(
        (c) => c.currentGrade == g.id,
      ).length;
      return { grade: g, classCount: gradeClasses, studentCount };
    });
  }, [grades, classes, students]);

  const filteredClasses = useMemo(() => {
    const pool = selectedGrade
      ? classes.filter((c) => c.gradeId === selectedGrade)
      : classes;
    return pool;
  }, [classes, selectedGrade]);

  const openAssign = (row) => setAssignModal({ open: true, classId: row.id });
  const closeAssign = () => setAssignModal({ open: false, classId: null });
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState(null);

  return (
    <div>
      <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Class Management
          </h1>
          <p className="text-sm text-neutral-700">
            Manage grades, classes, and assign class teachers
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedGrade && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-700">Grade</span>
                <span className="rounded bg-teal-50 px-2 py-1 text-md text-teal-700 font-medium">
                  {selectedGrade}
                </span>
              </div>

              <button
                onClick={() => setSelectedGrade(null)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
              >
                Back to Grades
              </button>
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
              <thead>
                <tr className="text-left text-neutral-800">
                  <th className="border-b border-gray-200 py-2 px-3">Class</th>
                  <th className="border-b border-gray-200 py-2 px-3">
                    Students
                  </th>
                  <th className="border-b border-gray-200 py-2 px-3">
                    Class Teacher
                  </th>
                  <th className="border-b border-gray-200 py-2 px-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-neutral-800">
                {filteredClasses
                  .filter((c) => c.gradeId === selectedGrade)
                  .map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="border-b border-gray-200 py-2 px-3 font-medium">
                        {row.className}
                      </td>

                      <td className="border-b border-gray-200 py-2 px-3">
                        {row.students.length}
                      </td>
                      <td className="border-b border-gray-200 py-2 px-3">
                        {row.classTeachers?.length
                          ? row.classTeachers
                              .map((t) => t.teacherName)
                              .join(" ")
                          : "-"}
                      </td>
                      <td className="border-b border-gray-200 py-2 px-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openAssign(row)}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-neutral-800 hover:border-teal-600 hover:text-teal-600"
                          >
                            Assign Teacher
                          </button>
                          <Link
                            to={`/classes/${encodeURIComponent(row.id)}`}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-neutral-800 hover:border-teal-600 hover:text-teal-600"
                          >
                            View Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {assignModal.open && (
        <AssignClassDialog
          gradeId={selectedGrade}
          classNameId={assignModal.classId}
          isTeacher={false}
          onClose={closeAssign}
          onSave={async (payload) => {
            try {
              setAssignError(null);
              setAssigning(true);
              await assignClassToTeacher(payload);
              // refresh classes list
              await dispatch(getClasses());
              closeAssign();
            } catch (err) {
              setAssignError("Failed to assign class. Please try again.");
            } finally {
              setAssigning(false);
            }
          }}
        />
      )}
    </div>
  );
}

function GradeCard({ grade, classCount, studentCount, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-teal-600 hover:shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-neutral-500">Grade</p>
          <p className="text-xl font-semibold text-neutral-900">{grade}</p>
        </div>
        <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700">
          {classCount} classes
        </span>
      </div>
      <div className="mt-3">
        <p className="text-sm text-neutral-700">{studentCount} Students</p>
      </div>
    </button>
  );
}

function ModalShell({ title, children, onClose, footer }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold text-neutral-900">{title}</p>
          <button
            onClick={onClose}
            className="rounded px-2 py-1 text-xs text-neutral-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>
        <div className="p-4">{children}</div>
        <div className="border-t px-4 py-3 flex justify-end gap-2">
          {footer}
        </div>
      </div>
    </div>
  );
}

function AssignTeacherModal({ teachers, onClose, onSave }) {
  const [picked, setPicked] = useState(null);
  return (
    <ModalShell
      title="Assign Class Teacher"
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Cancel
          </button>
          <Button label="Save" onClick={() => picked && onSave(picked)} />
        </>
      }
    >
      <div className="space-y-2">
        {teachers.map((t) => (
          <label
            key={t.id}
            className="flex items-center gap-2 text-sm text-neutral-800"
          >
            <input
              type="radio"
              name="teacher"
              checked={picked === t.id}
              onChange={() => setPicked(t.id)}
            />
            {t.name}
          </label>
        ))}
      </div>
    </ModalShell>
  );
}

export default ClassManagementPage;
