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
  GetClassAttendanceByDate,
  UpdateStudentAttendance,
} from "../../features/attendances/attendanceService";
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";
import { getMarksByClass } from "../../features/Marks/markServices";
import { getExams } from "../../features/exam/examService";
import ClassExamMarksTab from "../../components/Class/ClassExamMarksTab";
import ClassStudentsTab from "../../components/Class/ClassStudentsTab";
import ClassDetailsTab from "../../components/Class/ClassDetailsTab";
import ClassAttendanceTab from "../../components/Class/ClassAttendanceTab";
import TeacherAttendanceSection from "../../components/Class/TeacherAttendanceSection";

export default function ClassDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // basic state
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("details");

  // attendance state
  const getTodayLocalISO = () => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  };
  const [viewDate, setViewDate] = useState(() => getTodayLocalISO());
  const [attendanceView, setAttendanceView] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState(null);
  const [todayMarked, setTodayMarked] = useState(false);
  const [todayAttendanceExists, setTodayAttendanceExists] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  // exam marks state
  const [marks, setMarks] = useState([]);
  const [marksLoading, setMarksLoading] = useState(false);
  const [marksError, setMarksError] = useState(null);
  // exams metadata
  const [exams, setExams] = useState([]);
  const [examsError, setExamsError] = useState(null);

  // dialog and busy states
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignSubjectOpen, setAssignSubjectOpen] = useState(false);
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
  const [allExams, setAllExams] = useState([]);

  // derived data
  const students = details?.students || [];
  const classTeachers = details?.classTeachers || [];
  const subjectTeachers = details?.subjectTeachers || [];

  const subjectNameById = useMemo(() => {
    const map = {};
    (subjectTeachers || []).forEach((st) => {
      map[st.subjectId] = st.subjectName;
    });
    return map;
  }, [subjectTeachers]);

  const studentNameById = useMemo(() => {
    const map = {};
    (students || []).forEach((s) => {
      map[s.id] = s.fullName;
    });
    return map;
  }, [students]);

  //load exam
  useEffect(() => {
    const loadExams = async () => {
      try {
        const data = await getExams(); // Using your examServices
        setAllExams(data || []);
      } catch (err) {
        console.error("Failed to load exams", err);
      }
    };
    loadExams();
  }, []);

  const examNameById = useMemo(() => {
    const map = {};
    allExams.forEach((ex) => {
      map[ex.id] = ex.title;
    });
    return map;
  }, [allExams]);

  // load class details
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

  // load marks when tab changes
  useEffect(() => {
    if (!details?.classId || tab !== "marks") return;
    let isMounted = true;
    const loadMarks = async () => {
      setMarksLoading(true);
      setMarksError(null);
      try {
        const data = await getMarksByClass(details.classId);
        if (isMounted) setMarks(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted)
          setMarksError(
            err?.response?.data || err?.message || "Failed to load marks",
          );
      } finally {
        if (isMounted) setMarksLoading(false);
      }
    };
    loadMarks();
    return () => {
      isMounted = false;
    };
  }, [details?.classId, tab]);

  // load exams when viewing marks to identify grade-related exams
  useEffect(() => {
    if (!details?.gradeId || tab !== "marks") return;
    let isMounted = true;
    const loadExams = async () => {
      setExamsError(null);
      try {
        const data = await getExams();
        if (isMounted) setExams(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted)
          setExamsError(
            err?.response?.data || err?.message || "Failed to load exams",
          );
      }
    };
    loadExams();
    return () => {
      isMounted = false;
    };
  }, [details?.gradeId, tab]);

  // load attendance view
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

  // check if today marked
  useEffect(() => {
    if (!details?.classId) return;
    let isMounted = true;
    const checkToday = async () => {
      try {
        const data = await GetClassAttendanceByDate(
          details.classId,
          getTodayLocalISO(),
        );
        if (isMounted)
          setTodayAttendanceExists(
            Array.isArray(data) ? data.length > 0 : !!data,
          );
      } catch {
        /* ignore */
      }
    };
    checkToday();
    return () => {
      isMounted = false;
    };
  }, [details?.classId, todayMarked]);

  // termination logic
  const terminateClassForTeacher = async (teacherId) => {
    const assignments = await getClassAssignmentsForTeacher(teacherId);
    const match = (assignments || []).find(
      (a) =>
        (a.classId ?? a.ClassId) === details.classId &&
        (a.isActive ?? a.IsActive),
    );
    if (!match) throw new Error("Active class assignment not found.");
    await terminateClassAssignment(match.id ?? match.Id);
    const refreshed = await getClassDetails(id);
    setDetails(refreshed);
  };

  const terminateSubjectForTeacher = async (teacherId, subjectId) => {
    await terminateSubjectAssignment(subjectId);
    const refreshed = await getClassDetails(id);
    setDetails(refreshed);
  };

  if (loading)
    return (
      <div className="p-8 text-neutral-500 font-medium">
        Loading class details...
      </div>
    );
  if (error)
    return <div className="p-8 text-red-500 font-bold">{String(error)}</div>;

  return (
    <div className="max-w-full mx-auto space-y-8 pb-16 animate-fade-in px-4">
      {/* Header Section */}
      <header className="bg-cyan-900 rounded-3xl p-8 text-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold capitalize">
            {details.className || `Class ${details.classId}`}
          </h1>
          <p className="text-cyan-100 opacity-80 text-sm mt-1">
            Grade {details.gradeId} • Management dashboard
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-2xl border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-bold text-white hover:bg-white hover:text-cyan-900 transition-colors"
          >
            Back to list
          </button>
          {user.role === 0 && (
            <>
              {classTeachers.filter((t) => t.isActive).length < 2 && (
                <button
                  onClick={() => setAssignOpen(true)}
                  className="bg-white text-cyan-900 px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-cyan-50 transition-colors shadow-sm"
                >
                  Assign class teacher
                </button>
              )}
              <button
                onClick={() => setAssignSubjectOpen(true)}
                className="bg-cyan-700 text-white px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-cyan-600 transition-colors border border-cyan-600 shadow-sm"
              >
                Assign subject teacher
              </button>
            </>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex flex-wrap p-1.5 bg-white border border-neutral-200 rounded-3xl w-fit shadow-sm">
        {[
          { id: "details", label: "Class details" },
          { id: "students", label: "Students" },
          { id: "attendance", label: "Attendance" },
          { id: "marks", label: "Exam marks" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-6 py-2.5 text-sm font-bold capitalize rounded-2xl transition-all ${
              tab === t.id
                ? "bg-cyan-600 text-white"
                : "text-neutral-500 hover:text-cyan-700 hover:bg-cyan-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Tab Content Area */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
        {tab === "details" && (
          <ClassDetailsTab
            students={students}
            subjectTeachers={subjectTeachers}
            classTeachers={classTeachers}
            user={user}
            details={details}
            onRequestTerminateClass={(teacherId, name) =>
              setConfirmClass({ open: true, teacherId, name })
            }
            onRequestTerminateSubject={(subjectId, subject) =>
              setConfirmSubject({
                open: true,
                subjectId,
                subject,
                className: details.className,
              })
            }
          />
        )}

        {tab === "students" && (
          <ClassStudentsTab
            students={students}
            onViewStudent={(id) => navigate(`/students/${id}`)}
          />
        )}

        {tab === "attendance" && (
          <ClassAttendanceTab
            viewDate={viewDate}
            setViewDate={setViewDate}
            attendanceView={attendanceView}
            viewLoading={viewLoading}
            viewError={viewError}
            user={user}
            editingId={editingId}
            setEditingId={setEditingId}
            editValues={editValues}
            setEditValues={setEditValues}
            getTodayLocalISO={getTodayLocalISO}
            onRequestSaveEdit={(payload) =>
              setConfirmEdit({ open: true, payload })
            }
            students={students}
            teacherId={user?.teacherId}
            TeacherAttendanceSection={TeacherAttendanceSection}
            todayAttendanceExists={todayAttendanceExists || todayMarked}
            onTeacherAttendanceSuccess={() => {
              setTodayMarked(true);
              if (viewDate === getTodayLocalISO())
                setViewDate(getTodayLocalISO());
            }}
          />
        )}

        {/* ... inside ClassDetailsPage return ... */}
        {tab === "marks" && (
          <ClassExamMarksTab
            marks={(() => {
              if (!Array.isArray(allExams) || !details?.gradeId) return marks;

              // Correctly identify exams that contain this gradeId
              const allowedExamIds = new Set(
                allExams
                  .filter((e) =>
                    e.examGrades?.some(
                      (g) => String(g.gradeId) === String(details.gradeId),
                    ),
                  )
                  .map((e) => String(e.id)),
              );

              return (marks || []).filter((m) =>
                allowedExamIds.has(String(m.examId)),
              );
            })()}
            marksLoading={marksLoading}
            studentNameById={studentNameById}
            subjectNameById={subjectNameById}
            examNameById={examNameById}
            allExams={allExams}
            gradeId={details?.gradeId}
          />
        )}
      </div>

      {/* Assign Class Teacher Modal */}
      {assignOpen && (
        <AssignClassDialog
          gradeId={details.gradeId}
          classNameId={details.classId}
          isTeacher={false}
          onClose={() => setAssignOpen(false)}
          onSave={async () => {
            setSuccess({ open: true, msg: "Class assigned successfully!" });
            const refreshed = await getClassDetails(id);
            setDetails(refreshed);
            setAssignOpen(false);
          }}
        />
      )}

      {/* Assign Subject Modal */}
      {assignSubjectOpen && (
        <AssignSubjectDialog
          isTeacher={false}
          gradeId={details.gradeId}
          classId={details.classId}
          onClose={() => setAssignSubjectOpen(false)}
          onSave={async () => {
            setSuccess({ open: true, msg: "Subject assigned successfully!" });
            const refreshed = await getClassDetails(id);
            setDetails(refreshed);
            setAssignSubjectOpen(false);
          }}
        />
      )}

      {/* Confirm Class Termination */}
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
              await terminateClassForTeacher(confirmClass.teacherId);
              setSuccess({ open: true, msg: "Class assignment terminated!" });
              setConfirmClass({ open: false, teacherId: null, name: "" });
            } catch (error) {
              setErrors({
                open: true,
                msg: error?.response?.data || "Termination failed",
              });
            } finally {
              setBusyTerminateClass(false);
            }
          }}
        />
      )}

      {/* Confirm Subject Termination */}
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
              setSuccess({ open: true, msg: "Subject assignment terminated!" });
              setConfirmSubject({
                open: false,
                subjectId: null,
                subject: "",
                className: "",
              });
            } catch (err) {
              setErrors({
                open: true,
                msg: err?.response?.data || "Termination failed",
              });
            } finally {
              setBusyTerminateSubject(false);
            }
          }}
        />
      )}

      {/* Attendance Update Confirmation */}
      {confirmEdit.open && (
        <ConfirmDialog
          open={confirmEdit.open}
          title="Update attendance"
          message={`Confirm update for ${confirmEdit.payload?.studentName}?`}
          confirmLabel="Update"
          cancelLabel="Cancel"
          busy={busyEdit}
          onCancel={() => setConfirmEdit({ open: false, payload: null })}
          onConfirm={async () => {
            try {
              setBusyEdit(true);
              const { idVal, isPresent, reason, dateVal } = confirmEdit.payload;
              await UpdateStudentAttendance(idVal, {
                isPresent,
                reason,
                date: String(dateVal),
                classId: id,
              });
              setSuccess({ open: true, msg: "Attendance updated." });
              setEditingId(null);
              setConfirmEdit({ open: false, payload: null });
            } catch (e) {
              setErrors({ open: true, msg: "Failed to update attendance" });
            } finally {
              setBusyEdit(false);
            }
          }}
        />
      )}

      {/* Alert Feedback */}
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
    </div>
  );
}
