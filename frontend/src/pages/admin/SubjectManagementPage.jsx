import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/CommonElements/Button";
import { getAllSubjects } from "../../features/subject/subjectSlice";
import { getAllGrades } from "../../features/grade/gradeSlice";
import {
  addSubject,
  assignSubjectGrades,
  deleteSubject,
} from "../../features/subject/subjectService";
import AddSubjectModal from "../../components/Subject/AddSubjectModal";
import AssignGradesModal from "../../components/Subject/AssignGradesModal";
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";
import ConfirmDialog from "../../components/ConfirmDialog";

export default function SubjectManagementPage() {
  const errMsg = (err, fallback) => {
    const data = err?.response?.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object")
      return data.message || data.title || fallback;
    return err?.message || fallback;
  };

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [addModal, setAddModal] = useState({ open: false });
  const [assignModal, setAssignModal] = useState({
    open: false,
    subjectId: null,
  });
  const [subjects, setSubjects] = useState([]);
  const [assignSubmitting, setAssignSubmitting] = useState(false);
  const [success, setSuccess] = useState({ open: false, msg: "" });
  const [errors, setErrors] = useState({ open: false, msg: "" });
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    subject: null,
  });
  const [busyConfirm, setBusyConfirm] = useState(false);

  const dispatch = useDispatch();
  const subjectsList = useSelector((state) => state.subjects);
  const gradesState = useSelector((state) => state.grades);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllSubjects());
    dispatch(getAllGrades());
  }, [dispatch]);

  useEffect(() => {
    if (subjectsList?.subjects) {
      setSubjects(subjectsList.subjects);
      setLoading(false);
    }
  }, [subjectsList.subjects]);

  const grades = useMemo(() => gradesState?.grades || [], [gradesState.grades]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return subjects.filter(
      (s) =>
        !q ||
        [s.subjectName, s.moduleCode].some((f) => f?.toLowerCase().includes(q)),
    );
  }, [subjects, query]);

  const openAdd = () => setAddModal({ open: true });
  const closeAdd = () => setAddModal({ open: false });

  const saveAdd = async (payload) => {
    try {
      await addSubject(payload);
      await dispatch(getAllSubjects());
      setSuccess({ open: true, msg: "Subject added successfully." });
    } catch (err) {
      setErrors({ open: true, msg: errMsg(err, "Failed to add subject") });
    }
    closeAdd();
  };

  const openAssign = (row) => setAssignModal({ open: true, subjectId: row.id });
  const closeAssign = () => setAssignModal({ open: false, subjectId: null });

  const saveAssign = async (selectedGradeIds) => {
    if (assignSubmitting) return;
    try {
      setAssignSubmitting(true);
      const payload = selectedGradeIds.map((gid) => ({
        subjectId: assignModal.subjectId,
        gradeId: gid,
      }));
      await assignSubjectGrades(payload);
      await dispatch(getAllSubjects());
      closeAssign();
      setSuccess({ open: true, msg: "Grades assigned successfully." });
    } catch (err) {
      setErrors({
        open: true,
        msg: errMsg(err, "Failed to assign subject to grades"),
      });
    } finally {
      setAssignSubmitting(false);
    }
  };

  const currentGrades = (
    subjects.find((s) => s.id === assignModal.subjectId)?.grades || []
  ).map((g) => g.id);

  const confirmDeleteSubject = async () => {
    const row = confirmDelete.subject;
    if (!row?.id) return;
    try {
      setBusyConfirm(true);
      await deleteSubject(row.id);
      await dispatch(getAllSubjects());
      setSuccess({ open: true, msg: "Subject deleted successfully." });
      setConfirmDelete({ open: false, subject: null });
    } catch (err) {
      setErrors({ open: true, msg: errMsg(err, "Failed to delete subject") });
    } finally {
      setBusyConfirm(false);
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-8 pb-16 animate-fade-in px-4">
      {/* Enhanced dashboard header */}
      <header className="relative flex flex-col md:flex-row items-center justify-between gap-4 bg-linear-to-r from-cyan-900 via-cyan-800 to-cyan-900 p-8 rounded-2xl shadow-xl overflow-hidden group">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white capitalize">
            Subject management
          </h1>
          <p className="text-cyan-200/70 text-sm font-medium mt-1 capitalize">
            Manage subjects and assign them to grades
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-3 items-center">
          <div className="relative">
            <input
              placeholder="Search subjects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-64 rounded-2xl border-none bg-white/10 px-5 py-3 text-sm text-white placeholder:text-cyan-200/40 focus:bg-white focus:text-neutral-900 focus:ring-4 focus:ring-cyan-500/20 transition-all outline-none"
            />
          </div>
          <button
            onClick={openAdd}
            className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-bold text-white hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-900/20 capitalize"
          >
            Add subject
          </button>
        </div>

        {/* Decorative background element */}
        <div className="absolute -right-10 -bottom-10 h-40 w-40 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-colors duration-700"></div>
      </header>

      {/* Main content table */}
      <section className="rounded-2xl border border-neutral-100 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="h-8 w-8 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-neutral-400 capitalize ">
              Fetching subjects...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-cyan-800">
                  <th className="py-5 px-6 text-left text-sm font-bold text-cyan-50 capitalize ">
                    Subject identity
                  </th>
                  <th className="py-5 px-3 text-left text-sm font-bold text-cyan-50 capitalize ">
                    Module code
                  </th>
                  <th className="py-5 px-3 text-left text-sm font-bold text-cyan-50 capitalize ">
                    Assigned grades
                  </th>
                  <th className="py-5 px-6 text-right text-sm font-bold text-cyan-50 capitalize ">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="group hover:bg-cyan-50/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-neutral-800 capitalize">
                        {row.subjectName}
                      </p>
                    </td>
                    <td className="py-4 px-3">
                      <span className="text-sm font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-lg uppercase">
                        {row.moduleCode || "No code"}
                      </span>
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[300px]">
                        {row.grades.length > 0 ? (
                          row.grades.map((g) => (
                            <span
                              key={g.id}
                              className="text-sm font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md capitalize"
                            >
                              {g.gradeName}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-neutral-300 italic">
                            No grades assigned
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openAssign(row)}
                          className=" bg-cyan-800 text-sm border border-cyan-800 rounded-lg p-1 px-2   font-bold text-cyan-50 hover:text-cyan-600 transition-colors capitalize"
                        >
                          Manage grades
                        </button>
                        {(row.grades?.length ?? 0) === 0 && (
                          <button
                            onClick={() =>
                              setConfirmDelete({ open: true, subject: row })
                            }
                            className="h-8 w-8 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"
                            title="Delete subject"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Logic Modals */}
      {addModal.open && <AddSubjectModal onClose={closeAdd} onSave={saveAdd} />}
      {assignModal.open && (
        <AssignGradesModal
          grades={grades}
          selected={currentGrades}
          onClose={closeAssign}
          onSave={saveAssign}
          submitting={assignSubmitting}
        />
      )}

      {/* Feedback Alerts */}
      <SuccessAlert
        isOpen={success.open}
        message={success.msg}
        onClose={() => setSuccess({ ...success, open: false })}
      />
      <ErrorAlert
        isOpen={errors.open}
        message={errors.msg}
        onClose={() => setErrors({ ...errors, open: false })}
      />

      {confirmDelete.open && (
        <ConfirmDialog
          open={confirmDelete.open}
          title="Delete subject"
          message={`Are you sure you want to delete "${confirmDelete.subject?.subjectName}"? this action cannot be undone.`}
          cancelLabel="Keep subject"
          confirmLabel="Delete forever"
          busy={busyConfirm}
          onCancel={() => setConfirmDelete({ open: false, subject: null })}
          onConfirm={confirmDeleteSubject}
        />
      )}
    </div>
  );
}
