import React from "react";
import PromotionRow from "./PromotionRow";

export default function PromotionTable(props) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-neutral-800">
              <th className="border-b border-gray-200 py-2 px-3">Name</th>
              <th className="border-b border-gray-200 py-2 px-3">Admission</th>
              <th className="border-b border-gray-200 py-2 px-3">Status</th>
              <th className="border-b border-gray-200 py-2 px-3">Grade</th>
              <th className="border-b border-gray-200 py-2 px-3">Class</th>
              <th className="border-b border-gray-200 py-2 px-3">Note</th>
            </tr>
          </thead>
          <tbody className="text-neutral-800">
            {props.students.map((s) => (
              <PromotionRow
                key={s.id}
                student={s}
                grades={props.grades}
                classesByGrade={props.classesByGrade}
                value={props.promotions[s.id]}
                onChange={props.onChangePromotion}
                locked={props.locked}
                academicYearId={props.academicYearId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
