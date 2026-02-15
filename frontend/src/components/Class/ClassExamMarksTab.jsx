import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function ClassExamMarksTab({
  marks = [],
  marksLoading = false,
  studentNameById = {},
  subjectNameById = {},
  examNameById = {},
  allExams = [],
  gradeId = null,
}) {
  const [expandedExams, setExpandedExams] = useState(new Set());
  const [expandedSubjects, setExpandedSubjects] = useState(new Set());

  // 1. Group marks by ExamID -> SubjectID
  const nestedMarks = useMemo(() => {
    const grouped = {};
    (marks || []).forEach((m) => {
      const eid = String(m.examId);
      const sid = String(m.subjectId);
      if (!grouped[eid]) grouped[eid] = {};
      if (!grouped[eid][sid]) grouped[eid][sid] = [];
      grouped[eid][sid].push(m);
    });
    return grouped;
  }, [marks]);

  // 2. Identify Exams & Subjects assigned to this Grade
  const gradeStructure = useMemo(() => {
    if (!gradeId || !allExams) return [];

    return allExams
      .filter((exam) =>
        exam.examGrades?.some((g) => String(g.gradeId) === String(gradeId)),
      )
      .map((exam) => {
        const gradeConfig = exam.examGrades.find(
          (g) => String(g.gradeId) === String(gradeId),
        );
        return {
          id: String(exam.id),
          title: exam.title,
          subjectIds: Array.isArray(gradeConfig?.subjectId)
            ? gradeConfig.subjectId.map(String)
            : [],
        };
      });
  }, [allExams, gradeId]);

  const getGrade = (score) => {
    const n = parseFloat(score ?? 0);
    if (isNaN(n)) return "-";
    if (n >= 75) return "A";
    if (n >= 65) return "B";
    if (n >= 55) return "C";
    if (n >= 45) return "S";
    return "F";
  };

  const toggleExam = (eid) => {
    setExpandedExams((prev) => {
      const next = new Set(prev);
      if (next.has(eid)) next.delete(eid);
      else next.add(eid);
      return next;
    });
  };

  const toggleSubject = (eid, sid) => {
    const key = `${eid}-${sid}`;
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  if (marksLoading)
    return (
      <div className="p-20 text-center animate-pulse text-cyan-600 font-bold capitalize">
        Syncing records...
      </div>
    );

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="border-l-4 border-cyan-600 pl-4 mb-8">
        <h3 className="text-lg font-bold text-neutral-800 capitalize">
          Grade {gradeId} exam results
        </h3>
        <p className="text-xs text-neutral-500 capitalize">
          Total exams found for this grade: {gradeStructure.length}
        </p>
      </div>

      <div className="space-y-4">
        {gradeStructure.map((exam) => (
          <div
            key={exam.id}
            className="rounded-[2rem] border border-neutral-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md"
          >
            {/* Exam Row */}
            <div
              onClick={() => toggleExam(exam.id)}
              className={`flex items-center justify-between px-8 py-5 cursor-pointer ${
                expandedExams.has(exam.id)
                  ? "bg-cyan-50/30"
                  : "hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white ${
                    nestedMarks[exam.id] ? "bg-cyan-900" : "bg-neutral-300"
                  }`}
                >
                  {exam.id}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-neutral-900 capitalize">
                    {exam.title}
                  </h4>
                  <p className="text-[10px] font-bold text-cyan-600 capitalize tracking-tight">
                    {exam.subjectIds.length} subjects configured
                  </p>
                </div>
              </div>
              <div
                className={`transition-transform duration-300 ${expandedExams.has(exam.id) ? "rotate-180" : ""}`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* Subject List */}
            {expandedExams.has(exam.id) && (
              <div className="px-8 pb-8 space-y-3 animate-in slide-in-from-top-4">
                <div className="h-px bg-neutral-100 mb-4" />
                {exam.subjectIds.map((sid) => {
                  const subjectKey = `${exam.id}-${sid}`;
                  const subjectMarks = nestedMarks[exam.id]?.[sid] || [];
                  const hasMarks = subjectMarks.length > 0;

                  return (
                    <div
                      key={subjectKey}
                      className="rounded-2xl border border-neutral-200 bg-neutral-50/50 overflow-hidden"
                    >
                      <div
                        onClick={() => toggleSubject(exam.id, sid)}
                        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white transition-colors"
                      >
                        <p className="text-sm font-bold text-neutral-700 capitalize">
                          {subjectNameById[sid]}
                        </p>
                        <span
                          className={`text-[10px] font-bold px-3 py-1 rounded-full capitalize ${
                            hasMarks
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-neutral-200 text-neutral-400"
                          }`}
                        >
                          {hasMarks
                            ? `${subjectMarks.length} marks available`
                            : "No marks"}
                        </span>
                      </div>

                      {expandedSubjects.has(subjectKey) && (
                        <div className="px-4 pb-4 animate-in zoom-in-95">
                          {hasMarks ? (
                            <div className="rounded-2xl border border-neutral-200 overflow-hidden shadow-inner bg-white">
                              <table className="w-full text-left">
                                <thead className="bg-cyan-800 text-white text-[10px] capitalize font-bold">
                                  <tr>
                                    <th className="py-4 px-6">Student</th>
                                    <th className="py-4 px-6 text-center">
                                      Score
                                    </th>
                                    <th className="py-4 px-6 text-center">
                                      Grade
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                  {subjectMarks.map((m) => (
                                    <tr
                                      key={m.id}
                                      className="hover:bg-cyan-50/20 transition-colors"
                                    >
                                      <td className="py-4 px-6">
                                        <Link
                                          to={`/students/${m.studentId}`}
                                          className="text-sm font-bold text-neutral-800 hover:text-cyan-700"
                                        >
                                          {m.studentName ||
                                            studentNameById[m.studentId]}
                                        </Link>
                                        <p className="text-[10px] text-neutral-400 font-mono">
                                          {m.studentIDNumber}
                                        </p>
                                      </td>
                                      <td className="py-4 px-6 text-center font-bold text-cyan-600">
                                        {m.score}
                                      </td>
                                      <td className="py-4 px-6 text-center">
                                        <span
                                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                            getGrade(m.score) === "F"
                                              ? "text-rose-600 bg-rose-50"
                                              : "text-cyan-700 bg-cyan-50"
                                          }`}
                                        >
                                          {getGrade(m.score)}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="p-6 text-center text-xs text-neutral-400 bg-white rounded-2xl border border-dashed border-neutral-200 capitalize">
                              No results found for this subject in this exam.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
