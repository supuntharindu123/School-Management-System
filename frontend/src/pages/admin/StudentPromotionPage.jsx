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
            ? "Not started"
            : processed < classStudents.length
              ? "In progress"
              : "Completed",
      };
    });
    return map;
  }, [classes, students, promotions, finalized, context.yearId]);

  const visibleStudents = useMemo(() => {
    return students
      .filter((s) => {
        if (EXCLUDED_STATUSES.includes(s.status)) return false;
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
      setConfirmOpen(false);
    } catch (err) {
      setErrors({ open: true, msg: errMsg(err, "Failed to save promotions.") });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-8 pb-16 animate-fade-in px-4">
      <header className="flex items-center justify-between bg-linear-to-r from-cyan-900 via-cyan-800 to-cyan-900 py-8 rounded-2xl px-8 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-white capitalize">
            Student promotion
          </h1>
          <p className="text-sm text-cyan-100 opacity-80 capitalize">
            Manage student progression for the upcoming academic year
          </p>
        </div>
      </header>

      <PromotionHeader {...context} />

      {/* Control bar */}
      <section className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-1">
            <label className="text-sm font-bold text-neutral-400 capitalize tracking-widest px-1">
              Target grade
            </label>
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
              className="block w-48 rounded-xl border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-bold text-neutral-800 focus:border-cyan-500 focus:ring-cyan-500"
            >
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  Grade {g.gradeName}
                </option>
              ))}
            </select>
          </div>

          {mode === "class" && (
            <div className="space-y-1 animate-in slide-in-from-left-2 duration-300">
              <label className="text-sm font-bold text-neutral-400 capitalize tracking-widest px-1">
                Specific class
              </label>
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
                className="block w-48 rounded-xl border-neutral-200 bg-neutral-50 px-4 py-2 text-sm font-bold text-neutral-800"
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

        <div className="bg-neutral-100 p-1 rounded-xl inline-flex">
          {["overview", "class"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                mode === m
                  ? "bg-white text-cyan-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </section>

      {/* Main content area */}
      <main className="min-h-[400px]">
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
          <div className="space-y-4 animate-in fade-in duration-500">
            {finalized[context.classId] && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-sm font-bold text-amber-800 capitalize">
                This class has been finalized and locked.
              </div>
            )}

            <PromotionFilterTabs active={filter} onChange={setFilter} />

            {visibleStudents.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-neutral-200 rounded-2xl p-20 text-center">
                <p className="text-neutral-400 font-bold capitalize">
                  No students match the current filter.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
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
              </div>
            )}

            {/* Actions footer */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-cyan-700 p-6 rounded-2xl text-white gap-4">
              <div>
                <p className="text-sm font-bold text-neutral-400 capitalize tracking-widest">
                  Selection summary
                </p>
                <p className="text-sm font-bold capitalize">
                  {visibleStudents.length} Students visible • {pendingCount}{" "}
                  Pending changes
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setPromotions({})}
                  disabled={pendingCount === 0 || saving}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold border border-white/20 hover:bg-white/10 disabled:opacity-30 transition-all capitalize"
                >
                  Reset changes
                </button>
                <button
                  onClick={() => setConfirmOpen(true)}
                  disabled={
                    saving || pendingCount === 0 || finalized[context.classId]
                  }
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-700 transition-all capitalize"
                >
                  {saving ? "Saving..." : "Save promotions"}
                </button>
              </div>
            </div>

            <PromotionSummary promotions={Object.values(promotions)} />
          </div>
        )}
      </main>

      {/* Modals & alerts */}
      <SuccessAlert
        isOpen={success.open}
        message={success.msg}
        onClose={() => setSuccess({ open: false, msg: "" })}
      />
      <ErrorAlert
        isOpen={errors.open}
        message={errors.msg}
        onClose={() => setErrors({ open: false, msg: "" })}
      />

      {confirmOpen && (
        <ConfirmationModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          context={context}
          promotions={promotions}
          gradesLookup={gradesLookup}
          classesLookup={classesLookup}
          onConfirm={() => saveAll()}
        />
      )}
    </div>
  );
}
