import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PromotionHeader from "../../components/Promotion/PromotionHeader";
import PromotionFilterTabs from "../../components/Promotion/PromotionFilterTabs";
import PromotionTable from "../../components/Promotion/PromotionTable";
import PromotionSummary from "../../components/Promotion/PromotionSummary";
import ClassOverview from "../../components/Promotion/ClassOverview";
import ConfirmationModal from "../../components/Promotion/ConfirmationModal";
import SuccessAlert from "../../components/SuccessAlert";
import ErrorAlert from "../../components/ErrorAlert";

import { savePromotions } from "../../features/adminFeatures/promotion/promotionService";
import { getClassesByGrade } from "../../features/class/classService";
import { GetAllStudents } from "../../features/adminFeatures/students/studentListSlice";
import { getAllGrades } from "../../features/grade/gradeSlice";
import { getAllYears } from "../../features/year/yearSlice";

const EXCLUDED_STATUSES = ["Completed", "Leaving"];

export default function StudentPromotionPage() {
  const dispatch = useDispatch();

  const errMsg = (err, fallback) => {
    const data = err?.response?.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object")
      return data.message || data.title || fallback;
    return err?.message || fallback;
  };

  const { students } = useSelector((s) => s.studentList);
  const { grades } = useSelector((s) => s.grades);
  const { years } = useSelector((s) => s.years);

  const [mode, setMode] = useState("overview");
  const [classesByGrade, setClassesByGrade] = useState({});
  const [promotions, setPromotions] = useState({});
  const [finalized, setFinalized] = useState({});
  const [filter, setFilter] = useState("all");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState({ open: false, msg: "" });
  const [errors, setErrors] = useState({ open: false, msg: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingCount = useMemo(
    () => Object.values(promotions).filter((p) => !!p?.status).length,
    [promotions],
  );

  const [context, setContext] = useState({
    yearId: null,
    yearLabel: "",
    gradeId: null,
    gradeLabel: "",
    classId: null,
    classLabel: "",
  });

  useEffect(() => {
    dispatch(GetAllStudents());
    dispatch(getAllGrades());
    dispatch(getAllYears());
  }, [dispatch]);

  useEffect(() => {
    if (!grades.length || !years.length) return;

    const activeYear = years.at(-1);

    (async () => {
      const map = {};
      for (const g of grades) {
        const cls = await getClassesByGrade(g.id);
        map[g.id] = Array.isArray(cls) ? cls : [];
      }

      setClassesByGrade(map);

      const firstGrade = grades[0];
      const firstClass = map[firstGrade.id]?.[0];

      setContext({
        yearId: activeYear.id,
        yearLabel: activeYear.year,
        gradeId: firstGrade.id,
        gradeLabel: `Grade ${firstGrade.gradeName}`,
        classId: firstClass?.id ?? null,
        classLabel: firstClass?.name ?? "",
      });
    })();
  }, [grades, years]);

  const classes = classesByGrade[context.gradeId] || [];

  // Lookups for confirmation modal
  const gradesLookup = useMemo(() => {
    const m = {};
    grades.forEach((g) => (m[g.id] = g));
    return m;
  }, [grades]);
  const classesLookup = useMemo(() => {
    const m = {};
    Object.values(classesByGrade).forEach((arr) => {
      arr.forEach((c) => {
        m[c.classNameId ?? c.id] = c;
      });
    });
    return m;
  }, [classesByGrade]);

  const classStatuses = useMemo(() => {
    const map = {};

    classes.forEach((c) => {
      const classStudents = students.filter(
        (s) =>
          s.currentClass === c.name &&
          s.academicYearId !== context.yearId &&
          !EXCLUDED_STATUSES.includes(s.status),
      );

      const processed = classStudents.filter(
        (s) => promotions[s.id]?.status,
      ).length;

      map[c.id] = {
        total: classStudents.length,
        processed,
        status: finalized[c.id]
          ? "Finalized"
          : processed === 0
            ? "Not Started"
            : processed < classStudents.length
              ? "In Progress"
              : "Completed",
      };
    });

    return map;
  }, [classes, students, promotions, finalized, context.yearId]);

  /* ---------- Visible Students (FIXED) ---------- */
  const visibleStudents = useMemo(() => {
    return students
      .filter((s) => {
        // already completed / leaving in DB
        if (EXCLUDED_STATUSES.includes(s.status)) return false;

        // marked completed / leaving in UI
        if (EXCLUDED_STATUSES.includes(promotions[s.id]?.status)) return false;

        return (
          s.currentClass === context.classLabel &&
          s.academicYearId !== context.yearId
        );
      })
      .filter((s) =>
        filter === "all" ? true : promotions[s.id]?.status === filter,
      );
  }, [students, context.classLabel, context.yearId, promotions, filter]);

  const saveAll = async () => {
    if (!context.yearId) return;

    const payload = Object.entries(promotions)
      .map(([studentId, p]) => {
        if (!p.status) return null;

        const student = students.find((s) => s.id === Number(studentId));
        if (!student) return null;

        return {
          studentId: Number(studentId),
          gradeId: p.gradeId ?? context.gradeId,
          classId: p.classNameId ?? context.classId,
          academicYearId: context.yearId,
          status: p.status,
          description: p.description ?? "",
        };
      })
      .filter(Boolean);

    if (!payload.length) return;

    try {
      setSaving(true);
      await savePromotions(payload);
      dispatch(GetAllStudents());
      setPromotions({});
      setSuccess({ open: true, msg: "Promotions saved successfully." });
      setErrors({ open: false, msg: "" });
      setConfirmOpen(false);
    } catch (err) {
      setErrors({ open: true, msg: errMsg(err, "Failed to save promotions.") });
      setSuccess({ open: false, msg: "" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <header className="mb-4 flex items-center justify-between bg-linear-to-r from-cyan-800 via-cyan-700 to-cyan-800 py-6 rounded-2xl px-6 relative overflow-hidden shadow-md">
        <div>
          <h1 className="text-3xl font-bold text-cyan-50">Student Promotion</h1>
          <p className="text-sm text-cyan-50">
            Overview and class-by-class review
          </p>
        </div>
      </header>

      <PromotionHeader {...context} />

      {/* Controls */}
      <section className="mb-4 rounded-xl border border-gray-200 bg-white p-3 shadow-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-600">Grade</span>
              <select
                value={context.gradeId ?? ""}
                onChange={(e) => {
                  const gid = Number(e.target.value);
                  const cls = classesByGrade[gid] || [];
                  const grade = grades.find((g) => g.id === gid);

                  setContext((c) => ({
                    ...c,
                    gradeId: gid,
                    gradeLabel: `Grade ${grade?.gradeName}`,
                    classId: cls[0]?.id ?? null,
                    classLabel: cls[0]?.name ?? "",
                  }));
                  setMode("overview");
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                {grades.map((g) => (
                  <option key={g.id} value={g.id}>
                    Grade {g.gradeName}
                  </option>
                ))}
              </select>
            </div>

            {mode === "class" && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-600">Class</span>
                <select
                  value={context.classId ?? ""}
                  onChange={(e) => {
                    const cid = Number(e.target.value);
                    const cls = classes.find(
                      (c) => (c.classNameId ?? c.id) === cid,
                    );
                    setContext((c) => ({
                      ...c,
                      classId: cid,
                      classLabel: cls?.name ?? "",
                    }));
                  }}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  {classes.map((c) => (
                    <option
                      key={c.classNameId ?? c.id}
                      value={c.classNameId ?? c.id}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
            <button
              onClick={() => setMode("overview")}
              className={`px-3 py-1.5 text-sm ${
                mode === "overview"
                  ? "rounded-md bg-cyan-600 text-white"
                  : "text-neutral-800 hover:text-cyan-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setMode("class")}
              className={`px-3 py-1.5 text-sm ${
                mode === "class"
                  ? "rounded-md bg-cyan-600 text-white"
                  : "text-neutral-800 hover:text-cyan-700"
              }`}
            >
              Class
            </button>
          </div>
        </div>
      </section>

      {mode === "overview" ? (
        <ClassOverview
          classes={classes}
          classStatuses={classStatuses}
          onManage={(c) => {
            setContext((ctx) => ({
              ...ctx,
              classId: c.id,
              classLabel: c.name,
            }));
            setMode("class");
          }}
        />
      ) : (
        <>
          {finalized[context.classId] && (
            <div className="mb-3 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-sm text-purple-800">
              This class is finalized and locked. Editing is disabled.
            </div>
          )}

          <PromotionFilterTabs active={filter} onChange={setFilter} />

          {visibleStudents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-neutral-600 shadow-md">
              No students to display for this class and filter.
            </div>
          ) : (
            <PromotionTable
              students={visibleStudents}
              grades={grades}
              classesByGrade={classesByGrade}
              promotions={promotions}
              onChangePromotion={(id, p) =>
                setPromotions((m) => ({ ...m, [id]: p }))
              }
              locked={finalized[context.classId]}
              academicYearId={context.yearId}
            />
          )}

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-neutral-700">
              Showing {visibleStudents.length} student
              {visibleStudents.length === 1 ? "" : "s"}. Changes pending:{" "}
              {pendingCount}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPromotions({})}
                disabled={pendingCount === 0 || saving}
                className={`rounded-lg border px-4 py-2 text-sm ${
                  pendingCount === 0 || saving
                    ? "cursor-not-allowed border-gray-200 bg-white text-neutral-400"
                    : "border-gray-200 bg-white text-neutral-700 hover:bg-gray-50"
                }`}
              >
                Reset Changes
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                disabled={
                  saving || pendingCount === 0 || finalized[context.classId]
                }
                className={`rounded-lg px-4 py-2 text-sm ${
                  saving || pendingCount === 0 || finalized[context.classId]
                    ? "cursor-not-allowed bg-cyan-300 text-white"
                    : "bg-cyan-600 text-white hover:bg-cyan-700"
                }`}
              >
                {saving ? "Saving..." : "Save Promotions"}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <PromotionSummary promotions={Object.values(promotions)} />
          </div>
        </>
      )}
      {/* Alerts */}
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

      {/* Confirmation */}
      {confirmOpen && (
        <ConfirmationModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          context={context}
          promotions={promotions}
          gradesLookup={gradesLookup}
          classesLookup={classesLookup}
          onConfirm={() => {
            saveAll();
            setConfirmOpen(false);
          }}
        />
      )}
    </div>
  );
}
