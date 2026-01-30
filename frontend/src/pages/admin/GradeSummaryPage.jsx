import React, { useEffect, useState } from "react";
import CreativeStatCard from "../../components/CommonElements/CreativeStatCard";
import { getGradeSummaries } from "../../services/grades";

export default function GradeSummaryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await getGradeSummaries();
        if (active) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Failed to load grade summaries");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Grades Overview
        </h1>
        <p className="text-sm text-neutral-700">
          Students and classes per grade
        </p>
      </header>

      {loading ? (
        <p className="text-sm text-neutral-700">Loading...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <CreativeStatCard
              key={g.gradeId}
              title={`Grade ${g.gradeName ?? g.gradeId}`}
              stats={[
                { label: "Students", value: g.studentCount ?? 0 },
                { label: "Classes", value: g.classCount ?? 0 },
              ]}
            />
          ))}
        </section>
      )}
    </div>
  );
}
