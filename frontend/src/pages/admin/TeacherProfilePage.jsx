import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTeacherById,
  terminateClassAssignment,
  terminateSubjectAssignment,
  deleteTeacher,
} from "../../features/adminFeatures/teachers/teacherService";

// components
import AssignClassDialog from "../../components/Teacher/AssignClassDialog";
import AssignSubjectDialog from "../../components/Teacher/AssignSubjectDialog";
import EditTeacherDialog from "../../components/Teacher/EditTeacherDialog";
import ConfirmDialog from "../../components/ConfirmDialog";
import Button from "../../components/CommonElements/Button";
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";
import ConfirmTerminate from "../../components/ConfirmTerminate";

export default function TeacherProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [alert, setAlert] = useState({ open: false, msg: "", type: "success" });

  const errMsg = (err, fallback) => {
    const data = err?.response?.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object")
      return data.message || data.title || fallback;
    return err?.message || fallback;
  };

  const getInitials = (name) => {
    if (!name) return "T";
    const parts = String(name).trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const loadData = useCallback(async () => {
    try {
      const data = await getTeacherById(id);
      setTeacher(data);
    } catch (err) {
      setError("Failed to load teacher profile.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const executeAction = async (actionFn, successMsg) => {
    setBusy(true);
    try {
      await actionFn();
      await loadData();
      setAlert({ open: true, msg: successMsg, type: "success" });
      setActiveModal(null);
    } catch (err) {
      setAlert({
        open: true,
        msg: errMsg(err, "Action failed"),
        type: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <StatusBox message="Loading teacher profile..." />;
  if (error) return <StatusBox message={error} variant="error" />;
  if (!teacher) return <StatusBox message="No teacher data found." />;

  const user = teacher.user || {};

  return (
    <>
      <div className="max-w-full mx-auto space-y-8 pb-16 animate-fade-in px-4">
        {/* header */}
        <header className="flex flex-wrap items-center justify-between gap-4 bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-6 rounded-2xl px-6 relative overflow-hidden shadow-lg">
          <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl" />
          <div className="flex items-center gap-4">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white text-xl font-bold border border-white/20">
              {getInitials(teacher.fullName)}
            </span>
            <div>
              <h1 className="text-3xl font-bold text-cyan-50">
                {teacher.fullName || "Teacher Profile"}
              </h1>
              <p className="text-sm text-cyan-100/80">
                Employee ID: {teacher.id || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              bgcolor="bg-cyan-600"
              label="Back"
              onClick={() => navigate("/teachers")}
            />
            <Button
              bgcolor="bg-cyan-600"
              label="Assign Class"
              onClick={() => setActiveModal("assignClass")}
            />
            <Button
              bgcolor="bg-cyan-600"
              label="Assign Subject"
              onClick={() => setActiveModal("assignSubject")}
            />
            <Button
              bgcolor="bg-cyan-600"
              label="Edit Profile"
              onClick={() => setActiveModal("edit")}
            />
            <Button
              bgcolor="bg-red-600"
              label="Delete"
              onClick={() => setActiveModal("delete")}
            />
          </div>
        </header>

        {/* Unified Profile Details Container */}
        <section className="rounded-2xl border border-cyan-100 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-cyan-50 bg-cyan-50/30 px-6 "></div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-3">
              <Info label="Full Name" value={teacher.fullName} />
              <Info label="Email Address" value={user.email} />
              <Info label="Account Username" value={user.userName} />
              <Info label="Gender" value={teacher.gender} />
              <Info label="Date of Birth" value={teacher.birthDay} />
              <Info label="City / Region" value={teacher.city} />
              <div className="sm:col-span-3">
                <Info label="Home Address" value={teacher.address} />
              </div>
            </div>
          </div>
        </section>

        {/* quick stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Active Classes"
            count={
              teacher.classAssignments?.filter((a) => a.isActive).length || 0
            }
            sub="Current responsibilities"
          />
          <StatCard
            label="Active Subjects"
            count={
              teacher.subjectClasses?.filter((s) => s.isActive).length || 0
            }
            sub="Subjects being taught"
          />
          <StatCard
            label="Historical Total"
            count={
              (teacher.classAssignments?.length || 0) +
              (teacher.subjectClasses?.length || 0)
            }
            sub="All-time system records"
          />
        </section>

        {/* assignment containers */}
        <section className="grid gap-4 sm:grid-cols-2">
          <Card title="Class Assignments">
            <div className="space-y-3">
              {teacher.classAssignments?.length > 0 ? (
                teacher.classAssignments
                  .slice()
                  .sort((a, b) => (b.isActive === true) - (a.isActive === true))
                  .map((a) => (
                    <AssignmentRow
                      key={a.id}
                      title={a.className}
                      sub={`Role: ${a.role}`}
                      isActive={a.isActive}
                      onTerminate={() => {
                        setModalData(a);
                        setActiveModal("terminateClass");
                      }}
                    />
                  ))
              ) : (
                <p className="text-xs text-neutral-500 italic">
                  No classes assigned yet.
                </p>
              )}
            </div>
          </Card>

          <Card title="Subject Assignments">
            <div className="space-y-3">
              {teacher.subjectClasses?.length > 0 ? (
                teacher.subjectClasses
                  .slice()
                  .sort((a, b) => (b.isActive === true) - (a.isActive === true))
                  .map((s) => (
                    <AssignmentRow
                      key={s.id}
                      title={s.subjectName || s.subject}
                      sub={`Class: ${s.className}`}
                      isActive={s.isActive}
                      onTerminate={() => {
                        setModalData(s);
                        setActiveModal("terminateSubject");
                      }}
                    />
                  ))
              ) : (
                <p className="text-xs text-neutral-500 italic">
                  No subjects assigned yet.
                </p>
              )}
            </div>
          </Card>
        </section>
      </div>

      {/* dialogs (kept the same logic) */}
      {activeModal === "assignClass" && (
        <AssignClassDialog
          teacherId={id}
          onClose={() => setActiveModal(null)}
          onSave={() => executeAction(() => {}, "Class assigned successfully")}
        />
      )}
      {activeModal === "assignSubject" && (
        <AssignSubjectDialog
          teacherId={id}
          onClose={() => setActiveModal(null)}
          onSave={() =>
            executeAction(() => {}, "Subject assigned successfully")
          }
        />
      )}
      {activeModal === "edit" && (
        <EditTeacherDialog
          open={true}
          teacher={teacher}
          onClose={() => setActiveModal(null)}
          onSaved={() =>
            executeAction(() => {}, "Profile updated successfully")
          }
        />
      )}
      {activeModal === "delete" && (
        <ConfirmDialog
          open={true}
          title="Delete Teacher"
          busy={busy}
          message={`Are you sure you want to delete "${teacher.fullName}"?`}
          onCancel={() => setActiveModal(null)}
          onConfirm={() =>
            executeAction(
              () => deleteTeacher(teacher.id),
              "Teacher deleted successfully",
            ).then(() => navigate("/teachers"))
          }
        />
      )}
      {activeModal === "terminateClass" && (
        <ConfirmTerminate
          open={true}
          name={modalData?.className}
          busy={busy}
          onCancel={() => setActiveModal(null)}
          onConfirm={() =>
            executeAction(
              () => terminateClassAssignment(modalData.id),
              "Class assignment terminated",
            )
          }
        />
      )}
      {activeModal === "terminateSubject" && (
        <ConfirmTerminate
          open={true}
          subject={modalData?.subjectName || modalData?.subject}
          className={modalData?.className}
          busy={busy}
          onCancel={() => setActiveModal(null)}
          onConfirm={() =>
            executeAction(
              () => terminateSubjectAssignment(modalData.id),
              "Subject assignment terminated",
            )
          }
        />
      )}

      <SuccessAlert
        isOpen={alert.open && alert.type === "success"}
        message={alert.msg}
        onClose={() => setAlert({ ...alert, open: false })}
      />
      <ErrorAlert
        isOpen={alert.open && alert.type === "error"}
        message={alert.msg}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </>
  );
}

// Optimized Info Component (No individual border)
function Info({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm font-bold text-cyan-600 capitalize tracking-tight mb-1">
        {label}
      </span>
      <span className="text-sm font-medium text-neutral-800">
        {value || "Not Provided"}
      </span>
    </div>
  );
}

// Assignment Row Helper
function AssignmentRow({ title, sub, isActive, onTerminate }) {
  return (
    <div
      className={`group flex items-center justify-between rounded-xl p-3 border transition-colors ${isActive ? "border-cyan-100 bg-cyan-50/50" : "border-neutral-100 bg-neutral-50"}`}
    >
      <div>
        <p className="text-sm font-bold text-neutral-900">{title || "-"}</p>
        <p className="text-sm text-neutral-600">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border capitalize ${isActive ? "bg-cyan-100 text-cyan-700 border-cyan-200" : "bg-neutral-200 text-neutral-600 border-neutral-300"}`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
        {isActive && (
          <button
            onClick={onTerminate}
            className="text-[11px] font-bold text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Terminate
          </button>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, count, sub }) {
  return (
    <div className="rounded-2xl border border-cyan-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-neutral-500 capitalize tracking-wider">
          {label}
        </span>
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700 text-sm font-black">
          {count}
        </span>
      </div>
      <div className="text-[11px] text-neutral-400">{sub}</div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-neutral-50 bg-neutral-50/50 px-5 py-3">
        <p className="text-sm font-bold text-neutral-700">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function StatusBox({ message, variant }) {
  const styles =
    variant === "error"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : "border-cyan-100 bg-cyan-50 text-cyan-800";
  return (
    <div
      className={`mx-auto max-w-7xl rounded-2xl border p-8 text-center font-medium ${styles}`}
    >
      {message}
    </div>
  );
}
