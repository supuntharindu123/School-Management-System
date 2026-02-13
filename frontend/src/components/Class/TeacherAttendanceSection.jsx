import React, { useMemo, useState } from "react";
import Button from "../CommonElements/Button";
import ConfirmDialog from "../ConfirmDialog";
import SuccessAlert from "../SuccessAlert";
import ErrorAlert from "../ErrorAlert";
import { MarkStudentAttendances } from "../../features/attendances/attendanceService";

export default function TeacherAttendanceSection({
  students = [],
  teacherId,
  onSuccess,
}) {
  const getToday = () => new Date().toISOString().split("T")[0];

  const [date] = useState(getToday());
  const [rows, setRows] = useState(() =>
    (students || []).reduce(
      (acc, s) => ({ ...acc, [s.id]: { isPresent: true, reason: "" } }),
      {},
    ),
  );

  const [uiState, setUiState] = useState({
    submitting: false,
    confirm: false,
    busy: false,
  });
  const [alert, setAlert] = useState({ type: null, msg: "" });

  const allPresent = useMemo(() => {
    const ids = Object.keys(rows);
    return ids.length > 0 && ids.every((id) => rows[id].isPresent);
  }, [rows]);

  const setAll = (present) => {
    const next = {};
    Object.keys(rows).forEach((id) => {
      next[id] = {
        isPresent: !!present,
        reason: present ? "" : rows[id]?.reason || "",
      };
    });
    setRows(next);
  };

  const setCell = (studentId, patch) => {
    setRows((r) => ({
      ...r,
      [studentId]: {
        ...(r[studentId] || { isPresent: true, reason: "" }),
        ...patch,
      },
    }));
  };

  const handleMarkAttendance = async () => {
    if (!teacherId) {
      setAlert({ type: "error", msg: "Missing teacher identity." });
      return;
    }

    setUiState((s) => ({ ...s, busy: true }));
    try {
      const payload = students.map((s) => ({
        isPresent: !!rows[s.id]?.isPresent,
        reason: rows[s.id]?.isPresent ? null : rows[s.id]?.reason || null,
        date,
        studentId: s.id,
        teacherId,
      }));

      await MarkStudentAttendances(payload);
      setAlert({ type: "success", msg: "Attendance marked successfully." });
      if (onSuccess) onSuccess();
      setUiState((s) => ({ ...s, confirm: false }));
    } catch (e) {
      setAlert({
        type: "error",
        msg: e?.response?.data || e?.message || "Submission failed.",
      });
    } finally {
      setUiState((s) => ({ ...s, busy: false, submitting: false }));
    }
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Interaction Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b-2 border-neutral-100 pb-6">
        <div>
          <p className="text-xs font-bold capitalize text-cyan-600 mb-1">
            Daily log
          </p>
          <h3 className="text-2xl font-bold text-neutral-900 tracking-tight capitalize">
            Mark attendance
          </h3>
          <p className="text-sm font-medium text-neutral-400 font-mono mt-1">
            {date}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAll(!allPresent)}
          className={`px-6 py-2.5 rounded-2xl text-xs font-bold capitalize transition-all border-2 ${
            allPresent
              ? "bg-neutral-50 border-neutral-200 text-neutral-400 hover:border-rose-200 hover:text-rose-500"
              : "bg-cyan-50 border-cyan-100 text-cyan-700 hover:bg-cyan-600 hover:text-white hover:border-cyan-600"
          }`}
        >
          {allPresent ? "Clear all" : "Mark all present"}
        </button>
      </div>

      {/* Attendance Grid */}
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 text-xs font-bold capitalize text-neutral-500 border-b border-neutral-200">
                <th className="px-6 py-5">Student ID</th>
                <th className="px-6 py-5">Student name</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Reason for absence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {students.map((s) => {
                const r = rows[s.id] || { isPresent: true, reason: "" };
                return (
                  <tr
                    key={s.id}
                    className={`transition-colors ${!r.isPresent ? "bg-rose-50/30" : "hover:bg-neutral-50/50"}`}
                  >
                    <td className="px-6 py-5 text-[16px] font-mono font-medium text-neutral-400">
                      {s.studentIDNumber}
                    </td>
                    <td className="px-6 py-5 font-bold text-neutral-900">
                      {s.fullName}
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() =>
                          setCell(s.id, { isPresent: !r.isPresent })
                        }
                        className={`w-24 py-2 rounded-xl text-xs font-bold capitalize transition-all border-2 ${
                          r.isPresent
                            ? "bg-cyan-50 border-cyan-200 text-cyan-700"
                            : "bg-rose-100 border-rose-200 text-rose-700"
                        }`}
                      >
                        {r.isPresent ? "Present" : "Absent"}
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <input
                        type="text"
                        placeholder="State reason..."
                        value={r.reason}
                        onChange={(e) =>
                          setCell(s.id, { reason: e.target.value })
                        }
                        disabled={r.isPresent}
                        className="w-full bg-transparent text-sm border-b border-transparent focus:border-cyan-500 outline-none py-1 disabled:opacity-0 transition-all italic"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Submission */}
      <div className="flex justify-end pt-4">
        <Button
          label={uiState.submitting ? "Processing..." : "Submit records"}
          onClick={() => {
            setUiState((s) => ({ ...s, submitting: true, confirm: true }));
          }}
          disabled={uiState.submitting || !students.length}
          className="rounded-2xl"
        />
      </div>

      {/* Dialogs */}
      {uiState.confirm && (
        <ConfirmDialog
          open={uiState.confirm}
          title="Verify attendance"
          message={`Are you ready to submit logs for ${students.length} students?`}
          confirmLabel="Yes, submit"
          cancelLabel="Review"
          busy={uiState.busy}
          onCancel={() =>
            setUiState((s) => ({ ...s, confirm: false, submitting: false }))
          }
          onConfirm={handleMarkAttendance}
        />
      )}

      <SuccessAlert
        isOpen={alert.type === "success"}
        message={alert.msg}
        onClose={() => setAlert({ type: null, msg: "" })}
      />
      <ErrorAlert
        isOpen={alert.type === "error"}
        message={alert.msg}
        onClose={() => setAlert({ type: null, msg: "" })}
      />
    </div>
  );
}
