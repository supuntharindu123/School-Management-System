import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PromotionHeader from "../../components/Promotion/PromotionHeader";
import PromotionFilterTabs from "../../components/Promotion/PromotionFilterTabs";
import PromotionTable from "../../components/Promotion/PromotionTable";
import PromotionSummary from "../../components/Promotion/PromotionSummary";
import ClassOverview from "../../components/Promotion/ClassOverview";

import { savePromotions } from "../../services/promotion";
import { getClassesByGrade } from "../../features/class/classService";
import { GetAllStudents } from "../../features/adminFeatures/students/studentListSlice";
import { getAllGrades } from "../../features/grade/gradeSlice";
import { getAllYears } from "../../features/year/yearSlice";

const EXCLUDED_STATUSES = ["Completed", "Leaving"];

export default function StudentPromotionPage() {
  const dispatch = useDispatch();

  /* =========================
     Redux State
  ========================= */
  const { students } = useSelector((s) => s.studentList);
  const { grades } = useSelector((s) => s.grades);
  const { years } = useSelector((s) => s.years);

  /* =========================
     Local State
  ========================= */
  const [mode, setMode] = useState("overview");
  const [classesByGrade, setClassesByGrade] = useState({});
  const [promotions, setPromotions] = useState({});
  const [finalized, setFinalized] = useState({});
  const [filter, setFilter] = useState("all");
  const [saving, setSaving] = useState(false);

  const [context, setContext] = useState({
    yearId: null,
    yearLabel: "",
    gradeId: null,
    gradeLabel: "",
    classId: null,
    classLabel: "",
  });

  /* =========================
     Initial Load
  ========================= */
  useEffect(() => {
    dispatch(GetAllStudents());
    dispatch(getAllGrades());
    dispatch(getAllYears());
  }, [dispatch]);

  /* =========================
     Load Classes by Grade
  ========================= */
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

  /* =========================
     Derived Data
  ========================= */
  const classes = classesByGrade[context.gradeId] || [];

  /* ---------- Class Status ---------- */
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
        // ❌ already completed / leaving in DB
        if (EXCLUDED_STATUSES.includes(s.status)) return false;

        // ❌ marked completed / leaving in UI
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

  /* =========================
     Save Promotions
  ========================= */
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

      // ✅ refresh DB state
      dispatch(GetAllStudents());

      // ✅ reset UI
      setPromotions({});
    } catch (err) {
      console.error("Save failed", err);
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div>
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Student Promotion
        </h1>
        <p className="text-sm text-neutral-700">
          Overview and class-by-class review
        </p>
      </header>

      <PromotionHeader {...context} />

      <div className="mb-4 flex justify-between items-center">
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
        >
          {grades.map((g) => (
            <option key={g.id} value={g.id}>
              Grade {g.gradeName}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button onClick={() => setMode("overview")}>Overview</button>
          <button onClick={() => setMode("class")}>Class</button>
        </div>
      </div>

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
          <PromotionFilterTabs active={filter} onChange={setFilter} />

          <PromotionTable
            students={visibleStudents}
            grades={grades}
            classesByGrade={classesByGrade}
            promotions={promotions}
            onChangePromotion={(id, p) =>
              setPromotions((m) => ({ ...m, [id]: p }))
            }
            locked={finalized[context.classId]}
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={saveAll}
              disabled={saving}
              className="bg-teal-600 text-white px-4 py-2 rounded"
            >
              {saving ? "Saving..." : "Save Promotions"}
            </button>
          </div>

          <PromotionSummary promotions={Object.values(promotions)} />
        </>
      )}
    </div>
  );
}
