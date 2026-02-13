import React from "react";
import PromotionRow from "./PromotionRow";

export default function PromotionTable({
  students,
  grades,
  classesByGrade,
  promotions,
  onChangePromotion,
  locked,
  academicYearId,
}) {
  return (
    <section className="rounded-2xl border border-neutral-100 bg-white shadow-sm overflow-hidden transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-cyan-700">
              <th className="sticky top-0 border-b border-neutral-100 py-5 px-6 text-left text-sm font-bold text-cyan-50 capitalize tracking-widest">
                Student details
              </th>
              <th className="sticky top-0 border-b border-neutral-100 py-5 px-3 text-left text-sm font-bold text-cyan-50 capitalize tracking-widest">
                Action status
              </th>
              <th className="sticky top-0 border-b border-neutral-100 py-5 px-3 text-left text-sm font-bold text-cyan-50 capitalize tracking-widest">
                Target grade
              </th>
              <th className="sticky top-0 border-b border-neutral-100 py-5 px-3 text-left text-sm font-bold text-cyan-50 capitalize tracking-widest">
                Target class
              </th>
              <th className="sticky top-0 border-b border-neutral-100 py-5 px-6 text-left text-sm font-bold text-cyan-50 capitalize tracking-widest">
                Additional notes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {students.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <p className="text-sm font-bold text-neutral-400 capitalize">
                      No students found in this class
                    </p>
                    <p className="text-sm text-neutral-300">
                      Try adjusting your filters or selecting a different class
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <PromotionRow
                  key={s.id}
                  student={s}
                  grades={grades}
                  classesByGrade={classesByGrade}
                  value={promotions[s.id]}
                  onChange={onChangePromotion}
                  locked={locked}
                  academicYearId={academicYearId}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination Placeholder */}
      <div className="bg-neutral-50/30 px-6 py-4 border-t border-neutral-100 flex items-center justify-between">
        <p className="text-[10px] font-bold text-neutral-400 capitalize tracking-tight">
          Showing {students.length} students
        </p>
        <p className="text-[10px] font-bold text-cyan-600 capitalize tracking-tight">
          All data autosaved
        </p>
      </div>
    </section>
  );
}
