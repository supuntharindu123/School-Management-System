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
  // Helper to extract a user-friendly error message
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
  const [deletingId, setDeletingId] = useState(null); // kept for UI disable if needed
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

  // Loaded grades from API
  const grades = useMemo(() => gradesState?.grades || [], [gradesState.grades]);

  const filtered = useMemo(() => {
    return subjects.filter((s) => {
      return query
        ? [s.subjectName, s.moduleCode].some((f) =>
            f.toLowerCase().includes(query.toLowerCase()),
          )
        : true;
    });
  }, [subjects, query]);

  const openAdd = () => setAddModal({ open: true });
  const closeAdd = () => setAddModal({ open: false });
  const saveAdd = async (payload) => {
    try {
      const res = await addSubject(payload);
      console.log("Added subject:", res);
      // Refresh from API to ensure correct server IDs and data
      await dispatch(getAllSubjects());
      setSuccess({ open: true, msg: "Subject added successfully." });
      setErrors({ open: false, msg: "" });
    } catch (err) {
      setErrors({ open: true, msg: errMsg(err, "Failed to add subject") });
      setSuccess({ open: false, msg: "" });
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
      setErrors({ open: false, msg: "" });
    } catch (err) {
      setErrors({
        open: true,
        msg: errMsg(err, "Failed to assign subject to grades"),
      });
      setSuccess({ open: false, msg: "" });
    } finally {
      setAssignSubmitting(false);
    }
  };

  const currentGrades = (
    subjects.find((s) => s.id === assignModal.subjectId)?.grades || []
  ).map((g) => g.id);

  const startDeleteSubject = (row) => {
    if (!row?.id) return;
    setConfirmDelete({ open: true, subject: row });
  };

  const confirmDeleteSubject = async () => {
    const row = confirmDelete.subject;
    if (!row?.id) return;
    try {
      setBusyConfirm(true);
      await deleteSubject(row.id);
      await dispatch(getAllSubjects());
      setSuccess({ open: true, msg: "Subject deleted successfully." });
      setErrors({ open: false, msg: "" });
      setConfirmDelete({ open: false, subject: null });
    } catch (err) {
      setErrors({ open: true, msg: errMsg(err, "Failed to delete subject") });
      setSuccess({ open: false, msg: "" });
    } finally {
      setBusyConfirm(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="mb-4 flex items-center justify-between bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-6 rounded-2xl px-6 relative overflow-hidden">
        <div>
          <h1 className="text-3xl font-bold text-cyan-50">
            Subject Management
          </h1>
          <p className="text-sm text-cyan-50">
            Manage subjects and assign them to grades
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            placeholder="Search by name or code"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
          <Button label="Add Subject" onClick={openAdd} />
        </div>
      </header>

      {/* Table */}
      {loading ? (
        <p>Loading subjects...</p>
      ) : (
        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-neutral-800 bg-cyan-600 rounded-t-lg">
                  <th className="border-b border-gray-200 py-2 px-3 rounded-tl-lg">
                    Name
                  </th>
                  <th className="border-b border-gray-200 py-2 px-3">Code</th>
                  <th className="border-b border-gray-200 py-2 px-3">
                    Assigned Grades
                  </th>
                  <th className="border-b border-gray-200 py-2 px-3 text-right rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-neutral-800">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="border-b border-gray-200 py-2 px-3 font-medium">
                      {row.subjectName}
                    </td>
                    <td className="border-b border-gray-200 py-2 px-3">
                      {row.moduleCode}
                    </td>
                    <td className="border-b border-gray-200 py-2 px-3 truncate max-w-[280px]">
                      {row.grades.length
                        ? row.grades.map((g) => g.gradeName).join(", ")
                        : "-"}
                    </td>
                    <td className="border-b border-gray-200 py-2 px-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openAssign(row)}
                          className="rounded-lg border border-cyan-100 bg-white px-3 py-1.5 text-xs text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
                        >
                          Assign to Grades
                        </button>
                        {(row.grades?.length ?? 0) === 0 && (
                          <button
                            onClick={() => startDeleteSubject(row)}
                            className={`rounded-lg p-2 text-xs ${
                              confirmDelete.open &&
                              confirmDelete.subject?.id === row.id
                                ? " text-rose-400 bg-white"
                                : " bg-white text-rose-700 hover:border-rose-600 hover:text-rose-600"
                            }`}
                            aria-label="Delete subject"
                            title="Delete subject"
                            disabled={
                              confirmDelete.open &&
                              confirmDelete.subject?.id === row.id
                            }
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      className="py-10 text-center text-neutral-600"
                      colSpan={4}
                    >
                      No subjects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Modals */}
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

      {success.open && (
        <SuccessAlert
          isOpen={success.open}
          message={success.msg}
          onClose={() => setSuccess({ open: false, msg: "" })}
        />
      )}
      {errors.open && (
        <ErrorAlert
          isOpen={errors.open}
          message={errors.msg}
          onClose={() => setErrors({ open: false, msg: "" })}
        />
      )}

      {confirmDelete.open && (
        <ConfirmDialog
          open={confirmDelete.open}
          title="Delete Subject"
          message={`Are you sure you want to delete subject "${confirmDelete.subject?.subjectName}"? This action cannot be undone.`}
          cancelLabel="Cancel"
          confirmLabel="Delete"
          busy={busyConfirm}
          onCancel={() => setConfirmDelete({ open: false, subject: null })}
          onConfirm={() => {
            confirmDeleteSubject();
            setConfirmDelete({ open: false, subject: null });
          }}
        />
      )}
    </div>
  );
}
