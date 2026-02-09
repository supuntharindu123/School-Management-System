import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Button from "../../components/CommonElements/Button";
import { getClassDetails } from "../../services/classes";
import AssignClassDialog from "../../components/Teacher/AssignClassDialog";
import AssignSubjectDialog from "../../components/Teacher/AssignSubjectDialog";
import { useSelector } from "react-redux";
import ConfirmTerminate from "../../components/ConfirmTerminate";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  getClassAssignmentsForTeacher,
  terminateClassAssignment,
  terminateSubjectAssignment,
} from "../../features/adminFeatures/teachers/teacherService";
import {
  MarkStudentAttendances,
  GetClassAttendanceByDate,
  UpdateStudentAttendance,
} from "../../features/attendances/attendanceService";
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl border border-cyan-100 bg-white p-4 shadow-sm">
      <p className="text-xs text-cyan-700">{label}</p>
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
  const [classHistoryOpen, setClassHistoryOpen] = useState(false);
  const [subjectHistoryOpen, setSubjectHistoryOpen] = useState(false);
  const [assignSubjectOpen, setAssignSubjectOpen] = useState(false);
  const [terminatingKey, setTerminatingKey] = useState(null);
  const [confirmEdit, setConfirmEdit] = useState({
    open: false,
    payload: null,
  });
  const [busyEdit, setBusyEdit] = useState(false);
  const [confirmClass, setConfirmClass] = useState({
    open: false,
    teacherId: null,
    name: "",
  });
  const [confirmSubject, setConfirmSubject] = useState({
    open: false,
    subjectId: null,
    subject: "",
    className: "",
  });
  const [busyTerminateClass, setBusyTerminateClass] = useState(false);
  const [busyTerminateSubject, setBusyTerminateSubject] = useState(false);
  const [success, setSuccess] = useState({ open: false, msg: "" });
  const [errors, setErrors] = useState({ open: false, msg: "" });

  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    let isMounted = true;
    const loadDetails = async () => {
      setLoading(true);
      try {
        const data = await getClassDetails(id);
        if (isMounted) {
          setDetails(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err?.response?.data ||
              err?.message ||
              "Failed to load class details",
          );
          setLoading(false);
        }
      }
    };
    loadDetails();
    return () => {
      isMounted = false;
    };
  }, [id]);

  // Fetch attendance for selected view date
  useEffect(() => {
    if (!details?.classId || tab !== "attendance") return;
    let isMounted = true;
    const loadAttendanceView = async () => {
      setViewLoading(true);
      setViewError(null);
      try {
        const data = await GetClassAttendanceByDate(details.classId, viewDate);
        if (isMounted) {
          setAttendanceView(Array.isArray(data) ? data : []);
          setViewLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setViewError(
            err?.response?.data || err?.message || "Failed to load attendance",
          );
          setViewLoading(false);
        }
      }
    };
    loadAttendanceView();
    return () => {
      isMounted = false;
    };
  }, [details?.classId, tab, viewDate]);

  // Check if today's attendance already exists
  useEffect(() => {
    if (!details?.classId) return;
    let isMounted = true;
    const checkToday = async () => {
      try {
        const data = await GetClassAttendanceByDate(
          details.classId,
          getTodayLocalISO(),
        );
        if (isMounted) {
          setTodayAttendanceExists(
            Array.isArray(data) ? data.length > 0 : !!data,
          );
        }
      } catch {
        // ignore errors for existence check
      }
    };
    checkToday();
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
  const activeClassTeachersCount = classTeachers.filter(
    (t) => t.isActive,
  ).length;

  const ViewStdDetails = (studentId) => {
    navigate(`/students/${studentId}`);
  };

  const terminateClassForTeacher = async (teacherId) => {
    const key = `ct-${teacherId}`;
    setTerminatingKey(key);
    try {
      const assignments = await getClassAssignmentsForTeacher(teacherId);
      const match = (assignments || []).find(
        (a) =>
          (a.classId ?? a.ClassId) === details.classId &&
          (a.isActive ?? a.IsActive),
      );
      if (!match) {
        alert("Active class assignment not found for this teacher.");
        return;
      }
      await terminateClassAssignment(match.id ?? match.Id);
      const refreshed = await getClassDetails(id);
      setDetails(refreshed);
    } catch (err) {
      alert(
        err?.response?.data ||
          err?.message ||
          "Failed to terminate class assignment.",
      );
    } finally {
      setTerminatingKey(null);
    }
  };

  const terminateSubjectForTeacher = async (teacherId, subjectId) => {
    const key = `st-${teacherId}-${subjectId}`;
    setTerminatingKey(key);
    try {
      await terminateSubjectAssignment(subjectId);
      const refreshed = await getClassDetails(id);
      setDetails(refreshed);
    } catch (err) {
      alert(
        err?.response?.data ||
          err?.message ||
          "Failed to terminate subject assignment.",
      );
    } finally {
      setTerminatingKey(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <header className="mb-4 flex items-center justify-between bg-gradient-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-6 rounded-2xl px-6 shadow-md">
        <div>
          <h1 className="text-2xl font-bold text-cyan-50">
            {details.className || `Class ${details.classId}`}
          </h1>
          <p className="text-sm text-cyan-100">Grade: {details.gradeId}</p>
        </div>
        <div className="flex items-center gap-2">
          {user.role === 0 && (
            <>
              <Link
                to={`/teachers?assign=class&classId=${encodeURIComponent(details.classId)}`}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
              >
                Back
              </Link>
              {activeClassTeachersCount < 2 && (
                <Button
                  label="Assign Class Teacher"
                  onClick={() => setAssignOpen(true)}
                />
              )}

              <Button
                label="Assign Subject Teacher"
                onClick={() => setAssignSubjectOpen(true)}
              />
            </>
          )}
        </div>
      </header>

      {/* Tabs */}
      <nav className="rounded-xl bg-white p-2 shadow-sm mb-4">
        <div className="flex">
          <button
            type="button"
            onClick={() => setTab("details")}
            className={`px-3 py-2 text-sm rounded-l-lg ${
              tab === "details"
                ? "bg-cyan-600 text-white"
                : "bg-white border border-cyan-100 text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
            }`}
          >
            Class Details
          </button>
          <button
            type="button"
            onClick={() => setTab("students")}
            className={`px-3 py-2 text-sm  ${
              tab === "students"
                ? "bg-cyan-600 text-white"
                : "bg-white border border-cyan-100 text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
            }`}
          >
            Students
          </button>
          <button
            type="button"
            onClick={() => setTab("attendance")}
            className={`px-3 py-2 text-sm rounded-r-lg ${
              tab === "attendance"
                ? "bg-cyan-600 text-white"
                : "bg-white border border-cyan-100 text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
            }`}
          >
            Attendance
          </button>
        </div>
      </nav>

      {tab === "details" && (
        <>
          {/* Summary cards */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-4 mb-4">
            <SummaryCard label="Students" value={students.length} />
            <SummaryCard label="Subjects" value={subjectTeachers.length} />
            <SummaryCard label="Class Teachers" value={classTeachers.length} />
            <SummaryCard
              label="Active Class Teacher"
              value={activeClassTeacher ? activeClassTeacher.teacherName : "-"}
            />
          </section>

          {/* Class Teachers */}
          <section className="rounded-xl border border-cyan-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-cyan-100 px-4 py-3">
              <p className="text-md font-semibold text-neutral-900">
                Class Teachers
              </p>
              {classTeachers.some((t) => !t.isActive) && (
                <button
                  type="button"
                  className="rounded-lg border border-cyan-100 bg-cyan-600 px-3 py-2 text-sm text-white hover:border-cyan-500 hover:text-cyan-50"
                  onClick={() => setClassHistoryOpen((v) => !v)}
                >
                  {classHistoryOpen ? "Hide History" : "Show History"}
                </button>
              )}
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {classTeachers
                  .filter((t) => t.isActive)
                  .map((t) => (
                    <div
                      key={`${t.teacherId}-${t.role}`}
                      className="rounded-lg border border-cyan-100 p-3 text-sm shadow-md"
                    >
                      <p className="font-medium text-neutral-900">
                        {t.teacherName}
                      </p>
                      <p className="text-neutral-700">Role: {t.role}</p>
                      <p className="text-neutral-700">Active: Yes</p>
                      {user.role === 0 && (
                        <div className="mt-2">
                          <button
                            type="button"
                            className={`rounded-lg px-3 py-1 text-xs ${terminatingKey === `ct-${t.teacherId}` ? "bg-cyan-300 text-white" : "bg-cyan-600 text-white hover:bg-cyan-700"}`}
                            disabled={terminatingKey === `ct-${t.teacherId}`}
                            onClick={() =>
                              setConfirmClass({
                                open: true,
                                teacherId: t.teacherId,
                                name: t.teacherName,
                              })
                            }
                          >
                            {terminatingKey === `ct-${t.teacherId}`
                              ? "Terminating..."
                              : "Terminate"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                {classTeachers.filter((t) => t.isActive).length === 0 && (
                  <div className="rounded-lg border border-cyan-100 p-3 text-sm text-neutral-700">
                    No active class teacher assignments.
                  </div>
                )}
              </div>
            </div>
            {classHistoryOpen && (
              <div className="border-t border-cyan-100 px-4 py-3">
                <p className="text-sm font-semibold text-neutral-900">
                  History
                </p>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {classTeachers
                    .filter((t) => !t.isActive)
                    .map((t) => (
                      <div
                        key={`${t.teacherId}-${t.role}-hist`}
                        className="rounded-lg border border-cyan-100 p-3 text-sm shadow-md"
                      >
                        <p className="font-medium text-neutral-900">
                          {t.teacherName}
                        </p>
                        <p className="text-neutral-700">Role: {t.role}</p>
                        <p className="text-neutral-700">Status: Inactive</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </section>

          {/* Subject Teachers */}
          <section className="rounded-xl border border-cyan-100 bg-white shadow-md mt-4">
            <div className="flex items-center justify-between border-b border-cyan-100 px-4 py-3">
              <p className="text-sm font-semibold text-neutral-900">
                Subject Teachers
              </p>
              {subjectTeachers.some((st) => !st.isActive) && (
                <button
                  type="button"
                  className="rounded-lg border border-cyan-100 bg-cyan-600 px-3 py-2 text-sm text-white hover:border-cyan-500 hover:text-cyan-50"
                  onClick={() => setSubjectHistoryOpen((v) => !v)}
                >
                  {subjectHistoryOpen ? "Hide History" : "Show History"}
                </button>
              )}
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {subjectTeachers
                  .filter((st) => st.isActive)
                  .map((st) => (
                    <div
                      key={`${st.subjectId}-${st.teacherId}`}
                      className="rounded-lg border border-cyan-100 p-3 text-sm shadow-md"
                    >
                      <p className="font-medium text-neutral-900">
                        {st.subjectName}
                      </p>
                      <p className="text-neutral-700">
                        Teacher: {st.teacherName}
                      </p>
                      <p className="text-neutral-700">Active: Yes</p>
                      {user.role === 0 && (
                        <div className="mt-2">
                          <button
                            type="button"
                            className={`rounded-lg px-3 py-1 text-xs ${terminatingKey === `st-${st.teacherId}-${st.subjectId}` ? "bg-cyan-300 text-white" : "bg-cyan-600 text-white hover:bg-cyan-700"}`}
                            disabled={
                              terminatingKey ===
                              `st-${st.teacherId}-${st.subjectId}`
                            }
                            onClick={() =>
                              setConfirmSubject({
                                open: true,
                                subjectId: st.subjectId,
                                subject: st.subjectName,
                                className: details.className,
                              })
                            }
                          >
                            {terminatingKey ===
                            `st-${st.teacherId}-${st.subjectId}`
                              ? "Terminating..."
                              : "Terminate"}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                {subjectTeachers.filter((st) => st.isActive).length === 0 && (
                  <div className="rounded-lg border border-cyan-100 p-3 text-sm text-neutral-700">
                    No active subject teacher assignments.
                  </div>
                )}
              </div>
            </div>
            {subjectHistoryOpen && (
              <div className="border-t border-cyan-100 px-4 py-3">
                <p className="text-sm font-semibold text-neutral-900">
                  History
                </p>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {subjectTeachers
                    .filter((st) => !st.isActive)
                    .map((st) => (
                      <div
                        key={`${st.subjectId}-${st.teacherId}-hist`}
                        className="rounded-lg border border-cyan-100 p-3 text-sm"
                      >
                        <p className="font-medium text-neutral-900">
                          {st.subjectName}
                        </p>
                        <p className="text-neutral-700">
                          Teacher: {st.teacherName}
                        </p>
                        <p className="text-neutral-700">Status: Inactive</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {tab === "students" && (
        <section className="rounded-xl border border-cyan-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-cyan-100 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-900">Students</p>
            <span className="text-xs text-neutral-600">
              Total: {students.length}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left bg-cyan-50 text-cyan-800">
                  <th className="border-b border-cyan-200 py-2 px-3">ID</th>
                  <th className="border-b border-cyan-200 py-2 px-3">
                    Student ID
                  </th>
                  <th className="border-b border-cyan-200 py-2 px-3">Name</th>
                  <th className="border-b border-cyan-200 py-2 px-3">Gender</th>
                  <th className="border-b border-cyan-200 py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="text-neutral-800">
                {students.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-cyan-50"
                    onClick={() => {
                      ViewStdDetails(s.id);
                    }}
                  >
                    <td className="border-b border-cyan-100 py-2 px-3">
                      {s.id}
                    </td>
                    <td className="border-b border-cyan-100 py-2 px-3">
                      {s.studentIDNumber}
                    </td>
                    <td className="border-b border-cyan-100 py-2 px-3 font-medium">
                      {s.fullName}
                    </td>
                    <td className="border-b border-cyan-100 py-2 px-3">
                      {s.gender}
                    </td>
                    <td className="border-b border-cyan-100 py-2 px-3">
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
          <section className="rounded-xl border border-cyan-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-cyan-100 px-4 py-3">
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
                    className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
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
                    <tr className="text-left bg-cyan-600 text-cyan-50">
                      <th className="border-b border-cyan-200 py-2 px-3">ID</th>
                      <th className="border-b border-cyan-200 py-2 px-3">
                        Date
                      </th>
                      <th className="border-b border-cyan-200 py-2 px-3">
                        Student
                      </th>
                      <th className="border-b border-cyan-200 py-2 px-3">
                        Present
                      </th>
                      <th className="border-b border-cyan-200 py-2 px-3">
                        Reason
                      </th>
                      <th className="border-b border-cyan-200 py-2 px-3">
                        Teacher
                      </th>
                      {user?.role === 1 && (
                        <th className="border-b border-cyan-200 py-2 px-3">
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-neutral-800">
                    {(attendanceView || []).map((a) => (
                      <tr
                        key={`${a.id ?? a.Id}-${a.date ?? a.Date}`}
                        className="hover:bg-cyan-50"
                      >
                        <td className="border-b border-cyan-100 py-2 px-3">
                          {a.id ?? a.Id}
                        </td>
                        <td className="border-b border-cyan-100 py-2 px-3">
                          {a.date ?? a.Date}
                        </td>
                        <td className="border-b border-cyan-100 py-2 px-3 font-medium">
                          {a.studentName ?? a.StudentName}
                        </td>
                        <td className="border-b border-cyan-100 py-2 px-3">
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
                        <td className="border-b border-cyan-100 py-2 px-3">
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
                              className="block w-full rounded-lg border border-cyan-100 bg-white px-3 py-2 text-sm disabled:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                            />
                          ) : (
                            (a.reason ?? a.Reason ?? "-")
                          )}
                        </td>
                        <td className="border-b border-cyan-100 py-2 px-3">
                          {a.teacherName ?? a.TeacherName ?? "-"}
                        </td>
                        {user?.role === 1 && (
                          <td className="border-b border-cyan-100 py-2 px-3">
                            {editingId === (a.id ?? a.Id) ? (
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  className="rounded-lg border border-cyan-100 bg-white px-3 py-1 text-xs text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
                                  onClick={() => {
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
                                    const studentName =
                                      a.studentName ??
                                      a.StudentName ??
                                      "the student";
                                    setConfirmEdit({
                                      open: true,
                                      payload: {
                                        idVal,
                                        isPresent,
                                        reason,
                                        dateVal,
                                        studentName,
                                      },
                                    });
                                  }}
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  className="rounded-lg border border-cyan-100 bg-white px-3 py-1 text-xs text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (a.date ?? a.Date) === getTodayLocalISO() ? (
                              <button
                                type="button"
                                className="rounded-lg border border-cyan-100 bg-white px-3 py-1 text-xs text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
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
              <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
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
          onSave={async () => {
            try {
              setSuccess({ open: true, msg: "Class Assign Successfully!" });
              const refreshed = await getClassDetails(id);
              setDetails(refreshed);
              setAssignOpen(false);
            } catch (err) {
              setErrors({ open: false, msg: err?.response?.data });
            }
          }}
        />
      )}

      {assignSubjectOpen && (
        <AssignSubjectDialog
          isTeacher={false}
          gradeId={details.gradeId}
          classId={details.classId}
          onClose={() => setAssignSubjectOpen(false)}
          onSave={async () => {
            try {
              setSuccess({ open: true, msg: "Subject Assign Successfully!" });
              const refreshed = await getClassDetails(id);
              setDetails(refreshed);
              setAssignSubjectOpen(false);
            } catch (err) {
              setErrors({ open: false, msg: err?.response?.data });
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
          onCancel={() =>
            setConfirmClass({ open: false, teacherId: null, name: "" })
          }
          onConfirm={async () => {
            try {
              setBusyTerminateClass(true);
              setErrors({ open: false, msg: "" });
              await terminateClassForTeacher(confirmClass.teacherId);
              setSuccess({ open: true, msg: "Class Assign Terminated!" });
              setConfirmClass({ open: false, teacherId: null, name: "" });
            } catch (error) {
              setErrors({ open: true, msg: error?.response?.data });
            }
          }}
        />
      )}

      {confirmSubject.open && (
        <ConfirmTerminate
          open={confirmSubject.open}
          subject={confirmSubject.subject}
          className={confirmSubject.className}
          busy={busyTerminateSubject}
          onCancel={() =>
            setConfirmSubject({
              open: false,
              subjectId: null,
              subject: "",
              className: "",
            })
          }
          onConfirm={async () => {
            try {
              setBusyTerminateSubject(true);
              await terminateSubjectForTeacher(null, confirmSubject.subjectId);
              setSuccess({ open: true, msg: "Subject Assign Terminated!" });
              setConfirmSubject({
                open: false,
                subjectId: null,
                subject: "",
                className: "",
              });
            } catch (err) {
              setErrors({ open: true, msg: err?.response?.data });
            } finally {
              setBusyTerminateSubject(false);
            }
          }}
        />
      )}

      {success.open && (
        <SuccessAlert
          isOpen={success.open}
          message={success.msg}
          onClose={() => setSuccess({ open: false, msg: "" })}
        />
      )}
      {/* Confirm edit attendance (standalone, outside alerts) */}
      {confirmEdit.open && (
        <ConfirmDialog
          open={confirmEdit.open}
          title="Confirm Attendance Update"
          message={`Save changes for ${confirmEdit.payload?.studentName} on ${String(confirmEdit.payload?.dateVal)}?`}
          confirmLabel="Save"
          cancelLabel="Cancel"
          busy={busyEdit}
          onCancel={() => setConfirmEdit({ open: false, payload: null })}
          onConfirm={async () => {
            try {
              setBusyEdit(true);
              const { idVal, isPresent, reason, dateVal } =
                confirmEdit.payload || {};
              await UpdateStudentAttendance(idVal, {
                isPresent,
                reason,
                date: String(dateVal),
              });
              setSuccess({
                open: true,
                msg: "Attendance updated successfully.",
              });
              // reset editing state
              setEditingId(null);
              setEditValues((prev) => ({ ...prev, [idVal]: undefined }));
              // refresh current view
              setViewDate((d) => d);
              setConfirmEdit({ open: false, payload: null });
            } catch (e) {
              setErrors({
                open: true,
                msg:
                  e?.response?.data ||
                  e?.message ||
                  "Failed to update attendance",
              });
            } finally {
              setBusyEdit(false);
            }
          }}
        />
      )}

      {errors.open && (
        <ErrorAlert
          isOpen={errors.open}
          message={errors.msg}
          onClose={() => setErrors({ open: false, msg: "" })}
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busyConfirm, setBusyConfirm] = useState(false);
  const [markSuccess, setMarkSuccess] = useState({ open: false, msg: "" });
  const [markError, setMarkError] = useState({ open: false, msg: "" });

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

  const buildPayload = () =>
    (students || []).map((s) => ({
      isPresent: !!rows[s.id]?.isPresent,
      reason: rows[s.id]?.isPresent ? null : rows[s.id]?.reason || null,
      date,
      studentId: s.id,
      teacherId: teacherId,
    }));

  const onSubmit = () => {
    if (!teacherId) {
      setMarkError({ open: true, msg: "Missing teacher identity." });
      return;
    }
    setSubmitting(true);
    setConfirmOpen(true);
  };

  return (
    <>
      <section className="rounded-xl border border-cyan-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-cyan-100 px-4 py-3">
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
                className="rounded-lg border border-cyan-100 bg-white px-3 py-2 text-sm text-neutral-800 hover:border-cyan-600 hover:text-cyan-600"
              >
                {allPresent ? "Mark All Absent" : "Mark All Present"}
              </button>
            </div>
          </div>

          {/* Alerts handled via modals below */}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="text-left text-neutral-800">
                  <th className="border-b border-cyan-100 py-2 px-3">ID</th>
                  <th className="border-b border-cyan-100 py-2 px-3">
                    Student
                  </th>
                  <th className="border-b border-cyan-100 py-2 px-3">
                    Present
                  </th>
                  <th className="border-b border-cyan-100 py-2 px-3">
                    Reason (if absent)
                  </th>
                </tr>
              </thead>
              <tbody className="text-neutral-800">
                {(students || []).map((s) => {
                  const r = rows[s.id] || { isPresent: true, reason: "" };
                  return (
                    <tr key={s.id} className="hover:bg-cyan-50">
                      <td className="border-b border-cyan-100 py-2 px-3">
                        {s.id}
                      </td>
                      <td className="border-b border-cyan-100 py-2 px-3 font-medium">
                        {s.fullName}
                      </td>
                      <td className="border-b border-cyan-100 py-2 px-3">
                        <input
                          type="checkbox"
                          checked={!!r.isPresent}
                          onChange={(e) =>
                            setCell(s.id, { isPresent: e.target.checked })
                          }
                        />
                      </td>
                      <td className="border-b border-cyan-100 py-2 px-3">
                        <input
                          type="text"
                          placeholder="Optional when absent"
                          value={r.reason}
                          onChange={(e) =>
                            setCell(s.id, { reason: e.target.value })
                          }
                          disabled={!!r.isPresent}
                          className="block w-full rounded-lg border border-cyan-100 bg-white px-3 py-2 text-sm disabled:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                        />
                      </td>
                    </tr>
                  );
                })}
                {(!students || students.length === 0) && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-neutral-600"
                    >
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

      {/* Confirm mark attendance */}
      {confirmOpen && (
        <ConfirmDialog
          open={confirmOpen}
          title="Confirm Mark Attendance"
          message={`Mark attendance for ${students?.length ?? 0} students on ${date}?`}
          confirmLabel="Mark"
          cancelLabel="Cancel"
          busy={busyConfirm}
          onCancel={() => {
            setConfirmOpen(false);
            setSubmitting(false);
          }}
          onConfirm={async () => {
            try {
              setBusyConfirm(true);
              const payload = buildPayload();
              await MarkStudentAttendances(payload);
              setMarkSuccess({
                open: true,
                msg: "Attendance marked successfully.",
              });
              if (typeof onSuccess === "function") onSuccess();
              setConfirmOpen(false);
            } catch (e) {
              setMarkError({
                open: true,
                msg:
                  e?.response?.data ||
                  e?.message ||
                  "Failed to mark attendance.",
              });
            } finally {
              setBusyConfirm(false);
              setSubmitting(false);
            }
          }}
        />
      )}

      {markSuccess.open && (
        <SuccessAlert
          isOpen={markSuccess.open}
          message={markSuccess.msg}
          onClose={() => setMarkSuccess({ open: false, msg: "" })}
        />
      )}
      {markError.open && (
        <ErrorAlert
          isOpen={markError.open}
          message={markError.msg}
          onClose={() => setMarkError({ open: false, msg: "" })}
        />
      )}
    </>
  );
}
