import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTeacherById,
  assignSubjectToTeacher,
  terminateClassAssignment,
  terminateSubjectAssignment,
} from "../../features/adminFeatures/teachers/teacherService";
import AssignClassDialog from "../../components/Teacher/AssignClassDialog";
import AssignSubjectDialog from "../../components/Teacher/AssignSubjectDialog";
import EditTeacherDialog from "../../components/Teacher/EditTeacherDialog";
import ConfirmDialog from "../../components/ConfirmDialog";
import Button from "../../components/CommonElements/Button";
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";
import ConfirmTerminate from "../../components/ConfirmTerminate";
import { deleteTeacher } from "../../features/adminFeatures/teachers/teacherService";

export default function TeacherProfilePage() {
  const { id } = useParams();
  // Helper to extract readable error messages from server responses
  const errMsg = (err, fallback) => {
    const data = err?.response?.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object")
      return data.message || data.title || fallback;
    return err?.message || fallback;
  };
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignSubjectOpen, setAssignSubjectOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busyDelete, setBusyDelete] = useState(false);

  const [confirmClass, setConfirmClass] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [confirmSubject, setConfirmSubject] = useState({
    open: false,
    id: null,
    subject: "",
    className: "",
  });
  const [busyTerminateClass, setBusyTerminateClass] = useState(false);
  const [busyTerminateSubject, setBusyTerminateSubject] = useState(false);
  const [errors, setErrors] = useState({ open: false, msg: "" });
  const [success, setSuccess] = useState({ open: false, msg: "" });

  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "T";
    const parts = String(name).trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

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
      <div className="mx-auto max-w-7xl">
        <header className="mb-4 flex items-center justify-between bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-6 rounded-2xl px-6 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />
          <div className="flex items-center gap-4">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-cyan-700 text-white text-base font-bold">
              {getInitials(teacher.fullName)}
            </span>
            <div>
              <h1 className="text-3xl font-bold text-cyan-50">
                {teacher.fullName || "Teacher Profile"}
              </h1>
              <p className="text-sm text-cyan-50/90">
                {(teacher.user && teacher.user.email) ||
                  "Detailed information and assignments"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              bgcolor="bg-cyan-600"
              label="Back"
              onClick={() => navigate("/teachers")}
            ></Button>

            <Button
              onClick={() => setAssignOpen(true)}
              bgcolor="bg-cyan-600"
              label="Assign Class"
            ></Button>
            <Button
              onClick={() => setAssignSubjectOpen(true)}
              bgcolor="bg-cyan-600"
              label=" Assign Subject"
            ></Button>

            <Button
              onClick={() => setEditOpen(true)}
              bgcolor="bg-cyan-600"
              label="Edit Profile"
            ></Button>
            <Button
              onClick={() => setDeleteOpen(true)}
              label="Delete"
              bgcolor="bg-red-600"
            ></Button>
          </div>
        </header>

        {/* Identity */}
        {/* Quick stats */}
        <section className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-cyan-200 bg-white p-4 flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-cyan-700 text-white text-sm font-bold">
              {Array.isArray(teacher.classAssignments)
                ? teacher.classAssignments.filter((a) => a.isActive).length
                : 0}
            </span>
            <div>
              <div className="text-sm font-semibold text-neutral-900">
                Active Classes
              </div>
              <div className="text-xs text-neutral-600">
                Current assignments
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-cyan-200 bg-white p-4 flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-cyan-700 text-white text-sm font-bold">
              {Array.isArray(teacher.subjectClasses)
                ? teacher.subjectClasses.filter((s) => s.isActive).length
                : 0}
            </span>
            <div>
              <div className="text-sm font-semibold text-neutral-900">
                Active Subjects
              </div>
              <div className="text-xs text-neutral-600">
                Current assignments
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-cyan-200 bg-white p-4 flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500 to-cyan-700 text-white text-sm font-bold">
              {(Array.isArray(teacher.classAssignments)
                ? teacher.classAssignments.length
                : 0) +
                (Array.isArray(teacher.subjectClasses)
                  ? teacher.subjectClasses.length
                  : 0)}
            </span>
            <div>
              <div className="text-sm font-semibold text-neutral-900">
                Total Assignments
              </div>
              <div className="text-xs text-neutral-600">All-time count</div>
            </div>
          </div>
        </section>

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
          <div className="rounded-xl border border-cyan-200 bg-white p-4">
            <p className="text-xs text-neutral-600">Address</p>
            <p className="text-sm font-semibold text-neutral-900">
              {teacher.address || "-"}
            </p>
          </div>
        </section>

        {/* Assignments */}
        <section className="grid gap-3 sm:grid-cols-2">
          <Card title="Class Assignments">
            {Array.isArray(teacher.classAssignments) &&
            teacher.classAssignments.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {teacher.classAssignments
                  .slice()
                  .sort((a, b) => (b.isActive === true) - (a.isActive === true))
                  .map((a) => (
                    <div
                      key={a.id}
                      className={`rounded-lg p-3 ${a.isActive ? "border border-cyan-200 bg-cyan-50" : "border border-gray-200 bg-white"}`}
                    >
                      <p className="text-sm font-semibold text-neutral-900">
                        {a.className || "-"}
                      </p>
                      <p className="text-xs text-neutral-700">
                        Role: {a.role || "-"}
                      </p>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border ${a.isActive ? "bg-cyan-50 text-cyan-700 border-cyan-200" : "bg-neutral-50 text-neutral-600 border-neutral-200"}`}
                        >
                          Status: {a.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-700">
                        Created:{" "}
                        {a.createdDate
                          ? new Date(a.createdDate).toLocaleString()
                          : "-"}
                      </p>
                      {!a.isActive && (
                        <p className="text-xs text-neutral-700">
                          End:{" "}
                          {a.updatedDate &&
                          a.updatedDate !== "0001-01-01T00:00:00"
                            ? new Date(a.updatedDate).toLocaleString()
                            : "-"}
                        </p>
                      )}

                      <p className="text-xs text-neutral-700 truncate">
                        {a.description || "-"}
                      </p>
                      {a.isActive ? (
                        <div className="mt-2 flex gap-2">
                          <button
                            className="rounded-lg border border-cyan-600 bg-white px-3 py-1 text-xs text-cyan-700 hover:bg-cyan-50"
                            onClick={() =>
                              setConfirmClass({
                                open: true,
                                id: a.id,
                                name: a.className,
                              })
                            }
                          >
                            Terminate
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-600">No class assignments</p>
            )}
          </Card>
          <Card title="Subject Assignments">
            {Array.isArray(teacher.subjectClasses) &&
            teacher.subjectClasses.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {teacher.subjectClasses
                  .slice()
                  .sort((a, b) => (b.isActive === true) - (a.isActive === true))
                  .map((s) => (
                    <div
                      key={s.id}
                      className={`rounded-lg p-3 ${s.isActive ? "border border-cyan-200 bg-cyan-50" : "border border-gray-200 bg-white"}`}
                    >
                      <p className="text-sm font-semibold text-neutral-900">
                        {s.subjectName || s.subject || "-"}
                      </p>
                      <p className="text-xs text-neutral-700">
                        Class: {s.className || "-"}
                      </p>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border ${s.isActive ? "bg-cyan-50 text-cyan-700 border-cyan-200" : "bg-neutral-50 text-neutral-600 border-neutral-200"}`}
                        >
                          Status: {s.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-700">
                        Start:{" "}
                        {s.startDate && s.startDate !== "0001-01-01T00:00:00"
                          ? new Date(s.startDate).toLocaleString()
                          : "-"}
                      </p>
                      {!s.isActive && (
                        <p className="text-xs text-neutral-700">
                          End:{" "}
                          {s.endDate && s.endDate !== "0001-01-01T00:00:00"
                            ? new Date(s.endDate).toLocaleString()
                            : "-"}
                        </p>
                      )}

                      <p className="text-xs text-neutral-700 truncate">
                        {s.description || "-"}
                      </p>
                      {s.isActive ? (
                        <div className="mt-2 flex gap-2">
                          <button
                            className="rounded-lg border border-cyan-600 bg-white px-3 py-1 text-xs text-cyan-700 hover:bg-cyan-50"
                            onClick={() =>
                              setConfirmSubject({
                                open: true,
                                id: s.id,
                                subject: s.subjectName || s.subject,
                                className: s.className,
                              })
                            }
                          >
                            Terminate
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-600">No subject assignments</p>
            )}
          </Card>
        </section>
      </div>
      {assignOpen && (
        <AssignClassDialog
          teacherId={id}
          onClose={() => setAssignOpen(false)}
          onSave={async () => {
            try {
              const data = await getTeacherById(id);
              setTeacher(data);
              setSuccess({ open: true, msg: "Class assigned successfully" });
              setAssignOpen(false);
            } catch (err) {
              setErrors({
                open: true,
                msg: errMsg(err, "Failed to assign class. Please try again."),
              });
            }
          }}
        />
      )}
      {editOpen && (
        <EditTeacherDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          teacher={teacher}
          onSaved={async () => {
            const data = await getTeacherById(id);
            setTeacher(data);
            setEditOpen(false);
            setSuccess({
              open: true,
              msg: "Teacher profile updated successfully",
            });
          }}
        />
      )}
      {deleteOpen && (
        <ConfirmDialog
          open={deleteOpen}
          title="Delete Teacher"
          message={`Are you sure you want to delete "${teacher.fullName || "this teacher"}"? This action cannot be undone.`}
          cancelLabel="Cancel"
          confirmLabel="Delete"
          busy={busyDelete}
          onCancel={() => setDeleteOpen(false)}
          onConfirm={async () => {
            try {
              setBusyDelete(true);
              await deleteTeacher(teacher.id);
              setSuccess({ open: true, msg: "Teacher deleted successfully" });
              setDeleteOpen(false);
              navigate("/teachers");
            } catch (err) {
              setErrors({
                open: true,
                msg: errMsg(err, "Failed to delete teacher."),
              });
            } finally {
              setBusyDelete(false);
            }
          }}
        />
      )}
      {assignSubjectOpen && (
        <AssignSubjectDialog
          teacherId={id}
          onClose={() => setAssignSubjectOpen(false)}
          onSave={async () => {
            try {
              const data = await getTeacherById(id);
              setSuccess({
                open: true,
                msg: "Subject assigned successfully",
              });
              setTeacher(data);
              setAssignSubjectOpen(false);
            } catch (err) {
              setErrors({
                open: true,
                msg: errMsg(err, "Failed to assign subject. Please try again."),
              });
            }
          }}
        />
      )}

      {/* Confirm terminate class assignment */}
      {confirmClass.open && (
        <ConfirmTerminate
          open={confirmClass.open}
          name={confirmClass.name}
          busy={busyTerminateClass}
          onCancel={() => setConfirmClass({ open: false, id: null, name: "" })}
          onConfirm={async () => {
            try {
              setBusyTerminateClass(true);
              await terminateClassAssignment(confirmClass.id);
              const data = await getTeacherById(id);
              setTeacher(data);
              setSuccess({
                open: true,
                msg: "Class assignment terminated successfully",
              });
              setConfirmClass({ open: false, id: null, name: "" });
            } catch (err) {
              setErrors({
                open: true,
                msg: errMsg(err, "Failed to terminate assignment."),
              });
            } finally {
              setBusyTerminateClass(false);
            }
          }}
        />
      )}

      {/* Confirm terminate subject assignment */}
      {confirmSubject.open && (
        <ConfirmTerminate
          open={confirmSubject.open}
          subject={confirmSubject.subject}
          className={confirmSubject.className}
          busy={busyTerminateSubject}
          onCancel={() =>
            setConfirmSubject({
              open: false,
              id: null,
              subject: "",
              className: "",
            })
          }
          onConfirm={async () => {
            try {
              setBusyTerminateSubject(true);
              await terminateSubjectAssignment(confirmSubject.id);
              const data = await getTeacherById(id);
              setSuccess({
                open: true,
                msg: "Subject assignment terminated successfully",
              });
              setTeacher(data);
              setConfirmSubject({
                open: false,
                id: null,
                subject: "",
                className: "",
              });
            } catch (err) {
              setErrors({
                open: true,
                msg: errMsg(err, "Failed to terminate subject assignment."),
              });
            } finally {
              setBusyTerminateSubject(false);
            }
          }}
        />
      )}

      <SuccessAlert
        isOpen={success.open}
        message={success.msg}
        onClose={() => setSuccess({ open: false, msg: "" })}
      />

      <ErrorAlert
        isOpen={errors.open}
        message={errors.msg}
        onClose={() => setErrors({ open: false, msg: "" })}
      />
    </>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-cyan-200 bg-white p-3">
      <p className="text-xs text-neutral-600">{label}</p>
      <p className="text-sm font-semibold text-neutral-900">{value || "-"}</p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-xl border border-cyan-200 bg-white p-4">
      <p className="mb-2 text-sm font-semibold text-neutral-900">{title}</p>
      {children}
    </div>
  );
}
