import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  getTeacherById,
  assignClassToTeacher,
  assignSubjectToTeacher,
  terminateClassAssignment,
  terminateSubjectAssignment,
} from "../../features/adminFeatures/teachers/teacherService";
import AssignClassDialog from "../../components/Teacher/AssignClassDialog";
import AssignSubjectDialog from "../../components/Teacher/AssignSubjectDialog";
import EditTeacherDialog from "../../components/Teacher/EditTeacherDialog";
import DeleteTeacherDialog from "../../components/Teacher/DeleteTeacherDialog";
import Modal from "../../components/modal";

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
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [initialAssign, setInitialAssign] = useState({
    gradeId: null,
    classId: null,
  });
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
            <Link
              to="/teachers"
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-700"
            >
              Back to List
            </Link>

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

            <button
              onClick={() => setEditOpen(true)}
              className="rounded-lg bg-teal-600 px-3 py-2 text-sm text-white hover:bg-teal-700"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              className="rounded-lg bg-rose-600 px-3 py-2 text-sm text-white hover:bg-rose-700"
            >
              Delete
            </button>
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
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {teacher.classAssignments
                  .slice()
                  .sort((a, b) => (b.isActive === true) - (a.isActive === true))
                  .map((a) => (
                    <div
                      key={a.id}
                      className={`rounded-lg p-3 ${a.isActive ? "border border-teal-200 bg-teal-50" : "border border-gray-200 bg-white"}`}
                    >
                      <p className="text-sm font-semibold text-neutral-900">
                        {a.className || "-"}
                      </p>
                      <p className="text-xs text-neutral-700">
                        Role: {a.role || "-"}
                      </p>
                      <p
                        className={`text-xs ${a.isActive ? "text-teal-700" : "text-neutral-700"}`}
                      >
                        Status: {a.isActive ? "Active" : "Inactive"}
                      </p>
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
                            className="rounded-lg border border-teal-600 bg-white px-3 py-1 text-xs text-teal-700 hover:bg-teal-50"
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
            {assignSubjectError && (
              <div className="mb-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                {assignSubjectError}
              </div>
            )}
            {Array.isArray(teacher.subjectClasses) &&
            teacher.subjectClasses.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {teacher.subjectClasses
                  .slice()
                  .sort((a, b) => (b.isActive === true) - (a.isActive === true))
                  .map((s) => (
                    <div
                      key={s.id}
                      className={`rounded-lg p-3 ${s.isActive ? "border border-teal-200 bg-teal-50" : "border border-gray-200 bg-white"}`}
                    >
                      <p className="text-sm font-semibold text-neutral-900">
                        {s.subjectName || s.subject || "-"}
                      </p>
                      <p className="text-xs text-neutral-700">
                        Class: {s.className || "-"}
                      </p>
                      <p
                        className={`text-xs ${s.isActive ? "text-teal-700" : "text-neutral-700"}`}
                      >
                        Status: {s.isActive ? "Active" : "Inactive"}
                      </p>
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
                            className="rounded-lg border border-teal-600 bg-white px-3 py-1 text-xs text-teal-700 hover:bg-teal-50"
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
      {editOpen && (
        <EditTeacherDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          teacher={teacher}
          onSaved={async () => {
            const data = await getTeacherById(id);
            setTeacher(data);
            setEditOpen(false);
          }}
        />
      )}
      {deleteOpen && (
        <DeleteTeacherDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          teacher={teacher}
          onDeleted={() => {
            setDeleteOpen(false);
            window.location.href = "/teachers";
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

      {/* Confirm terminate class assignment */}
      {confirmClass.open && (
        <ConfirmClassTerminate
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
              setConfirmClass({ open: false, id: null, name: "" });
            } catch (err) {
              setAssignError("Failed to terminate assignment.");
            } finally {
              setBusyTerminateClass(false);
            }
          }}
        />
      )}

      {/* Confirm terminate subject assignment */}
      {confirmSubject.open && (
        <ConfirmSubjectTerminate
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
              setTeacher(data);
              setConfirmSubject({
                open: false,
                id: null,
                subject: "",
                className: "",
              });
            } catch (err) {
              setAssignSubjectError("Failed to terminate subject assignment.");
            } finally {
              setBusyTerminateSubject(false);
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

// Confirmation Modals
// Class terminate confirm
function ConfirmClassTerminate({ open, name, onCancel, onConfirm, busy }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Terminate Class Assignment"
      footer={
        <>
          <button
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-neutral-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`rounded-lg px-3 py-2 text-sm ${busy ? "bg-teal-300 text-white" : "bg-teal-600 text-white hover:bg-teal-700"}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Terminating..." : "Confirm"}
          </button>
        </>
      }
    >
      <p className="text-sm text-neutral-800">
        Are you sure you want to terminate this class assignment
        {name ? ` for ${name}` : ""}? This action cannot be undone.
      </p>
    </Modal>
  );
}

// Subject terminate confirm
function ConfirmSubjectTerminate({
  open,
  subject,
  className,
  onCancel,
  onConfirm,
  busy,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Terminate Subject Assignment"
      footer={
        <>
          <button
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-neutral-400"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`rounded-lg px-3 py-2 text-sm ${busy ? "bg-teal-300 text-white" : "bg-teal-600 text-white hover:bg-teal-700"}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? "Terminating..." : "Confirm"}
          </button>
        </>
      }
    >
      <p className="text-sm text-neutral-800">
        Are you sure you want to terminate the subject assignment
        {subject ? ` ${subject}` : ""}
        {className ? ` for ${className}` : ""}? This action cannot be undone.
      </p>
    </Modal>
  );
}
