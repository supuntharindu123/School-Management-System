import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Button from "../../components/CommonElements/Button";
import { getClassDetails } from "../../services/classes";
import { assignClassToTeacher } from "../../features/adminFeatures/teachers/teacherService";
import AssignClassDialog from "../../components/Teacher/AssignClassDialog";

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

export default function ClassDetailsPage() {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getClassDetails(id)
      .then((data) => {
        if (isMounted) {
          setDetails(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err?.response?.data ||
              err.message ||
              "Failed to load class details",
          );
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading)
    return (
      <div className="text-sm text-neutral-700">Loading class details...</div>
    );
  if (error) return <div className="text-sm text-red-600">{String(error)}</div>;
  if (!details)
    return (
      <div className="text-sm text-neutral-700">No details available.</div>
    );

  const students = details.students || [];
  const classTeachers = details.classTeachers || [];
  const subjectTeachers = details.subjectTeachers || [];
  const activeClassTeacher = classTeachers.find((t) => t.isActive);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            {details.className || `Class ${details.classId}`}
          </h1>
          <p className="text-sm text-neutral-700">Grade: {details.gradeId}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            label={
              activeClassTeacher
                ? "Change Class Teacher"
                : "Assign Class Teacher"
            }
            onClick={() => setAssignOpen(true)}
          />
          <Link
            to={`/teachers?assign=class&classId=${encodeURIComponent(details.classId)}`}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Go to Teacher Assignment
          </Link>
        </div>
      </header>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <SummaryCard label="Students" value={students.length} />
        <SummaryCard label="Subjects" value={subjectTeachers.length} />
        <SummaryCard label="Class Teachers" value={classTeachers.length} />
        <SummaryCard
          label="Active Class Teacher"
          value={activeClassTeacher ? activeClassTeacher.teacherName : "-"}
        />
      </section>

      {/* Students */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold text-neutral-900">Students</p>
          <span className="text-xs text-neutral-600">
            Total: {students.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-800">
                <th className="border-b border-gray-200 py-2 px-3">ID</th>
                <th className="border-b border-gray-200 py-2 px-3">
                  Student ID
                </th>
                <th className="border-b border-gray-200 py-2 px-3">Name</th>
                <th className="border-b border-gray-200 py-2 px-3">Gender</th>
                <th className="border-b border-gray-200 py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-200 py-2 px-3">{s.id}</td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {s.studentIDNumber}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3 font-medium">
                    {s.fullName}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {s.gender}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {s.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Class Teachers */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold text-neutral-900">
            Class Teachers
          </p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {classTeachers.map((t) => (
              <div
                key={`${t.teacherId}-${t.role}`}
                className="rounded-lg border border-gray-200 p-3 text-sm"
              >
                <p className="font-medium text-neutral-900">{t.teacherName}</p>
                <p className="text-neutral-700">Role: {t.role}</p>
                <p className="text-neutral-700">
                  Active: {t.isActive ? "Yes" : "No"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Teachers */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold text-neutral-900">
            Subject Teachers
          </p>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {subjectTeachers.map((st) => (
              <div
                key={`${st.subjectId}-${st.teacherId}`}
                className="rounded-lg border border-gray-200 p-3 text-sm"
              >
                <p className="font-medium text-neutral-900">{st.subjectName}</p>
                <p className="text-neutral-700">Teacher: {st.teacherName}</p>
                <p className="text-neutral-700">
                  Active: {st.isActive ? "Yes" : "No"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attendance */}
      <section className="rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold text-neutral-900">Attendance</p>
        </div>
        <div className="p-4">
          <Link
            to={`/attendance?classId=${encodeURIComponent(details.classId)}`}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
          >
            Record Today’s Attendance
          </Link>
        </div>
      </section>

      {assignOpen && (
        <AssignClassDialog
          gradeId={details.gradeId}
          classNameId={details.classId}
          isTeacher={false}
          onClose={() => setAssignOpen(false)}
          onSave={async (payload) => {
            try {
              setAssignError(null);
              setAssigning(true);
              await assignClassToTeacher(payload);
              const refreshed = await getClassDetails(id);
              setDetails(refreshed);
              setAssignOpen(false);
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
