import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  getTeacherById,
  assignClassToTeacher,
  assignSubjectToTeacher,
} from "../../features/adminFeatures/teachers/teacherService";
import AssignClassDialog from "../../components/Teacher/AssignClassDialog";
import AssignSubjectDialog from "../../components/Teacher/AssignSubjectDialog";

export default function TeacherProfilePage() {
  const { id } = useParams();
  const location = useLocation();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignError, setAssignError] = useState(null);
  const [assignSubjectOpen, setAssignSubjectOpen] = useState(false);
  const [assignSubjectError, setAssignSubjectError] = useState(null);
  const [initialAssign, setInitialAssign] = useState({
    gradeId: null,
    classId: null,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getTeacherById(id);
        if (mounted) setTeacher(data);
      } catch (err) {
        setError("Failed to load teacher profile.");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Auto-open Assign Class dialog from query params and preselect grade/class
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldOpen = params.get("assign") === "class";
    const classIdParam = params.get("classId");
    const gradeIdParam = params.get("gradeId");
    if (shouldOpen) {
      setAssignOpen(true);
      setInitialAssign({
        gradeId: gradeIdParam ? Number(gradeIdParam) : null,
        classId: classIdParam ? Number(classIdParam) : null,
      });
    }
  }, [location.search]);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-neutral-700">
        Loading teacher profile...
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800">
        {error}
      </div>
    );
  }
  if (!teacher) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-neutral-700">
        No data found.
      </div>
    );
  }

  const user = teacher.user || {};

  return (
    <>
      <div>
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900">
              Teacher Profile
            </h1>
            <p className="text-sm text-neutral-700">
              Detailed information and assignments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAssignOpen(true)}
              className="rounded-lg bg-teal-600 px-3 py-2 text-sm text-white hover:bg-teal-700"
            >
              Assign Class
            </button>
            <button
              onClick={() => setAssignSubjectOpen(true)}
              className="rounded-lg bg-teal-600 px-3 py-2 text-sm text-white hover:bg-teal-700"
            >
              Assign Subject
            </button>
            <Link
              to="/teachers"
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-700"
            >
              Back to List
            </Link>
          </div>
        </header>

        {/* Identity */}
        <section className="mb-4 grid gap-3 sm:grid-cols-3">
          <Info label="Full Name" value={teacher.fullName} />
          <Info label="Email" value={user.email} />
          <Info label="Username" value={user.userName} />
        </section>

        {/* Details */}
        <section className="mb-4 grid gap-3 sm:grid-cols-3">
          <Info label="Gender" value={teacher.gender} />
          <Info label="Birthday" value={teacher.birthDay} />
          <Info label="City" value={teacher.city} />
        </section>

        {/* Address */}
        <section className="mb-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-neutral-600">Address</p>
            <p className="text-sm font-semibold text-neutral-900">
              {teacher.address || "-"}
            </p>
          </div>
        </section>

        {/* Assignments */}
        <section className="grid gap-3 sm:grid-cols-2">
          <Card title="Class Assignments">
            {assignError && (
              <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                {assignError}
              </div>
            )}
            {Array.isArray(teacher.classAssignments) &&
            teacher.classAssignments.length > 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="text-left text-neutral-800">
                        <th className="border-b border-gray-200 py-2 px-3">
                          Class
                        </th>
                        <th className="border-b border-gray-200 py-2 px-3">
                          Role
                        </th>
                        <th className="border-b border-gray-200 py-2 px-3">
                          Status
                        </th>
                        <th className="border-b border-gray-200 py-2 px-3">
                          Created
                        </th>
                        <th className="border-b border-gray-200 py-2 px-3">
                          Updated
                        </th>
                        <th className="border-b border-gray-200 py-2 px-3">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-neutral-800">
                      {teacher.classAssignments.map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50">
                          <td className="border-b border-gray-200 py-2 px-3">
                            {a.className || "-"}
                          </td>
                          <td className="border-b border-gray-200 py-2 px-3">
                            {a.role || "-"}
                          </td>
                          <td className="border-b border-gray-200 py-2 px-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                                a.isActive
                                  ? "bg-teal-50 text-teal-700 border-teal-200"
                                  : "bg-gray-100 text-neutral-700 border-gray-200"
                              }`}
                            >
                              {a.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="border-b border-gray-200 py-2 px-3">
                            {a.createdDate
                              ? new Date(a.createdDate).toLocaleString()
                              : "-"}
                          </td>
                          <td className="border-b border-gray-200 py-2 px-3">
                            {a.updatedDate
                              ? new Date(a.updatedDate).toLocaleString()
                              : "-"}
                          </td>
                          <td className="border-b border-gray-200 py-2 px-3 truncate max-w-[240px]">
                            {a.description || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-600">No class assignments</p>
            )}
          </Card>
          <Card title="Subject Classes">
            {assignSubjectError && (
              <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                {assignSubjectError}
              </div>
            )}
            {Array.isArray(teacher.subjectClasses) &&
            teacher.subjectClasses.length > 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="text-left text-neutral-800">
                        <th className="border-b border-gray-200 py-2 px-3">
                          Subject
                        </th>
                        <th className="border-b border-gray-200 py-2 px-3">
                          Class
                        </th>
                        <th className="border-b border-gray-200 py-2 px-3">
                          Status
                        </th>
                        <th className="border-b border-gray-200 py-2 px-3">
                          Start
                        </th>
                        <th className="border-b border-gray-200 py-2 px-3">
                          End
                        </th>
                        <th className="border-b border-gray-200 py-2 px-3">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-neutral-800">
                      {teacher.subjectClasses.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50">
                          <td className="border-b border-gray-200 py-2 px-3">
                            {s.subjectName || s.subject || "-"}
                          </td>
                          <td className="border-b border-gray-200 py-2 px-3">
                            {s.className || "-"}
                          </td>
                          <td className="border-b border-gray-200 py-2 px-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                                s.isActive
                                  ? "bg-teal-50 text-teal-700 border-teal-200"
                                  : "bg-gray-100 text-neutral-700 border-gray-200"
                              }`}
                            >
                              {s.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="border-b border-gray-200 py-2 px-3">
                            {s.startDate &&
                            s.startDate !== "0001-01-01T00:00:00"
                              ? new Date(s.startDate).toLocaleString()
                              : "-"}
                          </td>
                          <td className="border-b border-gray-200 py-2 px-3">
                            {s.endDate && s.endDate !== "0001-01-01T00:00:00"
                              ? new Date(s.endDate).toLocaleString()
                              : "-"}
                          </td>
                          <td className="border-b border-gray-200 py-2 px-3 truncate max-w-[240px]">
                            {s.description || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-600">No subject classes</p>
            )}
          </Card>
        </section>
      </div>
      {assignOpen && (
        <AssignClassDialog
          teacherId={id}
          initialGradeId={initialAssign.gradeId}
          initialClassNameId={initialAssign.classId}
          onClose={() => setAssignOpen(false)}
          onSave={async (payload) => {
            try {
              setAssignError(null);
              await assignClassToTeacher(payload);
              const data = await getTeacherById(id);
              setTeacher(data);
              setAssignOpen(false);
            } catch (err) {
              setAssignError("Failed to assign class. Please try again.");
            }
          }}
        />
      )}
      {assignSubjectOpen && (
        <AssignSubjectDialog
          teacherId={id}
          onClose={() => setAssignSubjectOpen(false)}
          onSave={async (payload) => {
            try {
              setAssignSubjectError(null);
              await assignSubjectToTeacher(payload);
              const data = await getTeacherById(id);
              setTeacher(data);
              setAssignSubjectOpen(false);
            } catch (err) {
              setAssignSubjectError(
                "Failed to assign subject. Please try again.",
              );
            }
          }}
        />
      )}
    </>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3">
      <p className="text-xs text-neutral-600">{label}</p>
      <p className="text-sm font-semibold text-neutral-900">{value || "-"}</p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="mb-2 text-sm font-semibold text-neutral-900">{title}</p>
      {children}
    </div>
  );
}
