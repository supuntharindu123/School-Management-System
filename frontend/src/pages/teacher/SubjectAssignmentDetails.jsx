import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllSubjects } from "../../features/subject/subjectSlice";
import { getAllExams } from "../../features/exam/examSlice";

export default function SubjectAssignmentDetails() {
  const { subjectId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  // Optional route state can pass classId and teacherId
  const { classId: routeClassId, teacherId: routeTeacherId } =
    location.state || {};

  const { subjects } = useSelector((s) => s.subjects || {});
  const { exams } = useSelector((s) => s.exams || {});

  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (!subjects?.length) dispatch(getAllSubjects());
    if (!exams?.length) dispatch(getAllExams());
  }, [dispatch]);

  const subject = useMemo(
    () => (subjects || []).find((s) => String(s.id) === String(subjectId)),
    [subjects, subjectId],
  );

  // These can be enriched later with actual slices/services
  const className =
    location.state?.className ||
    "Class" + (routeClassId ? ` #${routeClassId}` : "");
  const teacherName =
    location.state?.teacherName ||
    (routeTeacherId ? `Teacher #${routeTeacherId}` : "Unknown");

  const subjectExams = useMemo(() => {
    // If exam objects carry subjectId, filter; otherwise show all
    return (exams || []).filter((e) => {
      if (e.subjectId == null) return true; // graceful fallback
      return String(e.subjectId) === String(subjectId);
    });
  }, [exams, subjectId]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans text-neutral-800 space-y-4">
      <header className="mb-4 flex items-center justify-between bg-gradient-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-6 rounded-2xl px-6">
        <div>
          <h1 className="text-3xl font-bold text-cyan-50">
            Subject Assignment
          </h1>
          <p className="text-sm text-cyan-50">
            Teacher assignment details for the subject
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2">
        <TabButton
          label="Details"
          active={activeTab === "details"}
          onClick={() => setActiveTab("details")}
        />
        <TabButton
          label="Students"
          active={activeTab === "students"}
          onClick={() => setActiveTab("students")}
        />
        <TabButton
          label="Exams"
          active={activeTab === "exams"}
          onClick={() => setActiveTab("exams")}
        />
      </div>

      {/* Panels */}
      {activeTab === "details" && (
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          <p className="text-sm font-semibold text-neutral-900">
            Subject Details
          </p>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DetailRow
              label="Subject Name"
              value={subject?.subjectName || "Unknown"}
            />
            <DetailRow label="Module Code" value={subject?.moduleCode || "—"} />
            <DetailRow label="Class Name" value={className} />
            <DetailRow label="Teacher Name" value={teacherName} />
          </div>
        </section>
      )}

      {activeTab === "students" && (
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          <p className="text-sm font-semibold text-neutral-900">Students</p>
          {/* Hook to actual class-based student list when available */}
          {Array.isArray(location.state?.students) &&
          location.state.students.length ? (
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-neutral-600">
                    <th className="py-2 pr-4">#</th>
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2">Admission No.</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-800">
                  {location.state.students.map((stu, idx) => (
                    <tr key={stu.id || idx} className="border-t">
                      <td className="py-2 pr-4">{idx + 1}</td>
                      <td className="py-2 pr-4">
                        {stu.name || stu.fullName || "Student"}
                      </td>
                      <td className="py-2">{stu.admissionNo || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2 text-sm text-neutral-700">
              No students available.
            </p>
          )}
        </section>
      )}

      {activeTab === "exams" && (
        <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          <p className="text-sm font-semibold text-neutral-900">
            Subject Exams
          </p>
          {subjectExams.length ? (
            <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subjectExams.map((e) => (
                <ExamCard key={e.id} exam={e} />
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-neutral-700">
              No exams related to this subject.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-lg border px-3 py-2 text-sm " +
        (active
          ? "border-cyan-600 bg-cyan-50 text-cyan-700"
          : "border-gray-200 bg-white text-neutral-800 hover:border-cyan-600 hover:text-cyan-700")
      }
    >
      {label}
    </button>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="rounded border border-gray-200 bg-white p-3">
      <p className="text-[12px] text-neutral-600">{label}</p>
      <p className="text-sm text-neutral-900">{value}</p>
    </div>
  );
}

function ExamCard({ exam }) {
  const { title, description, startDate, endDate, academicYear, examType } =
    exam;
  return (
    <div className="relative overflow-hidden rounded-xl border-t-4 border-cyan-600 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] text-cyan-800 border border-cyan-200">
              Term {examType}
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-800 border border-gray-200">
              Year {academicYear}
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-900">{title}</p>
        </div>
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-neutral-800">
        {description || "No description"}
      </p>
      <div className="mt-3 flex items-center gap-2 text-xs text-neutral-700 justify-between">
        <span className="rounded bg-gray-100 px-2 py-1">
          Start: {formatDate(startDate)}
        </span>
        <span className="rounded bg-gray-100 px-2 py-1">
          End: {formatDate(endDate)}
        </span>
      </div>
    </div>
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
