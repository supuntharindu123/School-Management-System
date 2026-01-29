import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeacherById } from "../../features/adminFeatures/teachers/teacherService";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const [teacherInfo, setTeacherInfo] = useState(null);

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useSelector((s) => s.auth);

  console.log("user", user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 1) {
      console.warn("User is not a teacher or not logged in");
    }

    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const data = await getTeacherById(user.teacherId);
        setTeacherInfo(data);
        setClasses(data.classAssignments || []);
        setSubjects(data.subjectClasses || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching teacher details:", err);
        setError("Failed to load teacher data");
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [user]);

  const classDetails = (id) => {
    navigate(`/classes/${id}`);
  };

  console.log("teacherInfo", teacherInfo);

  const upcomingExams = useMemo(() => {
    const now = new Date();
    return (exams || []).filter((e) => {
      const end = new Date(e?.endDate);
      return !isNaN(end) && now < end;
    });
  }, [exams]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Teacher Dashboard
            {teacherInfo?.fullName ? ` — ${teacherInfo.fullName}` : ""}
          </h1>
          <p className="text-sm text-neutral-700">
            Overview of assigned classes, subjects, and upcoming exams
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard
          title="Assigned Classes"
          value={teacherInfo?.classAssignments?.length ?? 0}
        />
        <SummaryCard
          title="Assigned Subjects"
          value={teacherInfo?.subjectClasses?.length ?? 0}
        />
      </div>

      {/* Assigned Classes */}
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-neutral-900">
            Assigned Classes
          </p>
          {loading && (
            <span className="text-xs text-neutral-600">Loading...</span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-800">
                <th className="border-b border-gray-200 py-2 px-3">Class</th>
                <th className="border-b border-gray-200 py-2 px-3">Role</th>
                <th className="border-b border-gray-200 py-2 px-3">Active</th>
                <th className="border-b border-gray-200 py-2 px-3">Assigned</th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {(classes || []).map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50"
                  onClick={() => {
                    classDetails(c.classId);
                  }}
                >
                  <td className="border-b border-gray-200 py-2 px-3">
                    {c.className || `Class #${c.classId}`}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {c.role || "-"}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {c.isActive ? statusBadge(true) : statusBadge(false)}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {formatDateTime(c.createdDate)}
                  </td>
                </tr>
              ))}
              {!classes?.length && (
                <tr>
                  <td className="py-8 text-center text-neutral-600" colSpan={4}>
                    No class assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Assigned Subjects */}
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-neutral-900">
            Assigned Subjects
          </p>
          {loading && (
            <span className="text-xs text-neutral-600">Loading...</span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-neutral-800">
                <th className="border-b border-gray-200 py-2 px-3">Subject</th>
                <th className="border-b border-gray-200 py-2 px-3">Class</th>
                <th className="border-b border-gray-200 py-2 px-3">Active</th>
                <th className="border-b border-gray-200 py-2 px-3">Period</th>
              </tr>
            </thead>
            <tbody className="text-neutral-800">
              {(subjects || []).map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-200 py-2 px-3">
                    {s.subjectName || "-"}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {s.className || "-"}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {s.isActive ? statusBadge(true) : statusBadge(false)}
                  </td>
                  <td className="border-b border-gray-200 py-2 px-3">
                    {formatRange(s.startDate, s.endDate)}
                  </td>
                </tr>
              ))}
              {!subjects?.length && (
                <tr>
                  <td className="py-8 text-center text-neutral-600" colSpan={4}>
                    No subject assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Upcoming Exams */}
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3">
          <p className="text-sm font-semibold text-neutral-900">
            Upcoming Exams
          </p>
          <p className="text-xs text-neutral-600">
            Based on assigned classes/grades
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(upcomingExams || []).map((e) => (
            <div
              key={e.id}
              className="rounded-lg border border-gray-200 bg-white p-3"
            >
              <p className="text-sm font-semibold text-neutral-900">
                {e.title}
              </p>
              <p className="text-xs text-neutral-700">
                Year {e.academicYear} · Grade {e.gradeName}
              </p>
              <div className="mt-2 text-xs text-neutral-700">
                <span className="rounded bg-gray-100 px-2 py-1">
                  Start: {formatDate(e.startDate)}
                </span>
                <span className="ml-2 rounded bg-gray-100 px-2 py-1">
                  End: {formatDate(e.endDate)}
                </span>
              </div>
            </div>
          ))}
          {!upcomingExams?.length && (
            <p className="text-sm text-neutral-600">No upcoming exams.</p>
          )}
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-xs text-neutral-600">{title}</p>
      <p className="text-2xl font-semibold text-neutral-900">{value}</p>
    </div>
  );
}

function statusBadge(active) {
  return (
    <span
      className={`rounded px-2 py-1 text-xs ${active ? "bg-teal-100 text-teal-800" : "bg-gray-200 text-gray-800"}`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function formatDate(d) {
  try {
    const str = typeof d === "string" ? d : String(d);
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${dd}`;
    }
    return str;
  } catch {
    return String(d);
  }
}

function formatDateTime(d) {
  try {
    const date = new Date(d);
    if (!isNaN(date.getTime())) return date.toLocaleString();
    return String(d);
  } catch {
    return String(d);
  }
}

function formatRange(s, e) {
  return `${formatDate(s)} — ${formatDate(e)}`;
}
