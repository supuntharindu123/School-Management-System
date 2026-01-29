import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Button from "../../components/CommonElements/Button";
import { getClassDetails } from "../../services/classes";
import { assignClassToTeacher } from "../../features/adminFeatures/teachers/teacherService";
import AssignClassDialog from "../../components/Teacher/AssignClassDialog";
import { useSelector } from "react-redux";
import {
  MarkStudentAttendances,
  GetClassAttendanceByDate,
  UpdateStudentAttendance,
} from "../../features/attendances/attendanceService";

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
  const [tab, setTab] = useState("details");
  const getTodayLocalISO = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  };
  const [viewDate, setViewDate] = useState(() => getTodayLocalISO());
  const [attendanceView, setAttendanceView] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState(null);
  const [todayMarked, setTodayMarked] = useState(false);
  const [todayAttendanceExists, setTodayAttendanceExists] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

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

  // Fetch attendance for selected view date
  useEffect(() => {
    if (!details?.classId || tab !== "attendance") return;
    let isMounted = true;
    setViewLoading(true);
    setViewError(null);
    GetClassAttendanceByDate(details.classId, viewDate)
      .then((data) => {
        if (isMounted) {
          setAttendanceView(Array.isArray(data) ? data : []);
          setViewLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setViewError(
            err?.response?.data || err?.message || "Failed to load attendance",
          );
          setViewLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, [details?.classId, tab, viewDate]);

  // Check if today's attendance already exists
  useEffect(() => {
    if (!details?.classId) return;
    let isMounted = true;
    GetClassAttendanceByDate(details.classId, getTodayLocalISO())
      .then((data) => {
        if (isMounted) {
          setTodayAttendanceExists(
            Array.isArray(data) ? data.length > 0 : !!data,
          );
        }
      })
      .catch(() => {
        // ignore errors for existence check
      });
    return () => {
      isMounted = false;
    };
  }, [details?.classId, todayMarked]);

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

  const ViewStdDetails = (studentId) => {
    navigate(`/students/${studentId}`);
  };

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
          {user.role === 0 && (
            <>
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
            </>
          )}
        </div>
      </header>

      {/* Tabs */}
      <nav className="rounded-xl border border-gray-200 bg-white p-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("details")}
            className={`px-3 py-2 text-sm rounded-lg ${
              tab === "details"
                ? "bg-teal-600 text-white"
                : "bg-white border border-gray-200 text-neutral-800 hover:border-teal-600 hover:text-teal-600"
            }`}
          >
            Class Details
          </button>
          <button
            type="button"
            onClick={() => setTab("students")}
            className={`px-3 py-2 text-sm rounded-lg ${
              tab === "students"
                ? "bg-teal-600 text-white"
                : "bg-white border border-gray-200 text-neutral-800 hover:border-teal-600 hover:text-teal-600"
            }`}
          >
            Students
          </button>
          <button
            type="button"
            onClick={() => setTab("attendance")}
            className={`px-3 py-2 text-sm rounded-lg ${
              tab === "attendance"
                ? "bg-teal-600 text-white"
                : "bg-white border border-gray-200 text-neutral-800 hover:border-teal-600 hover:text-teal-600"
            }`}
          >
            Attendance
          </button>
        </div>
      </nav>

      {tab === "details" && (
        <>
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
                    <p className="font-medium text-neutral-900">
                      {t.teacherName}
                    </p>
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
                    <p className="font-medium text-neutral-900">
                      {st.subjectName}
                    </p>
                    <p className="text-neutral-700">
                      Teacher: {st.teacherName}
                    </p>
                    <p className="text-neutral-700">
                      Active: {st.isActive ? "Yes" : "No"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {tab === "students" && (
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
                  <tr
                    key={s.id}
                    className="hover:bg-gray-50"
                    onClick={() => {
                      ViewStdDetails(s.id);
                    }}
                  >
                    <td className="border-b border-gray-200 py-2 px-3">
                      {s.id}
                    </td>
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
      )}

      {tab === "attendance" && (
        <>
          {/* View selected day attendance */}
          <section className="rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-semibold text-neutral-900">
                View Attendance
              </p>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-800">
                    Date
                  </label>
                  <input
                    type="date"
                    value={viewDate}
                    onChange={(e) => setViewDate(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>
              {viewLoading && (
                <div className="text-sm text-neutral-700">
                  Loading attendance...
                </div>
              )}
              {viewError && (
                <div className="text-sm text-rose-700">{String(viewError)}</div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="text-left text-neutral-800">
                      <th className="border-b border-gray-200 py-2 px-3">ID</th>
                      <th className="border-b border-gray-200 py-2 px-3">
                        Date
                      </th>
                      <th className="border-b border-gray-200 py-2 px-3">
                        Student
                      </th>
                      <th className="border-b border-gray-200 py-2 px-3">
                        Present
                      </th>
                      <th className="border-b border-gray-200 py-2 px-3">
                        Reason
                      </th>
                      <th className="border-b border-gray-200 py-2 px-3">
                        Teacher
                      </th>
                      {user?.role === 1 && (
                        <th className="border-b border-gray-200 py-2 px-3">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-neutral-800">
                    {(attendanceView || []).map((a) => (
                      <tr
                        key={`${a.id ?? a.Id}-${a.date ?? a.Date}`}
                        className="hover:bg-gray-50"
                      >
                        <td className="border-b border-gray-200 py-2 px-3">
                          {a.id ?? a.Id}
                        </td>
                        <td className="border-b border-gray-200 py-2 px-3">
                          {a.date ?? a.Date}
                        </td>
                        <td className="border-b border-gray-200 py-2 px-3 font-medium">
                          {a.studentName ?? a.StudentName}
                        </td>
                        <td className="border-b border-gray-200 py-2 px-3">
                          {editingId === (a.id ?? a.Id) ? (
                            <input
                              type="checkbox"
                              checked={
                                !!(
                                  editValues[a.id ?? a.Id]?.isPresent ??
                                  a.isPresent ??
                                  a.IsPresent
                                )
                              }
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [a.id ?? a.Id]: {
                                    ...(prev[a.id ?? a.Id] || {
                                      isPresent: !!(a.isPresent ?? a.IsPresent),
                                      reason: a.reason ?? a.Reason ?? "",
                                    }),
                                    isPresent: e.target.checked,
                                    reason: e.target.checked
                                      ? ""
                                      : (prev[a.id ?? a.Id]?.reason ??
                                        a.reason ??
                                        a.Reason ??
                                        ""),
                                  },
                                }))
                              }
                            />
                          ) : (a.isPresent ?? a.IsPresent) ? (
                            "Yes"
                          ) : (
                            "No"
                          )}
                        </td>
                        <td className="border-b border-gray-200 py-2 px-3">
                          {editingId === (a.id ?? a.Id) ? (
                            <input
                              type="text"
                              value={String(
                                editValues[a.id ?? a.Id]?.reason ??
                                  a.reason ??
                                  a.Reason ??
                                  "",
                              )}
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [a.id ?? a.Id]: {
                                    ...(prev[a.id ?? a.Id] || {
                                      isPresent: !!(a.isPresent ?? a.IsPresent),
                                      reason: a.reason ?? a.Reason ?? "",
                                    }),
                                    reason: e.target.value,
                                  },
                                }))
                              }
                              disabled={
                                !!(
                                  editValues[a.id ?? a.Id]?.isPresent ??
                                  a.isPresent ??
                                  a.IsPresent
                                )
                              }
                              className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
                            />
                          ) : (
                            (a.reason ?? a.Reason ?? "-")
                          )}
                        </td>
                        <td className="border-b border-gray-200 py-2 px-3">
                          {a.teacherName ?? a.TeacherName ?? "-"}
                        </td>
                        {user?.role === 1 && (
                          <td className="border-b border-gray-200 py-2 px-3">
                            {editingId === (a.id ?? a.Id) ? (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs text-neutral-800 hover:border-teal-600 hover:text-teal-600"
                                  onClick={async () => {
                                    const idVal = a.id ?? a.Id;
                                    const isPresent = !!(
                                      editValues[idVal]?.isPresent ??
                                      a.isPresent ??
                                      a.IsPresent
                                    );
                                    const reason = isPresent
                                      ? null
                                      : (editValues[idVal]?.reason ??
                                        a.reason ??
                                        a.Reason ??
                                        null);
                                    const dateVal = a.date ?? a.Date;
                                    try {
                                      await UpdateStudentAttendance(idVal, {
                                        isPresent,
                                        reason,
                                        date: String(dateVal),
                                      });
                                      setEditingId(null);
                                      setEditValues((prev) => ({
                                        ...prev,
                                        [idVal]: undefined,
                                      }));
                                      // refresh current view
                                      setViewDate((d) => d);
                                    } catch (e) {
                                      alert(
                                        e?.response?.data ||
                                          e?.message ||
                                          "Failed to update attendance",
                                      );
                                    }
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs text-neutral-800 hover:border-teal-600 hover:text-teal-600"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (a.date ?? a.Date) === getTodayLocalISO() ? (
                              <button
                                type="button"
                                className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs text-neutral-800 hover:border-teal-600 hover:text-teal-600"
                                title="Edit attendance"
                                onClick={() => setEditingId(a.id ?? a.Id)}
                              >
                                Edit
                              </button>
                            ) : null}
                          </td>
                        )}
                      </tr>
                    ))}
                    {(!attendanceView || attendanceView.length === 0) && (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-neutral-600"
                        >
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Mark today's attendance (hidden if already marked) */}
          {user?.role === 1 ? (
            todayAttendanceExists || todayMarked ? (
              <section className="rounded-xl border border-gray-200 bg-white">
                <div className="px-4 py-3">
                  <p className="text-sm text-neutral-800">
                    Today's attendance is already marked. The marking list is
                    hidden.
                  </p>
                </div>
              </section>
            ) : (
              <TeacherAttendanceSection
                students={students}
                teacherId={user?.teacherId}
                onSuccess={() => {
                  setTodayMarked(true);
                  // refresh today's view if user is viewing today
                  if (viewDate === getTodayLocalISO()) {
                    setViewDate(getTodayLocalISO());
                  }
                }}
              />
            )
          ) : null}
        </>
      )}

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

function TeacherAttendanceSection({ students, teacherId, onSuccess }) {
  const getTodayLocalISO = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  };
  const [date] = useState(() => getTodayLocalISO());
  const [rows, setRows] = useState(() => {
    const init = {};
    (students || []).forEach((s) => {
      init[s.id] = { isPresent: true, reason: "" };
    });
    return init;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  const allPresent = useMemo(() => {
    const ids = Object.keys(rows);
    if (!ids.length) return false;
    return ids.every((id) => rows[id].isPresent === true);
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

  const onSubmit = async () => {
    if (!teacherId) {
      setError("Missing teacher identity.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess("");
    try {
      const payload = (students || []).map((s) => ({
        isPresent: !!rows[s.id]?.isPresent,
        reason: rows[s.id]?.isPresent ? null : rows[s.id]?.reason || null,
        date,
        studentId: s.id,
        teacherId: teacherId,
      }));
      await MarkStudentAttendances(payload);
      setSuccess("Attendance marked successfully.");
      if (typeof onSuccess === "function") onSuccess();
    } catch (e) {
      setError(e?.response?.data || e?.message || "Failed to mark attendance.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <p className="text-sm font-semibold text-neutral-900">
          Mark Attendance
        </p>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-neutral-800">
              Date
            </label>
            <p className="mt-1 text-sm text-neutral-900">{date}</p>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setAll(!allPresent)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-teal-600 hover:text-teal-600"
            >
              {allPresent ? "Mark All Absent" : "Mark All Present"}
            </button>
          </div>
        </div>

        {error && <div className="text-sm text-rose-700">{String(error)}</div>}
        {success && <div className="text-sm text-teal-700">{success}</div>}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-800">
                <th className="border-b border-gray-200 py-2 px-3">ID</th>
                <th className="border-b border-gray-200 py-2 px-3">Student</th>
                <th className="border-b border-gray-200 py-2 px-3">Present</th>
                <th className="border-b border-gray-200 py-2 px-3">
                  Reason (if absent)
                </th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {(students || []).map((s) => {
                const r = rows[s.id] || { isPresent: true, reason: "" };
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="border-b border-gray-200 py-2 px-3">
                      {s.id}
                    </td>
                    <td className="border-b border-gray-200 py-2 px-3 font-medium">
                      {s.fullName}
                    </td>
                    <td className="border-b border-gray-200 py-2 px-3">
                      <input
                        type="checkbox"
                        checked={!!r.isPresent}
                        onChange={(e) =>
                          setCell(s.id, { isPresent: e.target.checked })
                        }
                      />
                    </td>
                    <td className="border-b border-gray-200 py-2 px-3">
                      <input
                        type="text"
                        placeholder="Optional when absent"
                        value={r.reason}
                        onChange={(e) =>
                          setCell(s.id, { reason: e.target.value })
                        }
                        disabled={!!r.isPresent}
                        className="block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm disabled:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-600"
                      />
                    </td>
                  </tr>
                );
              })}
              {(!students || students.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-neutral-600">
                    No students to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <Button
            label={submitting ? "Saving..." : "Submit Attendance"}
            onClick={onSubmit}
            disabled={submitting || !students?.length}
          />
        </div>
      </div>
    </section>
  );
}
